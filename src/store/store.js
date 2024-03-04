import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers } from '@reduxjs/toolkit'; // Import combineReducers
import { provider, tokens, exchange } from './reducers';

const initialState = {};
const middleware = [thunk];

const rootReducer = combineReducers({
    provider,
    tokens,
    exchange
});

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(...middleware),
}, composeWithDevTools());

export default store;
