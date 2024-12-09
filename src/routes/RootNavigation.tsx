import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import I18n from 'react-native-i18n';
import { useSelector } from 'react-redux';
import SplashScreen from '../screens/SplashScreen';
import { NavigationKeys } from '../constants/navigationKeys';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigation from './BottomTabNavigator';
import StarterScreen from '../screens/StarterScreen';
import FinalUser from '../screens/Auth/FinalUser';

const Stack = createNativeStackNavigator();

const RootNavigation: React.FC = (props: any) => {
	const options: NativeStackNavigationOptions = { animation: 'none' };
	const commonData = useSelector((state: any) => state.userDataSlice);
	I18n.locale = commonData.localize;

	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName={NavigationKeys.SplashScreen}
				screenOptions={{ headerShown: false, gestureEnabled: false }}>
				<Stack.Screen name={NavigationKeys.SplashScreen} component={SplashScreen} />
				<Stack.Screen options={options} name={NavigationKeys.AuthNavigator} component={AuthNavigator} />
				<Stack.Screen options={options} name={NavigationKeys.BottomTab} component={BottomTabNavigation} />
				<Stack.Screen options={options} name={NavigationKeys.FinalUser} component={FinalUser} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default RootNavigation;
