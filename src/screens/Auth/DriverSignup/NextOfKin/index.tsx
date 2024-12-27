import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Alert, Pressable, Text, Image } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { useDispatch, useSelector } from 'react-redux';
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
import { _showToast } from '../../../../services/UIs/ToastConfig';
import { updateUserState } from '../../../../store/reducers/userdataSlice';
import moment from 'moment';

const NextOfKin = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const next_Kin = props?.route?.params?.driverInfoRes;

	const userDetails = useSelector((state: any) => state?.userDataSlice.userData.data ?? {});
	const nextOfKinData = userDetails?.user?.driverInfo?.guarantor ?? {};

	const [isCalenderVisible, setIsCalenderVisible] = useState(false);
	const [date, setDate] = useState('');

	const [selectedCountry, setSelectedCountry] = useState(nextOfKinData?.countryCode ?? 'IN');
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
		setDate(nextOfKinData?.dob ?? '');
		setCountryName(nextOfKinData.country ?? '');
	}, []);

	// Formik setup
	const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
		initialValues: {
			fullName: nextOfKinData?.name ?? '',
			phoneNumber: nextOfKinData?.phoneNumber ?? '',
			email: nextOfKinData?.email ?? '',
			city: nextOfKinData?.city ?? '',
			postalCode: nextOfKinData?.postCode ?? '',
			street: nextOfKinData?.street ?? '',
			streetNumber: nextOfKinData?.streetNumber ?? '',
		},
		validationSchema: Yup.object({
			fullName: Yup.string().required('Full name is required'),
			phoneNumber: Yup.string()
				.required('Phone number is required')
				.matches(/^(\+?\d{1,4}[\s-]?)?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,}$/, 'Phone number is not valid'),
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
				countryCode: selectedCountry,
			},
		};

		try {
			setIsLoading(true);
			const res = await apiPost(ENDPOINT.SET_DRIVER_INFO, params);

			if (res.success) {
				_showToast('Next of Kin details saved successfully', 'success');
				props.navigation.goBack(); // Or navigate to the next screen
				dispatch(updateUserState({ driverInfo: { ...res?.data } }));
			} else {
				_showToast('Failed to save details', 'error');
			}
		} catch (error) {
			console.error('Error saving Next of Kin details', error);
			_showToast('An unexpected error occurred', 'error');
		} finally {
			setIsLoading(false);
			// onBackPress();
		}
	};

	const phoneNumberRef = useRef<any>(null);
	const cityRef = useRef<any>(null);
	const streetRef = useRef<any>(null);
	const streetNumberRef = useRef<any>(null);

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
							onSubmitEditing={() => phoneNumberRef?.current?.focus()}
							returnKeyType={'next'}
						/>
						<AppTextInput
							ref={phoneNumberRef}
							returnKeyType={'done'}
							inputMode={'number-pad'}
							placeholder="Phone Number"
							maxLength={20}
							value={values.phoneNumber}
							onChangeText={handleChange('phoneNumber')}
							onBlur={handleBlur('phoneNumber')}
							showError={touched.phoneNumber && errors.phoneNumber}
						/>
						<AppTextInput
							autoCaps={false}
							placeholder="Email"
							value={values.email}
							onChangeText={handleChange('email')}
							onBlur={handleBlur('email')}
							showError={touched.email && errors.email}
							onSubmitEditing={() => toggleCalenderModal()}
							returnKeyType={'next'}
						/>
						<Pressable style={styles.dobContainer} onPress={() => toggleCalenderModal()}>
							<Text
								style={{
									flex: 1,
									fontSize: FontSize._16,
									color: date ? AppColors.text : AppColors.placeholder,
								}}>
								{date ? moment(date).format('DD-MM-YYYY') : 'DOB'}
							</Text>
							<Image source={Icons.icnCalender} style={{ tintColor: AppColors.primary }} />
						</Pressable>

						{/* <AppTextInput
							value={date ? moment(date).format('DD-MM-YYYY') : ''}
							editable={false}
							placeholder="DOB"
							iconRight={Icons.icnCalender}
							iconRightClick={() => toggleCalenderModal()}
						/> */}
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
							onSubmitEditing={() => cityRef?.current?.focus()}
							returnKeyType="next"
						/>
						<AppTextInput
							ref={cityRef}
							placeholder="Postal Code"
							value={values.postalCode}
							onChangeText={handleChange('postalCode')}
							onBlur={handleBlur('postalCode')}
							showError={touched.postalCode && errors.postalCode}
							onSubmitEditing={() => cityRef?.current?.focus()}
							returnKeyType="done"
							inputMode="number-pad"
						/>
						<AppTextInput
							ref={streetRef}
							placeholder="Street"
							value={values.street}
							onChangeText={handleChange('street')}
							onBlur={handleBlur('street')}
							showError={touched.street && errors.street}
							onSubmitEditing={() => streetNumberRef?.current?.focus()}
							returnKeyType="next"
						/>
						<AppTextInput
							ref={streetNumberRef}
							placeholder="Street Number"
							value={values.streetNumber}
							onChangeText={handleChange('streetNumber')}
							onBlur={handleBlur('streetNumber')}
							showError={touched.streetNumber && errors.streetNumber}
							returnKeyType="done"
						/>
					</View>

					<AppButton
						top={AppMargin._30}
						bottom={AppMargin._30}
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
		dobContainer: {
			borderWidth: 1,
			borderColor: AppColors.white,
			borderRadius: 10,
			padding: 15,
			height: AppHeight._70,
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 20,
		},
	});
};

export default NextOfKin;
