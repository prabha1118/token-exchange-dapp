import { useSelector } from 'react-redux';

import sort from '../assets/sort.svg'
import Banner from './Banner'

import { filledOrdersSelector } from '../store/selectors'

const Trades = () => {
    const t_symbols = useSelector(state => state.tokens.symbols)

    const filledOrders = useSelector(filledOrdersSelector)

    return (
        <div className="component exchange__trades">
            <div className='component__header flex-between'>
                <h2>Trades</h2>
            </div>


            {!filledOrders || filledOrders.length === 0 ? (
                <Banner text="No Trades" />
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Time <img src={sort} alt="sort" /></th>
                            <th>{t_symbols && t_symbols[0]} <img src={sort} alt="sort" /></th>
                            <th>{t_symbols && t_symbols[1]}/{t_symbols && t_symbols[0]}<img src={sort} alt="sort" /></th>
                        </tr >
                    </thead >
                    <tbody>

                        {filledOrders.map((order, index) => {
                            return (
                                <tr key={index}>
                                    <td>{order.formattedTimestamp}</td>
                                    <td style={{ color: `$order.tokenPriceClass` }}>{order.token0Amount}</td>
                                    <td>{order.tokenPrice}</td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table >
            )}

        </div >
    );
}

export default Trades;