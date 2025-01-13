import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import AppText from './AppText';
import { AppMargin } from '../constants/commonStyle';
import { Fonts, FontSize } from '../assets/fonts';
import { Images } from '../assets/images';
import { Theme } from '../types';
import { useTheme } from '../theme/ThemeProvider';
import AppButton from './AppButton';
import { windowWidth } from '../constants/metrics';

interface AppStatusScreenProps {
	success?: boolean;
	message?: string;
	error?: boolean;
	onPress?: () => void;
	successLabel?: string;
	errorLabel?: string;
}

const AppStatusScreen = React.memo((props: AppStatusScreenProps) => {
	const { AppColors } = useTheme();
	const styles = React.useMemo(() => createStyles(AppColors), [AppColors]);

	const renderImage = () => {
		if (props.success) {
			return <Image style={styles.statusImage} source={Images.imgSuccessResponse} />;
		}
		if (props.error) {
			return <Image style={styles.statusImage} source={Images.imgErrorResponse} />;
		}
		return null;
	};

	return (
		<View style={{ flex: 1, alignItems: 'center' }}>
			<Image style={styles.backgroundImage} resizeMode="contain" source={Images.imgStatusBackground} />
			<View style={styles.container}>
				<View style={styles.content}>
					{renderImage()}
					<AppText
						textColor={props.success ? AppColors.success : AppColors.error}
						top={AppMargin._20}
						fontFamily={Fonts.BOLD}
						fontSize={FontSize._24}
						title={props.message}
					/>
				</View>
				<AppButton
					width={windowWidth - 40}
					textColor={AppColors.white}
					buttonLabel={props.success ? props.successLabel || 'Done' : props.errorLabel || 'Retry'}
					onClick={props.onPress}
				/>
			</View>
		</View>
	);
});

export default AppStatusScreen;

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		backgroundImage: {
			position: 'absolute',
		},
		content: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: 1,
		},
		statusImage: {
			alignSelf: 'center',
		},
	});
};
