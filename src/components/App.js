import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import store from '../store/store';

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange,
  subscribeToEvents,
  loadAllOrders
} from '../store/interactions'

import Navbar from './Navbar';
import Markets from './Markets';
import Balance from './Balance';
import Order from './Order';
import OrderBook from './OrderBook';
import PriceChart from './PriceChart';
import Trades from './Trades';

const HelperConfig = require('../HelperConfig.json');

function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    // Connect to the blockchain
    const provider = await loadProvider(dispatch)

    // Get the current network chainId
    const chainId = await loadNetwork(provider, dispatch)

    // Reload the page if the chainId changes
    window.ethereum.on('chainChanged', async () => {
      window.location.reload()
    })

    // Reload the page if the  chainId changes
    window.ethereum.on('accountsChanged', async () => {
      await loadAccount(provider, dispatch)
    })

    // Get the current account and balance from MetaMask
    // await loadAccount(provider, dispatch)  

    // Get the Token contract
    const comradeTokenAddress = HelperConfig[chainId].comradeTokenAddress
    const mETHTokenAddress = HelperConfig[chainId].mETHTokenAddress
    const mDaiTokenAddress = HelperConfig[chainId].mDaiTokenAddress
    // await loadTokens(provider, [comradeTokenAddress, mETHTokenAddress, mDaiTokenAddress], dispatch)

    // Load the Exchange contract
    const exchangeAddress = HelperConfig[chainId].exchangeAddress
    await loadExchange(provider, exchangeAddress, dispatch)

    // Fetch all orders: open, filled and cancelled
    loadAllOrders(provider, exchangeAddress, dispatch)

    // Listen to Events
    subscribeToEvents(provider, exchangeAddress, dispatch);
  }

  useEffect(() => {
    loadBlockchainData()
  })

  return (
    <div>

      <Navbar />

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          <Markets />

          <Balance />

          <Order />

        </section>
        <section className='exchange__section--right grid'>

          <PriceChart />

          {/* Transactions */}

          <Trades />

          <OrderBook />

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;
