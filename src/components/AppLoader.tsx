import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Spinner from 'react-native-spinkit';
import { useTheme } from '../theme/ThemeProvider';
import { AppShadow } from '../constants/commonStyle';
import { Theme } from '../types';

interface AppLoaderProps {
	isLoading?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ isLoading }) => {

	const { AppColors, isDarkMode } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	return (
		<View style={styles.container}>
			{isLoading && (
				<View style={styles.overlayContainer}>
					<Spinner
						isVisible={isLoading}
						size={24} type={'Wave'}
						color={AppColors.primary}
					/>
				</View>
			)}
		</View>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			zIndex: 9999,
			pointerEvents: 'none', // remove this line if you want to disable loader touch through.
			position: 'absolute',
			top: 0, bottom: 0,
			left: 0, right: 0,
			justifyContent: 'center',
			alignItems: 'center'
		},
		overlayContainer: {
			...AppShadow,
			padding: 15,
			backgroundColor: AppColors.white,
			borderRadius: 5
		}
	});
};

export default AppLoader;
