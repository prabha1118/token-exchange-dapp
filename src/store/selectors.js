import { createSelector } from 'reselect'
import { get, groupBy, reject } from 'lodash';
import moment from 'moment'
import { ethers } from 'ethers'

const tokens = state => get(state, 'tokens.contracts')
const allOrders = state => get(state, 'exchange.allOrders.data', [])
const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', [])
const filledOrders = state => get(state, 'exchange.filledOrders.data', [])


const openOrders = state => {
    const all = allOrders(state)
    const filled = filledOrders(state)
    const cancelled = cancelledOrders(state)

    const openOrders = reject(all, (order) => {
        const orderFilled = filled.some((o) => o.id.toString() === order.id.toString())
        const orderCancelled = cancelled.some((o) => o.id.toString() === order.id.toString())
        console.log("Hi ra...")
        return (orderFilled || orderCancelled)
    })

    return openOrders
}

const GREEN = '#25CE8F'
const RED = '#F45353'

const decorateOrder = (order, tokens) => {
    let token0Amount, token1Amount

    // Note: Always CMRD --> token0 and mETH (or) mDai --> token1
    // consider an example of Giving mETH in exchange for CMRD
    if (order.tokenGive === tokens[1]) {
        token0Amount = order.amountGet // The amount of CMRD we get
        token1Amount = order.amountGive // The amount of mETH we are giving
    } else {
        token0Amount = order.amountGive // The amount of CMRD we are giving
        token1Amount = order.amountGet // The amount of mETH we get
    }

    const precision = 100000
    let tokenPrice = (token1Amount / token0Amount)
    tokenPrice = Math.round(tokenPrice * precision) / precision

    return ({
        ...order,
        token0Amount: ethers.utils.formatUnits(token0Amount, "ether"),
        token1Amount: ethers.utils.formatUnits(token1Amount, "ether"),
        tokenPrice,
        formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ssa d MMM D')
    })
}

export const orderBookSelector = createSelector(openOrders, tokens, (orders, tokens) => {

    if (!tokens[0] || !tokens[1]) { return }

    // Filter orders for the selected token pair
    orders = orders.filter((o) => o.tokenGet === tokens[0] || o.tokenGet === tokens[1])
    orders = orders.filter((o) => o.tokenGive === tokens[0] | o.tokenGive === tokens[1])

    // Decorate orders
    orders = decorateOrderBookOrders(orders, tokens)

    orders = groupBy(orders, 'orderType')

    const buyOrders = get(orders, 'buy', [])
    const sellOrders = get(orders, 'sell', [])

    // Sort Buy orders by tokenPrice
    orders = {
        ...orders,
        buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
    }

    // Sort Sell orders by tokenPrice
    orders = {
        ...orders,
        sellOrders: sellOrders.sort((a, b) => a.tokenPrice - b.tokenPrice)
    }

    return orders
})

const decorateOrderBookOrders = (orders, tokens) => {
    return (
        orders.map((order) => {
            order = decorateOrder(order, tokens)
            order = decorateOrderBookOrder(order, tokens)
            return (order)
        })
    )
}

const decorateOrderBookOrder = (order, tokens) => {
    const orderType = order.tokenGive === tokens[1] ? "buy" : "sell"

    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderFillAction: (orderType === 'buy' ? 'sell' : 'buy')
    })
}
