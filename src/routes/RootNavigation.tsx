import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import I18n from 'react-native-i18n';
import { useSelector } from 'react-redux';
import SplashScreen from '../screens/SplashScreen';
import { NavigationKeys } from '../constants/navigationKeys';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigation from './BottomTabNavigator';
import StarterScreen from '../screens/StarterScreen';
import FinalUser from '../screens/Auth/FinalUser';
import { navigationRef } from '../utils/navigationUtils';
import MapScreen from '../screens/PassangerScreen';
import PassangerScreen from '../screens/PassangerScreen';
import { getCurrencies, getLocales } from 'react-native-localize';
import AddPassengerDocuments from '../screens/Auth/PassengerSignup/PassengerVerification';
import PassengerVerification from '../screens/Auth/PassengerSignup/PassengerVerification';

const Stack = createNativeStackNavigator();

const RootNavigation: React.FC = (props: any) => {
	const options: NativeStackNavigationOptions = { animation: 'none' };
	const commonData = useSelector((state: any) => state.userDataSlice);
	const locales = getLocales();
	const germanLocale = locales.find(locale => locale.languageTag === 'de-DE');

	I18n.locale = germanLocale ? germanLocale.languageCode : commonData.localize;

	console.log(getLocales(), '<=== getLocales');
	console.log(getCurrencies(), 'getCurrencies');

	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator
				initialRouteName={NavigationKeys.SplashScreen}
				screenOptions={{ headerShown: false, gestureEnabled: false }}>
				<Stack.Screen name={NavigationKeys.SplashScreen} component={SplashScreen} />
				<Stack.Screen options={options} name={NavigationKeys.AuthNavigator} component={AuthNavigator} />
				<Stack.Screen options={options} name={NavigationKeys.BottomTab} component={BottomTabNavigation} />
				<Stack.Screen options={options} name={NavigationKeys.FinalUser} component={FinalUser} />
				<Stack.Screen options={options} name={NavigationKeys.PassangerScreen} component={PassangerScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default RootNavigation;
