import React, { useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppHeight, AppMargin, ButtonEnd, borderRadius10 } from '../constants/commonStyle';
import { useTheme } from '../theme/ThemeProvider';
import AppText from './AppText';
import { FontSize } from '../../android/app/src/main/assets/custom';
import { Theme } from '../types';
import metrics from '../constants/metrics';
import { Icons } from '../assets/Icons';

interface AppDriverButtonsProps {
	buttonLabel?: string;
	textColor?: string;
	top?: number;
	width?: any;
	bottom?: number;
	icon?: any;
	fontFamily?: string;
	onClick?: () => void;
	onRightClick?: () => void;
	position?: 'end';
	fontSize?: number;
	bgColor?: string;
	borderWidth?: number;
	borderColor?: string;
	iconTint?: any;
	rotate?: any;
	iconNode?: any;
	height?: any;
	styleProps?: any;
	isVerify?: boolean;
}

const AppDriverButtons: React.FC<AppDriverButtonsProps> = (props: AppDriverButtonsProps) => {
	const { AppColors, isDarkMode } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	return (
		<View style={{ ...((props.position as any) && ButtonEnd) }}>
			<TouchableOpacity onPress={props.onClick} style={[styles.container, { ...props.styleProps }]}>
				<AppText
					// top={AppMargin._10}
					fontSize={props.fontSize ?? FontSize._16}
					fontFamily={props.fontFamily}
					textColor={props.textColor ?? AppColors.text}
					label={props.buttonLabel}
				/>
				{props.icon && !props.isVerify && (
					<TouchableOpacity onPress={props.onRightClick}>
						<Image
							resizeMode="contain"
							style={{
								height: props.height ?? 14,
								width: props.width ?? 14,
								// left: 20,
								transform: [{ rotate: props.rotate ?? '180deg' }],
							}}
							tintColor={props.iconTint ?? AppColors.text}
							source={props.icon}
						/>
					</TouchableOpacity>
				)}
				{props.icon && props.isVerify && (
					<TouchableOpacity onPress={props.onRightClick}>
						<Image
							resizeMode="contain"
							style={{
								height: metrics.moderateScale(24),
								width: metrics.moderateScale(24),
							}}
							source={Icons.icnValidated}
						/>
					</TouchableOpacity>
				)}
				{props.iconNode}
			</TouchableOpacity>
		</View>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			flexDirection: 'row',
			// marginHorizontal: 10,
			marginTop: AppMargin._15,
			// backgroundColor: 'red',
			height: AppHeight._50,
			borderBottomWidth: 1,
			borderColor: AppColors.textInputBorderColor,
			alignItems: 'center',
			justifyContent: 'space-between',
			// alignItems: 'center',
			// ...borderRadius10,
		},
	});
};

export default AppDriverButtons;
