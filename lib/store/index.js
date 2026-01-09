import { createStore, applyMiddleware } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import logger from 'redux-logger';
import { rootReducer } from './reducers';

/* =====================
   Middleware
===================== */
const getMiddleware = () => {
  const middleware = [];

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger);
  }

  return middleware;
};

/* =====================
   Store creator
===================== */
export const makeStore = () => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    return createStore(
      rootReducer,
      applyMiddleware(...getMiddleware())
    );
  }

  // ===== CLIENT SIDE =====
  const { persistStore, persistReducer } = require('redux-persist');
  const storage = require('redux-persist/lib/storage').default;

  const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['commons', 'carts'],
    // ❌ KHÔNG persist users (cookie là nguồn thật)
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(
    persistedReducer,
    applyMiddleware(...getMiddleware())
  );

  store.__persistor = persistStore(store);

  return store;
};

/* =====================
   Wrapper
===================== */
export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV !== 'production',
});
