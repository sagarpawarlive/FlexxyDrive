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
import { _showToast } from '../../../services/UIs/ToastConfig';
import { useTheme } from '../../../theme/ThemeProvider';
import { Theme } from '../../../types';
import { useFormik } from 'formik';

const SigninScreen = (props: any) => {
	const dispatch = useDispatch();
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const [showPassword, setShowPassword] = useState<boolean>(false);

	const imagesData = [
		{ id: 1, src: Icons.icnApple, label: 'Apple' },
		{ id: 2, src: Icons.icnGoogle, label: 'Google' },
		{ id: 3, src: Icons.icnFacebook, label: 'Facebook' },
	];

	// Handle press event for each icon
	const handlePress = (id: number) => {
		switch (id) {
			case 1:
				alert('Apple Icon Pressed');
				break;
			case 2:
				alert('Google Icon Pressed');
				break;
			case 3:
				alert('Facebook Icon Pressed');
				break;
			default:
				break;
		}
	};

	// Formik validation schema with Yup
	const validationSchema = Yup.object().shape({
		email: Yup.string().email('Enter valid Email address').required('Email is required'),
		password: Yup.string()
			.min(8, 'Password must be at least 8 characters long')
			.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
			.matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
			.required('Password is required'),
	});

	// Formik hook initialization
	const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema,
		onSubmit: (values: any) => {
			// Log the submitted values
			console.log('[ index.tsx / Form submitted with values: ] ----------------------->> ', values);

			Keyboard.dismiss();
			_showToast('Login Success', 'success');

			// props.navigation.navigate(NavigationKeys.DrawerScreen);
			// dispatch(setIsLogin(true));
		},
	});

	return (
		<MainContainer>
			<View style={styles.primaryContainer}>
				<AppScrollView bounces={false} extraHeight={AppHeight._350}>
					<View style={[AppContainer]}>
						<View style={styles.logoContainer}>
							<AppText fontSize={FontSize._40} fontFamily={Fonts.BOLD} title={'LOGO'} />
						</View>

						<View style={styles.logoContainer}>
							<AppText fontSize={FontSize._36} fontFamily={Fonts.REGULAR} title={'Login'} />
						</View>

						{/* Email Field */}
						<View style={{ marginTop: AppMargin._50 }}>
							<AppTextInput
								marginTop={5}
								placeholder={'Email Id / Phone number'}
								value={values.email} // Use Formik's value
								onChangeText={text => handleChange('email')(text)} // Formik's handleChange
								onBlur={() => handleBlur('email')} // Formik's handleBlur
							/>
							{/* Display error message for email */}
							{touched.email && errors.email && (
								<AppText
									top={AppMargin._5}
									left={AppMargin._20}
									textColor={AppColors.error}
									fontFamily={Fonts.REGULAR}
									fontSize={FontSize._14}
									label={errors.email}
								/>
							)}
						</View>

						{/* Password Field */}
						<View style={{ marginTop: AppMargin._30 }}>
							<AppTextInput
								marginTop={AppMargin._5}
								iconRight={showPassword ? Icons.icnShowPass : Icons.icnHidePass}
								iconRightClick={() => setShowPassword(!showPassword)}
								placeholder={'Password'}
								value={values.password} // Use Formik's value
								onChangeText={text => handleChange('password')(text)} // Formik's handleChange
								onBlur={() => handleBlur('password')} // Formik's handleBlur
								secureTextEntry={!showPassword}
							/>
							{/* Display error message for password */}
							{touched.password && errors.password && (
								<AppText
									top={AppMargin._5}
									left={AppMargin._20}
									textColor={AppColors.error}
									fontFamily={Fonts.REGULAR}
									fontSize={FontSize._14}
									label={errors.password}
								/>
							)}
						</View>

						{/* Forgot password */}
						<View style={styles.forgotPasswordContainer}>
							<Pressable onPress={() => alert('Forgot Password')}>
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
						<View
							style={{
								justifyContent: 'center',
								marginTop: 20,
								flexDirection: 'row',
							}}>
							<AppText
								fontSize={FontSize._16}
								fontFamily={Fonts.MEDIUM}
								label={`Don't have an account?`}
							/>
							<Pressable onPress={() => alert('Signup')}>
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
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		logoContainer: {
			marginTop: AppMargin._60,
			justifyContent: 'center',
			alignItems: 'center',
		},
		iconContainer: {
			alignItems: 'center',
			marginHorizontal: 10,
		},
		socialLoginContainer: {
			marginTop: AppMargin._100,
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
	});
};

export default SigninScreen;
