import React, { Fragment } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Theme } from '../types';

interface AppTextProps {
	title?: string;
	label?: string;
	textColor?: string;
	left?: number;
	top?: number;
	bottom?: number;
	fontFamily?: string;
	spacing?: number;
	fontSize?: number;
	numberOfLines?: number;
	align?: 'auto' | 'flex-start' | 'flex-end' | 'center';
}

const AppText: React.FC<AppTextProps> = (props) => {

	const { AppColors, isDarkMode } = useTheme();
	const styles = createStyles(AppColors, props);

	return (
		<Fragment>
			{props.title && (
				<Text style={styles.titleText}>
					{props.title}
				</Text>
			)}

			{props.label && (
				<Text numberOfLines={props.numberOfLines}
					style={styles.labelText}>
					{props.label}
				</Text>
			)}
		</Fragment>
	);
};

const createStyles = (AppColors: Theme, props: AppTextProps) => {

	const { textColor, bottom, fontFamily, fontSize, left, top, align, spacing } = props;

	return StyleSheet.create({
		titleText: {
			color: textColor || AppColors.text,
			includeFontPadding: false,
			marginTop: top,
			marginBottom: bottom,
			fontFamily: fontFamily ?? '',
			fontSize: fontSize ?? 22,
		},

		labelText: {
			includeFontPadding: false,
			marginLeft: left ? left : null,
			marginTop: top ? top : null,
			color: textColor || AppColors.text,
			alignSelf: align,
			fontSize: fontSize ?? 12,
			fontFamily: fontFamily ?? '',
			letterSpacing: spacing,
		},
	})
}

export default AppText;