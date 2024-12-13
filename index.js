/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';

Amplify.configure(amplifyconfig);

if (__DEV__) {
    require("./ReactotronConfig");
}

AppRegistry.registerComponent(appName, () => App);