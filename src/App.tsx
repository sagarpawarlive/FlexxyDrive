import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import StackNavigator from './routes/RootNavigation';
import toastConfig, { has_Notch } from './services/UIs/ToastConfig';
import store, { persistor } from './store';
import { ThemeProvider } from './theme/ThemeProvider';

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App: React.FC = () => {
	useEffect(() => {
		// console.log = () => { }; // comment this like to enable console log in entire app
		const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			return true;
		});
		return () => {
			backHandler.remove();
		};
	}, []);

	const state = store.getState(); // to change app language without restarting the app

	useEffect(() => {
		console.log(state.userDataSlice.localize, ' - Current Language');
	}, [state.userDataSlice.localize]);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Provider store={store}>
				<PersistGate persistor={persistor} loading={null}>
					<ThemeProvider isDisabled={false}>
						<StackNavigator />
						<Toast config={toastConfig} topOffset={has_Notch ? 0 : 20} position="top" />
					</ThemeProvider>
				</PersistGate>
			</Provider>
		</GestureHandlerRootView>
	);
};

export default App;
