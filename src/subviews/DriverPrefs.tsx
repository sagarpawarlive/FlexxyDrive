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
import { useDispatch, useSelector } from 'react-redux';
import { updateUserState } from '../store/reducers/userdataSlice';
import { _showToast } from '../services/UIs/ToastConfig';
import { t } from '../i18n';
import metrics from '../constants/metrics';

const { height } = Dimensions.get('window');

const DriverPrefs = ({ isVisible, onClose, title, data }: any) => {
	const { AppColors } = useTheme();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const dispatch = useDispatch();

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
			const response = await apiPost(ENDPOINT.SET_DRIVER_INFO, params);
			if (response?.success) {
				const { data = {} } = response ?? {};

				dispatch(updateUserState({ driverInfo: { ...response?.data } }));
				_showToast('Preferences Updated Successfully', 'success');
			} else {
				_showToast(response?.message, 'error');
			}
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
			<View style={[styles.listItem, { borderColor: AppColors.text }]}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Image
						tintColor={AppColors.text}
						style={{ marginHorizontal: metrics.horizontalScale(30) }}
						source={icon}
					/>
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
		{ label: t('smoking'), key: 'smoking', icon: Icons.icnSmoking },
		{ label: t('pets'), key: 'pets', icon: Icons.icnPets },
		{ label: t('music'), key: 'music', icon: Icons.icnMusic },
	];

	return (
		<Modal
			backdropTransitionInTiming={500}
			backdropTransitionOutTiming={500}
			isVisible={isVisible}
			backdropColor={AppColors.primaryTransparent8}
			onBackdropPress={onClose}
			onBackButtonPress={onClose}
			style={[styles.modal, {}]}
			animationIn="slideInUp"
			animationOut="slideOutDown">
			<View style={[styles.modalContent, { backgroundColor: AppColors.background }]}>
				<View style={styles.header}>
					<TouchableOpacity onPress={onClose} style={styles.closeButton}>
						<Image tintColor={AppColors.text} style={styles.closeIcon} source={Icons.icnClose} />
					</TouchableOpacity>
					<View style={{ flexGrow: 1, alignItems: 'center' }}>
						<AppText fontFamily={Fonts.REGULAR} fontSize={FontSize._20} title={title} />
					</View>
					<View style={{ height: metrics.moderateScale(30), width: metrics.moderateScale(30) }} />
				</View>

				<FlatList
					style={{ marginTop: metrics.verticalScale(20) }}
					scrollEnabled={false}
					data={switchData}
					keyExtractor={item => item.key}
					renderItem={renderItem}
					ItemSeparatorComponent={() => <View style={{ marginTop: metrics.verticalScale(10) }} />}
				/>

				<AppButton
					top={metrics.verticalScale(20)}
					textColor={AppColors.textDark}
					fontSize={FontSize._16}
					fontFamily={Fonts.MEDIUM}
					buttonLabel={t('save')}
					onClick={api_AddDriverInfo}
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
		padding: metrics.moderateScale(15),
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	closeButton: {
		padding: metrics.moderateScale(10),
		borderRadius: 15,
	},
	closeIcon: { height: metrics.moderateScale(30), width: metrics.moderateScale(30) },
	listItem: {
		...borderRadius10,
		borderWidth: 1,
		padding: metrics.moderateScale(10),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

export default DriverPrefs;
