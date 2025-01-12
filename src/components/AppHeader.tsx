import * as React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icons } from '../assets/Icons';
import { Fonts, FontSize } from '../assets/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { Theme } from '../types';

interface AppHeaderProps {
	buttonTitle?: string;
	onBack?: () => void;
	tintColor?: string;
	rightIcon?: ImageSourcePropType;
	top?: number;
}

const AppHeader = (props: AppHeaderProps) => {
	const { AppColors, isDarkMode } = useTheme();
	const styles = React.useMemo(() => createStyles(AppColors), [AppColors]);

	return (
		<View style={[styles.container, { marginTop: props.top ?? 0, justifyContent: 'space-between' }]}>
			<TouchableOpacity onPress={props.onBack} style={styles.container}>
				<Image
					style={{ tintColor: props.tintColor ?? AppColors.text }}
					resizeMode="contain"
					source={Icons.icnBack}
				/>
			</TouchableOpacity>
			<Text style={[styles.buttonTitle, { color: props.tintColor ?? AppColors.text }]}>{props.buttonTitle}</Text>
			<View style={styles.container} />
			{props.rightIcon && (
				<TouchableOpacity onPress={props.onBack} style={styles.container}>
					<Image
						style={{ tintColor: props.tintColor ? props.tintColor : AppColors.backButton }}
						resizeMode="contain"
						source={props.rightIcon}
					/>
				</TouchableOpacity>
			)}
		</View>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		buttonTitle: {
			includeFontPadding: false,
			color: AppColors.backButton,
			marginLeft: -4,
			fontSize: FontSize._20,
			fontFamily: Fonts.BOLD,
		},
	});
};

export default AppHeader;
