import { useSelector, useDispatch } from 'react-redux';

import sort from '../assets/sort.svg';

import { orderBookSelector } from '../store/selectors';
import { loadProvider, fillOrder } from '../store/interactions';

const OrderBook = () => {
    const dispatch = useDispatch()

    const exchange = useSelector(state => state.exchange.contract)
    const t_symbols = useSelector(state => state.tokens.symbols)
    const orderBook = useSelector(orderBookSelector)

    const fillOrderHandler = async (order) => {
        const provider = await loadProvider(dispatch);
        fillOrder(provider, exchange, order, dispatch)
    }

    return (
        <div className="component exchange__orderbook">
            <div className='component__header flex-between'>
                <h2>Order Book</h2>
            </div>

            <div className="flex">

                {!orderBook || orderBook.sellOrders.length === 0 ? (
                    <p className="flex-center">No Sell Orders</p>
                ) : (
                    <table className='exchange__orderbook--sell'>
                        <caption>Selling</caption>
                        <thead>
                            <tr>
                                <th>{t_symbols && t_symbols[0]}<img src={sort} alt='Sort' /></th>
                                <th>{t_symbols && t_symbols[1]}/{t_symbols && t_symbols[0]}<img src={sort} alt='Sort' /></th>
                                <th>{t_symbols && t_symbols[1]}<img src={sort} alt='Sort' /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderBook && orderBook.sellOrders.map((order, index) => {
                                return (
                                    <tr key={index} onClick={() => fillOrderHandler(order)}>
                                        <td>{order.token0Amount}</td>
                                        <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenPrice}</td>
                                        <td>{order.token1Amount}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}

                <div className='divider'></div>

                {!orderBook || orderBook.buyOrders.length === 0 ? (
                    <p className="flex-center">No Buy Orders</p>
                ) : (
                    <table className='exchange__orderbook--sell'>
                        <caption>Buying</caption>
                        <thead>
                            <tr>
                                <th>{t_symbols && t_symbols[0]}<img src={sort} alt='Sort' /></th>
                                <th>{t_symbols && t_symbols[1]}/{t_symbols && t_symbols[0]}<img src={sort} alt='Sort' /></th>
                                <th>{t_symbols && t_symbols[1]}<img src={sort} alt='Sort' /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderBook && orderBook.buyOrders.map((order, index) => {
                                return (
                                    <tr key={index} onClick={() => fillOrderHandler(order)}>
                                        <td>{order.token0Amount}</td>
                                        <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenPrice}</td>
                                        <td>{order.token1Amount}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}

            </div>
        </div>
    );
}

export default OrderBook;