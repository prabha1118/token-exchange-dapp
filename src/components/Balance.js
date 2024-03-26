import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadProvider, loadBalances, depositTokens, withdrawTokens } from '../store/interactions';

import dapp from '../assets/dapp.svg';
import eth from '../assets/eth.svg';

const Balance = () => {

    const [isDeposit, setIsDeposit] = useState(true);
    const [token1TransferAmount, setToken1TransferAmount] = useState(0);
    const [token2TransferAmount, setToken2TransferAmount] = useState(0);

    const dispatch = useDispatch()

    const exchange = useSelector(state => state.exchange.contract)
    const tokens = useSelector(state => state.tokens.contracts) // Array of token addresses
    const account = useSelector(state => state.provider.account)

    const t_symbols = useSelector(state => state.tokens.symbols)
    const t_balances = useSelector(state => state.tokens.balances)
    const e_balances = useSelector(state => state.exchange.balances)

    const transferStatus = useSelector(state => state.exchange.transferInProgress)

    const depositRef = useRef(null)
    const withdrawRef = useRef(null)

    const tabHandler = (e) => {
        if (e.target.className !== depositRef.current.className) {
            e.target.className = 'tab tab--active'
            depositRef.current.className = 'tab'
            setIsDeposit(false)
        } else {
            e.target.className = 'tab tab--active'
            withdrawRef.current.className = 'tab'
            setIsDeposit(true)
        }
    }

    const amountHandler = (e, token) => {
        if (token === tokens[0]) {
            setToken1TransferAmount(e.target.value)
        } else {
            setToken2TransferAmount(e.target.value)
        }
    }

    const depositHandler = async (e, token) => {
        e.preventDefault();
        if (token === tokens[0]) {
            const provider = await loadProvider(dispatch);
            depositTokens(provider, exchange, "Deposit", token, token1TransferAmount, dispatch)

            setToken1TransferAmount(0);
        } else {
            const provider = await loadProvider(dispatch);
            depositTokens(provider, exchange, "Deposit", token, token2TransferAmount, dispatch)

            setToken2TransferAmount(0);
        }
    }

    const withdrawHandler = async (e, token) => {
        e.preventDefault();
        if (token === tokens[0]) {
            const provider = await loadProvider(dispatch);
            withdrawTokens(provider, exchange, "Withdraw", token, token1TransferAmount, dispatch)

            setToken1TransferAmount(0);
        } else {
            const provider = await loadProvider(dispatch);
            withdrawTokens(provider, exchange, "Withdraw", token, token2TransferAmount, dispatch)

            setToken2TransferAmount(0);
        }
    }

    useEffect(() => {


        if (exchange && tokens[0] && tokens[1] && account) {
            let againProvider;

            const providerAndBalances = async () => {
                const againProvider = await loadProvider(dispatch);
                loadBalances(againProvider, exchange, tokens, account, dispatch)
            }

            providerAndBalances();

        }
    }, [account, tokens, exchange, dispatch, transferStatus]);


    return (
        <div className='component exchange__transfers'>
            <div className='component__header flex-between'>
                <h2>Balance</h2>
                <div className='tabs'>
                    <button onClick={tabHandler} ref={depositRef} className='tab tab--active'>Deposit</button>
                    <button onClick={tabHandler} ref={withdrawRef} className='tab'>Withdraw</button>
                </div>
            </div>

            {/* Deposit/Withdraw Component 1 (CMRD) */}

            <div className='exchange__transfers--form'>
                <div className='flex-between'>
                    <p><small>Token</small><br /><img src={dapp} alt="Token Logo" />{t_symbols && t_symbols[0]}</p>
                    <p><small>Wallet</small><br />{t_balances && (Number(t_balances[0])).toFixed(7)}</p>
                    <p><small>Exchange</small><br />{e_balances && e_balances[0]}</p>
                </div>

                <form onSubmit={isDeposit ? (e) => depositHandler(e, tokens[0]) : (e) => withdrawHandler(e, tokens[0])}>
                    <label htmlFor="token0">{t_symbols && t_symbols[0]} Amount</label>
                    <input
                        type="text"
                        id='token0'
                        placeholder='0.0000'
                        value={token1TransferAmount === 0 ? '' : token1TransferAmount}
                        onChange={(e) => amountHandler(e, tokens[0])} />

                    <button className='button' type='submit'>
                        {isDeposit ? (
                            <span>Deposit</span>
                        ) : (
                            <span>Withdraw</span>
                        )}
                    </button>
                </form>
            </div>

            <hr />

            {/* Deposit/Withdraw Component 2 (mETH) */}

            <div className='exchange__transfers--form'>
                <div className='flex-between'>
                    <p><small>Token</small><br /><img src={eth} alt="Token Logo" />{t_symbols && t_symbols[1]}</p>
                    <p><small>Wallet</small><br />{t_balances && (Number(t_balances[1])).toFixed(7)}</p>
                    <p><small>Exchange</small><br />{e_balances && e_balances[1]}</p>
                </div>

                <form onSubmit={isDeposit ? (e) => depositHandler(e, tokens[1]) : (e) => withdrawHandler(e, tokens[1])}>
                    <label htmlFor="token0">{t_symbols && t_symbols[1]} Amount</label>
                    <input
                        type="text"
                        id='token1'
                        placeholder='0.0000'
                        value={token2TransferAmount === 0 ? '' : token2TransferAmount}
                        onChange={(e) => amountHandler(e, tokens[1])}
                    />

                    <button className='button' type='submit'>
                        {isDeposit ? (
                            <span>Deposit</span>
                        ) : (
                            <span>Withdraw</span>
                        )}
                    </button>
                </form>
            </div>

            <hr />
        </div>
    );
}

export default Balance;