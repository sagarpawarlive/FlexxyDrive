import React, { useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ButtonEnd, borderRadius10 } from '../constants/commonStyle';
import { useTheme } from '../theme/ThemeProvider';
import AppText from './AppText';
import { FontSize } from '../../android/app/src/main/assets/custom';
import { Theme } from '../types';

interface AppButtonProps {
	buttonLabel?: string;
	textColor?: string;
	top?: number;
	width?: any;
	bottom?: number;
	icon?: any;
	fontFamily?: string;
	onClick?: () => void;
	position?: "end";
}

const AppButton: React.FC<AppButtonProps> = (props: AppButtonProps) => {

	const { AppColors, isDarkMode } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	return (
		<View style={{ ...props.position as any && ButtonEnd }}>
			<TouchableOpacity onPress={props.onClick}
				style={[styles.container, {
					marginBottom: props.bottom,
					marginTop: props.top,
					flexDirection: 'row',
					alignItems: 'center',
					width: props.width
				}]}>
				<AppText
					fontSize={FontSize._14}
					fontFamily={props.fontFamily}
					textColor={AppColors.white}
					label={props.buttonLabel}
				/>
				{props.icon &&
					<Image style={{
						left: 20,
						transform: [{ rotate: '180deg' }]
					}} tintColor={AppColors.background} source={props.icon}
					/>}
			</TouchableOpacity>
		</View >
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			padding: 20,
			backgroundColor: AppColors.primary,
			justifyContent: 'center',
			alignItems: 'center',
			...borderRadius10
		}
	});
};

export default AppButton;