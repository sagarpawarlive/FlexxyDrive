import React from 'react';
import { Image, ImageProps, KeyboardTypeOptions, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { borderRadius10 } from '../constants/commonStyle';
import { Theme } from '../types';

interface AppTextInputProps {
	value?: string;
	placeholder?: string;
	maxLength?: number;
	editable?: boolean;
	inputMode?: KeyboardTypeOptions | undefined;
	icon?: ImageProps;
	secureTextEntry?: boolean;
	onChangeText?: (text: string) => void;
	marginTop?: number; // Allow customizing marginTop
}

const AppTextInput: React.FC<AppTextInputProps> = ({
	value,
	secureTextEntry,
	placeholder,
	maxLength,
	editable = true,
	icon,
	inputMode,
	onChangeText,
	marginTop = 20, // Default marginTop
}) => {
	const { AppColors, isDarkMode } = useTheme();
	const styles = createStyles(AppColors);

	return (
		<View style={[styles.container, { marginTop }]}>
			{icon && <Image style={styles.icon} source={icon} />}
			<TextInput
				secureTextEntry={secureTextEntry}
				placeholderTextColor={AppColors.secondary}
				value={value}
				placeholder={placeholder}
				maxLength={maxLength}
				editable={editable}
				keyboardType={inputMode}
				style={styles.input}
				onChangeText={onChangeText}
			/>
		</View>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			flexDirection: 'row',
			borderWidth: 1,
			borderColor: AppColors.primary,
			backgroundColor: AppColors.background,
			alignItems: 'center',
			// padding: 15,
			paddingHorizontal: 10,
			...borderRadius10,
		},

		icon: {
			tintColor: AppColors.primary,
			height: 24,
			width: 24,
			marginRight: 10,
		},

		input: {
			flex: 1,
			color: AppColors.primary,
		},
	});
};

export default AppTextInput;
