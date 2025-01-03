import React, { forwardRef } from 'react';
import {
	Image,
	ImageProps,
	KeyboardTypeOptions,
	Pressable,
	StyleSheet,
	TextInput,
	TextInputProps,
	TouchableOpacity,
	View,
} from 'react-native';
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
	onBlur?: (event: any) => void;
	borderColor?: string;
	showError?: any;
	borderWidth?: number;
	borderBottomWidth?: number;
	height?: number;
	backgroundColor?: string;
	leftNode?: React.ReactNode;
	rightNode?: React.ReactNode;
	autoCaps?: 'none' | 'sentences' | 'words' | 'characters' | boolean;
	texInputProps?: TextInputProps;
	returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
	returnKeyLabel?: string;
	onSubmitEditing?: () => void;
	wholePress?: () => void;
	marginHorizontal?: number;
}

const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
	(
		{
			value,
			onSubmitEditing,
			secureTextEntry,
			placeholder,
			maxLength,
			editable = true,
			icon,
			tint,
			iconRight,
			iconRightClick = () => {},
			inputMode,
			borderColor,
			onChangeText,
			marginTop = 20, // Default marginTop
			onBlur,
			showError,
			borderWidth,
			borderBottomWidth,
			height,
			backgroundColor,
			leftNode,
			rightNode,
			texInputProps,
			autoCaps,
			returnKeyType,
			returnKeyLabel,
			wholePress,
			marginHorizontal,
		},
		ref,
	) => {
		const { AppColors, isDarkMode } = useTheme();
		const styles = createStyles(AppColors);

		return (
			<View>
				<TouchableOpacity disabled={!wholePress} onPress={wholePress}>
					<View
						style={[
							styles.container,
							{
								height: height ?? AppHeight._70,
								marginTop,
								borderColor: borderColor ?? AppColors.white,
								borderWidth: borderBottomWidth ? 0 : 1,
								borderBottomWidth: borderWidth ? 0 : 1,
								paddingHorizontal: borderBottomWidth ? 0 : 10,
								backgroundColor: backgroundColor ?? AppColors.background,
								marginHorizontal: marginHorizontal,
							},
						]}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								flex: 1,
							}}>
							{icon && <Image style={styles.icon} source={icon} />}
							{leftNode}
							<TextInput
								ref={ref}
								secureTextEntry={secureTextEntry}
								placeholderTextColor={AppColors.placeholder}
								value={value}
								placeholder={placeholder}
								maxLength={maxLength}
								editable={editable}
								keyboardType={inputMode}
								style={[styles.input]}
								onChangeText={onChangeText}
								autoCapitalize={autoCaps}
								returnKeyLabel={returnKeyLabel}
								returnKeyType={returnKeyType}
								{...texInputProps}
								onBlur={onBlur}
								onSubmitEditing={onSubmitEditing}
							/>
							{rightNode}
						</View>
						{iconRight && (
							<Pressable style={{ flex: 0.15 }} onPress={iconRightClick}>
								<Image
									style={[styles.icon, { tintColor: tint ?? AppColors.secondary }]}
									source={iconRight}
								/>
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
				</TouchableOpacity>
			</View>
		);
	},
);

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			flexDirection: 'row',
			borderColor: AppColors.white,
			alignItems: 'center',
			justifyContent: 'space-between',
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
