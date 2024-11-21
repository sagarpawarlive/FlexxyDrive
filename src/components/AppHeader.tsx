import * as React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icons } from '../assets/Icons';
import { Fonts } from '../assets/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { Theme } from '../types';

interface AppHeaderProps {
	buttonTitle?: string;
	onBack?: () => void;
	tintColor?: string;
	rightIcon?: ImageSourcePropType;
}

const AppHeader = (props: AppHeaderProps) => {

	const { AppColors, isDarkMode } = useTheme();
	const styles = React.useMemo(() => createStyles(AppColors), [AppColors]);

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={props.onBack} style={styles.container}>
				<Image style={{ tintColor: props.tintColor ?? AppColors.backButton }} resizeMode='contain' source={Icons.icnBack} />
				<Text style={styles.buttonTitle}>{props.buttonTitle}</Text>
			</TouchableOpacity>
			<View style={{ flexGrow: 1 }} />
			{props.rightIcon &&
				<TouchableOpacity onPress={props.onBack} style={styles.container}>
					<Image style={{ tintColor: props.tintColor ? props.tintColor : AppColors.backButton }} resizeMode='contain'
						source={props.rightIcon} />
				</TouchableOpacity>}
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
			marginLeft: 20,
			fontSize: 16,
			fontFamily: Fonts.REGULAR
		}
	});
};

export default AppHeader;