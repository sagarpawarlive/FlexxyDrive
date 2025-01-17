import { useFormik } from 'formik';
import React, { useState, useMemo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import * as Yup from 'yup';
import { FontSize, Fonts } from '../../../assets/fonts';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import MainContainer from '../../../components/MainContainer';
import { AppContainer, AppMargin } from '../../../constants/commonStyle';
import { _showToast } from '../../../services/UIs/ToastConfig';
import { useTheme } from '../../../theme/ThemeProvider';
import AppLoader from '../../../components/AppLoader';
import CountryPicker from 'react-native-country-picker-modal';
import { APIMethods } from '../../../services/API/methods';
import { ENDPOINT } from '../../../services/API/endpoints';
import { NavigationKeys } from '../../../constants/navigationKeys';
import { setUserData } from '../../../store/reducers/userdataSlice';
import { useDispatch } from 'react-redux';
import { phoneValidation } from '../../../constants/validationSchema';
import { t } from '../../../i18n';
import metrics from '../../../constants/metrics';
import { getLocales } from 'react-native-localize';
import { getPhoneCode } from '../../../utils/phoneNumberUtils';

const AddMobileNumber = (props: any) => {
	const { AppColors } = useTheme();
	const dispatch = useDispatch();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const locales = getLocales();
	const countryCode = locales?.[0].countryCode ?? 'IN';
	const dialingCode = getPhoneCode(countryCode) ?? '91';
	const userId = props?.route?.params?.userId;
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [countryCallingCode, setCountryCallingCode] = useState(dialingCode); // Default to India country code
	const [selectedCountry, setSelectedCountry] = useState(countryCode); // To store selected country
	const [showCountryPicker, setShowCountryPicker] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const validationSchema = Yup.object().shape({
		phone: phoneValidation,
	});

	const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
		initialValues: {
			phone: '',
		},
		validationSchema,
		onSubmit: (values: any) => {
			api_addNumber(values);
		},
	});

	const api_addNumber = async (values: any) => {
		const New_phone = `+${countryCallingCode}${values.phone}`;
		const params = {
			userId: userId,
			phoneNumber: New_phone,
		};

		const otpParams: any = {
			phoneNumber: New_phone,
		};
		setIsLoading(true);
		const response: any = await APIMethods.post(ENDPOINT.ADD_PHONE_NUMBER, params, []);
		// _showToast(response?.message, response?.user ? 'success' : 'error');
		// if (response?.user) props.navigation.navigate(NavigationKeys.FinalUser);
		// console.log('[ /Add phone response ] ------->', response);
		if (response?.data?.user?.id) {
			const responseOtp: any = await APIMethods.post(ENDPOINT.SEND_SMS_OTP, otpParams, []);
			if (responseOtp?.statusCode == 200) {
				props.navigation.navigate(NavigationKeys.OtpScreen, {
					phone: New_phone,
					newUser: response,
				});
				_showToast('You have received an OTP', 'success');
			} else {
				_showToast(responseOtp?.message, 'error');
			}
		} else {
			_showToast(response?.message, 'error');
		}
		// dispatch(setUserData(response));
		setIsLoading(false);
	};

	const onSelectCountry = (country: any) => {
		setShowCountryPicker(false);
		setSelectedCountry(country.cca2);
		setCountryCallingCode(country.callingCode[0]);
	};

	return (
		<MainContainer>
			<View style={styles.primaryContainer}>
				<View style={AppContainer}>
					<AppText
						fontSize={FontSize._24}
						top={metrics.verticalScale(40)}
						fontFamily={Fonts.MEDIUM}
						title={t('addPhoneNumber')}
					/>

					<AppTextInput
						returnKeyLabel="Done"
						returnKeyType="done"
						marginTop={metrics.verticalScale(40)}
						maxLength={15}
						placeholder={t('phoneNumber')}
						value={values.phone}
						inputMode={'numeric'}
						onChangeText={handleChange('phone')}
						onBlur={handleBlur('phone')}
						leftNode={
							<Pressable onPress={() => setShowCountryPicker(true)}>
								<AppText fontSize={FontSize._16} title={`+${countryCallingCode}`} />
							</Pressable>
						}
						showError={touched.phone && errors.phone}
					/>

					<AppText
						fontSize={FontSize._16}
						top={metrics.verticalScale(40)}
						fontFamily={Fonts.MEDIUM}
						title={t('requirePhoneToContinue')}
					/>

					<AppButton
						// position="end"
						top={metrics.verticalScale(20)}
						fontSize={FontSize._16}
						textColor={AppColors.textDark}
						fontFamily={Fonts.MEDIUM}
						buttonLabel={t('continue')}
						onClick={handleSubmit}
					/>
				</View>
			</View>

			<CountryPicker
				theme={{
					backgroundColor: AppColors.background,
					onBackgroundTextColor: AppColors.text,
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
			/>

			<AppLoader isLoading={isLoading} />
		</MainContainer>
	);
};

const createStyles = (AppColors: any) => {
	return StyleSheet.create({
		primaryContainer: { flex: 1, backgroundColor: AppColors.background },
	});
};

export default AddMobileNumber;
