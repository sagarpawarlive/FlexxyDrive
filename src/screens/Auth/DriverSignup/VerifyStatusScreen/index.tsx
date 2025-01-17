import React, { useMemo } from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import AppHeader from '../../../../components/AppHeader';
import MainContainer from '../../../../components/MainContainer';
import { AppMargin } from '../../../../constants/commonStyle';
import { useTheme } from '../../../../theme/ThemeProvider';
import { Theme } from '../../../../types';
import { Images } from '../../../../assets/images';
import AppText from '../../../../components/AppText';
import { Fonts, FontSize } from '../../../../assets/fonts';
import AppStatusScreen from '../../../../components/AppStatusScreen';
import { t } from '../../../../i18n';
import { NavigationKeys } from '../../../../constants/navigationKeys';
import metrics from '../../../../constants/metrics';

const VerifyStatusScreen = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const isSuccess = props?.route?.params?.success;
	const [currentPosition, setCurrentPosition] = React.useState(3);

	const onBackPress = () => {
		props.navigation.goBack();
	};

	return (
		<MainContainer>
			<View style={styles.innerMainContainer}>
				<AppStatusScreen
					message={isSuccess ? t('verifySuccess') : t('verifyFailure')}
					// error={false}
					success={isSuccess}
					onPress={() => {
						props.navigation.navigate(
							isSuccess ? NavigationKeys.PassangerScreen : NavigationKeys.FinalUser,
						);
					}}
					buttonLabel={'Continue'}
				/>
			</View>
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		innerMainContainer: {
			flex: 1,
			backgroundColor: AppColors.background,
			paddingHorizontal: 20,
			alignItems: 'center',
			paddingBottom: metrics.verticalScale(20),
		},
	});
};

export default VerifyStatusScreen;
