import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Image, FlatList, Pressable, Alert } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { Icons } from '../../../../assets/Icons';
import { Fonts, FontSize } from '../../../../assets/fonts';
import { AppMargin, borderRadius10 } from '../../../../constants/commonStyle';
import AppButton from '../../../../components/AppButton';
import AppText from '../../../../components/AppText';
import AppHeader from '../../../../components/AppHeader';
import ImagePicker from 'react-native-image-crop-picker';
import { s3Upload } from '../../../../utils/awsUpload';
import { apiPost } from '../../../../services/API/apiServices';
import { ENDPOINT } from '../../../../services/API/endpoints';
import AppLoader from '../../../../components/AppLoader';
import MainContainer from '../../../../components/MainContainer';
import { _showToast } from '../../../../services/UIs/ToastConfig';
import { generateUniqueFileName, isIOS } from '../../../../constants/constants';
import RNFS from 'react-native-fs';
import { App_Permission } from '../../../../services/Permissions';

const { height } = Dimensions.get('window');

const AddDocumentsOptions = [
	{ id: 1, icon: Icons.icnLargePicker, name: 'Driving License', description: 'An official document' },
	{ id: 2, icon: Icons.icnCamera, name: 'Upload Photo', description: 'Capture a selfie' },
];

const AddDocuments = props => {
	const { AppColors } = useTheme();
	const { documents, isVerified } = props?.route?.params?.driverDocuments ?? null;

	// State to handle selected driving license and captured image
	const [selectedDrivingLicence, setSelectedDrivingLicence] = useState(
		{ path: documents?.drivingLicense, isFile: false } ?? null,
	);
	const [capturedImage, setCapturedImage] = useState({ path: documents?.driverImage, isFile: false } ?? null);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onclose = async () => {
		props.navigation.goBack();
	};

	// Render the list items
	const renderItem = ({ item }) => (
		<Pressable
			onPress={() => {
				if (!isVerified) {
					if (item.id === 2) openImagePicker('camera'); // Open camera for selfie
					else openImagePicker('gallery'); // Open gallery for document
				}
			}}
			style={[
				styles.listItem,
				{
					borderColor: AppColors.white,
					padding: 20,
					borderWidth: 1,
					justifyContent: 'space-between',
					width: '100%',
				},
			]}>
			<View style={{ ...borderRadius10 }}>
				<AppText fontFamily={Fonts.REGULAR} fontSize={FontSize._16} title={item.name} />
				<AppText fontFamily={Fonts.REGULAR} fontSize={FontSize._12} title={item.description} />
			</View>

			<Image style={{}} tintColor={item.id === 2 ? AppColors.success : null} source={item.icon} />
		</Pressable>
	);

	// Open image picker (camera or gallery)
	const openImagePicker = useCallback(async (type: 'camera' | 'gallery') => {
		try {
			const image =
				type == 'camera'
					? // await ImageCropPicker.openCamera({
					  // 		width: 800,
					  // 		height: 800,
					  // 		compressImageMaxWidth: 800,
					  // 		compressImageMaxHeight: 800,
					  // 		compressImageQuality: 0.7,
					  // 		includeBase64: true,
					  //   })
					  await selectAndCompressImage()
					: await selectAndCompressImage();

			// Set the selected file to the respective state
			if (type == 'camera') {
				setCapturedImage({ ...image, isFile: true }); // Set selfie image
			} else {
				setSelectedDrivingLicence({ ...image, isFile: true }); // Set driving license image
			}
		} catch (error) {
			console.error('Error picking image:', error);
		}
	}, []);

	const selectAndCompressImage = async () => {
		const photoPermission = (await App_Permission._askPhotoPermission()) ?? false;
		if (photoPermission) {
			try {
				const image = await ImagePicker.openPicker({}).then(data => {
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
				(await isIOS) ? image : dict;
				console.log('[ / dict ] ------->', dict);
				return isIOS ? image : dict;
			} catch (error) {
				console.log('Error selecting or compressing image:', error);
			}
		}
	};

	// Handle save (upload files)
	const handleSave = async () => {
		setIsLoading(true);
		try {
			let updateDocuments = documents;

			if (selectedDrivingLicence && selectedDrivingLicence.isFile) {
				const license = await s3Upload(selectedDrivingLicence);
				updateDocuments = {
					...updateDocuments,
					drivingLicense: license,
				};

				console.log('Driving License uploaded:', license);
			}

			if (capturedImage && capturedImage.isFile) {
				const selfie = await s3Upload(capturedImage);
				updateDocuments = {
					...updateDocuments,
					driverImage: selfie,
				};

				console.log('Captured Image uploaded:', selfie);
			}
			const params = {
				documents: updateDocuments,
			};
			// API call to save driver information with the uploaded file links
			await apiPost(ENDPOINT.SET_DRIVER_INFO, params).then(res => {
				setIsLoading(false);
				if (res?.success) {
					onclose();
					_showToast('Driver Documents added successfully', 'success');
				}
			});
		} catch (error) {
			_showToast('Error uploading files:', 'error');
			setIsLoading(false);
		}
	};

	return (
		<MainContainer>
			<View style={[styles.container, { backgroundColor: AppColors.background }]}>
				<AppHeader buttonTitle={'Add Documents'} tintColor={AppColors.backButton} onBack={() => onclose()} />

				{/* List Section */}
				<FlatList
					style={{ marginTop: 20 }}
					scrollEnabled={false}
					data={AddDocumentsOptions}
					keyExtractor={item => item.id.toString()}
					renderItem={renderItem}
					ItemSeparatorComponent={() => <View style={[styles.separator, {}]} />}
				/>

				{/* Display Selected Files */}
				<View style={styles.selectedFilesContainer}>
					{selectedDrivingLicence && (
						<View style={styles.selectedFileItem}>
							<AppText fontFamily={Fonts.REGULAR} fontSize={FontSize._14} title={' Driving License'} />
							<Image source={{ uri: selectedDrivingLicence?.path }} style={styles.selectedFileImage} />
						</View>
					)}

					{capturedImage && (
						<View style={styles.selectedFileItem}>
							<AppText fontFamily={Fonts.REGULAR} fontSize={FontSize._14} title={'Selfie Image'} />
							<Image source={{ uri: capturedImage?.path }} style={styles.selectedFileImage} />
						</View>
					)}
				</View>

				{isVerified && (
					<AppText
						textColor={'#90EE90'}
						fontFamily={Fonts.REGULAR}
						fontSize={FontSize._14}
						title={'Documents are verified'}
					/>
				)}
				{/* Save Button */}
				{!isVerified && (
					<AppButton
						top={AppMargin._20}
						textColor={AppColors.textDark}
						fontSize={FontSize._16}
						fontFamily={Fonts.MEDIUM}
						buttonLabel={'Save'}
						onClick={handleSave}
					/>
				)}
				<AppLoader isLoading={isLoading} />
			</View>
		</MainContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	listItem: {
		...borderRadius10,
		flexDirection: 'row',
		alignItems: 'center',
	},
	separator: {
		marginVertical: 10,
		height: 1,
		marginHorizontal: 20,
	},
	selectedFilesContainer: {
		marginTop: 20,
	},
	selectedFileItem: {
		marginBottom: 10,
	},
	selectedFileImage: {
		width: 100,
		height: 100,
		marginTop: 5,
		borderRadius: 8,
	},
});

export default AddDocuments;
