import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { hasNotch } from 'react-native-device-info';
import Toast, { ToastConfig as ToastMessageType } from 'react-native-toast-message';
import { useTheme } from '../../theme/ThemeProvider';
import { Theme } from '../../types';

interface ToastConfigParams {
	text1?: string;
	topOffset?: number;
	type?: 'success' | 'warning' | 'error';
}

type ToastView = (params: ToastConfigParams) => React.ReactNode;

export const has_Notch = hasNotch();

const CustomToastView: ToastView = ({ text1, type }) => {
	const { AppColors } = useTheme();
	const styles = React.useMemo(() => createStyles(AppColors), [AppColors]);

	let backgroundColor;

	switch (type) {
		case 'error': backgroundColor = AppColors.error;
			break;
		case 'warning': backgroundColor = AppColors.warning;
			break;
		case 'success': backgroundColor = AppColors.success;
			break;
		default: break;
	}
	return (
		<View style={[styles.mainViewStyle, { backgroundColor }]}>
			{has_Notch && <View style={{ backgroundColor: backgroundColor, height: 40 }} />}
			<View style={styles.subViewStyle}>
				<Text numberOfLines={2} style={styles.textStyle}>
					{text1}
				</Text>
			</View>
		</View>
	);
};

const toastConfig: ToastMessageType = {
	error: (props) => <CustomToastView  {...props} type="error" />,
	success: (props) => <CustomToastView {...props} type="success" />,
	warning: (props) => <CustomToastView {...props} type="warning" />,
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		mainViewStyle: {
			height: 50 + (has_Notch ? 40 : 0),
			width: '100%',
			justifyContent: 'center',
		},
		subViewStyle: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingLeft: 10,
		},
		iconStyle: {
			tintColor: AppColors.white,
		},
		textStyle: {
			color: AppColors.white,
			width: '90%',
			fontSize: 14,
			paddingLeft: 10,
		},
	});
};

export const _showToast = (msg: string, type: string = 'error') => {
	Toast.show({ type, text1: msg, visibilityTime: 2000 })
};

export default toastConfig;