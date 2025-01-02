import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { FontSize } from '../../../../android/app/src/main/assets/custom';
import { Images } from '../../../assets/images';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import MainContainer from '../../../components/MainContainer';
import { AppContainer, AppHeight, AppMargin, AppShadowWhite, WindowWidth } from '../../../constants/commonStyle';
import { NavigationKeys } from '../../../constants/navigationKeys';
import { useTheme } from '../../../theme/ThemeProvider';
import { Theme } from '../../../types';
import { Fonts } from '../../../assets/fonts';
import { App_Permission } from '../../../services/Permissions';

const IntroScreen = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const onPressPermissionButton = async () => {
		try {
			const locationPermission = await App_Permission._askLocationPermission();
			if (locationPermission == true) {
				props.navigation.navigate(NavigationKeys.SigninScreen);
			}
			// Navigate to the next screen or perform additional logic
			// props.navigation.navigate(NavigationKeys.LocationPermission);
		} catch (error) {
			console.error('Permission request failed:', error);
		}
	};

	return (
		<MainContainer>
			<View style={[styles.container, {}]}>
				<View style={styles.imageContainer}>
					<Image resizeMode="contain" source={Images.imgLocationImage} />
				</View>
				<AppText
					fontFamily={Fonts.MEDIUM}
					fontSize={FontSize._20}
					top={AppMargin._50}
					label="Don't worry your data is private"
				/>
				<View style={styles.permissionContainer}>
					<AppButton
						position="end"
						width={WindowWidth / 1.5}
						fontFamily={Fonts.MEDIUM}
						textColor={AppColors.textDark}
						buttonLabel={'ALLOW LOCATION'}
						onClick={() => onPressPermissionButton()}
					/>
				</View>
			</View>
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: AppColors.background,
			alignItems: 'center',
		},
		logoContainer: {
			marginTop: AppMargin._60,
			justifyContent: 'center',
			alignItems: 'center',
		},
		imageContainer: {
			marginTop: AppMargin._100,
			justifyContent: 'center',
			alignItems: 'center',
		},
		bottomContainer: {
			flex: 1,
			marginTop: AppMargin._100,
			borderTopLeftRadius: 30,
			borderTopRightRadius: 30,
			alignItems: 'center',
			...AppShadowWhite,
		},
		welcomeTextContainer: {
			marginTop: AppMargin._30,
			flex: 1,
		},
		permissionContainer: { flex: 1, alignItems: 'center' },
	});
};

export default IntroScreen;
