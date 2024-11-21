import React, { useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Icons } from '../assets/Icons';
import { useTheme } from '../theme/ThemeProvider';
import { Theme } from '../types';

interface AppCheckBoxProps {
	isChecked?: boolean;
	onCheckBoxPress?: (isChecked: boolean) => void;
}

const AppCheckBox: React.FC<AppCheckBoxProps> = ({ isChecked, onCheckBoxPress }) => {

	const { AppColors, isDarkMode } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const handlePress = () => {
		if (onCheckBoxPress) {
			onCheckBoxPress(!isChecked);
		}
	};

	return (
		<TouchableOpacity onPress={handlePress} style={styles.container}>
			<Image
				tintColor={AppColors.primary}
				source={isChecked
					? Icons.icnCheckbox
					: Icons.icnCheckboxEmpty}
			/>
		</TouchableOpacity>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignItems: 'center',
		},
	});
};

export default AppCheckBox;