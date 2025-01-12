import React, { useMemo } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Spinner from 'react-native-spinkit';
import { useTheme } from '../theme/ThemeProvider';
import { AppHeight, AppShadow } from '../constants/commonStyle';
import { Theme } from '../types';

interface AppLoaderProps {
	isLoading?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ isLoading }) => {
	const { AppColors, isDarkMode } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	return (
		<Modal transparent={true} visible={isLoading} animationType="fade" onRequestClose={() => {}}>
			<View style={styles.modalContainer}>
				{isLoading && (
					<View style={styles.overlayContainer}>
						<Spinner
							isVisible={isLoading}
							size={AppHeight._60}
							type="ThreeBounce"
							color={AppColors.primary}
						/>
					</View>
				)}
			</View>
		</Modal>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		modalContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: AppColors.primaryTransparent, // Overlay background color
		},
		overlayContainer: {
			// ...AppShadow,
			// padding: 20,
			// backgroundColor: AppColors.white,
			borderRadius: 5,
			alignItems: 'center', // Centers the spinner inside the modal
		},
	});
};

export default AppLoader;
