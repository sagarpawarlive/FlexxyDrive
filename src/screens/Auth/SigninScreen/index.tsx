import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Keyboard, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { FontSize, Fonts } from '../../../assets/fonts';
import { Icons } from '../../../assets/Icons';
import AppButton from '../../../components/AppButton';
import AppScrollView from '../../../components/AppScrollView';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import MainContainer from '../../../components/MainContainer';
import { AppContainer, AppHeight, AppMargin } from '../../../constants/commonStyle';
import { _showToast } from '../../../services/UIs/ToastConfig';
import { useTheme } from '../../../theme/ThemeProvider';
import { Theme } from '../../../types';
import { useFormik } from 'formik';
import { NavigationKeys } from '../../../constants/navigationKeys';
import AppLoader from '../../../components/AppLoader';
import { apiPost } from '../../../services/API/apiServices';
import { ENDPOINT } from '../../../services/API/endpoints';
import { APIMethods } from '../../../services/API/methods';
import { setUserData } from '../../../store/reducers/userdataSlice';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { ANDROID_CLIENT_ID, FIREBASE_WEB_CLIENT_ID } from '../../../config';
import { isIOS } from '../../../constants/constants';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

const SigninScreen = (props: any) => {
	const dispatch = useDispatch();
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const imagesData = [
		{ id: 1, src: Icons.icnGoogle, label: 'Google' },
		{ id: 2, src: Icons.icnApple, label: 'Apple' },
		{ id: 3, src: Icons.icnFacebook, label: 'Facebook' },
	];

	useEffect(() => {
		GoogleSignin.configure({
			webClientId: isIOS ? FIREBASE_WEB_CLIENT_ID : ANDROID_CLIENT_ID,
		});
	}, []);

	const googleLogin = async () => {
		try {
			await GoogleSignin.hasPlayServices();
			const userInfo: any = await GoogleSignin.signIn();
			console.log('[ / userInfo google login ] ------->', userInfo);
			let googleParams = {
				token: userInfo.data.idToken,
			};
			const response: any = await apiPost(ENDPOINT.GOOGLE_LOGIN, googleParams, []);
			console.log('[ / {google signin Resss }] ------->', response);
			if (response?.requirePhoneNumber == true) {
				props.navigation.navigate(NavigationKeys.AddMobileNumber, {
					userId: response?.user?.id,
				});
			} else {
				props.navigation.navigate(NavigationKeys.FinalUser);
				dispatch(setUserData(response));
			}
		} catch (error: any) {
			if (error.code == statusCodes.SIGN_IN_CANCELLED) {
				console.log(error);
			} else if (error.code == statusCodes.IN_PROGRESS) {
				console.log(error);
			} else if (error.code == statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				console.log(error);
			} else {
			}
		}
	};

	async function onFacebookButtonPress() {
		// Attempt login with permissions
		const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

		if (result.isCancelled) {
			throw 'User cancelled the login process';
		}

		// Once signed in, get the users AccessToken
		const data = await AccessToken.getCurrentAccessToken();

		console.log(data, '<=== data');

		if (!data) {
			_showToast('Something went wrong obtaining access token', 'success');
		}

		// const facebookParams = {
		// 	token: 'appleCredential?.token',
		// 	secret: 'appleCredential?.secret',
		// 	providerId: 'appleCredential?.providerId',
		// };

		// const response: any = await apiPost(ENDPOINT.GOOGLE_LOGIN, facebookParams, []);
		// console.log('[ / {google signin Resss }] ------->', response);
		// if (response?.requirePhoneNumber == true) {
		// 	props.navigation.navigate(NavigationKeys.AddMobileNumber, {
		// 		userId: response?.user?.id,
		// 	});
		// } else {
		// 	props.navigation.navigate(NavigationKeys.FinalUser);
		// 	dispatch(setUserData(response));
		// }
	}

	async function onAppleButtonPress() {
		// Start the sign-in request
		const appleAuthRequestResponse = await appleAuth.performRequest({
			requestedOperation: appleAuth.Operation.LOGIN,
			// As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
			// See: https://github.com/invertase/react-native-apple-authentication#faqs
			requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
		});

		console.log(appleAuthRequestResponse, '<=== appleAuthRequestResponse');

		// Ensure Apple returned a user identityToken
		if (!appleAuthRequestResponse.identityToken) {
			throw new Error('Apple Sign-In failed - no identify token returned');
		}

		// Create a Firebase credential from the response
		const { identityToken, nonce } = appleAuthRequestResponse;
		const appleCredential = await auth.AppleAuthProvider.credential(identityToken, nonce);

		console.log(appleCredential, '<==== appleCredential');

		const appleParams = {
			token: appleCredential?.token,
			secret: appleCredential?.secret,
			providerId: appleCredential?.providerId,
		};

		const response: any = await apiPost(ENDPOINT.APPLE_LOGIN, appleParams, []);
		console.log('[ / {apple signin Resss }] ------->', response);

		if (response?.requirePhoneNumber == true) {
			props.navigation.navigate(NavigationKeys.AddMobileNumber, {
				userId: response?.user?.id,
			});
		} else {
			props.navigation.navigate(NavigationKeys.FinalUser);
			dispatch(setUserData(response));
		}
	}

	// Handle press event for each icon
	const handlePress = (id: number) => {
		switch (id) {
			case 1:
				googleLogin();
				break;
			case 2:
				onAppleButtonPress();
				break;
			case 3:
				onFacebookButtonPress();
				break;
			default:
				break;
		}
	};

	// Formik validation schema with Yup
	const validationSchema = Yup.object().shape({
		username: Yup.string().required('Username is required'),
		password: Yup.string()
			.min(8, 'Password must be at least 8 characters long')
			// .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
			// .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
			// .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
			.required('Password is required'),
	});

	// Formik hook initialization
	const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
		initialValues: {
			username: '',
			password: '',
		},
		validationSchema,

		onSubmit: (values: any) => {
			// Log the submitted values
			Keyboard.dismiss();
			let res = api_signin(values);
			// props.navigation.navigate(NavigationKeys.OtpScreen);
			// dispatch(setIsLogin(true));
		},
	});

	const api_signin = async (values: any) => {
		setIsLoading(true);
		const response: any = await APIMethods.post(ENDPOINT.LOGIN, values, []);
		_showToast(response?.message, response?.user ? 'success' : 'error');
		if (response?.user) props.navigation.navigate(NavigationKeys.FinalUser);
		dispatch(setUserData(response));
		setIsLoading(false);
	};

	const api_googleSignin = async (values: any) => {
		setIsLoading(true);
		const response: any = await APIMethods.post(ENDPOINT.GOOGLE_LOGIN, values, []);
		_showToast(response?.message, response?.user ? 'success' : 'error');
		// if (response?.user) props.navigation.navigate(NavigationKeys.FinalUser);
		// dispatch(setUserData(response));
		setIsLoading(false);
	};

	return (
		<MainContainer>
			<View style={styles.primaryContainer}>
				<AppScrollView bounces={false} extraHeight={AppHeight._350}>
					<View style={[AppContainer]}>
						<View style={styles.logoContainer}>
							{/* <AppText fontSize={FontSize._40} fontFamily={Fonts.BOLD} title={'LOGO'} /> */}
						</View>

						<View style={styles.logoContainer}>
							<AppText fontSize={FontSize._36} fontFamily={Fonts.REGULAR} title={'Login'} />
						</View>

						{/* Email Field */}
						<View style={{ marginTop: AppMargin._40 }}>
							<AppTextInput
								marginTop={5}
								placeholder={'Username'}
								value={values.username} // Use Formik's value
								onChangeText={text => handleChange('username')(text)}
								onBlur={() => handleBlur('username')}
								showError={errors.username}
								autoCaps="none"
							/>
						</View>

						{/* Password Field */}
						<View style={{ marginTop: AppMargin._20 }}>
							<AppTextInput
								marginTop={AppMargin._5}
								iconRight={showPassword ? Icons.icnShowPass : Icons.icnHidePass}
								iconRightClick={() => setShowPassword(!showPassword)}
								placeholder={'Password'}
								value={values.password} // Use Formik's value
								onChangeText={text => handleChange('password')(text)}
								onBlur={() => handleBlur('password')}
								secureTextEntry={!showPassword}
								showError={errors.password}
							/>
						</View>

						{/* Forgot password */}
						<View style={styles.forgotPasswordContainer}>
							<Pressable onPress={() => props.navigation.navigate(NavigationKeys.ForgotPasswordScreen)}>
								<AppText
									textColor={AppColors.primary}
									fontSize={FontSize._14}
									fontFamily={Fonts.MEDIUM}
									label="Forgot password ?"
								/>
							</Pressable>
						</View>

						<View style={{ flex: 1, justifyContent: 'flex-end' }}>
							<View style={styles.socialLoginContainer}>
								<FlatList
									bounces={false}
									scrollEnabled={false}
									data={imagesData}
									horizontal
									keyExtractor={item => item.id.toString()}
									renderItem={({ item }) => (
										<TouchableOpacity
											style={styles.iconContainer}
											onPress={() => handlePress(item.id)}>
											<Image source={item.src} />
										</TouchableOpacity>
									)}
								/>
							</View>
							<AppButton
								top={AppMargin._40}
								fontSize={FontSize._16}
								textColor={AppColors.textDark}
								fontFamily={Fonts.MEDIUM}
								buttonLabel={'Confirm'}
								onClick={handleSubmit} // Use Formik's handleSubmit
							/>
						</View>
						<View style={styles.bottomContainer}>
							<AppText
								fontSize={FontSize._16}
								fontFamily={Fonts.MEDIUM}
								label={`Don't have an account?`}
							/>
							<Pressable onPress={() => props.navigation.navigate(NavigationKeys.SignupScreen)}>
								<AppText
									left={5}
									textColor={AppColors.primary}
									fontSize={FontSize._16}
									fontFamily={Fonts.MEDIUM}
									label={`Sign up`}
								/>
							</Pressable>
						</View>
					</View>
				</AppScrollView>
			</View>

			<AppLoader isLoading={isLoading} />
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		logoContainer: {
			marginTop: AppMargin._50,
			justifyContent: 'center',
			alignItems: 'center',
		},
		iconContainer: {
			alignItems: 'center',
			marginHorizontal: 20,
		},
		socialLoginContainer: {
			// marginTop: AppMargin._100,
			justifyContent: 'center',
			alignItems: 'center',
			shadowColor: '#FFFFFF',
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 10.84,
			elevation: 5,
		},
		primaryContainer: { flex: 1, backgroundColor: AppColors.background },
		forgotPasswordContainer: {
			marginVertical: AppMargin._10,
			alignItems: 'flex-end',
		},
		bottomContainer: {
			justifyContent: 'center',
			marginTop: 20,
			flexDirection: 'row',
		},
	});
};

export default SigninScreen;
