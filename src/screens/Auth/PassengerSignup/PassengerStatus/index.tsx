import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Fonts, FontSize } from '../../../../assets/fonts';
import AppHeader from '../../../../components/AppHeader';
import AppText from '../../../../components/AppText';
import MainContainer from '../../../../components/MainContainer';
import { AppMargin, borderRadius10, WindowHeight } from '../../../../constants/commonStyle';
import { t } from '../../../../i18n';
import { useTheme } from '../../../../theme/ThemeProvider';
import { Theme } from '../../../../types';

import StepIndicator from 'react-native-step-indicator';
import { Icons } from '../../../../assets/Icons';
import metrics from '../../../../constants/metrics';

const PassengerStatus = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const [currentPosition, setCurrentPosition] = React.useState(1);

	const onBackPress = () => {
		props.navigation.goBack();
	};

	const labels = ['Personal Information', 'Document Verification'];

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
		labelSize: FontSize._16,
		labelAlign: 'left',
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
		return (
			<View style={{}}>
				<AppText fontSize={FontSize._16} title={label} fontFamily={Fonts.MEDIUM} />
				{
					<AppText
						fontSize={FontSize._12}
						title={currentPosition == position ? 'Pending' : 'Submitted'}
						textColor={currentPosition == position ? AppColors.warning : AppColors.text}
						fontFamily={Fonts.MEDIUM}
					/>
				}
			</View>
		);
	};

	const renderStepIndicator = ({ position, stepStatus }: { position: number; stepStatus: string }) => {
		return (
			<View style={{}}>
				<Image source={currentPosition == position ? Icons.icnPendingVerification : Icons.icnValidated} />
			</View>
		);
	};

	const isVerification = true;
	const verificationMessage = isVerification ? t('accountVerifyShortly') : t('accountVerified');

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

					<View style={{ height: WindowHeight / 3 }}>
						<StepIndicator
							stepCount={2}
							direction="vertical"
							customStyles={customStyles}
							currentPosition={currentPosition}
							labels={labels}
							renderLabel={renderLabel}
							renderStepIndicator={renderStepIndicator}
						/>
					</View>

					<View style={styles.messageContainer}>
						<Image
							style={styles.messageContainerChild}
							tintColor={AppColors.warning}
							source={Icons.icnError}
						/>
						<AppText
							left={AppMargin._5}
							fontFamily={Fonts.REGULAR}
							fontSize={FontSize._12}
							textColor={AppColors.warning}
							title={verificationMessage}
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
		messageContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			padding: AppMargin._20,
			backgroundColor: AppColors.warningTrasparent,
			...borderRadius10,
		},
		messageContainerChild: {
			height: metrics.moderateScale(14),
			width: metrics.moderateScale(14),
		},
	});
};

export default PassengerStatus;
