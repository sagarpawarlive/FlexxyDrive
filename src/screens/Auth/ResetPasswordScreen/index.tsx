import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { Fonts, FontSize } from '../../../assets/fonts';
import { Icons } from '../../../assets/Icons';
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
import { t } from '../../../i18n';
import { apiPost } from '../../../services/API/apiServices';
import { ENDPOINT } from '../../../services/API/endpoints';
import { _showToast } from '../../../services/UIs/ToastConfig';
import { NavigationKeys } from '../../../constants/navigationKeys';

const ResetPasswordScreen = (props: any) => {
	const dispatch = useDispatch();
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const token = props?.route?.params?.response?.token ?? '';

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

	// Formik hook to manage form state and submission
	const formik = useFormik({
		initialValues: {
			password: '', // Initial value for password input
			confirmPassword: '', // Initial value for confirm password input
		},
		validationSchema: Yup.object({
			password: Yup.string()
				.required(t('passwordRequired'))
				.min(8, t('passwordLength8'))
				.matches(/[a-zA-Z0-9]/, t('passwordCharacter')),
			confirmPassword: Yup.string()
				.required(t('confirmPasswordRequired'))
				.oneOf([Yup.ref('password'), null], t('passwordMustMatch')),
		}),
		onSubmit: values => {
			resetPassword();

			// Handle the form submission logic here
			// alert(`Password reset successful for: ${values.password}`);
		},
	});

	const onBackPress = () => {
		props.navigation.goBack();
	};

	const resetPassword = async () => {
		const params = {
			newPassword: formik.values.password,
		};
		const response = await apiPost(ENDPOINT.UPDATE_RESET_PASSWORD, params, {
			Authorization: `Bearer ${token}`,
		});

		if (response?.statusCode >= 200 && response?.statusCode <= 299) {
			_showToast(response?.message, 'success');
			props.navigation.navigate(NavigationKeys.SigninScreen);
		}
	};

	return (
		<MainContainer>
			<View style={styles.innerMainContainer}>
				<AppHeader top={AppMargin._30} onBack={onBackPress} />

				<View style={{ marginTop: AppMargin._100, alignItems: 'center' }}>
					<AppText
						label={t('resetPasswordTitle')}
						textAlign={'center'}
						width={'95%'}
						fontFamily={Fonts.MEDIUM}
						fontSize={FontSize._26}
					/>
					<AppText
						label={t('resetPasswordSubTitle')}
						textAlign={'center'}
						width={'95%'}
						fontFamily={Fonts.MEDIUM}
						fontSize={FontSize._16}
					/>
				</View>

				<View style={{ marginTop: AppMargin._50 }}>
					{/* Password Field */}
					<AppTextInput
						marginTop={AppMargin._5}
						placeholder={'New Password'}
						secureTextEntry={!showPassword}
						value={formik.values.password}
						onChangeText={formik.handleChange('password')}
						onBlur={formik.handleBlur('password')}
						showError={formik.touched.password && formik.errors.password}
						iconRight={showPassword ? Icons.icnShowPass : Icons.icnHidePass}
						iconRightClick={() => setShowPassword(!showPassword)} // Toggle password visibility
					/>
				</View>

				<View style={{ marginTop: AppMargin._20 }}>
					{/* Confirm Password Field */}
					<AppTextInput
						marginTop={AppMargin._5}
						placeholder={'Confirm Password'}
						secureTextEntry={!showConfirmPassword}
						value={formik.values.confirmPassword}
						onChangeText={formik.handleChange('confirmPassword')}
						onBlur={formik.handleBlur('confirmPassword')}
						showError={formik.touched.confirmPassword && formik.errors.confirmPassword}
						iconRight={showConfirmPassword ? Icons.icnShowPass : Icons.icnHidePass}
						iconRightClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle confirm password visibility
					/>
				</View>

				<AppButton
					textColor={AppColors.textDark}
					fontSize={FontSize._16}
					fontFamily={Fonts.MEDIUM}
					position="end"
					buttonLabel={'Reset Password'}
					onClick={formik.handleSubmit} // Trigger Formik form submission
				/>
			</View>
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		innerMainContainer: {
			flex: 1,
			backgroundColor: AppColors.background,
			paddingHorizontal: 20,
		},
	});
};

export default ResetPasswordScreen;
