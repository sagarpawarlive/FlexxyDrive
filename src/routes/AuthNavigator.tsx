import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { NavigationKeys } from '../constants/navigationKeys';
import AddMobileNumber from '../screens/Auth/AddMobileNumber';
import AddCarDetails from '../screens/Auth/DriverSignup/AddCarDetails';
import AddDocuments from '../screens/Auth/DriverSignup/AddDocuments';
import AddEmergencyContacts from '../screens/Auth/DriverSignup/AddEmergencyContacts';
import AddPayments from '../screens/Auth/DriverSignup/AddPayments';
import DriverInformation from '../screens/Auth/DriverSignup/DriverInformation';
import NextOfKin from '../screens/Auth/DriverSignup/NextOfKin';
import OtherInformation from '../screens/Auth/DriverSignup/OtherInformation';
import PendingVerification from '../screens/Auth/DriverSignup/PendingVerification';
import VerifyStatusScreen from '../screens/Auth/DriverSignup/VerifyStatusScreen';
import FinalUser from '../screens/Auth/FinalUser';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import IntroScreen from '../screens/Auth/IntroScreen';
import LocationPermission from '../screens/Auth/LocationPermissionScreen/Index';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import OtpScreen from '../screens/Auth/OtpScreen';
import PassengerVerification from '../screens/Auth/PassengerSignup/PassengerVerification';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import SigninScreen from '../screens/Auth/SigninScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import PassengerStatus from '../screens/Auth/PassengerSignup/PassengerStatus';

const Stack = createNativeStackNavigator();

const AuthNavigator: React.FC = () => {
	return (
		<Stack.Navigator initialRouteName={NavigationKeys.OnboardingScreen} screenOptions={{ headerShown: false }}>
			<Stack.Screen name={NavigationKeys.OnboardingScreen} component={OnboardingScreen} />
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
			<Stack.Screen name={NavigationKeys.AddDocuments} component={AddDocuments} />
			<Stack.Screen name={NavigationKeys.OtherInformation} component={OtherInformation} />
			<Stack.Screen name={NavigationKeys.PendingVerification} component={PendingVerification} />
			<Stack.Screen name={NavigationKeys.VerifyStatusScreen} component={VerifyStatusScreen} />

			{/* Passenger Information */}
			<Stack.Screen name={NavigationKeys.PassengerVerification} component={PassengerVerification} />
			<Stack.Screen name={NavigationKeys.PassengerStatus} component={PassengerStatus} />
		</Stack.Navigator>
	);
};

export default AuthNavigator;
