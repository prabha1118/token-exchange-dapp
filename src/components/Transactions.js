import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState } from 'react';
import { myOpenOrdersSelector, myFilledOrdersSelector } from '../store/selectors';
import { loadProvider, cancelOrder } from '../store/interactions';
import sort from '../assets/sort.svg';
import Banner from './Banner';

const Transactions = () => {
    const [showMyOrders, setShowMyOrders] = useState(true)

    const dispatch = useDispatch()

    const exchange = useSelector(state => state.exchange.contract)
    const t_symbols = useSelector(state => state.tokens.symbols)
    const myOpenOrders = useSelector(myOpenOrdersSelector)
    const myFilledOrders = useSelector(myFilledOrdersSelector)

    const orderRef = useRef(null)
    const tradeRef = useRef(null)

    const tabHandler = (e) => {
        if (e.target.className !== orderRef.current.className) {
            e.target.className = 'tab tab--active'
            orderRef.current.className = 'tab'
            setShowMyOrders(false)
        } else {
            e.target.className = 'tab tab--active'
            tradeRef.current.className = 'tab'
            setShowMyOrders(true)
        }
    }

    const cancelHandler = async (order) => {
        const provider = await loadProvider(dispatch);
        cancelOrder(provider, exchange, order, dispatch)
    }

    return (
        <div className="component exchange__transactions">
            {showMyOrders ? (
                <div>
                    <div className='component__header flex-between'>
                        <h2>My Orders</h2>

                        <div className='tabs'>
                            <button onClick={tabHandler} ref={orderRef} className='tab tab--active'>Orders</button>
                            <button onClick={tabHandler} ref={tradeRef} className='tab'>Trades</button>
                        </div>
                    </div>

                    {!myOpenOrders || myOpenOrders.length === 0 ? (
                        <Banner text="No Open Orders" />
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>{t_symbols && t_symbols[0]}<img src={sort} alt="Sort" /></th>
                                    <th>{t_symbols && t_symbols[1]}/{t_symbols && t_symbols[0]} <img src={sort} alt="Sort" /></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>

                                {myOpenOrders && myOpenOrders.map((order, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={{ color: `${order.orderTypeClass}` }}>{order.token0Amount}</td>
                                            <td>{order.tokenPrice}</td>
                                            <td><button className='button--sm' onClick={() => cancelHandler(order)}>Cancel</button></td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </table>
                    )}

                </div>
            ) : (
                <div>
                    <div className='component__header flex-between'>
                        <h2>My Transactions</h2>

                        <div className='tabs'>
                            <button onClick={tabHandler} ref={orderRef} className='tab tab--active'>Orders</button>
                            <button onClick={tabHandler} ref={tradeRef} className='tab'>Trades</button>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Time<img src={sort} alt="Sort" /></th>
                                <th>{t_symbols && t_symbols[0]}<img src={sort} alt="Sort" /></th>
                                <th>{t_symbols && t_symbols[1]}/{t_symbols && t_symbols[0]}<img src={sort} alt="sort" /></th>
                            </tr>
                        </thead>
                        <tbody>

                            {myFilledOrders && myFilledOrders.map((order, index) => {

                                return (
                                    <tr key={index}>
                                        <td>{order.formattedTimestamp}</td>
                                        <td style={{ color: `${order.orderClass}` }}>{order.orderSign}{order.token0Amount}</td>
                                        <td>{order.tokenPrice}</td>
                                    </tr>
                                )

                            })}

                        </tbody>
                    </table>

                </div>
            )}
        </div>
    )
}

export default Transactions;