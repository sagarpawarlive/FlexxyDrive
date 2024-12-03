import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SigninScreen from '../screens/Auth/SigninScreen';
import { NavigationKeys } from '../constants/navigationKeys';
import IntroScreen from '../screens/Auth/IntroScreen';
import LocationPermission from '../screens/Auth/LocationPermissionScreen/Index';
import SignupScreen from '../screens/Auth/SignupScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import OtpScreen from '../screens/Auth/OtpScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import FinalUser from '../screens/Auth/FinalUser';

const Stack = createNativeStackNavigator();

const AuthNavigator: React.FC = () => {
	return (
		<Stack.Navigator initialRouteName={NavigationKeys.IntroScreen} screenOptions={{ headerShown: false }}>
			<Stack.Screen name={NavigationKeys.IntroScreen} component={IntroScreen} />
			<Stack.Screen name={NavigationKeys.LocationPermission} component={LocationPermission} />
			<Stack.Screen name={NavigationKeys.SigninScreen} component={SigninScreen} />
			<Stack.Screen name={NavigationKeys.ForgotPasswordScreen} component={ForgotPasswordScreen} />
			<Stack.Screen name={NavigationKeys.ResetPasswordScreen} component={ResetPasswordScreen} />
			<Stack.Screen name={NavigationKeys.SignupScreen} component={SignupScreen} />
			<Stack.Screen name={NavigationKeys.FinalUser} component={FinalUser} />
			<Stack.Screen name={NavigationKeys.OtpScreen} component={OtpScreen} />
		</Stack.Navigator>
	);
};

export default AuthNavigator;
