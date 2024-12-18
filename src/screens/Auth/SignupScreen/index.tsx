import { useFormik } from 'formik';
import React, { useMemo, useState } from 'react';
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

	const imagesData = useMemo(
		() => [
			{ id: 1, src: Icons.icnGoogle, label: 'Google' },
			{ id: 2, src: Icons.icnApple, label: 'Apple' },
			{ id: 3, src: Icons.icnFacebook, label: 'Facebook' },
		],
		[],
	);

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

	const handlePress = (id: number) => {
		switch (id) {
			case 1:
				googleLogin();
				break;
			case 2:
				alert('Apple Icon Pressed');
				break;
			case 3:
				alert('Facebook Icon Pressed');
				break;
			default:
				break;
		}
	};

	const validationSchema = Yup.object().shape({
		username: Yup.string().required('Username  is required'),
		firstName: Yup.string().required('First name is required'),
		lastName: Yup.string().required('Last name is required'),
		phone: Yup.string()
			.matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
			.required('Phone number is required'),
		email: Yup.string().email('Enter valid Email address').required('Email is required'),
		password: Yup.string()
			.min(8, 'Password must be at least 8 characters long')
			// .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
			// .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
			// .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
			.required('Password is required'),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('password'), null], 'Passwords must match')
			.required('Confirm Password is required'),
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
		onSubmit: (values: any) => {
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
			let res = apiSignup(params);

			// _showToast('You have received an OTP', 'success');
			setIsLoading(false);
		},
	});

	const apiSignup = async (values: any) => {
		const response: any = await APIMethods.post(ENDPOINT.SIGNUP, values, []);
		if (response.statusCode >= 200 && response.statusCodes <= 299) {
			const responseOtp: any = await APIMethods.post(ENDPOINT.SEND_SMS_OTP, values, []);
			if (responseOtp.statusCode >= 200 && responseOtp.statusCodes <= 299) {
				props.navigation.navigate(NavigationKeys.OtpScreen, {
					phone: values.phoneNumber,
					newUser: response,
				});
				console.log('[ / {newUser}] ------->', newUser);
				_showToast('You have received an OTP', 'success');
			}
		} else {
			_showToast(response?.message, 'error');
		}
	};

	const renderFormField = (
		placeholder: string,
		fieldName: string,
		isPassword: boolean = false,
		isCountry = false,
	) => (
		<View style={{ marginTop: AppMargin._20 }}>
			<AppTextInput
				maxLength={fieldName === 'phone' ? 10 : undefined}
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
			/>
		</View>
	);

	return (
		<MainContainer>
			<View style={styles.primaryContainer}>
				<AppScrollView bounces={false} extraHeight={AppHeight._350}>
					<View style={[AppContainer]}>
						<View style={styles.logoContainer}>
							{/* <AppText fontSize={FontSize._40} fontFamily={Fonts.BOLD} title={'LOGO'} /> */}
						</View>

						<View style={styles.logoContainer}>
							<AppText fontSize={FontSize._36} fontFamily={Fonts.REGULAR} title={'Sign Up'} />
						</View>

						{/* Render Form Fields */}
						{renderFormField('Username', 'username')}
						{renderFormField('First Name', 'firstName')}
						{renderFormField('Last Name', 'lastName')}
						{renderFormField('Phone Number', 'phone', false, true)}
						{renderFormField('Email Id', 'email')}
						{renderFormField('Password', 'password', true)}
						{renderFormField('Confirm Password', 'confirmPassword', true)}

						<View style={{ marginTop: AppMargin._40 }}>
							{/* <View style={styles.socialLoginContainer}>
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
							</View> */}
							<AppButton
								top={AppMargin._40}
								fontSize={FontSize._16}
								textColor={AppColors.textDark}
								fontFamily={Fonts.MEDIUM}
								buttonLabel={'Sign Up'}
								onClick={handleSubmit}
							/>
						</View>

						<View style={styles.bottomContainer}>
							<AppText
								fontSize={FontSize._16}
								fontFamily={Fonts.MEDIUM}
								label={`Already have an account?`}
							/>
							<Pressable onPress={() => props.navigation.navigate(NavigationKeys.SigninScreen)}>
								<AppText
									left={5}
									textColor={AppColors.primary}
									fontSize={FontSize._16}
									fontFamily={Fonts.MEDIUM}
									label={`Sign in`}
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
			marginTop: AppMargin._50,
			justifyContent: 'center',
			alignItems: 'center',
		},
		iconContainer: {
			alignItems: 'center',
			marginHorizontal: 20,
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
		primaryContainer: { flex: 1, backgroundColor: AppColors.background, paddingBottom: 20 },
		signupLinkContainer: {
			justifyContent: 'center',
			marginTop: 20,
			flexDirection: 'row',
		},
		bottomContainer: {
			justifyContent: 'center',
			marginTop: 20,
			flexDirection: 'row',
		},
	});
};

export default SignupScreen;
