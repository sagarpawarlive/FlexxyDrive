import React, { ReactNode, useMemo } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Theme } from '../types';

interface MainContainerProps {
	topColor?: string;
	hideTop?: boolean;

	bottomColor?: string;
	hideBottom?: boolean;

	children: ReactNode;
	style?: any; // You can define a more specific style type if needed
}

const MainContainer: React.FC<MainContainerProps> = ({
	children,
	style,
	hideTop,
	hideBottom,
	topColor,
	bottomColor,
}) => {
	const { AppColors, isDarkMode } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	return (
		<View style={{ flex: 1 }}>
			{!hideTop && <SafeAreaView style={[{ backgroundColor: topColor ?? AppColors.background }]} />}
			{children}
			{!hideBottom && <SafeAreaView style={[{ backgroundColor: bottomColor ?? AppColors.background }]} />}
		</View>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: AppColors.background,
		},
	});
};

export default MainContainer;
