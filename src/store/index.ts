import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import userDataSlice from './reducers/userdataSlice';

const storage = AsyncStorage;

const persistConfig = {
	key: 'persistStorage',
	storage: storage,
	blacklist: [''],
	whitelist: ['userData', 'localize', 'isDarkMode', 'themeSystemSetting', 'isLogin'],
};

const userData_Slice = persistReducer(persistConfig, userDataSlice);

// Define your additional middleware here

const additionalMiddleware = (store: any) => (next: any) => (action: any) => {
	// Middleware logic
	return next(action);
};

const store = configureStore({
	reducer: {
		//multiple reducers
		userDataSlice: userData_Slice,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(additionalMiddleware), // Add multiple middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

export default store;
