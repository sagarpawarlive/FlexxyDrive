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
import { NavigationKeys } from '../../../constants/navigationKeys';

const FinalUser = (props: any) => {
	const dispatch = useDispatch();
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const [showPassword, setShowPassword] = useState<boolean>(false);

	const imagesData = [
		{ id: 1, src: Icons.icnGoogle, label: 'Google' },
		{ id: 2, src: Icons.icnApple, label: 'Apple' },
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
		username: Yup.string().required('Username is required'),
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
			username: '',
			password: '',
		},
		validationSchema,
		onSubmit: (values: any) => {
			// Log the submitted values
			console.log('[ index.tsx / Form submitted with values: ] ----------------------->> ', values);

			Keyboard.dismiss();
			_showToast('OTP sent!', 'success');

			props.navigation.navigate(NavigationKeys.OtpScreen);
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

						<View style={[styles.logoContainer, { marginTop: AppMargin._100 }]}>
							<AppText fontSize={FontSize._24} fontFamily={Fonts.BOLD} title={'Welcome to FlexxyDrive'} />
						</View>
						<View style={{ marginTop: AppMargin._100 }}>
							<AppButton
								top={AppMargin._40}
								fontSize={FontSize._16}
								textColor={AppColors.primary}
								fontFamily={Fonts.MEDIUM}
								buttonLabel={'Book A Ride'}
								bgColor={AppColors.background}
								borderWidth={1}
								onClick={() => alert('book a ride')} // Use Formik's handleSubmit
							/>
							<AppButton
								top={AppMargin._40}
								fontSize={FontSize._16}
								textColor={AppColors.primary}
								fontFamily={Fonts.MEDIUM}
								buttonLabel={'Offer A Ride'}
								bgColor={AppColors.background}
								borderWidth={1}
								onClick={() => alert('book a ride')} // Use Formik's handleSubmit
							/>
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

export default FinalUser;
