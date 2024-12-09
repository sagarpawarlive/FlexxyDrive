import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
import AppScrollView from '../../../../components/AppScrollView';
import { Icons } from '../../../../assets/Icons';
import AppCalender from '../../../../subviews/AppCalender';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';

const NextOfKin = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const [isCalenderVisible, setIsCalenderVisible] = useState(false);
	const [date, setDate] = useState('');

	const [countryCode, setCountryCode] = useState('+91');
	const [selectedCountry, setSelectedCountry] = useState('IN');
	const [showCountryPicker, setShowCountryPicker] = useState(false);
	const [countryName, setCountryName] = useState('India');

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
		console.log('[  country ] ----------------------->> ', country);
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
						<AppTextInput placeholder="Full Name" />
						<AppTextInput returnKeyType={'done'} inputMode={'number-pad'} placeholder="Phone Number" />
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
							rightNode={
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
						<AppTextInput placeholder="City" />
						<AppTextInput placeholder="Postal Code" />
						<AppTextInput placeholder="Street" />
						<AppTextInput placeholder="Street Number" />
					</View>

					<AppButton
						top={AppMargin._30}
						textColor={AppColors.textDark}
						fontSize={FontSize._16}
						fontFamily={Fonts.MEDIUM}
						position="end"
						buttonLabel={'SAVE CARD'}
						onClick={() => {}} // Trigger Formik form submission
					/>
				</AppScrollView>
			</View>
			<AppCalender isVisible={isCalenderVisible} onClose={toggleCalenderModal} onDateSelect={handleDateSelect} />
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
