import React, { useMemo, useState } from 'react';
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
import { Calendar } from 'react-native-calendars';
import AppCalender from '../../../../subviews/AppCalender';
import DriverPrefs from '../../../../subviews/DriverPrefs';
import ImagePicker from '../../../../subviews/imagePicker';
import AddDocuments from '../../../../subviews/AddDocuments';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import AppLoader from '../../../../components/AppLoader';
import { apiPost } from '../../../../services/API/apiServices';
import { ENDPOINT } from '../../../../services/API/endpoints';

const DriverInformation = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const [date, setDate] = useState('');
	const [isCalenderVisible, setIsCalenderVisible] = useState(false);
	const [isPrefModalVisible, setIsPrefModalVisible] = useState(false);
	const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);
	const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);

	const [countryCode, setCountryCode] = useState('+91');
	const [selectedCountry, setSelectedCountry] = useState('IN');
	const [showCountryPicker, setShowCountryPicker] = useState(false);
	const [countryName, setCountryName] = useState('India');

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { userData } = useSelector((state: any) => state.userDataSlice);

	// Form states using Formik
	const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
		initialValues: {
			firstName: '',
			lastName: '',
			city: '',
			postCode: '',
			street: '',
			streetNumber: '',
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
			// Handle form submission (e.g., API call)

			api_AddDriverInfo(values);
		},
	});

	const api_AddDriverInfo = async (values: any) => {
		const params = {
			firstName: values.firstName,
			lastName: values.lastName,
			dob: date,
			country: selectedCountry,
			city: values.city,
			postCode: values.postCode,
			street: values.street,
			streetNumber: values.streetNumber,
		};

		setIsLoading(true);
		let res = await apiPost(ENDPOINT.SET_DRIVER_INFO, params, { token: userData.token });
		setIsLoading(false);
		// props.navigation.navigate(NavigationKeys.OtpScreen);
		// dispatch(setIsLogin(true));
	};
	// Country picker change handler
	const onSelectCountry = (country: any) => {
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
							source={Images.imgDriverPlaceholder}
							style={{ height: AppHeight._175, width: AppHeight._175 }}
						/>
						<Pressable onPress={toggleImageModal} style={{ position: 'absolute', bottom: 0, right: 0 }}>
							<Image source={Icons.icnProfilePicker} style={{}} />
						</Pressable>
					</View>
				</View>

				<AppScrollView bounces={false} extraHeight={AppHeight._350}>
					<View style={{ marginTop: AppMargin._50 }}>
						<AppTextInput
							height={AppHeight._50}
							borderBottomWidth={1}
							placeholder="First name"
							value={values.firstName}
							onChangeText={handleChange('firstName')}
							onBlur={handleBlur('firstName')}
							showError={touched.firstName && errors.firstName}
						/>
						<AppTextInput
							height={AppHeight._50}
							borderBottomWidth={1}
							placeholder="Last name"
							value={values.lastName}
							onChangeText={handleChange('lastName')}
							onBlur={handleBlur('lastName')}
							showError={touched.lastName && errors.lastName}
						/>

						<AppTextInput
							editable={false}
							height={AppHeight._50}
							borderBottomWidth={1}
							placeholder="DOB"
							value={date}
							iconRight={Icons.icnCalender}
							iconRightClick={toggleModal}
						/>

						<AppDriverButtons
							onClick={() => setShowCountryPicker(true)}
							buttonLabel={countryName}
							iconNode={
								<CountryPicker
									visible={showCountryPicker}
									countryCode={selectedCountry}
									withFlag={true}
									withCallingCodeButton={true}
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
							height={AppHeight._50}
							borderBottomWidth={1}
							placeholder="City"
							value={values.city}
							onChangeText={handleChange('city')}
							onBlur={handleBlur('city')}
							showError={touched.city && errors.city}
						/>
						<AppTextInput
							height={AppHeight._50}
							borderBottomWidth={1}
							placeholder="Post code"
							value={values.postCode}
							onChangeText={handleChange('postCode')}
							onBlur={handleBlur('postCode')}
							showError={touched.postCode && errors.postCode}
						/>
						<AppTextInput
							height={AppHeight._50}
							borderBottomWidth={1}
							placeholder="Street"
							value={values.street}
							onChangeText={handleChange('street')}
							onBlur={handleBlur('street')}
							showError={touched.street && errors.street}
						/>
						<AppTextInput
							height={AppHeight._50}
							borderBottomWidth={1}
							placeholder="Street Number"
							value={values.streetNumber}
							onChangeText={handleChange('streetNumber')}
							onBlur={handleBlur('streetNumber')}
							showError={touched.streetNumber && errors.streetNumber}
						/>

						<AppDriverButtons
							onClick={toggleDocumentModal}
							rotate={'0deg'}
							buttonLabel="Add Document"
							iconTint={AppColors.primary}
							icon={Icons.icnUpload}
						/>

						<AppDriverButtons
							buttonLabel="Next of Kin"
							iconTint={AppColors.white}
							icon={Icons.icnBack}
							onClick={() => props.navigation.navigate(NavigationKeys.NextOfKin)}
						/>

						<AppDriverButtons
							onClick={() => setIsPrefModalVisible(true)}
							buttonLabel="Preferences"
							iconTint={AppColors.white}
							icon={Icons.icnBack}
						/>
						<AppDriverButtons
							onClick={() => props.navigation.navigate(NavigationKeys.AddCarDetails)}
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
							onClick={() => props.navigation.navigate(NavigationKeys.AddEmergencyContacts)}
							buttonLabel="Emergency Contacts"
							iconTint={AppColors.white}
							icon={Icons.icnBack}
						/>
					</View>

					<AppButton
						top={AppMargin._20}
						textColor={AppColors.textDark}
						fontSize={FontSize._16}
						fontFamily={Fonts.MEDIUM}
						position="end"
						buttonLabel={'Verify'}
						onClick={handleSubmit}
					/>
				</AppScrollView>
			</View>

			<AppCalender isVisible={isCalenderVisible} onClose={toggleModal} onDateSelect={handleDateSelect} />
			<DriverPrefs
				onClose={() => setIsPrefModalVisible(false)}
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
	});
};

export default DriverInformation;
