import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Fonts, FontSize } from '../../../../assets/fonts';
import AppButton from '../../../../components/AppButton';
import AppHeader from '../../../../components/AppHeader';
import AppText from '../../../../components/AppText';
import MainContainer from '../../../../components/MainContainer';
import { AppHeight, AppMargin, borderRadius10 } from '../../../../constants/commonStyle';
import { useTheme } from '../../../../theme/ThemeProvider';
import { Theme } from '../../../../types';
import AppTextInput from '../../../../components/AppTextInput';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // For form validation
import { Images } from '../../../../assets/images';
import { Icons } from '../../../../assets/Icons';
import AppScrollView from '../../../../components/AppScrollView';
import AppDriverButtons from '../../../../components/AppDriverButtons';
import { NavigationKeys } from '../../../../constants/navigationKeys';
import AppCalender from '../../../../subviews/AppCalender';
import DriverPrefs from '../../../../subviews/DriverPrefs';
import ImagePicker from '../../../../subviews/imagePicker';
import AddDocuments from '../../../../subviews/AddDocuments';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import AppLoader from '../../../../components/AppLoader';
import { apiGet, apiPost } from '../../../../services/API/apiServices';
import { ENDPOINT } from '../../../../services/API/endpoints';
import RadioGroup from 'react-native-radio-buttons-group';
import moment from 'moment';
import { _showToast } from '../../../../services/UIs/ToastConfig';
import { updateUserState } from '../../../../store/reducers/userdataSlice';
import {
	cityValidation,
	firstNameValidation,
	lastNameValidation,
	postCodeValidation,
	streetNumberValidation,
	streetValidation,
} from '../../../../constants/validationSchema';
import metrics from '../../../../constants/metrics';
import { t } from '../../../../i18n';

let update = false;

const DriverInformation = (props: any) => {
	const userType = props?.route?.params?.type;
	const dispatch = useDispatch();
	const userDataSlice = useSelector(state => state?.userDataSlice ?? {});
	const { userData } = userDataSlice ?? {};
	const {
		firstName: fName,
		lastName: lName,
		username,
		phoneNumber,
		email,
		driverInfo = {},
	} = userData?.data?.user ?? {};
	const {
		firstName = fName,
		lastName = lName,
		city,
		postCode,
		street,

		dob = '',
		country,
		countryCode,
		gender,
		documents,
		guarantor,
		carDetails,
		preferences,
		isVerified,
	} = driverInfo ?? {};
	const { AppColors } = useTheme();

	const radioDesigns = {
		borderColor: AppColors.primary,
		color: AppColors.primary,
		labelStyle: { color: AppColors.text },
	};

	const radioButtons = [
		{
			id: '1', // acts as primary key, should be unique and non-empty string
			label: 'Male',
			value: 'Male',
			...radioDesigns,
		},
		{
			id: '2',
			label: 'Female',
			value: 'Female',
			...radioDesigns,
		},
		{
			id: '3',
			label: 'Non-Binary',
			value: 'NonBinary',
			...radioDesigns,
		},
		{
			id: '4',
			label: 'Prefer not to say',
			value: 'PreferNotToSay',
			...radioDesigns,
		},
	];

	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const [date, setDate] = useState(dob);
	const [isCalenderVisible, setIsCalenderVisible] = useState(false);
	const [isPrefModalVisible, setIsPrefModalVisible] = useState(false);
	const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);
	const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
	const [selectedId, setSelectedId] = useState<any>(radioButtons.filter(item => item.value === gender)?.[0]?.id);

	const [selectedCountry, setSelectedCountry] = useState(countryCode);
	const [showCountryPicker, setShowCountryPicker] = useState(false);
	const [countryName, setCountryName] = useState(country);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [driverInfoRes, setDriverInfoRes] = useState<any>(null);

	const firstNameRef = useRef<any>(null);
	const lastNameRef = useRef<any>(null);
	const cityRef = useRef<any>(null);
	const postCodeRef = useRef<any>(null);
	const streetRef = useRef<any>(null);
	const streetNumberRef = useRef<any>(null);

	useEffect(() => {
		// const unsubscribe = props.navigation.addListener('focus', () => {
		api_getDriverInfo();
		// });
		// return () => {
		// 	unsubscribe();
		// };
	}, [props.navigation]);

	useEffect(() => {
		if (driverInfoRes) {
			setValues({
				firstName: driverInfoRes?.driverInfo?.firstName ?? fName,
				lastName: driverInfoRes?.driverInfo?.lastName ?? lName,
				city: driverInfoRes?.driverInfo?.city ?? '',
				postCode: driverInfoRes?.driverInfo?.postCode ?? '',
				street: driverInfoRes?.driverInfo?.street ?? '',

				dob: driverInfoRes?.driverInfo?.dob ?? '',
			});

			setDate(driverInfoRes?.driverInfo?.dob ?? '');
			setCountryName(driverInfoRes?.driverInfo?.country ?? '');
			setSelectedCountry(driverInfoRes?.driverInfo?.countryCode ?? '');
			setSelectedId(radioButtons.filter(item => item.value == driverInfoRes?.driverInfo?.gender)?.[0]?.id);
		}
	}, [driverInfoRes]);

	const api_getDriverInfo = async () => {
		const params = { token: userData?.data?.token };
		setIsLoading(true);
		const response = await apiGet(ENDPOINT.GET_PROFILE_INFO, '', params);
		if (response?.success) {
			setDriverInfoRes(response.data);
			dispatch(updateUserState({ ...response?.data }));
			setIsLoading(false);
		} else {
			setIsLoading(false);
			_showToast(response.message, 'error');
		}
	};

	// Form states using Formik
	const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
		initialValues: {
			firstName: firstName,
			lastName: lastName,
			city: city,
			dob: date,
			postCode: postCode,
			street: street,
			// streetNumber: streetNumber,
		},
		validationSchema: Yup.object({
			firstName: firstNameValidation,
			lastName: lastNameValidation,
			city: cityValidation,
			postCode: postCodeValidation,
			street: streetValidation,
			// streetNumber: streetNumberValidation,
		}),
		onSubmit: values => {
			console.log('Form submitted with:', values);
			api_AddDriverInfo(values);
		},
	});

	const api_AddDriverInfo = async (values: any) => {
		const params = {
			firstName: values.firstName,
			lastName: values.lastName,
			dob: date ?? '',
			gender: radioButtons.filter(item => item.id === selectedId)?.[0].value,
			country: countryName,
			city: values.city,
			postCode: values.postCode,
			street: values.street,
			streetNumber: values.streetNumber,
			countryCode: selectedCountry,
		};

		if (!date) {
			_showToast('Please select Date of birth', 'error');
			return;
		}

		if (!countryName) {
			_showToast('Please select country', 'error');
			return;
		}

		setIsLoading(true);

		let res = await apiPost(ENDPOINT.SET_DRIVER_INFO, params, { token: userData.token });
		console.log(res, '<== res');

		// if (res?.error) {
		// 	_showToast(res?.message, 'error');
		// }
		setIsLoading(false);

		if (res?.statusCode >= 200 && res?.statusCode <= 299) {
			dispatch(updateUserState({ driverInfo: { ...res.data } }));
			userTypeNavigation();
			_showToast(res?.message, 'success');
			if (res?.data?.documents) {
				if (
					res?.data?.documents?.drivingLicense?.length > 0 &&
					res?.data?.documents?.driverImage?.length > 0 &&
					!isVerified
				) {
					const verifyDocumentParams = {
						selfie: res?.data?.documents?.driverImage,
						idImage: res?.data?.documents?.drivingLicense,
						// country: res?.data?.countryCode,
						country: 'DE',
						idType: 'DRIVERS_LICENSE',
					};
					const verifyResponse = await apiPost(ENDPOINT.VERIFY_DOCUMENT, verifyDocumentParams);
					console.log(verifyResponse, '<==== verifyResponse');
				}
			}
		} else {
			_showToast(res?.message, 'error');
		}
		// setIsLoading(false);
		// _showToast(res?.message, 'success');
		/*
				const verifyDocument = {

				}
				await apiPost(ENDPOINT.VERIFY_DOCUMENT, verifyDocument).then(res => { })

		*/
	};
	// Country picker change handler
	const onSelectCountry = (country: any) => {
		console.log('[ / country ] ------->', country);
		setShowCountryPicker(false);
		setSelectedCountry(country.cca2);
		setCountryName(country.name);
	};

	const toggleImageModal = () => {
		setIsImagePickerVisible(!isImagePickerVisible);
	};

	const toggleDocumentModal = () => {
		setIsDocumentModalVisible(!isDocumentModalVisible);
	};

	const onBackPress = () => {
		props.navigation.goBack();
	};

	// Toggle modal visibility
	const toggleModal = () => {
		setIsCalenderVisible(!isCalenderVisible);
	};

	// Handle the selected date from the modal
	const handleDateSelect = (date: string) => {
		setDate(date); // Store the selected date
		console.log('Date selected:', date);
	};

	const userTitle = userType == 1 ? t('driverInformation') : t('passengerInformation');
	const userTypeNavigation = () => {
		if (userType == 1) {
			props.navigation.navigate(NavigationKeys.OtherInformation);
		} else {
			props.navigation.navigate(NavigationKeys.PassengerVerification);
		}
	};

	return (
		<MainContainer hideTop>
			<View style={[styles.innerMainContainer, {}]}>
				<AppHeader top={metrics.verticalScale(30)} onBack={onBackPress} buttonTitle={userTitle} />

				<View style={styles.profileContainer}>
					<View style={styles.profileSubContainer}>
						<Image
							source={
								documents?.driverImage ? { uri: documents?.driverImage } : Images.imgDriverPlaceholder
							}
							style={styles.profileImage}
						/>
						<Pressable onPress={() => {}} style={{ position: 'absolute', bottom: 0, right: 0 }}>
							<Image source={Icons.icnCamera} style={{}} />
						</Pressable>
					</View>
				</View>

				<AppScrollView bounces={false} extraHeight={metrics.verticalScale(250)}>
					<View style={{ marginTop: metrics.verticalScale(30) }}>
						<View
							style={{
								flexDirection: 'row',
								flex: 1,
								justifyContent: 'space-between',
							}}>
							<View
								style={{
									flex: 0.48,
									marginBottom: metrics.verticalScale(10),
								}}>
								<AppTextInput
									ref={firstNameRef}
									placeholder={t('firstName')}
									value={values.firstName}
									onChangeText={handleChange('firstName')}
									onBlur={handleBlur('firstName')}
									// showError={touched.firstName && errors.firstName}
									onSubmitEditing={() => lastNameRef?.current?.focus()}
									returnKeyType="next"
								/>
								{touched.firstName && errors.firstName && (
									<View style={styles.errorContainer}>
										<Image
											style={[styles.icon, { tintColor: AppColors.error }]}
											source={Icons.icnError}
										/>
										<AppText
											width={'50%'}
											left={metrics.horizontalScale(10)}
											textColor={AppColors.error}
											fontFamily={Fonts.REGULAR}
											fontSize={FontSize._14}
											label={errors.firstName}
										/>
									</View>
								)}
							</View>

							<View style={{ flex: 0.48, marginBottom: metrics.verticalScale(10) }}>
								<AppTextInput
									ref={lastNameRef}
									placeholder={t('lastName')}
									value={values.lastName}
									onChangeText={handleChange('lastName')}
									onBlur={handleBlur('lastName')}
									// showError={touched.lastName && errors.lastName}
									onSubmitEditing={toggleModal}
									returnKeyType="next"
								/>
								{touched.lastName && errors.lastName && (
									<View style={[styles.errorContainer]}>
										<Image
											style={[styles.icon, { tintColor: AppColors.error }]}
											source={Icons.icnError}
										/>
										<AppText
											width={'50%'}
											left={metrics.horizontalScale(10)}
											textColor={AppColors.error}
											fontFamily={Fonts.REGULAR}
											fontSize={FontSize._14}
											label={errors.lastName}
										/>
									</View>
								)}
							</View>
						</View>

						{/* {touched.firstName && errors.firstName && (
							<View style={styles.errorContainer}>
								<Image style={[styles.icon, { tintColor: AppColors.error }]} source={Icons.icnError} />
								<AppText
									width={'90%'}
									left={metrics.horizontalScale(10)}
									textColor={AppColors.error}
									fontFamily={Fonts.REGULAR}
									fontSize={FontSize._14}
									label={errors.firstName}
								/>
							</View>
						)} */}

						<Pressable style={styles.dobContainer} onPress={() => toggleModal()}>
							<View
								style={{ position: 'absolute', zIndex: 99, left: 20, top: metrics.verticalScale(-8) }}>
								<AppText
									fontSize={FontSize._14}
									label={t('dob')}
									styleProps={{ backgroundColor: AppColors.background, paddingHorizontal: 5 }}
								/>
							</View>
							<Text style={styles.dobText}>{date ? moment(date).format('DD-MM-YYYY') : t('dob')}</Text>
							<Image source={Icons.icnCalender} style={{ tintColor: AppColors.primary }} />
						</Pressable>

						<View style={styles.radioButtonsContainer}>
							<View
								style={{ position: 'absolute', zIndex: 99, left: 20, top: metrics.verticalScale(-8) }}>
								<AppText
									fontSize={FontSize._14}
									label={t('gender')}
									styleProps={{ backgroundColor: AppColors.background, paddingHorizontal: 5 }}
								/>
							</View>
							{/* <AppText fontSize={FontSize._16} title={t('gender')} /> */}
							<RadioGroup
								radioButtons={radioButtons}
								onPress={setSelectedId}
								selectedId={selectedId}
								containerStyle={{ flexDirection: 'column' }} // Horizontal layout
							/>
						</View>

						<View style={{ marginTop: metrics.verticalScale(10) }}>
							<View style={{ position: 'absolute', zIndex: 99, left: 20, top: metrics.verticalScale(4) }}>
								<AppText
									fontSize={FontSize._14}
									label={t('country')}
									styleProps={{ backgroundColor: AppColors.background, paddingHorizontal: 5 }}
								/>
							</View>
							<AppDriverButtons
								styleProps={{
									borderWidth: 1,
									paddingHorizontal: metrics.verticalScale(20),
									height: AppHeight._70,
									...borderRadius10,
								}}
								onClick={() => setShowCountryPicker(true)}
								buttonLabel={countryName}
								textColor={AppColors.text}
								iconNode={
									<CountryPicker
										onClose={() => setShowCountryPicker(false)}
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
											onBackgroundTextColor: AppColors.text,
										}}
									/>
								}
							/>
						</View>
						<View
							style={{
								flexDirection: 'row',
								flex: 1,
								justifyContent: 'space-between',
							}}>
							<View
								style={{
									flex: 0.48,
									marginBottom: metrics.verticalScale(10),
								}}>
								<AppTextInput
									ref={cityRef}
									placeholder={t('city')}
									value={values.city}
									onChangeText={handleChange('city')}
									onBlur={handleBlur('city')}
									// showError={touched.city && errors.city}
									onSubmitEditing={() => postCodeRef?.current?.focus()}
									returnKeyType="next"
								/>
								{touched.city && errors.city && (
									<View style={styles.errorContainer}>
										<Image
											style={[styles.icon, { tintColor: AppColors.error }]}
											source={Icons.icnError}
										/>
										<AppText
											width={'50%'}
											left={metrics.horizontalScale(10)}
											textColor={AppColors.error}
											fontFamily={Fonts.REGULAR}
											fontSize={FontSize._14}
											label={errors.city}
										/>
									</View>
								)}
							</View>
							<View
								style={{
									flex: 0.48,
									marginBottom: metrics.verticalScale(10),
								}}>
								<AppTextInput
									ref={postCodeRef}
									placeholder={t('postCode')}
									value={values.postCode}
									onChangeText={handleChange('postCode')}
									onBlur={handleBlur('postCode')}
									// showError={touched.postCode && errors.postCode}
									onSubmitEditing={() => streetRef?.current?.focus()}
									returnKeyType="done"
									inputMode="number-pad"
								/>
								{touched.postCode && errors.postCode && (
									<View style={styles.errorContainer}>
										<Image
											style={[styles.icon, { tintColor: AppColors.error }]}
											source={Icons.icnError}
										/>
										<AppText
											width={'50%'}
											left={metrics.horizontalScale(10)}
											textColor={AppColors.error}
											fontFamily={Fonts.REGULAR}
											fontSize={FontSize._14}
											label={errors.postCode}
										/>
									</View>
								)}
							</View>
						</View>

						<AppTextInput
							ref={streetRef}
							placeholder={t('address')}
							value={values.street}
							onChangeText={handleChange('street')}
							onBlur={handleBlur('street')}
							showError={touched.street && errors.street}
							onSubmitEditing={() => streetNumberRef?.current?.focus()}
							returnKeyType="next"
						/>
						{/* <AppTextInput
							ref={streetNumberRef}
							placeholder={t('streetNumber')}
							value={values.streetNumber}
							onChangeText={handleChange('streetNumber')}
							onBlur={handleBlur('streetNumber')}
							showError={touched.streetNumber && errors.streetNumber}
							returnKeyType="done"
						/> */}

						{/* <View>
							<AppDriverButtons
								onClick={() =>
									props.navigation.navigate(NavigationKeys.AddDocuments, {
										driverDocuments: driverInfoRes?.driverInfo ?? {},
									})
								}
								rotate={'0deg'}
								buttonLabel={t('addDocuments')}
								iconTint={AppColors.primary}
								icon={Icons.icnUpload}
								height={metrics.moderateScale(24)}
								width={metrics.moderateScale(24)}
							/>
							<AppText
								top={metrics.verticalScale(5)}
								left={metrics.horizontalScale(10)}
								label="JPG, PNG "
							/>
						</View> */}

						{/* <AppDriverButtons
							buttonLabel="Next of Kin"
							iconTint={AppColors.white}
							icon={Icons.icnBack}
							onClick={() => {
								props.navigation.navigate(NavigationKeys.NextOfKin, {
									driverInfoRes: guarantor ?? {},
								});
							}}
						/> */}
						{/*
						<AppDriverButtons
							onClick={() => setIsPrefModalVisible(true)}
							buttonLabel={t('preferences')}
							icon={Icons.icnBack}
						/>
						<AppDriverButtons
							onClick={() =>
								props.navigation.navigate(NavigationKeys.AddCarDetails, {
									AllCarDetails: carDetails ?? {},
								})
							}
							buttonLabel={t('addCar')}
							icon={Icons.icnBack}
						/>
						<AppDriverButtons
							onClick={() => props.navigation.navigate(NavigationKeys.AddPayments)}
							buttonLabel={t('addPaymentDetails')}
							icon={Icons.icnBack}
						/>
						<AppDriverButtons
							onClick={() =>
								props.navigation.navigate(NavigationKeys.AddEmergencyContacts, {
									driverInfos: driverInfoRes?.driverInfo,
								})
							}
							buttonLabel={t('emergencyContacts')}
							icon={Icons.icnBack}
						/> */}
					</View>
					<View style={{ marginBottom: metrics.verticalScale(20) }}>
						<AppButton
							top={metrics.verticalScale(20)}
							textColor={AppColors.textDark}
							fontSize={FontSize._16}
							fontFamily={Fonts.MEDIUM}
							position="end"
							buttonLabel={t('submit')}
							onClick={handleSubmit}
						/>
					</View>
				</AppScrollView>
			</View>

			<AppCalender isVisible={isCalenderVisible} onClose={toggleModal} onDateSelect={handleDateSelect} />
			<DriverPrefs
				data={preferences}
				onClose={() => {
					setIsPrefModalVisible(false);
					// api_getDriverInfo();
				}}
				isVisible={isPrefModalVisible}
				title={t('preferences')}
			/>
			<ImagePicker
				isVisible={isImagePickerVisible}
				onClose={toggleImageModal}
				title={t('selectedUploadOption')}
			/>
			<AddDocuments isVisible={isDocumentModalVisible} title={t('addDocuments')} onClose={toggleDocumentModal} />
			<AppLoader isLoading={isLoading} />
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		orContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			marginTop: metrics.verticalScale(20),
		},
		innerMainContainer: {
			flex: 1,
			backgroundColor: AppColors.background,
			paddingHorizontal: metrics.verticalScale(20),
			paddingTop: metrics.verticalScale(30),
		},
		profileContainer: {
			marginTop: metrics.verticalScale(30),
			justifyContent: 'center',
			alignItems: 'center',
		},
		profileSubContainer: {
			borderRadius: 100,
			height: metrics.moderateScale(100),
			width: metrics.moderateScale(100),
		},
		radioButtonsContainer: {
			borderColor: AppColors.textInputBorderColor,
			borderWidth: 1,
			padding: metrics.verticalScale(10),
			paddingHorizontal: metrics.verticalScale(20),
			marginTop: metrics.verticalScale(10),
			flexDirection: 'row',
			justifyContent: 'space-between', // Ensure equal spacing between buttons
			alignItems: 'center',
			borderRadius: 10,
		},
		dobContainer: {
			// backgroundColor: 'red',
			borderWidth: 1,
			borderColor: AppColors.textInputBorderColor,
			paddingVertical: metrics.verticalScale(15),
			paddingHorizontal: metrics.horizontalScale(20),
			flexDirection: 'row',
			alignItems: 'center',
			marginVertical: metrics.verticalScale(10),
			borderRadius: 10,
		},
		topImage: { position: 'absolute' },
		dobText: { flex: 1, fontSize: FontSize._16, color: AppColors.text },
		profileImage: { height: metrics.moderateScale(100), width: metrics.moderateScale(100), borderRadius: 100 },
		errorContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: metrics.verticalScale(10),
		},
		icon: {
			tintColor: AppColors.secondary,
			height: 20,
			width: 20,
			marginLeft: metrics.horizontalScale(10),
		},
	});
};

export default DriverInformation;
