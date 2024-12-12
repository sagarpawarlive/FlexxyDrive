import React, { useState } from 'react';
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

const switchData = [
	{ id: 1, icon: Icons.icnSmoking, label: 'Smoking', initialValue: false },
	{ id: 2, icon: Icons.icnPets, label: 'Pets', initialValue: false },
	{ id: 3, icon: Icons.icnMusic, label: 'Music', initialValue: false },
];

const DriverPrefs = ({ isVisible, onClose, title, data }: any) => {
	const { AppColors } = useTheme();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [switchesState, setSwitchesState] = useState(
		switchData.reduce((acc, item) => {
			acc[item.id] = item.initialValue;
			return acc;
		}, {}),
	);

	const handleToggleSwitch = id => {
		setSwitchesState(prevState => ({
			...prevState,
			[id]: !prevState[id],
		}));
	};

	const api_AddDriverInfo = async (values: any) => {
		const params = {
			preferences: {
				smoking: switchesState[1],
				pets: switchesState[2],
				music: switchesState[3],
			},
		};

		setIsLoading(true);
		let res = await apiPost(ENDPOINT.SET_DRIVER_INFO, params);
		setIsLoading(false);
		onClose();
		// props.navigation.navigate(NavigationKeys.OtpScreen);
		// dispatch(setIsLogin(true));
	};

	const renderItem = ({ item }) => (
		<View style={[styles.listItem, { borderColor: AppColors.white }]}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Image style={{ marginHorizontal: AppMargin._30 }} source={item.icon} />
				<AppText fontFamily={Fonts.REGULAR} fontSize={FontSize._16} title={item.label} />
			</View>
			<Switch
				value={switchesState[item.id]}
				onValueChange={() => handleToggleSwitch(item.id)}
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
					keyExtractor={item => item.id.toString()}
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
