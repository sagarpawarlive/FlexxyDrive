import { useFormik } from 'formik';
import React, { useMemo, useRef, useState } from 'react';
import { FlatList, Image, Keyboard, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import { NavigationKeys } from '../../../constants/navigationKeys';
import { _showToast } from '../../../services/UIs/ToastConfig';
import { useTheme } from '../../../theme/ThemeProvider';
import { Theme } from '../../../types';
import CountryPicker from 'react-native-country-picker-modal';
import AppLoader from '../../../components/AppLoader';
import { APIMethods } from '../../../services/API/methods';
import { ENDPOINT } from '../../../services/API/endpoints';
import { apiPost } from '../../../services/API/apiServices';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { setUserData } from '../../../store/reducers/userdataSlice';
import auth from '@react-native-firebase/auth';
import {
	confirmPasswordValidation,
	emailValidation,
	firstNameValidation,
	lastNameValidation,
	passwordValidation,
	phoneValidation,
	usernameValidation,
} from '../../../constants/validationSchema';
import { t } from '../../../i18n';
import { imagesData } from '../../../constants/staticData';
import appleAuth from '@invertase/react-native-apple-authentication';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import metrics from '../../../constants/metrics';

const SignupScreen = (props: any) => {
	const dispatch = useDispatch();
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [countryCallingCode, setCountryCallingCode] = useState('91'); // Default to USA country code
	const [selectedCountry, setSelectedCountry]: any = useState('IN'); // To store selected country
	const [showCountryPicker, setShowCountryPicker] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [newUser, setNewUser] = useState<any>();

	const userNameRef = useRef<any>(null);
	const firstNameRef = useRef<any>(null);
	const lastNameRef = useRef<any>(null);
	const phoneNumberRef = useRef<any>(null);
	const emailRef = useRef<any>(null);
	const passwordRef = useRef<any>(null);
	const confirmPasswordRef = useRef<any>(null);

	const onSelectCountry = (country: any) => {
		setShowCountryPicker(false);
		setSelectedCountry(country.cca2);
		setCountryCallingCode(country.callingCode[0]);
		console.log('[  country ] ----------------------->> ', country);
	};

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

	const validationSchema = Yup.object().shape({
		username: usernameValidation,
		firstName: firstNameValidation,
		lastName: lastNameValidation,
		phone: phoneValidation,
		email: emailValidation,
		password: passwordValidation,
		confirmPassword: confirmPasswordValidation,
	});

	const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
		initialValues: {
			username: '',
			firstName: '',
			lastName: '',
			phone: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationSchema,
		onSubmit: async (values: any) => {
			const New_phone = `+${countryCallingCode}${values.phone}`;

			//signup params
			let params = {
				firstName: values.firstName,
				lastName: values.lastName,
				username: values.username,
				phoneNumber: New_phone,
				email: values.email,
				password: values.password,
			};

			let smsParams = {
				phoneNumber: New_phone,
			};
			Keyboard.dismiss();

			setIsLoading(true);
			let res = await apiSignup(params);

			// _showToast('You have received an OTP', 'success');
		},
	});

	const apiSignup = async (values: any) => {
		const response: any = await APIMethods.post(ENDPOINT.SIGNUP, values, []);
		console.log(response, '<== response');

		if (response?.data?.user?.id) {
			const responseOtp: any = await APIMethods.post(ENDPOINT.SEND_SMS_OTP, values, []);
			if (responseOtp?.statusCode >= 200 && responseOtp?.statusCode <= 299) {
				props.navigation.navigate(NavigationKeys.OtpScreen, {
					phone: values.phoneNumber,
					newUser: response,
				});
				console.log('[ / {newUser}] ------->', newUser);
				_showToast('You have received an OTP', 'success');
			} else {
				_showToast(responseOtp?.message, 'error');
			}
		} else {
			_showToast(response?.message, 'error');
		}
		setIsLoading(false);
	};

	const renderFormField = (
		placeholder: string,
		fieldName: string,
		isPassword: boolean = false,
		isCountry = false,
		ref?,
		nextRef?,
	) => (
		<View style={{ marginTop: AppMargin._20 }}>
			<AppTextInput
				ref={ref}
				maxLength={fieldName === 'phone' ? 15 : undefined}
				marginTop={AppMargin._5}
				placeholder={placeholder}
				value={values[fieldName]}
				autoCaps="none"
				inputMode={isCountry ? 'phone-pad' : 'default'}
				onChangeText={handleChange(fieldName)}
				onBlur={handleBlur(fieldName)}
				secureTextEntry={isPassword && !showPassword}
				leftNode={
					isCountry && (
						<Pressable onPress={() => setShowCountryPicker(true)}>
							<AppText fontSize={FontSize._16} title={`+${countryCallingCode}`} />
						</Pressable>
					)
				}
				iconRight={isPassword ? (showPassword ? Icons.icnShowPass : Icons.icnHidePass) : undefined}
				iconRightClick={() => setShowPassword(!showPassword)}
				showError={touched[fieldName] && errors[fieldName]}
				returnKeyType={placeholder === 'Confirm Password' ? 'done' : 'next'}
				onSubmitEditing={() =>
					placeholder === 'Confirm Password' ? Keyboard.dismiss() : nextRef?.current?.focus()
				}
				texInputProps={{
					blurOnSubmit: false,
				}}
			/>
		</View>
	);

	return (
		<MainContainer>
			<View style={styles.primaryContainer}>
				<AppScrollView bounces={false} extraHeight={AppHeight._350}>
					<View style={[AppContainer]}>
						<View style={styles.logoContainer}>
							<Image
								source={Icons.icnFlexxyLogoIcon}
								resizeMode="contain"
								style={{ height: metrics.verticalScale(28) }}
							/>
							{/* <AppText fontSize={FontSize._40} fontFamily={Fonts.BOLD} title={'LOGO'} /> */}
						</View>

						<View style={[styles.logoContainer, { marginTop: metrics.verticalScale(30) }]}>
							<AppText fontSize={FontSize._36} fontFamily={Fonts.MEDIUM} title={t('signup')} />
						</View>

						{/* Render Form Fields */}
						{renderFormField(t('username'), 'username', false, false, userNameRef, firstNameRef)}
						{renderFormField(t('firstName'), 'firstName', false, false, firstNameRef, lastNameRef)}
						{renderFormField(t('lastName'), 'lastName', false, false, lastNameRef, phoneNumberRef)}
						{renderFormField(t('phoneNumber'), 'phone', false, true, phoneNumberRef, emailRef)}
						{renderFormField(t('emailId'), 'email', false, false, emailRef, passwordRef)}
						{renderFormField('Password', 'password', true, false, passwordRef, confirmPasswordRef)}
						{renderFormField('Confirm Password', 'confirmPassword', true, false, confirmPasswordRef)}

						<View style={{ marginTop: metrics.verticalScale(30) }}>
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
								buttonLabel={t('signup')}
								onClick={handleSubmit}
							/>
						</View>

						<View style={styles.bottomContainer}>
							<AppText
								fontSize={FontSize._12}
								fontFamily={Fonts.MEDIUM}
								label={t('alreadyHaveAnAccount')}
							/>
							<Pressable onPress={() => props.navigation.navigate(NavigationKeys.SigninScreen)}>
								<AppText
									left={5}
									textColor={AppColors.text}
									fontSize={FontSize._12}
									fontFamily={Fonts.BOLD}
									label={t('login')}
									underLine
								/>
							</Pressable>
						</View>
					</View>
				</AppScrollView>
			</View>

			<CountryPicker
				theme={{
					backgroundColor: AppColors.background,
					onBackgroundTextColor: AppColors.white,
				}}
				visible={showCountryPicker}
				countryCode={selectedCountry}
				withFlag={true}
				withCallingCodeButton={false}
				withFlagButton={false}
				countryCodes={[]}
				withCallingCode={true}
				withAlphaFilter={true}
				withFilter={true}
				withCountryNameButton={false}
				onSelect={onSelectCountry}
				onClose={() => setShowCountryPicker(false)}
				containerButtonStyle={{}}
			/>

			<AppLoader isLoading={isLoading} />
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		logoContainer: {
			marginTop: metrics.verticalScale(50),
			justifyContent: 'center',
			alignItems: 'center',
		},
		iconContainer: {
			alignItems: 'center',
			marginHorizontal: metrics.horizontalScale(20),
		},
		socialLoginContainer: {
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
		primaryContainer: { flex: 1, backgroundColor: AppColors.background, paddingBottom: metrics.verticalScale(20) },
		signupLinkContainer: {
			justifyContent: 'center',
			marginTop: metrics.verticalScale(20),
			flexDirection: 'row',
		},
		bottomContainer: {
			justifyContent: 'center',
			marginTop: metrics.verticalScale(20),
			flexDirection: 'row',
		},
	});
};

export default SignupScreen;
