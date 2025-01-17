import React, { useMemo, useState, useEffect } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
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
import { apiGet, apiPost } from '../../../../services/API/apiServices';
import { ENDPOINT } from '../../../../services/API/endpoints';
import { updateUserState } from '../../../../store/reducers/userdataSlice';
import { App_Permission } from '../../../../services/Permissions';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import { generateUniqueFileName, isIOS } from '../../../../constants/constants';
import { s3Upload } from '../../../../utils/awsUpload';
import { _showToast } from '../../../../services/UIs/ToastConfig';
import AppYearPicker from '../../../../components/AppYearPicker';
import AppFuelPicker from '../../../../components/AppFuelPicker';
import { fuelType } from '../../../../constants/staticData';
import {
	colorValidation,
	firstRegistrationValidation,
	fuelValidation,
	licencePlateValidation,
} from '../../../../constants/validationSchema';
import { t } from '../../../../i18n';
import metrics from '../../../../constants/metrics';

const AddCarDetails = (props: any) => {
	const dispatch = useDispatch();

	const userDetails = useSelector((state: any) => state?.userDataSlice.userData.data ?? {});
	const carData = userDetails?.user?.driverInfo?.carDetails ?? {};

	const { isDarkMode, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const [selectedCarOption, setSelectedCarOption] = useState(carData?.carBrand);
	const [selectedCarModel, setSelectedCarModel] = useState(carData?.carModel);

	// const [selectedYear, setSelectedYear] = useState(carData?.firstRegistrationYear);
	const [otherFuel, setOtherFuel] = useState('');

	// const [selectedCarType, setSelectedCarType] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [brands, setBrands] = useState([]);
	const [models, setModels] = useState([]);
	const [capturedImage, setCapturedImage] = useState({ path: '', isFile: false } ?? null);
	const [brandModalLoading, setBrandModalLoading] = useState(false);
	const onBackPress = () => {
		props.navigation.goBack();
	};

	const currentYear = new Date().getFullYear();
	const years = [];

	for (let year = currentYear; year >= 1990; year--) {
		years.push(year.toString());
	}

	const handleImageUpload = async () => {
		setIsLoading(true);
		const photoPermission = (await App_Permission._askPhotoPermission()) ?? false;
		if (photoPermission) {
			try {
				const image = await ImagePicker.openPicker({}).then(data => {
					setCapturedImage({ ...data });
					return data;
				});

				const localFilePath = `${RNFS.DocumentDirectoryPath}/${generateUniqueFileName(image.filename)}`;
				await RNFS.copyFile(image.path, localFilePath);
				const androidFilePath = 'file://' + localFilePath;
				let dict = {
					...image,
					sourceURL: androidFilePath,
					path: androidFilePath,
				};
				setCapturedImage(isIOS ? image : dict);
				setIsLoading(false);
			} catch (error) {
				console.log('Error selecting or compressing image:', error);
				setIsLoading(false);
			}
		}
	};

	// API Call to Save Car Details
	const api_AddDriverInfo = async () => {
		setIsLoading(true);

		const isValid = await formik.validateForm();

		if (!selectedCarModel?.name || !selectedCarOption?.name) {
			_showToast('Please select car', 'warning');
			return;
		}

		if (Object.keys(isValid).length > 0) {
			formik.handleSubmit();
			return;
		}
		let carImage = '';
		if (capturedImage?.path !== '') {
			carImage = await s3Upload(capturedImage);
		}
		const params = {
			carDetails: {
				carModel: selectedCarModel?.name ?? '',
				carBrand: selectedCarOption?.name ?? '',
				firstRegistrationYear: parseInt(formik.values.firstRegistration),
				fuel: formik.values.fuel == 'Other' ? otherFuel : formik.values.fuel,
				color: formik.values.color,
				// mileage: parseInt(formik.values.mileage),
				// numberOfSeats: parseInt(formik.values.numberOfSeats),
				// vehicleType: selectedCarType?.name ?? '',
				licensePlateNumber: formik.values.licensePlate,
				imageUrl: carImage || imageUri,
			},
		};

		try {
			setIsLoading(true);
			const res = await apiPost(ENDPOINT.SET_DRIVER_INFO, params);
			dispatch(
				updateUserState({
					driverInfo: { ...res?.data },
				}),
			);
			if (res.success) {
				_showToast('Car details saved successfully', 'success');
				props.navigation.goBack(); // or navigate to next screen
			} else {
				_showToast(res?.message, 'error');
			}
		} catch (error) {
			_showToast('An unexpected error occurred', 'error');
		} finally {
			setIsLoading(false);
		}
		setIsLoading(false);
	};

	// Formik Validation Schema
	const validationSchema = Yup.object().shape({
		firstRegistration: firstRegistrationValidation,
		fuel: fuelValidation,
		color: colorValidation,

		// mileage: Yup.string().required('Mileage is required'),
		// numberOfSeats: Yup.number()
		// 	.positive('Number of seats must be a positive number')
		// 	.integer('Number of seats must be an integer')
		// 	.min(2, 'Minimum 2 seats')
		// 	.max(10, 'Maximum 10 seats')
		// 	.required('Number of seats is required'),

		licensePlate: licencePlateValidation,

		// otherCarModel: Yup.string().when('selectedCarOption', {
		// 	is: 'Others',
		// 	then: Yup.string().required('Please specify car model'),
		// }

		// otherVehicleType: Yup.string().when('selectedCarType', {
		// 	is: 'Others',
		// 	then: Yup.string().required('Please specify vehicle type'),
		// }),
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
		},
		validationSchema,
		onSubmit: api_AddDriverInfo,
	});

	// Pre-fill form values if `driverInfoRes?.carDetails` is available
	useEffect(() => {
		if (carData) {
			setSelectedCarOption({ name: carData.carBrand });
			setSelectedCarModel({ name: carData.carModel });
			formik.setValues({
				firstRegistration: carData.firstRegistrationYear?.toString() || '',
				fuel: carData.fuel || '',
				color: carData.color || '',
				mileage: carData.mileage?.toString() || '',
				numberOfSeats: carData.numberOfSeats?.toString() || '',
				licensePlate: carData.licensePlateNumber || '',
				otherCarModel: carData.carModel,
			});
			setImageUri(carData.imageUrl || null);
		}
	}, [props.driverInfoRes]);

	const searchBrand = async (carBrand: string) => {
		setBrandModalLoading(true);
		const res = await apiGet(`${ENDPOINT.GET_BRAND}?search=${carBrand}`);
		setBrands(res?.data ?? []);
		setModels([]);
		setSelectedCarModel('');
		setBrandModalLoading(false);
	};

	const getModal = async (brand: { id: number; name: string }) => {
		setBrandModalLoading(true);
		setModels([]);
		setSelectedCarModel('');
		const res = await apiGet(`${ENDPOINT.GET_MODELS}/${brand?.id}`);
		setModels(res?.data ?? []);
		setBrandModalLoading(false);
	};

	return (
		<MainContainer>
			<View style={styles.innerMainContainer}>
				<AppHeader onBack={onBackPress} buttonTitle={t('addCarDetails')} />

				<AppScrollView bounces={false} extraHeight={AppHeight._350}>
					<View style={{ marginTop: metrics.verticalScale(35) }}>
						<AppCustomPicker
							showSearch
							brandModalLoading={brandModalLoading}
							onSearchPress={searchBrand}
							selectedItem={selectedCarOption}
							setSelectedItem={item => {
								getModal(item);
								setSelectedCarOption(item);
							}}
							unselectedText={t('selectBrand')}
							options={brands}
							setSearchItem={item => {
								// console.log(item, '<== item');
								// alert(item.name);
							}}
						/>

						<AppCustomPicker
							brandModalLoading={brandModalLoading}
							marginTop={metrics.verticalScale(20)}
							selectedItem={selectedCarModel}
							setSelectedItem={setSelectedCarModel}
							unselectedText={t('selectMakeModel')}
							options={models ?? []}
						/>

						{/* First Registration Input */}
						{/* <AppTextInput
							placeholder="First Registration Year"
							value={formik.values.firstRegistration}
							onChangeText={formik.handleChange('firstRegistration')}
							showError={formik.touched.firstRegistration && formik.errors.firstRegistration}
							texInputProps={{
								keyboardType: 'number-pad',
								returnKeyType: 'done',
							}}
						/> */}

						<AppYearPicker
							marginTop={metrics.verticalScale(20)}
							selectedItem={formik.values.firstRegistration}
							setSelectedItem={formik.handleChange('firstRegistration')}
							unselectedText={t('selectYear')}
							options={years}
						/>

						{formik.touched.firstRegistration && formik.errors.firstRegistration && (
							<View style={styles.errorContainer}>
								<Image style={[styles.icon, { tintColor: AppColors.error }]} source={Icons.icnError} />
								<AppText
									width={'90%'}
									left={metrics.horizontalScale(10)}
									textColor={AppColors.error}
									fontFamily={Fonts.REGULAR}
									fontSize={FontSize._14}
									label={formik.errors.firstRegistration}
								/>
							</View>
						)}

						{/* Fuel Type Input */}
						<AppFuelPicker
							marginTop={metrics.verticalScale(20)}
							selectedItem={formik.values.fuel}
							setSelectedItem={formik.handleChange('fuel')}
							unselectedText={t('selectFuel')}
							options={fuelType}
						/>

						{formik.touched.fuel && formik.errors.fuel && (
							<View style={styles.errorContainer}>
								<Image style={[styles.icon, { tintColor: AppColors.error }]} source={Icons.icnError} />
								<AppText
									width={'90%'}
									left={AppMargin._10}
									textColor={AppColors.error}
									fontFamily={Fonts.REGULAR}
									fontSize={FontSize._14}
									label={formik.errors.fuel}
								/>
							</View>
						)}

						{/* <AppTextInput
							placeholder="Fuel Type"
							value={formik.values.fuel}
							onChangeText={formik.handleChange('fuel')}
							showError={formik.touched.fuel && formik.errors.fuel}
						/> */}

						{formik.values.fuel == 'Other' && (
							<AppTextInput
								placeholder="Enter Fuel Type"
								value={otherFuel}
								onChangeText={setOtherFuel}
								showError={formik.touched.fuel && formik.errors.fuel}
							/>
						)}

						{/* Color Input */}
						<AppTextInput
							placeholder={t('carColor')}
							value={formik.values.color}
							onChangeText={formik.handleChange('color')}
							showError={formik.touched.color && formik.errors.color}
						/>

						{/* Mileage Input */}
						{/* <AppTextInput
							placeholder="Mileage"
							value={formik.values.mileage}
							onChangeText={formik.handleChange('mileage')}
							showError={formik.touched.mileage && formik.errors.mileage}
							texInputProps={{
								returnKeyType: 'done',
							}}
						/> */}

						{/* Number of Seats Input */}
						{/* <AppTextInput
							placeholder="Number of Seats"
							value={formik.values.numberOfSeats}
							onChangeText={formik.handleChange('numberOfSeats')}
							showError={formik.touched.numberOfSeats && formik.errors.numberOfSeats}
							texInputProps={{
								keyboardType: 'number-pad',
								returnKeyType: 'done',
							}}
						/> */}

						{/* Vehicle Type Picker */}
						{/* <AppCustomPicker
							marginTop={AppMargin._20}
							selectedItem={selectedCarType}
							setSelectedItem={setSelectedCarType}
							unselectedText={'Vehicle Type'}
							options={car_type_options}
						/> */}

						{/* License Plate Input */}
						<AppTextInput
							marginTop={metrics.verticalScale(20)}
							placeholder={t('licensePlate')}
							value={formik.values.licensePlate}
							onChangeText={formik.handleChange('licensePlate')}
							showError={formik.touched.licensePlate && formik.errors.licensePlate}
						/>

						{/* Image Upload */}
						<Pressable onPress={handleImageUpload} style={[styles.imageContainer]}>
							<View style={styles.imageContent}>
								<AppText
									fontFamily={Fonts.REGULAR}
									fontSize={FontSize._14}
									title={t('carUploadMessage')}
								/>
								<Image
									style={styles.uploadImage}
									source={
										capturedImage?.sourceURL
											? { uri: capturedImage?.sourceURL }
											: imageUri
											? { uri: imageUri }
											: Icons.icnLargePicker
									}
								/>
							</View>
						</Pressable>
					</View>

					{/* Save Button */}
					<AppButton
						onClick={formik.handleSubmit}
						top={metrics.verticalScale(20)}
						textColor={AppColors.textDark}
						fontSize={FontSize._16}
						fontFamily={Fonts.MEDIUM}
						position="end"
						buttonLabel={t('save')}
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
			paddingHorizontal: metrics.horizontalScale(20),
			paddingVertical: metrics.verticalScale(16),
		},
		icon: {
			tintColor: AppColors.secondary,
			height: 20,
			width: 20,
			marginLeft: metrics.horizontalScale(10),
		},
		errorContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: metrics.verticalScale(10),
		},
		imageContainer: {
			borderColor: AppColors.textInputBorderColor,
			borderWidth: 1,
			marginTop: metrics.verticalScale(20),
			padding: metrics.moderateScale(10),
			...borderRadius10,
		},
		imageContent: {
			alignItems: 'center',
			flexDirection: 'row',
			width: '90%',
		},
		uploadImage: {
			// marginHorizontal: AppMargin._20,
			height: metrics.moderateScale(40),
			width: metrics.moderateScale(40),
			borderRadius: 25,
			left: metrics.horizontalScale(10),
		},
	});
};

export default AddCarDetails;
