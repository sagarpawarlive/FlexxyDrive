import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { useDispatch } from 'react-redux';
import { Fonts, FontSize } from '../../../../assets/fonts';
import { Icons } from '../../../../assets/Icons';
import AppButton from '../../../../components/AppButton';
import AppHeader from '../../../../components/AppHeader';
import AppScrollView from '../../../../components/AppScrollView';
import AppTextInput from '../../../../components/AppTextInput';
import MainContainer from '../../../../components/MainContainer';
import { AppHeight, AppMargin } from '../../../../constants/commonStyle';
import AppCalender from '../../../../subviews/AppCalender';
import { useTheme } from '../../../../theme/ThemeProvider';
import { Theme } from '../../../../types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiPost } from '../../../../services/API/apiServices';
import { ENDPOINT } from '../../../../services/API/endpoints';
import AppLoader from '../../../../components/AppLoader';

const NextOfKin = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const next_Kin = props?.route?.params?.driverInfoRes;

	const [isCalenderVisible, setIsCalenderVisible] = useState(false);
	const [date, setDate] = useState('');

	const [selectedCountry, setSelectedCountry] = useState('IN');
	const [showCountryPicker, setShowCountryPicker] = useState(false);
	const [countryName, setCountryName] = useState('India');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onBackPress = () => {
		props.navigation.goBack();
	};

	const handleDateSelect = (date: string) => {
		setDate(date); // Store the selected date
		console.log('Date selected:', date);
	};

	const toggleCalenderModal = () => {
		setIsCalenderVisible(!isCalenderVisible);
	};

	// Country picker change handler
	const onSelectCountry = (country: any) => {
		setShowCountryPicker(false);
		setSelectedCountry(country.cca2);
		setCountryName(country.name);
	};

	useEffect(() => {
		setValues({
			fullName: next_Kin?.name,
			phoneNumber: next_Kin?.phoneNumber,
			email: next_Kin?.email,
			city: next_Kin?.city,
			postalCode: next_Kin?.postCode,
			street: next_Kin?.street,
			streetNumber: next_Kin?.streetNumber,
		});
		setDate(next_Kin?.dob);
		setCountryName(next_Kin?.country);
	}, []);

	// Formik setup
	const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
		initialValues: {
			fullName: '',
			phoneNumber: '',
			email: '',
			city: '',
			postalCode: '',
			street: '',
			streetNumber: '',
		},
		validationSchema: Yup.object({
			fullName: Yup.string().required('Full name is required'),
			phoneNumber: Yup.string().required('Phone number is required'),
			email: Yup.string().email('Invalid email format').required('Email is required'),
			city: Yup.string().required('City is required'),
			postalCode: Yup.string().required('Postal code is required'),
			street: Yup.string().required('Street is required'),
			streetNumber: Yup.string().required('Street number is required'),
		}),
		onSubmit: values => {
			api_AddNextOfKin(values); // Submit the form
		},
	});

	// Function to submit the data to the API
	const api_AddNextOfKin = async (values: any) => {
		const params = {
			guarantor: {
				name: values.fullName,
				phoneNumber: values.phoneNumber,
				dob: date,
				country: countryName,
				email: values.email,
				city: values.city,
				postCode: values.postalCode,
				street: values.street,
				streetNumber: values.streetNumber,
			},
		};

		try {
			setIsLoading(true);
			const res = await apiPost(ENDPOINT.SET_DRIVER_INFO, params);

			if (res.success) {
				Alert.alert('Success', 'Next of Kin details saved successfully');
				props.navigation.goBack(); // Or navigate to the next screen
			} else {
				Alert.alert('Error', res.message || 'Failed to save details');
			}
		} catch (error) {
			console.error('Error saving Next of Kin details', error);
			Alert.alert('Error', 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
			// onBackPress();
		}
	};

	return (
		<MainContainer>
			<View style={styles.innerMainContainer}>
				<AppHeader
					buttonTitle={'Next of Kin'}
					tintColor={AppColors.backButton}
					top={AppMargin._30}
					onBack={onBackPress}
				/>

				<AppScrollView bounces={false} extraHeight={AppHeight._350}>
					<View style={{ marginTop: AppMargin._30 }}>
						<AppTextInput
							placeholder="Full Name"
							value={values.fullName}
							onChangeText={handleChange('fullName')}
							onBlur={handleBlur('fullName')}
							showError={touched.fullName && errors.fullName}
						/>
						<AppTextInput
							returnKeyType={'done'}
							inputMode={'number-pad'}
							placeholder="Phone Number"
							maxLength={10}
							value={values.phoneNumber}
							onChangeText={handleChange('phoneNumber')}
							onBlur={handleBlur('phoneNumber')}
							showError={touched.phoneNumber && errors.phoneNumber}
						/>
						<AppTextInput
							placeholder="Email"
							value={values.email}
							onChangeText={handleChange('email')}
							onBlur={handleBlur('email')}
							showError={touched.email && errors.email}
						/>
						<AppTextInput
							value={date}
							editable={false}
							placeholder="DOB"
							iconRight={Icons.icnCalender}
							iconRightClick={() => toggleCalenderModal()}
						/>
						<AppTextInput
							editable={false}
							value={countryName}
							placeholder="Country"
							texInputProps={{
								onPress: () => {
									setShowCountryPicker(true);
								},
							}}
							rightNode={
								<CountryPicker
									visible={showCountryPicker}
									countryCode={selectedCountry}
									withFlag={true}
									withCallingCodeButton={false}
									withFlagButton={true}
									countryCodes={[]}
									withCallingCode={true}
									withAlphaFilter={true}
									withFilter={true}
									withCountryNameButton={false}
									onSelect={onSelectCountry}
									containerButtonStyle={{}}
									theme={{
										backgroundColor: AppColors.background,
										onBackgroundTextColor: AppColors.white,
									}}
								/>
							}
						/>
						<AppTextInput
							placeholder="City"
							value={values.city}
							onChangeText={handleChange('city')}
							onBlur={handleBlur('city')}
							showError={touched.city && errors.city}
						/>
						<AppTextInput
							placeholder="Postal Code"
							value={values.postalCode}
							onChangeText={handleChange('postalCode')}
							onBlur={handleBlur('postalCode')}
							showError={touched.postalCode && errors.postalCode}
						/>
						<AppTextInput
							placeholder="Street"
							value={values.street}
							onChangeText={handleChange('street')}
							onBlur={handleBlur('street')}
							showError={touched.street && errors.street}
						/>
						<AppTextInput
							placeholder="Street Number"
							value={values.streetNumber}
							onChangeText={handleChange('streetNumber')}
							onBlur={handleBlur('streetNumber')}
							showError={touched.streetNumber && errors.streetNumber}
						/>
					</View>

					<AppButton
						top={AppMargin._30}
						textColor={AppColors.textDark}
						fontSize={FontSize._16}
						fontFamily={Fonts.MEDIUM}
						position="end"
						buttonLabel={'SAVE'}
						onClick={handleSubmit} // Trigger Formik form submission
					/>
				</AppScrollView>
			</View>
			<AppCalender isVisible={isCalenderVisible} onClose={toggleCalenderModal} onDateSelect={handleDateSelect} />
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

export default NextOfKin;
