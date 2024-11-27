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

const IntroScreen = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	return (
		<MainContainer>
			<View style={[styles.container, { backgroundColor: AppColors.background }]}>
				<View style={styles.logoContainer}>
					<AppText fontSize={FontSize._40} fontFamily={Fonts.BOLD} title={'LOGO'} />
				</View>

				<View style={styles.imageContainer}>
					<Image resizeMode="contain" source={Images.imgIntroLocation} />
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
						onClick={() => props.navigation.navigate(NavigationKeys.LocationPermission)}
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
