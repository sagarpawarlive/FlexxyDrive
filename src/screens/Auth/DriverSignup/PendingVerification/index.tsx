import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Fonts, FontSize } from '../../../../assets/fonts';
import AppHeader from '../../../../components/AppHeader';
import AppText from '../../../../components/AppText';
import MainContainer from '../../../../components/MainContainer';
import { AppMargin, WindowHeight } from '../../../../constants/commonStyle';
import { t } from '../../../../i18n';
import { useTheme } from '../../../../theme/ThemeProvider';
import { Theme } from '../../../../types';

import StepIndicator from 'react-native-step-indicator';
import { Icons } from '../../../../assets/Icons';

const PendingVerification = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const [currentPosition, setCurrentPosition] = React.useState(3);

	const onBackPress = () => {
		props.navigation.goBack();
	};

	const labels = ['Personal Information', 'Car Details', 'Other Documents', 'Document Verification'];

	const customStyles = {
		// stepIndicatorSize: 25,
		separatorStrokeWidth: 2,
		currentStepStrokeWidth: 3,
		stepStrokeCurrentColor: AppColors.background,
		stepStrokeWidth: 2,
		stepStrokeFinishedColor: AppColors.background,
		stepStrokeUnFinishedColor: '#aaaaaa',
		// separatorFinishedColor: '#fe7013',
		separatorUnFinishedColor: '#aaaaaa',
		stepIndicatorFinishedColor: AppColors.background,
		stepIndicatorUnFinishedColor: AppColors.background,
		stepIndicatorCurrentColor: AppColors.background,
		stepIndicatorLabelFontSize: 13,
		currentStepIndicatorLabelFontSize: 13,
		// stepIndicatorLabelCurrentColor: '#fe7013',
		stepIndicatorLabelFinishedColor: AppColors.text,
		stepIndicatorLabelUnFinishedColor: AppColors.text,
		labelColor: AppColors.text,
		labelSize: 13,
		// currentStepLabelColor: '#fe7013',
	};

	const _onStepPress = (position: number) => {
		setCurrentPosition(position);
	};

	const renderLabel = ({
		position,
		label,
		currentPosition,
	}: {
		position: number;
		stepStatus: string;
		label: string;
		currentPosition: number;
	}) => {
		return <Text style={{ color: AppColors.text }}>{label}</Text>;
	};

	const renderStepIndicator = ({ position, stepStatus }: { position: number; stepStatus: string }) => {
		return (
			<View style={{}}>
				<Image source={currentPosition == position ? Icons.icnPendingVerification : Icons.icnValidated} />
			</View>
		);
	};

	return (
		<MainContainer>
			<View style={styles.innerMainContainer}>
				<AppHeader buttonTitle={''} top={AppMargin._30} onBack={onBackPress} />

				<View style={{ marginTop: AppMargin._30, flex: 1 }}>
					<AppText
						fontFamily={Fonts.BOLD}
						fontSize={FontSize._20}
						textColor={AppColors.text}
						title={t('pendingVerification')}
					/>

					<View style={{ height: WindowHeight / 2 }}>
						<StepIndicator
							stepCount={4}
							direction="vertical"
							customStyles={customStyles}
							currentPosition={currentPosition}
							labels={labels}
							renderLabel={renderLabel}
							renderStepIndicator={renderStepIndicator}
						/>
					</View>
				</View>
			</View>
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		orContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			marginTop: AppMargin._20,
		},
		innerMainContainer: {
			flex: 1,
			backgroundColor: AppColors.background,
			paddingHorizontal: 20,
		},
	});
};

export default PendingVerification;
