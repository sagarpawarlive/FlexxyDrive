import React from 'react';
import { Image, ImageProps, KeyboardTypeOptions, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { AppHeight, AppMargin, borderRadius10 } from '../constants/commonStyle';
import { Theme } from '../types';
import { Fonts, FontSize } from '../assets/fonts';
import AppText from './AppText';
import { Icons } from '../assets/Icons';

interface AppTextInputProps {
	value?: string;
	placeholder?: string;
	maxLength?: number;
	editable?: boolean;
	inputMode?: KeyboardTypeOptions | undefined;
	icon?: ImageProps;
	iconRight?: ImageProps;
	tint?: string;
	iconRightClick?: () => void;
	secureTextEntry?: boolean;
	onChangeText?: (text: string) => void;
	marginTop?: number; // Allow customizing marginTop
	onBlur?: () => void;
	borderColor?: string;
	showError?: any;
}

const AppTextInput: React.FC<AppTextInputProps> = ({
	value,
	secureTextEntry,
	placeholder,
	maxLength,
	editable = true,
	icon,
	tint,
	iconRight,
	iconRightClick,
	inputMode,
	borderColor,
	onChangeText,
	marginTop = 20, // Default marginTop
	onBlur,
	showError,
}) => {
	const { AppColors, isDarkMode } = useTheme();
	const styles = createStyles(AppColors);

	return (
		<View>
			<View style={[styles.container, { marginTop, borderColor: borderColor ?? AppColors.white }]}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						flex: 1,
					}}>
					{icon && <Image style={styles.icon} source={icon} />}
					<TextInput
						secureTextEntry={secureTextEntry}
						placeholderTextColor={AppColors.placeholder}
						value={value}
						placeholder={placeholder}
						maxLength={maxLength}
						editable={editable}
						keyboardType={inputMode}
						style={[styles.input]}
						onChangeText={onChangeText}
					/>
				</View>
				{iconRight && (
					<Pressable style={{ flex: 0.15 }} onPress={iconRightClick}>
						<Image style={[styles.icon, { tintColor: tint ?? AppColors.secondary }]} source={iconRight} />
					</Pressable>
				)}
			</View>
			{showError && (
				<View style={styles.errorContainer}>
					<Image style={[styles.icon, { tintColor: AppColors.error }]} source={Icons.icnError} />
					<AppText
						width={'90%'}
						left={AppMargin._10}
						textColor={AppColors.error}
						fontFamily={Fonts.REGULAR}
						fontSize={FontSize._14}
						label={showError}
					/>
				</View>
			)}
		</View>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			flexDirection: 'row',
			borderWidth: 1,
			backgroundColor: AppColors.background,
			borderColor: AppColors.white,
			alignItems: 'center',
			justifyContent: 'space-between',
			height: AppHeight._70,
			paddingHorizontal: 10,
			...borderRadius10,
		},

		icon: {
			tintColor: AppColors.secondary,
			height: 20,
			width: 20,
			marginLeft: 10,
		},

		input: {
			flex: 1, // Allow input to take available space
			paddingHorizontal: 10,
			color: AppColors.text,
			fontFamily: Fonts.REGULAR,
			fontSize: FontSize._14,
		},

		errorContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 10,
		},
	});
};

export default AppTextInput;
