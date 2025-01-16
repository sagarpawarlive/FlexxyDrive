import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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
import metrics from '../../../constants/metrics';
import CountryPicker from 'react-native-country-picker-modal';
import { phoneValidation } from '../../../constants/validationSchema';
import { APIMethods } from '../../../services/API/methods';
import { ENDPOINT } from '../../../services/API/endpoints';
import { _showToast } from '../../../services/UIs/ToastConfig';
import { NavigationKeys } from '../../../constants/navigationKeys';
import AppLoader from '../../../components/AppLoader';
import { t } from '../../../i18n';
import { getCurrencies, getLocales } from 'react-native-localize';
import { getPhoneCode } from '../../../utils/phoneNumberUtils';

const ForgotPasswordScreen = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();

	const locales = getLocales();
	const countryCode = locales?.[0].countryCode ?? 'IN';
	const dialingCode = getPhoneCode(countryCode) ?? '91';

	const [openCountry, setOpenCountry] = useState(false);
	const [countrySelected, setCountrySelected] = useState(countryCode);
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const [countryCallingCode, setCountryCallingCode] = useState(dialingCode ?? '91');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Formik hook to manage form state and submission
	const formik = useFormik({
		initialValues: {
			emailOrPhone: '', // Initial value for the email/phone number input
		},
		validationSchema: Yup.object({
			emailOrPhone: phoneValidation,
		}),
		onSubmit: values => {
			sendOtp(values);
		},
	});

	const onBackPress = () => {
		props.navigation.goBack();
	};

	const sendOtp = async (values: { [key: string]: string }) => {
		const New_phone = `+${countryCallingCode}${values.emailOrPhone}`;
		const params = {
			phoneNumber: New_phone,
		};

		setIsLoading(true);
		const response: any = await APIMethods.post(ENDPOINT.FORGOT_PASSWORD_SEND_OTP, params, []);
		if (response?.statusCode >= 200 && response?.statusCode <= 299) {
			_showToast(response?.message, 'success');

			props.navigation.navigate(NavigationKeys.OtpScreen, {
				phone: New_phone,
				type: 'forgot',
			});
		} else {
			_showToast(response?.message, 'error');
		}
		setIsLoading(false);
	};

	const onSelectCountry = (country: any) => {
		setOpenCountry(false);
		setCountrySelected(country.cca2);
		setCountryCallingCode(country.callingCode[0]);
	};

	return (
		<MainContainer>
			<View style={styles.innerMainContainer}>
				<AppHeader tintColor={AppColors.backButton} top={AppMargin._30} onBack={onBackPress} />

				<View style={{ marginTop: AppMargin._100, alignItems: 'center' }}>
					<AppText
						label={t('forgotPassword')}
						textAlign={'center'}
						fontFamily={Fonts.MEDIUM}
						fontSize={FontSize._26}
						styleProps={{
							color: AppColors.text,
							lineHeight: metrics.moderateScale(33.5),
						}}
					/>
					<AppText
						label={t('forgotSubTitle')}
						textAlign={'center'}
						width={'95%'}
						fontFamily={Fonts.MEDIUM}
						fontSize={FontSize._16}
						styleProps={{
							marginTop: metrics.moderateScale(10),
						}}
					/>
				</View>

				<View style={{ marginTop: AppMargin._50 }}>
					<AppTextInput
						marginTop={AppMargin._5}
						placeholder={'Phone number'}
						value={formik.values.emailOrPhone}
						onChangeText={formik.handleChange('emailOrPhone')}
						onBlur={formik.handleBlur('emailOrPhone')}
						showError={formik.touched.emailOrPhone && formik.errors.emailOrPhone}
						leftNode={
							<Pressable onPress={() => setOpenCountry(true)}>
								<AppText fontSize={FontSize._16} title={`+${countryCallingCode}`} />
							</Pressable>
						}
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
			<CountryPicker
				theme={{
					backgroundColor: AppColors.background,
					onBackgroundTextColor: AppColors.text,
				}}
				visible={openCountry}
				countryCode={countrySelected}
				withFlag={true}
				withCallingCodeButton={false}
				withFlagButton={false}
				countryCodes={[]}
				withCallingCode={true}
				withAlphaFilter={true}
				withFilter={true}
				withCountryNameButton={false}
				onSelect={onSelectCountry}
				onClose={() => setOpenCountry(false)}
				containerButtonStyle={{}}
			/>
			<AppLoader isLoading={isLoading} />
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
