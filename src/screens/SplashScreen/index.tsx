import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, useAppColorscheme, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Images } from '../../assets/images';
import { AppDispatch } from '../../store';
import { useTheme } from '../../theme/ThemeProvider';
import { Theme } from '../../types';
import DeviceInfo from 'react-native-device-info';

interface SplashScreenProps {
	navigation: any
}

const SplashScreen: React.FC<SplashScreenProps> = (props) => {

	const dispatch: AppDispatch = useDispatch();
	const isLogin = useSelector((state: any) => state.commonData.isLogin)
	const { AppColors, isDarkMode } = useTheme();
	const colourScheme = useColorScheme()
	const styles = createStyles(AppColors, colourScheme as string);
	const [deviceInfo, setDeviceInfo] = useState({});
	console.log(deviceInfo);

	useEffect(() => {
		const unsubscribe = props.navigation.addListener('focus', () => {
			setTimeout(() => {
				switch (isLogin) {
					case true:
						props.navigation.navigate('BottomTab');
						break;
					case false:
						props.navigation.navigate('AuthNavigator');
						break;
					default:
				}
			}, 2000);
		});

		return () => {
			unsubscribe();
		};
	}, [isLogin, props.navigation, dispatch]);

	useEffect(() => {
		const fetchDeviceInfo = async () => {
			const info = {
				deviceName: await DeviceInfo.getDeviceName(),
				systemName: await DeviceInfo.getSystemName(),
				systemVersion: await DeviceInfo.getSystemVersion(),
				brand: await DeviceInfo.getBrand(),
				model: await DeviceInfo.getModel(),
				uniqueId: await DeviceInfo.getUniqueId(),
			};
			setDeviceInfo(info);
		};
		fetchDeviceInfo();
	}, []);

	return (
		<View style={styles.container}>
			<Image source={Images.imgSplash} />
		</View>
	);
};

const createStyles = (AppColors: Theme, colourScheme: string) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colourScheme == 'dark' ? 'black' : AppColors.white,
			alignItems: 'center',
			justifyContent: 'center',
		}
	})
};

export default SplashScreen;