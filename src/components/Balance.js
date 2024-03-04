import dapp from '../assets/dapp.svg';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadProvider, loadBalances, depositTokens } from '../store/interactions';

const Balance = () => {

    const [token1TransferAmount, setToken1TransferAmount] = useState(0);

    const dispatch = useDispatch()

    const exchange = useSelector(state => state.exchange.contract)
    const tokens = useSelector(state => state.tokens.contracts)
    const account = useSelector(state => state.provider.account)

    const t_symbols = useSelector(state => state.tokens.symbols)
    const t_balances = useSelector(state => state.tokens.balances)
    const e_balances = useSelector(state => state.exchange.balances)

    const amountHandler = (e, token) => {
        if (token === tokens[0]) {
            setToken1TransferAmount(e.target.value)
            console.log(token1TransferAmount)
        }
    }

    const depositHandler = async (e, token) => {
        e.preventDefault();
        if (token === tokens[0]) {
            const provider = await loadProvider(dispatch);
            depositTokens(provider, exchange, "Deposit", token, token1TransferAmount, dispatch)
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
    }, [tokens, exchange, dispatch]);

    // const dispatch = useDispatch();

    // const [account, setAccount] = useState(null);
    // const exchange = useSelector(state => state.exchange.contract);
    // const tokens = useSelector(state => state.tokens.contracts);
    // console.log(tokens)

    // const _provider = async () => {
    //     const provider = await loadProvider(dispatch);
    //     return provider;
    // }


    // useEffect(() => {
    //     if (!account) {
    //         const loadProviderAndAccount = async () => {
    //             const loadedAccount = await loadAccount(_provider, dispatch);
    //             setAccount(loadedAccount);
    //         };
    //         loadProviderAndAccount();
    //     }
    // }, [account, dispatch]);

    // useEffect(() => {
    //     if (exchange && tokens[0] && tokens[1] && account) {

    //         loadBalances(_provider, exchange, tokens, account, dispatch);
    //     }
    // }, [tokens, exchange, account, dispatch]);


    return (
        <div className='component exchange__transfers'>
            <div className='component__header flex-between'>
                <h2>Balance</h2>
                <div className='tabs'>
                    <button className='tab tab--active'>Deposit</button>
                    <button className='tab'>Withdraw</button>
                </div>
            </div>

            {/* Deposit/Withdraw Component 1 (CMRD) */}

            <div className='exchange__transfers--form'>
                <div className='flex-between'>
                    <p><small>Token</small><br /><img src={dapp} alt="Token Logo" />{t_symbols && t_symbols[0]}</p>
                    <p><small>Wallet</small><br />{t_balances && (t_balances[0])}</p>
                    <p><small>Exchange</small><br />{e_balances && e_balances[0]}</p>
                </div>

                <form onSubmit={(e) => depositHandler(e, tokens[0])}>
                    <label htmlFor="token0">{t_symbols && t_symbols[0]} Amount</label>
                    <input type="text" id='token0' placeholder='0.0000' onChange={(e) => amountHandler(e, tokens[0])} />

                    <button className='button' type='submit'>
                        <span>Deposit</span>
                    </button>
                </form>
            </div>

            <hr />

            {/* Deposit/Withdraw Component 2 (mETH) */}

            <div className='exchange__transfers--form'>
                <div className='flex-between'>

                </div>

                <form>
                    <label htmlFor="token1"></label>
                    <input type="text" id='token1' placeholder='0.0000' />

                    <button className='button' type='submit'>
                        <span></span>
                    </button>
                </form>
            </div>

            <hr />
        </div>
    );
}

export default Balance;