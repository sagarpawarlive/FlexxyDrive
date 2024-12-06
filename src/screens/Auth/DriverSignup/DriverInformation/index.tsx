import React, { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
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
						<AppTextInput height={AppHeight._50} borderBottomWidth={1} placeholder="First name" />
						<AppTextInput height={AppHeight._50} borderBottomWidth={1} placeholder="Last name" />

						<AppTextInput
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
									theme={{
										onBackgroundTextColor: AppColors.text,
									}}
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

						<AppTextInput height={AppHeight._50} borderBottomWidth={1} placeholder="City" />
						<AppTextInput height={AppHeight._50} borderBottomWidth={1} placeholder="Post code" />
						<AppTextInput height={AppHeight._50} borderBottomWidth={1} placeholder="Street" />
						<AppTextInput height={AppHeight._50} borderBottomWidth={1} placeholder="Street name" />

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
						onClick={() => {}}
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
			// backgroundColor: 'red',
		},
	});
};

export default DriverInformation;
