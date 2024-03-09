import { ethers } from 'ethers'
import TOKEN_ABI from '../abis/ComradeToken.json'
import EXCHANGE_ABI from '../abis/Exchange.json'
import { exchange, provider } from './reducers'

export const loadProvider = async (dispatch) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    dispatch({ type: 'PROVIDER_LOADED', provider: provider.connection.url })

    return provider
}

export const loadNetwork = async (provider, dispatch) => {
    const { chainId } = await provider.getNetwork()
    dispatch({ type: 'NETWORK_LOADED', chainId })

    return chainId
}

export const loadAccount = async (provider, dispatch) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])

    dispatch({ type: 'ACCOUNT_LOADED', account })

    let balance = await provider.getBalance(account)
    balance = ethers.utils.formatEther(balance)

    dispatch({ type: 'ETHER_BALANCE_LOADED', balance })

    return account
}

export const loadTokens = async (provider, addresses, dispatch) => {
    let token, symbol

    for (let i = 0; i < addresses.length; i++) {
        token = new ethers.Contract(addresses[i], TOKEN_ABI, provider)
        symbol = await token.symbol()

        dispatch({ type: `TOKEN_${i + 1}_LOADED`, tokenAddress: addresses[i], symbol: symbol })
    }

    return token;
}

export const loadExchange = async (provider, address, dispatch) => {
    const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider)
    dispatch({ type: 'EXCHANGE_LOADED', exchange: exchange.address })

    return exchange
}

export const subscribeToEvents = (provider, exchangeAddress, dispatch) => {

    let exchangeContract = new ethers.Contract(exchangeAddress, EXCHANGE_ABI, provider)

    exchangeContract.on('TokensDeposited', (token, user, amount) => {
        console.log("hi")
        dispatch({ type: 'TRANSFER_SUCCESSFUL' })
    })

}

export const loadBalances = async (provider, exchange, tokens, account, dispatch) => {
    if (tokens[0]) {

        let token = new ethers.Contract(tokens[0], TOKEN_ABI, provider)
        let balance = ethers.utils.formatUnits(await token.balanceOf(account), 18)
        dispatch({ type: 'CMRD_TOKEN_BALANCE_LOADED', balance })

        token = new ethers.Contract(tokens[1], TOKEN_ABI, provider)
        balance = ethers.utils.formatUnits(await token.balanceOf(account), 18)
        dispatch({ type: 'OTHER_TOKEN_BALANCE_LOADED', balance })

        let exchangeContract = new ethers.Contract(exchange, EXCHANGE_ABI, provider)

        balance = ethers.utils.formatUnits(await exchangeContract.depositedAmount(tokens[0], account), 18)
        dispatch({ type: 'EXCHANGE_CMRD_TOKEN_BALANCE_LOADED', balance })

        balance = ethers.utils.formatUnits(await exchangeContract.depositedAmount(tokens[1], account), 18)
        dispatch({ type: 'EXCHANGE_OTHER_TOKEN_BALANCE_LOADED', balance })

    } else {
        console.error("Tokens data not loaded yet.");
    }

}

export const depositTokens = async (provider, exchange, transferType, token, amount, dispatch) => {

    dispatch({ type: "TRANSFER_IN_PROGRESS" })

    try {
        let tokenContract = new ethers.Contract(token, TOKEN_ABI, provider)
        let exchangeContract = new ethers.Contract(exchange, EXCHANGE_ABI, provider)

        const signer = await provider.getSigner()

        let tx = await tokenContract.connect(signer).approve(exchange, amount)
        await tx.wait()

        tx = await exchangeContract.connect(signer).depositTokens(token, amount)
        await tx.wait()

        console.log("Tokens deposited.")
        console.log(ethers.utils.formatUnits(await exchangeContract.depositedAmount(token, await signer.getAddress()), 18))

    } catch (error) {
        dispatch({ type: 'TRANSFER_FAILED' })
    }
}
