import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Images } from '../../../assets/images';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import MainContainer from '../../../components/MainContainer';
import { AppContainer, AppHeight, AppMargin, AppShadowWhite, WindowWidth } from '../../../constants/commonStyle';
import { NavigationKeys } from '../../../constants/navigationKeys';
import { useTheme } from '../../../theme/ThemeProvider';
import { Theme } from '../../../types';
import { Fonts, FontSize } from '../../../assets/fonts';
import { App_Permission } from '../../../services/Permissions';

const IntroScreen = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const checkPermission = async () => {
		try {
			const locationPermission = await App_Permission._askLocationPermission();
			if (locationPermission == true) {
				props.navigation.navigate(NavigationKeys.SigninScreen);
			} else {
				props.navigation.navigate(NavigationKeys.LocationPermission);
			}
		} catch (error) {
			console.error('Permission request failed:', error);
		}
	};

	return (
		<MainContainer>
			<View style={[styles.container, { backgroundColor: AppColors.background }]}>
				<View style={styles.logoContainer} />

				<View style={styles.imageContainer}>
					<Image resizeMode="contain" source={Images.imgSplash} />
				</View>

				<View style={[styles.bottomContainer, { backgroundColor: AppColors.background }]}>
					<View style={styles.welcomeTextContainer}>
						<AppText fontFamily={Fonts.BOLD} fontSize={FontSize._24} title="Welcome to FlexxyDrive" />
					</View>

					<AppButton
						width={WindowWidth / 1.5}
						fontFamily={Fonts.MEDIUM}
						textColor={AppColors.textDark}
						buttonLabel={'CONTINUE'}
						onClick={checkPermission}
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
		},
		logoContainer: {
			marginTop: AppMargin._60,
			justifyContent: 'center',
			alignItems: 'center',
		},
		imageContainer: {
			height: AppHeight._250,
			marginTop: AppMargin._90,
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
	});
};

export default IntroScreen;
