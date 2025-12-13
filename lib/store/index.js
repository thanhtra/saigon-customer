
import { applyMiddleware, createStore } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import logger from 'redux-logger';
import { rootReducer } from './reducers';

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');

    return composeWithDevTools(applyMiddleware(...middleware))
  }

  return applyMiddleware();
}


export const makeStore = (context) => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    const store = createStore(rootReducer, bindMiddleware([logger]))
    return store;

  } else {
    const { persistStore, persistReducer } = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;

    const persistConfig = {
      key: 'nextjs',
      whitelist: ['commons', 'carts', 'users'],
      storage
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer)
    const store = createStore(persistedReducer, bindMiddleware([logger]))

    store.__persistor = persistStore(store);
    return store;
  }
}

export const wrapper = createWrapper(makeStore, { debug: true })