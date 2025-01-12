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
import { imagesData, ImagesDataAndroid } from '../../../constants/staticData';
import { passwordValidation, usernameValidation } from '../../../constants/validationSchema';
import Metrics from '../../../constants/metrics';
import { t } from '../../../i18n';
import { Images } from '../../../assets/images';
import metrics from '../../../constants/metrics';

const SigninScreen = (props: any) => {
	const dispatch = useDispatch();
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

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
			if (userInfo?.data?.idToken) {
				let googleParams = {
					token: userInfo.data.idToken,
				};
				const response: any = await apiPost(ENDPOINT.GOOGLE_LOGIN, googleParams, []);
				console.log('[ / {google signin Resss }] ------->', response);
				if (response?.data?.requirePhoneNumber == true) {
					props.navigation.navigate(NavigationKeys.AddMobileNumber, {
						userId: response?.data?.user?.id,
					});
				} else {
					if (response?.data?.token?.length > 0) {
						props.navigation.navigate(NavigationKeys.FinalUser);
						dispatch(setUserData(response));
					} else {
						_showToast(response?.message, 'error');
					}
				}
			} else {
				_showToast(userInfo?.type, 'error');
			}
		} catch (error: any) {
			if (error.code == statusCodes.SIGN_IN_CANCELLED) {
				_showToast(error?.message, 'error');
			} else if (error?.code == statusCodes.IN_PROGRESS) {
				_showToast(error?.message, 'error');
			} else if (error?.code == statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				_showToast(error?.message, 'error');
			} else {
				_showToast(error?.message, 'error');
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

		if (response?.data?.requirePhoneNumber == true) {
			props.navigation.navigate(NavigationKeys.AddMobileNumber, {
				userId: response?.data?.user?.id,
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
		username: usernameValidation,
		password: passwordValidation,
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
		console.log(response, '<== response hello');

		_showToast(response?.message, response?.data?.user ? 'success' : 'error');
		if (response?.data?.user) props.navigation.navigate(NavigationKeys.FinalUser);
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
				<AppScrollView bounces={false} extraHeight={Metrics.verticalScale(350)}>
					<View style={[AppContainer]}>
						<View style={[styles.logoContainer]}>
							<Image
								source={Icons.icnFlexxyLogoIcon}
								resizeMode="contain"
								style={{ height: metrics.verticalScale(28) }}
							/>
							{/* <AppText fontSize={FontSize._40} fontFamily={Fonts.BOLD} title={'LOGO'} /> */}
						</View>

						<View style={[styles.logoContainer, { marginTop: Metrics.verticalScale(30) }]}>
							<AppText fontSize={FontSize._36} fontFamily={Fonts.MEDIUM} title={t('welcomeBack')} />
						</View>

						{/* Email Field */}
						<View style={{ marginTop: AppMargin._40 }}>
							<AppTextInput
								marginTop={Metrics.verticalScale(5)}
								placeholder={t('username')}
								value={values.username} // Use Formik's value
								onChangeText={text => handleChange('username')(text)}
								onBlur={() => handleBlur('username')}
								showError={errors.username}
								autoCaps="none"
							/>
						</View>

						{/* Password Field */}
						<View style={{ marginTop: Metrics.verticalScale(15) }}>
							<AppTextInput
								marginTop={AppMargin._5}
								iconRight={showPassword ? Icons.icnShowPass : Icons.icnHidePass}
								iconRightClick={() => setShowPassword(!showPassword)}
								placeholder={t('password')}
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
									label={t('forgotPassword')}
								/>
							</Pressable>
						</View>

						<View style={{ flex: 1, justifyContent: 'flex-end' }}>
							<AppButton
								top={Metrics.verticalScale(40)}
								fontSize={FontSize._18}
								textColor={AppColors.textDark}
								fontFamily={Fonts.MEDIUM}
								buttonLabel={t('login')}
								onClick={handleSubmit} // Use Formik's handleSubmit
							/>
						</View>
						<View style={styles.bottomContainer}>
							<AppText
								fontSize={FontSize._12}
								fontFamily={Fonts.REGULAR}
								label={t('dontHaveAnAccount')}
							/>
							<Pressable onPress={() => props.navigation.navigate(NavigationKeys.SignupScreen)}>
								<AppText
									left={Metrics.horizontalScale(5)}
									textColor={AppColors.text}
									fontSize={FontSize._12}
									fontFamily={Fonts.BOLD}
									label={t('signup')}
									underLine
								/>
							</Pressable>
						</View>

						<View style={styles.socialLoginContainer}>
							<FlatList
								bounces={false}
								scrollEnabled={false}
								data={isIOS ? imagesData : ImagesDataAndroid}
								horizontal
								keyExtractor={item => item.id.toString()}
								renderItem={({ item }) => (
									<TouchableOpacity style={styles.iconContainer} onPress={() => handlePress(item.id)}>
										<Image source={item.src} />
									</TouchableOpacity>
								)}
							/>
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
			marginTop: Metrics.verticalScale(50),
			justifyContent: 'center',
			alignItems: 'center',
		},
		iconContainer: {
			alignItems: 'center',
			marginHorizontal: Metrics.horizontalScale(20),
		},
		socialLoginContainer: {
			marginTop: metrics.verticalScale(70),
			justifyContent: 'center',
			alignItems: 'center',
			shadowColor: AppColors.white,
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 10.84,
			elevation: 5,
		},
		primaryContainer: { flex: 1, backgroundColor: AppColors.background, paddingBottom: Metrics.verticalScale(20) },
		forgotPasswordContainer: {
			marginVertical: Metrics.verticalScale(10),
			alignItems: 'flex-end',
		},
		bottomContainer: {
			justifyContent: 'center',
			marginTop: Metrics.verticalScale(20),
			flexDirection: 'row',
		},
	});
};

export default SigninScreen;
