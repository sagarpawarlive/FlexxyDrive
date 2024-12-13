import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../theme/ThemeProvider';
import { Icons } from '../assets/Icons';
import { Fonts, FontSize } from '../assets/fonts';
import AppText from '../components/AppText';
import { Switch } from 'react-native-switch';
import { AllCenter, AppMargin, borderRadius10 } from '../constants/commonStyle';
import AppButton from '../components/AppButton';
import { apiPost } from '../services/API/apiServices';
import { ENDPOINT } from '../services/API/endpoints';

const { height } = Dimensions.get('window');

const DriverPrefs = ({ isVisible, onClose, title, data }: any) => {
	const { AppColors } = useTheme();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Preferences structure with initial values
	const initialSwitchData = {
		smoking: false,
		pets: false,
		music: false,
	};

	const [switchesState, setSwitchesState] = useState(initialSwitchData);

	// Update state when `data` prop changes (e.g., when modal is opened or data is updated)
	useEffect(() => {
		if (data) {
			setSwitchesState({
				smoking: data?.smoking || false,
				pets: data?.pets || false,
				music: data?.music || false,
			});
		}
	}, [data, isVisible]); // Re-run this effect when `data` or `isVisible` changes

	// Toggle switch handler, now using the preference key directly
	const handleToggleSwitch = useCallback((key: string) => {
		setSwitchesState(prevState => ({
			...prevState,
			[key]: !prevState[key],
		}));
	}, []);

	// API call for saving driver preferences
	const api_AddDriverInfo = async () => {
		const params = {
			preferences: switchesState,
		};

		setIsLoading(true);
		try {
			await apiPost(ENDPOINT.SET_DRIVER_INFO, params);
		} catch (error) {
			console.error('Failed to update driver info:', error);
		} finally {
			setIsLoading(false);
			onClose();
		}
	};

	// Render switch item
	const renderItem = ({ item }) => {
		const { label, key, icon } = item;
		return (
			<View style={[styles.listItem, { borderColor: AppColors.white }]}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Image style={{ marginHorizontal: AppMargin._30 }} source={icon} />
					<AppText fontFamily={Fonts.REGULAR} fontSize={FontSize._16} title={label} />
				</View>
				<Switch
					value={switchesState[key]}
					onValueChange={() => handleToggleSwitch(key)}
					circleSize={20}
					activeText={''}
					inActiveText={''}
					switchLeftPx={2}
					switchRightPx={2}
					backgroundActive={AppColors.primary}
					backgroundInactive={'gray'}
					circleActiveColor={AppColors.secondary}
					circleInActiveColor={AppColors.secondary}
				/>
			</View>
		);
	};

	// Switch data with key for easy state management
	const switchData = [
		{ label: 'Smoking', key: 'smoking', icon: Icons.icnSmoking },
		{ label: 'Pets', key: 'pets', icon: Icons.icnPets },
		{ label: 'Music', key: 'music', icon: Icons.icnMusic },
	];

	return (
		<Modal
			isVisible={isVisible}
			backdropColor={'#2C3E50CC'}
			onBackdropPress={onClose}
			onBackButtonPress={onClose}
			style={styles.modal}
			animationIn="slideInUp"
			animationOut="slideOutDown">
			<View style={[styles.modalContent, { backgroundColor: AppColors.modalBackground }]}>
				<View style={styles.header}>
					<TouchableOpacity onPress={onClose} style={styles.closeButton}>
						<Image style={styles.closeIcon} source={Icons.icnClose} />
					</TouchableOpacity>
					<View style={{ flexGrow: 1, alignItems: 'center' }}>
						<AppText fontFamily={Fonts.REGULAR} fontSize={FontSize._20} title={title} />
					</View>
					<View style={{ height: 30, width: 30 }} />
				</View>

				<FlatList
					style={{ marginTop: 20 }}
					scrollEnabled={false}
					data={switchData}
					keyExtractor={item => item.key}
					renderItem={renderItem}
					ItemSeparatorComponent={() => <View style={{ marginTop: 10 }} />}
				/>

				<AppButton
					top={AppMargin._20}
					textColor={AppColors.textDark}
					fontSize={FontSize._16}
					fontFamily={Fonts.MEDIUM}
					buttonLabel={'Save'}
					onClick={api_AddDriverInfo}
					loading={isLoading} // Optionally add loading state to the button
				/>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
	},
	modalContent: {
		backgroundColor: 'white',
		width: '100%',
		padding: 16,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	closeButton: {
		padding: 8,
		borderRadius: 15,
	},
	closeIcon: { height: 30, width: 30 },
	listItem: {
		...borderRadius10,
		borderWidth: 1,
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

export default DriverPrefs;
