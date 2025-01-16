import React, { Fragment } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Theme } from '../types';

interface AppTextProps {
	title?: string;
	label?: any;
	textColor?: string;
	left?: number;
	top?: number;
	bottom?: number;
	fontFamily?: string;
	spacing?: number;
	fontSize?: number;
	numberOfLines?: number;
	align?: 'auto' | 'flex-start' | 'flex-end' | 'center';
	textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
	width?: any;
	styleProps?: any;
	underLine?: boolean;
}

const AppText: React.FC<AppTextProps> = props => {
	const { AppColors, isDarkMode } = useTheme();
	const styles = createStyles(AppColors, props);

	return (
		<Fragment>
			{props.title && <Text style={[styles.titleText, props.styleProps]}>{props.title}</Text>}

			{props.label && (
				<Text numberOfLines={props.numberOfLines} style={[styles.labelText, props.styleProps]}>
					{props.label}
				</Text>
			)}
		</Fragment>
	);
};

const createStyles = (AppColors: Theme, props: AppTextProps) => {
	const { textColor, bottom, fontFamily, fontSize, left, top, align, spacing, width } = props;

	return StyleSheet.create({
		titleText: {
			color: textColor || AppColors.text,
			includeFontPadding: false,
			marginTop: top,
			marginBottom: bottom,
			fontFamily: fontFamily ?? '',
			fontSize: fontSize ?? 22,
			textAlign: props.textAlign,
			textDecorationLine: props.underLine ? 'underline' : 'none',
			marginLeft: left ? left : null,
		},

		labelText: {
			width: width ?? null,
			includeFontPadding: false,
			marginLeft: left ? left : null,
			marginTop: top ? top : null,
			color: textColor || AppColors.text,
			alignSelf: align,
			textAlign: props.textAlign,
			fontSize: fontSize ?? 12,
			fontFamily: fontFamily ?? '',
			letterSpacing: spacing,
			textDecorationLine: props.underLine ? 'underline' : 'none',
		},
	});
};

export default AppText;
