import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createFilter } from 'redux-persist-transform-filter';
import thunk from 'redux-thunk';
import rootReducer, { RootState } from './slices'



const initialState = {
  user: {
    data: '',
    loading: false,
    error: '',
  },
};

const userStateFilter = createFilter('user', ['data']);
const investorStateFilter = createFilter('investor', ['data']);

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [],
  whitelist: ['wallet', 'connector', 'appNetwork', 'solanaWallet'],
  transforms: [userStateFilter, investorStateFilter],
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer as any);

export const store = configureStore({
  reducer: persistedReducer as any,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
    },
  }).concat(thunk) as any,
  preloadedState: initialState, 
});

export const persistor = persistStore(store);

const configureStoreWithPersistor = () => {
  return { store, persistor };
};

export default configureStoreWithPersistor;