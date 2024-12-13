import React, { useMemo, useState, useEffect } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Custom Imports
import { Fonts, FontSize } from '../../../../assets/fonts';
import { Icons } from '../../../../assets/Icons';
import { AppHeight, AppMargin, borderRadius10 } from '../../../../constants/commonStyle';
import { useTheme } from '../../../../theme/ThemeProvider';
import { Theme } from '../../../../types';

// Components
import AppButton from '../../../../components/AppButton';
import AppHeader from '../../../../components/AppHeader';
import AppText from '../../../../components/AppText';
import MainContainer from '../../../../components/MainContainer';
import AppScrollView from '../../../../components/AppScrollView';
import AppTextInput from '../../../../components/AppTextInput';
import AppCustomPicker from '../../../../components/AppCustomPicker';
import AppLoader from '../../../../components/AppLoader';

// Services
import { apiPost } from '../../../../services/API/apiServices';
import { ENDPOINT } from '../../../../services/API/endpoints';

const AddCarDetails = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const [selectedCarOption, setSelectedCarOption] = useState('');
	const [selectedCarType, setSelectedCarType] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [imageUri, setImageUri] = useState<string | null>(null);

	const car_options = [
		'Mercedes Benz(GLC)',
		'Mercedes Benz(AMG)',
		'BMW 3 Series',
		'Audi A4',
		'Toyota Camry',
		'Others',
	];

	const car_type_options = ['SUV', 'Saloon', 'Estate Car', 'Cabriolet/Roadster', 'Van/Minibus', 'Others'];

	const onBackPress = () => {
		props.navigation.goBack();
	};

	const handleImageUpload = () => {
		// Implement image picker logic
		Alert.alert('Upload Car Image', 'Implement image picker here');
	};

	// API Call to Save Car Details
	const api_AddDriverInfo = async () => {
		const isValid = await formik.validateForm();
		if (Object.keys(isValid).length > 0) {
			formik.handleSubmit();
			return;
		}

		const params = {
			carDetails: {
				carModel: selectedCarOption === 'Others' ? formik.values.otherCarModel : selectedCarOption,
				firstRegistrationYear: parseInt(formik.values.firstRegistration),
				fuel: formik.values.fuel,
				color: formik.values.color,
				mileage: parseInt(formik.values.mileage),
				numberOfSeats: parseInt(formik.values.numberOfSeats),
				vehicleType: selectedCarType === 'Others' ? formik.values.otherVehicleType : selectedCarType,
				licensePlateNumber: formik.values.licensePlate,
				imageUrl: imageUri,
			},
		};

		try {
			setIsLoading(true);
			const res = await apiPost(ENDPOINT.SET_DRIVER_INFO, params);

			if (res.success) {
				Alert.alert('Success', 'Car details saved successfully');
				props.navigation.goBack(); // or navigate to next screen
			} else {
				Alert.alert('Error', res.message || 'Failed to save car details');
			}
		} catch (error) {
			console.error('Error saving car details', error);
			Alert.alert('Error', 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	// Formik Validation Schema
	const validationSchema = Yup.object().shape({
		firstRegistration: Yup.number()
			.positive('Registration year must be a positive number')
			.integer('Registration year must be an integer')
			.min(1900, 'Registration year must be after 1900')
			.max(new Date().getFullYear(), 'Registration year cannot be in the future')
			.required('Registration year is required'),
		fuel: Yup.string().required('Fuel type is required'),
		color: Yup.string().required('Color is required'),
		mileage: Yup.number()
			.positive('Mileage must be a positive number')
			.integer('Mileage must be an integer')
			.required('Mileage is required'),
		numberOfSeats: Yup.number()
			.positive('Number of seats must be a positive number')
			.integer('Number of seats must be an integer')
			.min(2, 'Minimum 2 seats')
			.max(10, 'Maximum 10 seats')
			.required('Number of seats is required'),
		licensePlate: Yup.string()
			.required('License plate number is required')
			.matches(/^[A-Z0-9]+$/, 'License plate must be alphanumeric'),
		otherCarModel: Yup.string().when('selectedCarOption', {
			is: 'Others',
			then: Yup.string().required('Please specify car model'),
		}),
		otherVehicleType: Yup.string().when('selectedCarType', {
			is: 'Others',
			then: Yup.string().required('Please specify vehicle type'),
		}),
	});

	// Formik Form Management
	const formik = useFormik({
		initialValues: {
			firstRegistration: '',
			fuel: '',
			color: '',
			mileage: '',
			numberOfSeats: '',
			licensePlate: '',
			otherCarModel: '',
			otherVehicleType: '',
		},
		validationSchema,
		onSubmit: api_AddDriverInfo,
	});

	// Pre-fill form values if `driverInfoRes?.carDetails` is available
	useEffect(() => {
		const carDetails = props.route?.params?.AllCarDetails;

		if (carDetails) {
			setSelectedCarOption(carDetails.carModel);
			setSelectedCarType(carDetails.vehicleType);
			formik.setValues({
				firstRegistration: carDetails.firstRegistrationYear?.toString() || '',
				fuel: carDetails.fuel || '',
				color: carDetails.color || '',
				mileage: carDetails.mileage?.toString() || '',
				numberOfSeats: carDetails.numberOfSeats?.toString() || '',
				licensePlate: carDetails.licensePlateNumber || '',
				otherCarModel: carDetails.carModel === 'Others' ? carDetails.carModel : '',
				otherVehicleType: carDetails.vehicleType === 'Others' ? carDetails.vehicleType : '',
			});
			setImageUri(carDetails.imageUrl || null);
		}
	}, [props.driverInfoRes]);

	return (
		<MainContainer>
			<View style={styles.innerMainContainer}>
				<AppHeader tintColor={AppColors.white} onBack={onBackPress} buttonTitle={'Add Car Details'} />

				<AppScrollView bounces={false} extraHeight={AppHeight._350}>
					<View style={{ marginTop: AppMargin._50 }}>
						{/* Car Make/Model Picker */}
						<AppCustomPicker
							selectedItem={selectedCarOption}
							setSelectedItem={setSelectedCarOption}
							unselectedText={'Select Make/Model'}
							options={car_options}
						/>
						{selectedCarOption === 'Others' && (
							<AppTextInput
								placeholder="Enter Car Model"
								value={formik.values.otherCarModel}
								onChangeText={formik.handleChange('otherCarModel')}
								showError={formik.touched.otherCarModel && formik.errors.otherCarModel}
							/>
						)}

						{/* First Registration Input */}
						<AppTextInput
							placeholder="First Registration Year"
							value={formik.values.firstRegistration}
							onChangeText={formik.handleChange('firstRegistration')}
							showError={formik.touched.firstRegistration && formik.errors.firstRegistration}
							texInputProps={{
								keyboardType: 'number-pad',
								returnKeyType: 'done',
							}}
						/>

						{/* Fuel Type Input */}
						<AppTextInput
							placeholder="Fuel Type"
							value={formik.values.fuel}
							onChangeText={formik.handleChange('fuel')}
							showError={formik.touched.fuel && formik.errors.fuel}
						/>

						{/* Color Input */}
						<AppTextInput
							placeholder="Car Color"
							value={formik.values.color}
							onChangeText={formik.handleChange('color')}
							showError={formik.touched.color && formik.errors.color}
						/>

						{/* Mileage Input */}
						<AppTextInput
							placeholder="Mileage"
							value={formik.values.mileage}
							onChangeText={formik.handleChange('mileage')}
							showError={formik.touched.mileage && formik.errors.mileage}
							texInputProps={{
								keyboardType: 'number-pad',
								returnKeyType: 'done',
							}}
						/>

						{/* Number of Seats Input */}
						<AppTextInput
							placeholder="Number of Seats"
							value={formik.values.numberOfSeats}
							onChangeText={formik.handleChange('numberOfSeats')}
							showError={formik.touched.numberOfSeats && formik.errors.numberOfSeats}
							texInputProps={{
								keyboardType: 'number-pad',
								returnKeyType: 'done',
							}}
						/>

						{/* Vehicle Type Picker */}
						<AppCustomPicker
							marginTop={AppMargin._20}
							selectedItem={selectedCarType}
							setSelectedItem={setSelectedCarType}
							unselectedText={'Vehicle Type'}
							options={car_type_options}
						/>
						{selectedCarType === 'Others' && (
							<AppTextInput
								placeholder="Enter Vehicle Type"
								value={formik.values.otherVehicleType}
								onChangeText={formik.handleChange('otherVehicleType')}
								showError={formik.touched.otherVehicleType && formik.errors.otherVehicleType}
							/>
						)}

						{/* License Plate Input */}
						<AppTextInput
							placeholder="License Plate Number"
							value={formik.values.licensePlate}
							onChangeText={formik.handleChange('licensePlate')}
							showError={formik.touched.licensePlate && formik.errors.licensePlate}
						/>

						{/* Image Upload */}
						<Pressable
							onPress={handleImageUpload}
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

					{/* Save Button */}
					<AppButton
						onClick={formik.handleSubmit}
						top={AppMargin._20}
						textColor={AppColors.textDark}
						fontSize={FontSize._16}
						fontFamily={Fonts.MEDIUM}
						position="end"
						buttonLabel={'Save'}
					/>
				</AppScrollView>
			</View>

			{/* Loading Indicator */}
			<AppLoader isLoading={isLoading} />
		</MainContainer>
	);
};

// Styles
const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		innerMainContainer: {
			flex: 1,
			backgroundColor: AppColors.background,
			paddingHorizontal: 20,
		},
	});
};

export default AddCarDetails;
