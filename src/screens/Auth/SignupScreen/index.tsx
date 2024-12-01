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

const SignupScreen = (props: any) => {
	const dispatch = useDispatch();
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const [showPassword, setShowPassword] = useState<boolean>(false);

	const imagesData = useMemo(
		() => [
			{ id: 1, src: Icons.icnApple, label: 'Apple' },
			{ id: 2, src: Icons.icnGoogle, label: 'Google' },
			{ id: 3, src: Icons.icnFacebook, label: 'Facebook' },
		],
		[],
	);

	const handlePress = (id: number) => {
		alert(`${imagesData.find(item => item.id == id)?.label} Icon Pressed`);
	};

	const validationSchema = Yup.object().shape({
		firstName: Yup.string().required('First name is required'),
		lastName: Yup.string().required('Last name is required'),
		phone: Yup.string()
			.matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
			.required('Phone number is required'),
		email: Yup.string().email('Enter valid Email address').required('Email is required'),
		password: Yup.string()
			.min(8, 'Password must be at least 8 characters long')
			.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
			.matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
			.required('Password is required'),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('password'), null], 'Passwords must match')
			.required('Confirm Password is required'),
	});

	const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
		initialValues: {
			firstName: '',
			lastName: '',
			phone: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationSchema,
		onSubmit: (values: any) => {
			Keyboard.dismiss();
			_showToast('Signup Success', 'success');
		},
	});

	const renderFormField = (placeholder: string, fieldName: string, isPassword: boolean = false) => (
		<View style={{ marginTop: AppMargin._20 }}>
			<AppTextInput
				marginTop={5}
				placeholder={placeholder}
				value={values[fieldName]}
				onChangeText={handleChange(fieldName)}
				onBlur={handleBlur(fieldName)}
				secureTextEntry={isPassword && !showPassword}
				iconRight={isPassword ? (showPassword ? Icons.icnShowPass : Icons.icnHidePass) : undefined}
				iconRightClick={() => setShowPassword(!showPassword)}
			/>
			{touched[fieldName] && errors[fieldName] && (
				<AppText
					top={AppMargin._5}
					left={AppMargin._20}
					textColor={AppColors.error}
					fontFamily={Fonts.REGULAR}
					fontSize={FontSize._14}
					label={errors[fieldName]}
				/>
			)}
		</View>
	);

	return (
		<MainContainer>
			<View style={styles.primaryContainer}>
				<AppScrollView bounces={false} extraHeight={AppHeight._350}>
					<View style={[AppContainer]}>
						<View style={styles.logoContainer}>
							<AppText fontSize={FontSize._40} fontFamily={Fonts.BOLD} title={'LOGO'} />
						</View>

						<View style={styles.logoContainer}>
							<AppText fontSize={FontSize._36} fontFamily={Fonts.REGULAR} title={'Sign Up'} />
						</View>

						{/* Render Form Fields */}
						{renderFormField('First Name', 'firstName')}
						{renderFormField('Last Name', 'lastName')}
						{renderFormField('Phone Number', 'phone')}
						{renderFormField('Email Id (Optional)', 'email')}
						{renderFormField('Password', 'password', true)}
						{renderFormField('Confirm Password', 'confirmPassword', true)}

						<View style={{ marginTop: AppMargin._40 }}>
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
								buttonLabel={'Sign Up'}
								onClick={handleSubmit}
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
								label={`Already have an account?`}
							/>
							<Pressable onPress={() => props.navigation.navigate(NavigationKeys.SignupScreen)}>
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
		primaryContainer: { flex: 1, backgroundColor: AppColors.background },
		signupLinkContainer: {
			justifyContent: 'center',
			marginTop: 20,
			flexDirection: 'row',
		},
	});
};

export default SignupScreen;
