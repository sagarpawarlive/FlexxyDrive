import { useFormik } from 'formik';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup'; // For form validation
import { Fonts, FontSize } from '../../../../assets/fonts';
import { Icons } from '../../../../assets/Icons';
import AppButton from '../../../../components/AppButton';
import AppDriverButtons from '../../../../components/AppDriverButtons';
import AppHeader from '../../../../components/AppHeader';
import AppLoader from '../../../../components/AppLoader';
import AppScrollView from '../../../../components/AppScrollView';
import AppText from '../../../../components/AppText';
import MainContainer from '../../../../components/MainContainer';
import metrics from '../../../../constants/metrics';
import { NavigationKeys } from '../../../../constants/navigationKeys';
import {
	cityValidation,
	firstNameValidation,
	lastNameValidation,
	postCodeValidation,
	streetValidation,
} from '../../../../constants/validationSchema';
import { t } from '../../../../i18n';
import { apiGet, apiPost } from '../../../../services/API/apiServices';
import { ENDPOINT } from '../../../../services/API/endpoints';
import { _showToast } from '../../../../services/UIs/ToastConfig';
import { updateUserState } from '../../../../store/reducers/userdataSlice';
import AddDocuments from '../../../../subviews/AddDocuments';
import AppCalender from '../../../../subviews/AppCalender';
import DriverPrefs from '../../../../subviews/DriverPrefs';
import ImagePicker from '../../../../subviews/imagePicker';
import { useTheme } from '../../../../theme/ThemeProvider';
import { Theme } from '../../../../types';
import { getLocales } from 'react-native-localize';

let update = false;

const OtherInformation = (props: any) => {
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
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const [date, setDate] = useState(dob);
	const [isCalenderVisible, setIsCalenderVisible] = useState(false);
	const [isPrefModalVisible, setIsPrefModalVisible] = useState(false);
	const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);
	const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
	const [selectedId, setSelectedId] = useState<any>(gender == 'Male' ? '1' : gender == 'Female' ? '2' : '');

	const [selectedCountry, setSelectedCountry] = useState(countryCode);
	const [showCountryPicker, setShowCountryPicker] = useState(false);
	const [countryName, setCountryName] = useState(country);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [driverInfoRes, setDriverInfoRes] = useState<any>(null);

	useEffect(() => {
		// const unsubscribe = props.navigation.addListener('focus', () => {
		api_getDriverInfo();
	}, [props.navigation]);

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

	console.log(userDataSlice, '<=== userDataSlice other');

	// const api_AddDriverInfo = async (values: any) => {
	// 	const params = {
	// 		firstName: values.firstName,
	// 		lastName: values.lastName,
	// 		dob: date ?? '',
	// 		gender: selectedId == '1' ? 'Male' : selectedId == '2' ? 'Female' : '',
	// 		country: countryName,
	// 		city: values.city,
	// 		postCode: values.postCode,
	// 		street: values.street,
	// 		streetNumber: values.streetNumber,
	// 		countryCode: selectedCountry,
	// 	};

	// 	setIsLoading(true);

	// 	let res = await apiPost(ENDPOINT.SET_DRIVER_INFO, params, { token: userData.token });
	// 	console.log(res, '<== res');

	// 	if (res?.error) {
	// 		_showToast(res?.message, 'error');
	// 	}

	// 	if (res?.success) {
	// 		dispatch(updateUserState({ driverInfo: { ...res.data } }));
	// 		if (res?.data?.documents) {
	// 			if (
	// 				res?.data?.documents?.drivingLicense?.length > 0 &&
	// 				res?.data?.documents?.driverImage?.length > 0 &&
	// 				!isVerified
	// 			) {
	// 				const verifyDocumentParams = {
	// 					selfie: res?.data?.documents?.driverImage,
	// 					idImage: res?.data?.documents?.drivingLicense,
	// 					// country: res?.data?.countryCode,
	// 					country: 'DE',
	// 					idType: 'DRIVERS_LICENSE',
	// 				};
	// 				const verifyResponse = await apiPost(ENDPOINT.VERIFY_DOCUMENT, verifyDocumentParams);
	// 				console.log(verifyResponse, '<==== verifyResponse');
	// 			}
	// 		}
	// 	}
	// 	setIsLoading(false);
	// 	_showToast(res?.message, 'success');
	// };

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

	const disabled = !driverInfo?.documents || !driverInfo?.guarantor || !driverInfo?.carDetails || !preferences;

	// const verifyDocument = async () => {
	// 	const locales = getLocales();
	// 	const countryCode = locales[0].countryCode;
	// 	setIsLoading(true);

	// 	const payload = {
	// 		selfie: driverInfo?.documents?.driverImage,
	// 		idImage: driverInfo?.documents?.drivingLicense,
	// 		country: 'DE',
	// 		idType: 'DRIVERS_LICENSE',
	// 		userType: 'DRIVER',
	// 	};
	// 	await apiPost(ENDPOINT.VERIFY_DOCUMENT, payload).then(res => {
	// 		if (res?.statusCode >= 200 && res?.statusCode <= 299) {
	// 			setIsLoading(false);
	// 			_showToast(res?.message, 'success');

	// 			props.navigation.navigate(NavigationKeys.PendingVerification);
	// 		} else {
	// 			_showToast(res?.message, 'error');
	// 			setIsLoading(false);
	// 		}
	// 	});
	// 	setIsLoading(false);
	// };
	const handleVerify = () => {
		if (isVerified) {
			props.navigation.navigate(NavigationKeys.PassangerScreen);
		} else {
			props.navigation.navigate(NavigationKeys.PendingVerification);
		}
	};

	return (
		<MainContainer hideTop>
			<View style={[styles.innerMainContainer, {}]}>
				<AppHeader top={metrics.verticalScale(30)} onBack={onBackPress} buttonTitle={t('otherInformation')} />

				<AppScrollView>
					<View>
						<View>
							<AppDriverButtons
								onClick={() =>
									props.navigation.navigate(NavigationKeys.AddCarDetails, {
										AllCarDetails: carDetails ?? {},
									})
								}
								buttonLabel={t('carDetails')}
								icon={Icons.icnBack}
								isVerify={carDetails}
							/>

							<AppDriverButtons
								onClick={() => setIsPrefModalVisible(true)}
								buttonLabel={t('preferences')}
								icon={Icons.icnBack}
								isVerify={preferences}
							/>

							<AppDriverButtons
								onClick={() => props.navigation.navigate(NavigationKeys.AddPayments)}
								buttonLabel={t('paymentDetails')}
								icon={Icons.icnBack}
								// isVerify={paymentDetails}
							/>

							<AppDriverButtons
								buttonLabel={t('nextOfKin')}
								icon={Icons.icnBack}
								onClick={() => {
									props.navigation.navigate(NavigationKeys.NextOfKin, {
										driverInfoRes: guarantor ?? {},
									});
								}}
								isVerify={guarantor ?? false}
							/>

							<AppDriverButtons
								onClick={() =>
									props.navigation.navigate(NavigationKeys.AddDocuments, {
										driverDocuments: driverInfoRes?.driverInfo ?? {},
									})
								}
								icon={Icons.icnBack}
								buttonLabel={t('documents')}
								isVerify={documents}
							/>

							{/* <AppText
								top={metrics.verticalScale(5)}
								left={metrics.horizontalScale(10)}
								label="JPG, PNG "
							/> */}
						</View>

						{/* <AppDriverButtons
							onClick={() =>
								props.navigation.navigate(NavigationKeys.AddEmergencyContacts, {
									driverInfos: driverInfoRes?.driverInfo,
								})
							}
							buttonLabel={t('emergencyContacts')}
							icon={Icons.icnBack}
						/> */}
					</View>
					{/* <View style={{ marginBottom: metrics.verticalScale(20) }}> */}
					<AppButton
						bottom={metrics.verticalScale(10)}
						top={metrics.verticalScale(20)}
						textColor={AppColors.textDark}
						fontSize={FontSize._16}
						fontFamily={Fonts.MEDIUM}
						position="end"
						buttonLabel={'Verify'}
						onClick={() => {
							handleVerify();
							// props.navigation.navigate(NavigationKeys.VerifyStatusScreen);
						}}
						disabled={disabled}
					/>
					{/* </View> */}
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

export default OtherInformation;
