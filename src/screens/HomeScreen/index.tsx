import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Fonts } from '../../assets/fonts';
import AppLoader from '../../components/AppLoader';
import AppText from '../../components/AppText';
import MainContainer from '../../components/MainContainer';
import { AppMargin, AppPadding } from '../../constants/commonStyle';
import { t } from '../../i18n';
import { AppDispatch } from '../../store';
import { useTheme } from '../../theme/ThemeProvider';
import { Theme } from '../../types';

declare function alert(message: string): void;

interface HomeScreenProps {
	navigation: any;
}

const HomeScreen = (props: HomeScreenProps) => {
	const { AppColors, isDarkMode } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const dispatch: AppDispatch = useDispatch();

	const listData = useSelector((state: any) => state.homeScreen);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const commonData = useSelector((state: any) => state.commonData);

	return (
		<MainContainer>
			{isLoading && <AppLoader isLoading={isLoading} />}
			<View style={{ marginHorizontal: 20, flex: 1 }}>
				<AppText
					textColor={AppColors.primary}
					fontFamily={Fonts.BOLD}
					title={`${t('title')} ${listData.userName}`}
				/>

				<View style={{ flex: 1 }}></View>
			</View>
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		renderContainer: {
			padding: 20,
			borderWidth: 1,
			borderColor: AppColors.primaryTransparent,
		},
		flatListContainer: {
			paddingBottom: AppMargin._75,
			paddingTop: AppPadding._20,
		},
	});
};

export default HomeScreen;
