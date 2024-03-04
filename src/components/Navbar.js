import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers'
import Blockies from 'react-blockies';
import logo from '../assets/logo.png';
import eth from '../assets/eth.svg';
import HelperConfig from '../HelperConfig.json';
import { loadProvider, loadAccount } from '../store/interactions.js';

const Navbar = () => {

    // let provider;
    // const provider = useSelector(state => state.provider.provider)
    // const account = useSelector(state => state.provider.account)
    // const balance = useSelector(state => state.provider.balance)

    // const dispatch = useDispatch()

    // const providerHandler = async () => {
    //     provider = await loadProvider(dispatch)
    // }

    // const connectHandler = async () => {
    //     providerHandler()
    //     await loadAccount(provider, dispatch)
    // }

    // const fullProvider = new ethers.providers.Web3Provider(provider.connection);

    // const connectHandler = async () => {
    //     await loadAccount(fullProvider, dispatch)
    // }


    const { provider, account, chainId, balance } = useSelector(state => state.provider);
    const dispatch = useDispatch();

    const connectHandler = async () => {
        try {
            const againProvider = await loadProvider(dispatch); // Ensure provider is loaded
            await loadAccount(againProvider, dispatch);
        } catch (error) {
            console.error("Error connecting to provider:", error);
            // Handle connection errors gracefully
        }
    };

    const networkHandler = async (e) => {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: e.target.value }],
        })
    }


    return (
        <div className='exchange__header grid'>
            <div className='exchange__header--brand flex'>
                <img src={logo} className='logo' alt="DApp logo" />
                <h1> CMRD Token Exchange</h1>
            </div>

            <div className='exchange__header--networks flex'>
                <img src={eth} className="logo" alt="dApp logo"></img>

                <select name="networks" id="networks" value={HelperConfig[chainId] ? HelperConfig[chainId].chain_hex_id : '0'} onChange={networkHandler}>
                    <option value="0" disabled> Select Network</option>
                    {/* <option value="0x7A69"> Localhost</option> */}
                    <option value="0xAA36A7">Sepolia</option>
                </select>
            </div>

            <div className='exchange__header--account flex'>
                {balance ? (
                    <p><small>My Balance</small>{Number(balance).toFixed()}</p>
                ) : (
                    <p><small>My Balance</small>0 ETH</p>
                )}

                {account ? (
                    <a target="_blank" rel="norefferer">
                        {account.slice(0, 7) + "..." + account.slice(37, 42)}
                        <Blockies
                            account={account}
                            seed={account} // Provide the account as the seed
                            size={10}
                            scale={3}
                            color="#2187D0"
                            bgColor="#F1F2F9"
                            spotColor="#767F92"
                            className="identicon"
                        />
                    </a>
                ) : (
                    <button className="button" onClick={connectHandler}> Connect</button>
                )}

            </div>
        </div>
    )
}

export default Navbar;

//  href={`${HelperConfig[chainId].explorerURL}${account}`}