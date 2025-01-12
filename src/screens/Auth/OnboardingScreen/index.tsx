import React, { useMemo } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Fonts, FontSize } from '../../../assets/fonts';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import MainContainer from '../../../components/MainContainer';
import { onboardingDummyData } from '../../../constants/constants';
import metrics, { windowWidth } from '../../../constants/metrics';
import { NavigationKeys } from '../../../constants/navigationKeys';
import { t } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeProvider';
import { Theme } from '../../../types';

const OnboardingScreen = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();

	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const onBackPress = () => {
		props.navigation.goBack();
	};

	const alreadyAcc = () => {
		props.navigation.navigate(NavigationKeys.SigninScreen);
	};

	const createAcc = () => {
		props.navigation.navigate(NavigationKeys.SignupScreen);
	};

	const renderFlatListItem = ({ item, index }: any) => {
		return (
			<View style={styles.renderItemContainer}>
				<Image source={item.img} />
				<AppText
					top={metrics.verticalScale(50)}
					fontFamily={Fonts.BOLD}
					fontSize={FontSize._24}
					title={item.title}
					styleProps={{ textAlign: 'center' }}
				/>
			</View>
		);
	};

	return (
		<MainContainer>
			<View style={styles.innerMainContainer}>
				<FlatList
					showsHorizontalScrollIndicator={false}
					horizontal
					pagingEnabled
					data={onboardingDummyData}
					renderItem={renderFlatListItem}
				/>

				<View style={styles.buttonContainer}>
					<AppButton
						textColor={AppColors.textDark}
						fontSize={FontSize._16}
						fontFamily={Fonts.MEDIUM}
						position="end"
						buttonLabel={t('CreateAccount')}
						onClick={createAcc}
					/>
				</View>

				<View>
					<TouchableOpacity onPress={alreadyAcc} style={styles.alreadyAcc}>
						<AppText
							textColor={AppColors.text}
							fontFamily={Fonts.MEDIUM}
							label={t('iAlreadyHaveAnAccount')}
							fontSize={FontSize._16}
							styleProps={{ textAlign: 'center' }}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		innerMainContainer: {
			flex: 1,
			backgroundColor: AppColors.background,
			paddingBottom: metrics.verticalScale(20),
		},
		renderItemContainer: { width: windowWidth, justifyContent: 'center', alignItems: 'center' },
		buttonContainer: { flex: 1, marginHorizontal: metrics.horizontalScale(20) },
		alreadyAcc: { marginVertical: metrics.horizontalScale(20), paddingTop: metrics.verticalScale(20) },
	});
};

export default OnboardingScreen;
