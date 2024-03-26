export const provider = (state = {}, action) => {
    switch (action.type) {
        case 'PROVIDER_LOADED':
            return {
                ...state,
                provider: action.provider
            }
        case 'NETWORK_LOADED':
            return {
                ...state,
                chainId: action.chainId
            }
        case 'ACCOUNT_LOADED':
            return {
                ...state,
                account: action.account
            }
        case 'ETHER_BALANCE_LOADED':
            return {
                ...state,
                balance: action.balance
            }
        default:
            return state
    }
}

export const tokens = (state = { loaded: false, contracts: [], symbols: [] }, action) => {
    switch (action.type) {
        case 'TOKEN_1_LOADED':
            return {
                ...state,
                loaded: true,
                contracts: [action.tokenAddress], // Add only the first token address
                symbols: [action.symbol] // Add only the first symbol
            }
        case 'TOKEN_2_LOADED': // Correct the action type
            return {
                ...state,
                contracts: [...state.contracts, action.tokenAddress], // Append the second token address
                symbols: [...state.symbols, action.symbol] // Append the second symbol
            }
        case 'TOKEN_3_LOADED': // New case for Token 3
            return {
                ...state,
                contracts: [...state.contracts, action.tokenAddress], // Append the third token address
                symbols: [...state.symbols, action.symbol] // Append the third symbol
            };


        case 'CMRD_TOKEN_BALANCE_LOADED':
            return {
                ...state,
                balances: [action.balance] // Add only the first balance
            }
        case 'OTHER_TOKEN_BALANCE_LOADED':
            return {
                ...state,
                balances: [...state.balances, action.balance] // Add only the first balance
            }
        default:
            return state
    }
}

const DEFAULT_EXCHANGE_STATE = {
    loaded: false,
    contract: {},
    allOrders: {
        loaded: false,
        data: []
    },
    filledOrders: {
        loaded: false,
        data: []
    },
    cancelledOrders: {
        loaded: false,
        data: []
    },
    transaction: {
        isSuccessful: false
    },
    events: []
}

export const exchange = (state = DEFAULT_EXCHANGE_STATE, action) => {
    switch (action.type) {
        case 'EXCHANGE_LOADED':
            return {
                ...state,
                loaded: true,
                contract: action.exchange
            }
        case 'ALL_ORDERS_LOADED':
            return {
                ...state,
                allOrders: {
                    loaded: true,
                    data: action.allOrders
                }
            }
        case 'CANCELLED_ORDERS_LOADED':
            return {
                ...state,
                cancelledOrders: {
                    loaded: true,
                    data: action.cancelledOrders
                }
            }
        case 'FILLED_ORDERS_LOADED':
            return {
                ...state,
                filledOrders: {
                    loaded: true,
                    data: action.filledOrders
                }
            }
        case 'ORDER_CANCEL_REQUEST':
            return {
                ...state,
                transaction: {
                    status: "Cancel Order request",
                    isPending: true,
                    isSuccessful: false
                }
            }
        case 'ORDER_CANCEL_SUCCESSFULL':
            return {
                ...state,
                transaction: {
                    status: "Order Cancel successful",
                    isPending: false,
                    isSuccessful: true
                },
                cancelledOrders: {
                    ...state.cancelledOrders,
                    data: [...state.cancelledOrders.data, action.order]
                },
                events: [...state.events, action.event]
            }
        case 'ORDER_CANCEL_FAILED':
            return {
                ...state,
                transaction: {
                    status: "Order Cancel failed",
                    isPending: false,
                    isSuccessful: false,
                    isError: true
                }
            }
        case 'ORDER_FILL_REQUEST':
            return {
                ...state,
                transaction: {
                    status: "Fill Order Request",
                    isPending: true,
                    isSuccessful: false
                }
            }
        case 'ORDER_FILL_SUCCESSFULL':
            return {
                ...state,
                transaction: {
                    status: "Fill Order Successfull",
                    isPending: false,
                    isSuccessfull: true
                },
                filledOrders: {
                    ...state.filledOrders,
                    data: [...state.filledOrders.data, action.order]
                },
                events: [...state.events, action.event]
            }
        case 'ORDER_FILL_FAILED':
            return {
                ...state,
                transaction: {
                    status: "Fill Order Failed",
                    isPending: false,
                    isSuccessful: false,
                    isError: true
                }
            }
        case 'EXCHANGE_CMRD_TOKEN_BALANCE_LOADED':
            return {
                ...state,
                balances: [action.balance]
            }
        case 'EXCHANGE_OTHER_TOKEN_BALANCE_LOADED':
            return {
                ...state,
                balances: [...state.balances, action.balance]
            }


        case 'TRANSFER_REQUEST':
            return {
                ...state,
                transaction: {
                    status: "Transfer in progress",
                    isPending: true,
                    isSuccessful: false
                },
                transferInProgress: true
            }
        case 'TRANSFER_SUCCESSFUL':
            return {
                ...state,
                transaction: {
                    status: "Transfer successful",
                    isPending: false,
                    isSuccessful: true
                },
                transferInProgress: false,
                events: [...state.events, action.event]
            }
        case 'TRANSFER_FAILED':
            return {
                ...state,
                transaction: {
                    status: "Transfer failed",
                    isPending: false,
                    isSuccessful: false,
                    isError: true
                },
                transferInProgress: false
            }


        case 'NEW_ORDER_REQUEST':
            return {
                ...state,
                transaction: {
                    status: "New Order request",
                    isPending: true,
                    isSuccessful: false
                },
            }
        case 'NEW_ORDER_SUCCESSFULL':

            return {
                ...state,
                transaction: {
                    status: "New Order successful",
                    isPending: false,
                    isSuccessful: true
                },
                allOrders: {
                    ...state.allOrders,
                    data: [...state.allOrders.data, action.order]
                },
                events: [...state.events, action.event]
            }
        case 'NEW_ORDER_FAILED':
            return {
                ...state,
                transaction: {
                    status: "New Order failed",
                    isPending: false,
                    isSuccessful: false,
                    isError: true
                },

            }
        default:
            return state
    }
}
