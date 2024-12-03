import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Fonts, FontSize } from '../../../assets/fonts';
import AppButton from '../../../components/AppButton';
import AppHeader from '../../../components/AppHeader';
import AppText from '../../../components/AppText';
import MainContainer from '../../../components/MainContainer';
import { AppMargin } from '../../../constants/commonStyle';
import { useTheme } from '../../../theme/ThemeProvider';
import { Theme } from '../../../types';
import AppTextInput from '../../../components/AppTextInput';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // For form validation

const ForgotPasswordScreen = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	// Formik hook to manage form state and submission
	const formik = useFormik({
		initialValues: {
			emailOrPhone: '', // Initial value for the email/phone number input
		},
		validationSchema: Yup.object({
			emailOrPhone: Yup.string()
				.required('This field is required.')
				.matches(
					/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$|^[0-9]{10}$/,
					'Enter a valid email or phone number',
				),
		}),
		onSubmit: values => {
			// Handle the form submission logic here
			alert(`Form submitted with: ${values.emailOrPhone}`);
			// Example dispatch
			// dispatch(someAction(values));
		},
	});

	const onBackPress = () => {
		props.navigation.goBack();
	};

	return (
		<MainContainer>
			<View style={styles.innerMainContainer}>
				<AppHeader tintColor={AppColors.backButton} top={AppMargin._30} onBack={onBackPress} />

				<View style={{ marginTop: AppMargin._100, alignItems: 'center' }}>
					<AppText
						label={`Please provide email/phone number to send password reset link`}
						textAlign={'center'}
						width={'95%'}
						fontFamily={Fonts.MEDIUM}
						fontSize={FontSize._16}
					/>
				</View>

				<View style={{ marginTop: AppMargin._50 }}>
					<AppTextInput
						marginTop={AppMargin._5}
						placeholder={'Email / Phone number'}
						value={formik.values.emailOrPhone}
						onChangeText={formik.handleChange('emailOrPhone')}
						onBlur={formik.handleBlur('emailOrPhone')}
						showError={formik.touched.emailOrPhone && formik.errors.emailOrPhone}
					/>
				</View>

				<AppButton
					textColor={AppColors.textDark}
					fontSize={FontSize._16}
					fontFamily={Fonts.MEDIUM}
					position="end"
					buttonLabel={'Send'}
					onClick={formik.handleSubmit} // Trigger Formik form submission
				/>
			</View>
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		orContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			marginTop: AppMargin._20,
		},
		innerMainContainer: {
			flex: 1,
			backgroundColor: AppColors.background,
			paddingHorizontal: 20,
		},
	});
};

export default ForgotPasswordScreen;
