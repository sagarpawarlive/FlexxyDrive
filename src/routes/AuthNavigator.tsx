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
import DriverInformation from '../screens/Auth/DriverSignup/DriverInformation';
import AddCarDetails from '../screens/Auth/DriverSignup/AddCarDetails';
import AddPayments from '../screens/Auth/DriverSignup/AddPayments';
import AddEmergencyContacts from '../screens/Auth/DriverSignup/AddEmergencyContacts';
import NextOfKin from '../screens/Auth/DriverSignup/NextOfKin';
import AddMobileNumber from '../screens/Auth/AddMobileNumber';

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
			<Stack.Screen name={NavigationKeys.AddMobileNumber} component={AddMobileNumber} />

			{/* Driver Information  Stack */}
			<Stack.Screen name={NavigationKeys.DriverInformation} component={DriverInformation} />
			<Stack.Screen name={NavigationKeys.AddCarDetails} component={AddCarDetails} />
			<Stack.Screen name={NavigationKeys.AddPayments} component={AddPayments} />
			<Stack.Screen name={NavigationKeys.NextOfKin} component={NextOfKin} />
			<Stack.Screen name={NavigationKeys.AddEmergencyContacts} component={AddEmergencyContacts} />
		</Stack.Navigator>
	);
};

export default AuthNavigator;
