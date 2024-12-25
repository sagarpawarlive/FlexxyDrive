//@ts-nocheck
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';
import { name as AppName } from './app.json';
import { reactotronRedux } from 'reactotron-redux';
let reactotron;
if (__DEV__) {
	reactotron = Reactotron.configure({
		name: AppName,
		// host: '192.168.1.51',
		// port: 9090,
	})
		.use(reactotronRedux())
		.useReactNative({
			asyncStorage: true,
			networking: { ignoreUrls: /(symbolicated|localhost:8081|generate_204)/ },
			editor: false,
			errors: { veto: stackFrame => false },
			overlay: false,
		}) // .setAsyncStorageHandler(AsyncStorage)
		// .use(reactotronRedux())
		.connect(); // Connect to local client

	// console.warn = Reactotron.warn
	console.log = Reactotron.log;
	// console.info = Reactotron.log

	Reactotron.onCustomCommand({
		command: 'Clear AsyncStorage',
		handler: () => {
			AsyncStorage.getAllKeys()
				.then(keys => AsyncStorage.multiRemove(keys))
				.then(() => {
					alert('Clear Asyncstorage successfully.');
				});
		},
		title: 'Clear AsyncStorage',
		description: 'Clears all data from AsyncStorage.',
	});
}
export default reactotron;
