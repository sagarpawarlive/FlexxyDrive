import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, useColorScheme } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDispatch, useSelector } from 'react-redux';
import { Images } from '../../assets/images';
import { NavigationKeys } from '../../constants/navigationKeys';
import { AppDispatch } from '../../store';
import { useTheme } from '../../theme/ThemeProvider';
import { Theme } from '../../types';
import { windowWidth } from '../../constants/metrics';
import { App_Permission } from '../../services/Permissions';

interface SplashScreenProps {
	navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = props => {
	const dispatch: AppDispatch = useDispatch();

	const { AppColors, isDarkMode } = useTheme();
	const colourScheme = useColorScheme();
	const styles = createStyles(AppColors, colourScheme as string);
	const [deviceInfo, setDeviceInfo] = useState({});
	console.log(deviceInfo);

	const userData = useSelector((state: any) => state.userDataSlice);

	console.log('[ / userData ] ------->', userData);
	console.log('[ / colourScheme ] ------->', colourScheme);
	useEffect(() => {
		const unsubscribe = props.navigation.addListener('focus', async () => {
			await App_Permission._askLocationPermission();
			setTimeout(() => {
				switch (true) {
					case userData?.userData && userData?.userData?.data?.token?.length > 0:
						props.navigation.navigate(NavigationKeys.AuthNavigator, {
							screen: NavigationKeys.FinalUser,
						});
						break;
					case !userData?.data?.token:
						props.navigation.navigate(NavigationKeys.AuthNavigator);
						break;
					default:
				}
			}, 4000); //4000 gif duration
		});

		return () => {
			unsubscribe();
		};
	}, [props.navigation, dispatch]);

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
			<View>
				<Image
					resizeMode="contain"
					style={{ width: windowWidth }}
					source={colourScheme === 'dark' ? Images.imgLoader : Images.lightThemeSplash}
				/>
			</View>
		</View>
	);
};

const createStyles = (AppColors: Theme, colourScheme: string) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colourScheme === 'light' ? 'rgba(255,255,255,1)' : 'rgba(8, 0, 24, 1)',
			alignItems: 'center',
			justifyContent: 'center',
		},
	});
};

export default SplashScreen;
