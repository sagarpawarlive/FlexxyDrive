import React, { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
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
import AppCustomPicker from '../../../../components/AppCustomPicker';

const AddCarDetails = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const [selectedCarOption, setSelectedCarOption] = useState('');
	const [selectedCarType, setSelectedCarType] = useState('');

	const onBackPress = () => {
		props.navigation.goBack();
	};

	const car_options = [
		'Mercedes Benz(GLC)',
		'Mercedes Benz(AMG)',
		'Mercedes Benz(GLC)',
		'Mercedes Benz(GLC)',
		'Mercedes Benz(GLC)',
		'Others',
	];

	const car_type_options = ['SUV', 'Saloon', 'Estate Car', 'Cabriolet/Roadster', 'Van/Minibus', 'Others'];

	return (
		<MainContainer>
			<View style={[styles.innerMainContainer, {}]}>
				<AppHeader tintColor={AppColors.white} onBack={onBackPress} buttonTitle={'Add Car Details'} />

				<AppScrollView bounces={false} extraHeight={AppHeight._350}>
					<View style={{ marginTop: AppMargin._50 }}>
						<AppCustomPicker
							selectedItem={selectedCarOption}
							setSelectedItem={setSelectedCarOption}
							unselectedText={'Select Make/Model'}
							options={car_options}
						/>
						<AppTextInput placeholder="Color" />
						<AppTextInput placeholder="Mileage" />
						<AppTextInput placeholder="Number of Seats" />
						<AppCustomPicker
							marginTop={AppMargin._20}
							selectedItem={selectedCarType}
							setSelectedItem={setSelectedCarType}
							unselectedText={'Vehicle Type'}
							options={car_type_options}
						/>

						<Pressable
							onPress={() => {
								alert('picker');
							}}
							style={[
								{
									borderColor: AppColors.white,
									borderWidth: 1,
									marginTop: AppMargin._20,
									padding: 10,
									...borderRadius10,
								},
							]}>
							<View style={{ alignItems: 'center', flexDirection: 'row', width: '80%' }}>
								<AppText
									fontFamily={Fonts.REGULAR}
									fontSize={FontSize._14}
									title={
										'Upload Car Images (image should\nbe Front of Car with License plate visible)'
									}
								/>
								<Image style={{ marginHorizontal: AppMargin._30 }} source={Icons.icnLargePicker} />
							</View>
						</Pressable>
					</View>

					<AppButton
						top={AppMargin._20}
						textColor={AppColors.textDark}
						fontSize={FontSize._16}
						fontFamily={Fonts.MEDIUM}
						position="end"
						buttonLabel={'Save'}
					/>
				</AppScrollView>
			</View>
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

export default AddCarDetails;
