import React, { ReactNode, useMemo } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Theme } from '../types';

interface MainContainerProps {
	children: ReactNode;
	style?: any; // You can define a more specific style type if needed
}

const MainContainer: React.FC<MainContainerProps> = ({ children, style }) => {

	const { AppColors, isDarkMode } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: AppColors.background }}>
			<View style={[styles.container, style]}>
				{children}
			</View>
		</SafeAreaView>
	)
}

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: AppColors.background
		},
	});
};


export default MainContainer;