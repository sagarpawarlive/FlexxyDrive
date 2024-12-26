import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Fonts, FontSize } from '../../../../assets/fonts';
import AppButton from '../../../../components/AppButton';
import AppHeader from '../../../../components/AppHeader';
import AppText from '../../../../components/AppText';
import MainContainer from '../../../../components/MainContainer';
import { AppHeight, AppMargin } from '../../../../constants/commonStyle';
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

let update = false;

const DriverInformation = (props: any) => {
	const dispatch = useDispatch();
	const userDataSlice = useSelector(state => state?.userDataSlice ?? {});
	const { userData } = userDataSlice ?? {};
	const { firstName: fName, lastName: lName, username, phoneNumber, email, driverInfo = {} } = userData?.user ?? {};
	const {
		firstName = fName,
		lastName = lName,
		city,
		postCode,
		street,
		streetNumber,
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
	console.log(driverInfo, '<=== driverInfo');

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

	const firstNameRef = useRef<any>(null);
	const lastNameRef = useRef<any>(null);
	const cityRef = useRef<any>(null);
	const postCodeRef = useRef<any>(null);
	const streetRef = useRef<any>(null);
	const streetNumberRef = useRef<any>(null);

	const radioDesigns = {
		borderColor: AppColors.primary,
		color: AppColors.primary,
		labelStyle: { color: AppColors.white },
	};

	const radioButtons = useMemo(
		() => [
			{
				id: '1', // acts as primary key, should be unique and non-empty string
				label: 'Male',
				value: 'male',
				...radioDesigns,
			},
			{
				id: '2',
				label: 'Female',
				value: 'female',
				...radioDesigns,
			},
		],
		[],
	);
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
				firstName: driverInfoRes?.driverInfo?.firstName ?? '',
				lastName: driverInfoRes?.driverInfo?.lastName ?? '',
				city: driverInfoRes?.driverInfo?.city ?? '',
				postCode: driverInfoRes?.driverInfo?.postCode ?? '',
				street: driverInfoRes?.driverInfo?.street ?? '',
				streetNumber: driverInfoRes?.driverInfo?.streetNumber ?? '',
				dob: driverInfoRes?.driverInfo?.dob ?? '',
			});

			setDate(driverInfoRes?.driverInfo?.dob ?? '');
			setCountryName(driverInfoRes?.driverInfo?.country ?? '');
			setSelectedCountry(driverInfoRes?.driverInfo?.countryCode ?? '');
			setSelectedId(
				driverInfoRes?.driverInfo?.gender == 'Male'
					? '1'
					: driverInfoRes?.driverInfo?.gender == 'Female'
					? '2'
					: '',
			);
		}
	}, [driverInfoRes]);

	const api_getDriverInfo = async () => {
		const params = { token: userData?.token };
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
			streetNumber: streetNumber,
		},
		validationSchema: Yup.object({
			firstName: Yup.string().required('First name is required'),
			lastName: Yup.string().required('Last name is required'),
			city: Yup.string().required('City is required'),
			postCode: Yup.string().required('Post code is required'),
			street: Yup.string().required('Street is required'),
			streetNumber: Yup.string().required('Street number is required'),
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
			gender: selectedId == '1' ? 'Male' : selectedId == '2' ? 'Female' : '',
			country: countryName,
			city: values.city,
			postCode: values.postCode,
			street: values.street,
			streetNumber: values.streetNumber,
			countryCode: selectedCountry,
		};

		setIsLoading(true);

		let res = await apiPost(ENDPOINT.SET_DRIVER_INFO, params, { token: userData.token });
		console.log(res, '<== res');

		if (res?.error) {
			_showToast(res?.message, 'error');
		}

		if (res?.success) {
			dispatch(updateUserState({ driverInfo: { ...res.data } }));
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
		}
		setIsLoading(false);
		_showToast(res?.message, 'success');

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

	return (
		<MainContainer hideTop>
			<View style={[styles.innerMainContainer, { paddingTop: AppMargin._30 }]}>
				<Image style={{ position: 'absolute' }} source={Images.imDdrivertopbackground} />

				<AppHeader
					tintColor={AppColors.textDark}
					top={AppMargin._30}
					onBack={onBackPress}
					buttonTitle={'Welcome to'}
				/>

				<AppText
					left={AppMargin._40}
					textColor={AppColors.textDark}
					label={`Driver information`}
					width={'95%'}
					fontFamily={Fonts.BOLD}
					fontSize={FontSize._24}
				/>

				<View style={styles.profileContainer}>
					<View style={styles.profileSubContainer}>
						<Image
							source={
								documents?.driverImage ? { uri: documents?.driverImage } : Images.imgDriverPlaceholder
							}
							style={{ height: AppHeight._175, width: AppHeight._175, borderRadius: 100 }}
						/>
						{/* <Pressable onPress={() => {}} style={{ position: 'absolute', bottom: 0, right: 0 }}>
							<Image source={Icons.icnProfilePicker} style={{}} />
						</Pressable> */}
					</View>
				</View>

				<AppScrollView bounces={false} extraHeight={AppHeight._350}>
					<View style={{ marginTop: AppMargin._50 }}>
						<AppTextInput
							// height={AppHeight._50}
							ref={firstNameRef}
							borderBottomWidth={1}
							placeholder={driverInfoRes?.firstName ?? 'First name'}
							value={values.firstName}
							onChangeText={handleChange('firstName')}
							onBlur={handleBlur('firstName')}
							showError={touched.firstName && errors.firstName}
							onSubmitEditing={() => lastNameRef?.current?.focus()}
							returnKeyType="next"
						/>
						<AppTextInput
							// height={AppHeight._50}
							ref={lastNameRef}
							borderBottomWidth={1}
							placeholder="Last name"
							value={values.lastName}
							onChangeText={handleChange('lastName')}
							onBlur={handleBlur('lastName')}
							showError={touched.lastName && errors.lastName}
							onSubmitEditing={toggleModal}
							returnKeyType="next"
						/>

						{/* <AppTextInput
							editable={false}
							// height={AppHeight._50}
							borderBottomWidth={1}
							placeholder="DOB"
							value={date ? moment(date).format('DD-MM-YYYY') : ''}
							iconRight={Icons.icnCalender}
							iconRightClick={toggleModal}
							wholePress={() => toggleModal()}
							returnKeyType="next"
						/> */}

						<Pressable style={styles.dobContainer} onPress={() => toggleModal()}>
							<Text style={{ flex: 1, fontSize: FontSize._16, color: AppColors.text }}>
								{date ? moment(date).format('DD-MM-YYYY') : 'DOB'}
							</Text>
							<Image source={Icons.icnCalender} style={{ tintColor: AppColors.primary }} />
						</Pressable>

						<View style={styles.radioButtonsContainer}>
							<AppText fontSize={FontSize._16} title="Gender" />
							<RadioGroup
								radioButtons={radioButtons}
								onPress={setSelectedId}
								selectedId={selectedId}
								containerStyle={{ flexDirection: 'row' }} // Horizontal layout
							/>
						</View>

						<AppDriverButtons
							onClick={() => setShowCountryPicker(true)}
							buttonLabel={countryName}
							textColor={AppColors.white}
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
										onBackgroundTextColor: AppColors.white,
									}}
								/>
							}
						/>

						<AppTextInput
							ref={cityRef}
							// height={AppHeight._50}
							borderBottomWidth={1}
							placeholder="City"
							value={values.city}
							onChangeText={handleChange('city')}
							onBlur={handleBlur('city')}
							showError={touched.city && errors.city}
							onSubmitEditing={() => postCodeRef?.current?.focus()}
							returnKeyType="next"
						/>
						<AppTextInput
							ref={postCodeRef}
							// height={AppHeight._50}
							borderBottomWidth={1}
							placeholder="Post code"
							value={values.postCode}
							onChangeText={handleChange('postCode')}
							onBlur={handleBlur('postCode')}
							showError={touched.postCode && errors.postCode}
							onSubmitEditing={() => streetRef?.current?.focus()}
							returnKeyType="done"
							inputMode="number-pad"
						/>
						<AppTextInput
							ref={streetRef}
							// height={AppHeight._50}
							borderBottomWidth={1}
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
							// height={AppHeight._50}
							borderBottomWidth={1}
							placeholder="Street Number"
							value={values.streetNumber}
							onChangeText={handleChange('streetNumber')}
							onBlur={handleBlur('streetNumber')}
							showError={touched.streetNumber && errors.streetNumber}
							returnKeyType="done"
						/>

						<View>
							<AppDriverButtons
								onClick={() =>
									props.navigation.navigate(NavigationKeys.AddDocuments, {
										driverDocuments: driverInfoRes?.driverInfo ?? {},
									})
								}
								rotate={'0deg'}
								buttonLabel="Add Document"
								iconTint={AppColors.primary}
								icon={Icons.icnUpload}
								height={24}
								width={24}
							/>
							<AppText top={5} left={10} label="JPG, PNG " />
						</View>

						<AppDriverButtons
							buttonLabel="Next of Kin"
							iconTint={AppColors.white}
							icon={Icons.icnBack}
							onClick={() => {
								props.navigation.navigate(NavigationKeys.NextOfKin, {
									driverInfoRes: guarantor ?? {},
								});
							}}
						/>

						<AppDriverButtons
							onClick={() => setIsPrefModalVisible(true)}
							buttonLabel="Preferences"
							iconTint={AppColors.white}
							icon={Icons.icnBack}
						/>
						<AppDriverButtons
							onClick={() =>
								props.navigation.navigate(NavigationKeys.AddCarDetails, {
									AllCarDetails: carDetails ?? {},
								})
							}
							buttonLabel="Add Car"
							iconTint={AppColors.white}
							icon={Icons.icnBack}
						/>
						<AppDriverButtons
							onClick={() => props.navigation.navigate(NavigationKeys.AddPayments)}
							buttonLabel="Add Payment Details"
							iconTint={AppColors.white}
							icon={Icons.icnBack}
						/>
						<AppDriverButtons
							onClick={() =>
								props.navigation.navigate(NavigationKeys.AddEmergencyContacts, {
									driverInfos: driverInfoRes?.driverInfo,
								})
							}
							buttonLabel="Emergency Contacts"
							iconTint={AppColors.white}
							icon={Icons.icnBack}
						/>
					</View>
					<View style={{ marginBottom: 10 }}>
						<AppButton
							top={AppMargin._20}
							textColor={AppColors.textDark}
							fontSize={FontSize._16}
							fontFamily={Fonts.MEDIUM}
							position="end"
							buttonLabel={'Verify'}
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
				title={'Select Preferences'}
			/>
			<ImagePicker isVisible={isImagePickerVisible} onClose={toggleImageModal} title={'Select upload option'} />
			<AddDocuments isVisible={isDocumentModalVisible} title={'Add Document'} onClose={toggleDocumentModal} />
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
		profileContainer: {
			marginTop: AppMargin._30,
			justifyContent: 'center',
			alignItems: 'center',
		},
		profileSubContainer: {
			borderRadius: 100,
			height: AppHeight._175,
			width: AppHeight._175,
		},
		radioButtonsContainer: {
			borderColor: AppColors.white,
			borderBottomWidth: 1,
			paddingVertical: AppMargin._20,
			marginHorizontal: AppMargin._10,
			flexDirection: 'row',
			justifyContent: 'space-between', // Ensure equal spacing between buttons
			alignItems: 'center',
		},
		dobContainer: {
			// backgroundColor: 'red',
			borderBottomWidth: 1,
			borderBottomColor: AppColors.white,
			paddingVertical: 15,
			marginHorizontal: 10,
			flexDirection: 'row',
			alignItems: 'center',
			marginVertical: 10,
		},
	});
};

export default DriverInformation;
