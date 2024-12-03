import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Fonts, FontSize } from '../../../assets/fonts';
import AppButton from '../../../components/AppButton';
import AppHeader from '../../../components/AppHeader';
import AppOtpView from '../../../components/AppOtpView';
import AppText from '../../../components/AppText';
import MainContainer from '../../../components/MainContainer';
import { AppMargin } from '../../../constants/commonStyle';
import { NavigationKeys } from '../../../constants/navigationKeys';
import { useTheme } from '../../../theme/ThemeProvider';
import { Theme } from '../../../types';

const OtpScreen = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const [otpValue, setOtpValue] = useState('');
	console.log(otpValue, 'otpValue');

	const onBackPress = () => {
		props.navigation.goBack();
	};

	return (
		<MainContainer>
			<View style={styles.innerMainContainer}>
				<AppHeader tintColor={AppColors.backButton} top={AppMargin._30} onBack={onBackPress} />

				<View style={{ marginTop: AppMargin._100, alignItems: 'center' }}>
					<AppText fontFamily={Fonts.MEDIUM} fontSize={FontSize._20} label={`Enter verification code`} />

					<View style={{ marginTop: AppMargin._20, flexDirection: 'row' }}>
						<AppText fontFamily={Fonts.REGULAR} label={`A code has been sent to `} />
						<AppText fontFamily={Fonts.BOLD} label={`Email Id /Phone Number.`} />
					</View>

					<AppOtpView
						onSubmitPress={() => alert('Entered OTP : ' + JSON.stringify(otpValue))}
						defaultValue={otpValue}
						handleTextChange={val => setOtpValue(val)}
					/>

					<View style={styles.bottomContainer}>
						<AppText fontSize={FontSize._16} fontFamily={Fonts.REGULAR} label={`Don't receive a code?`} />
						<Pressable onPress={() => alert('resent!!')}>
							<AppText
								left={5}
								textColor={AppColors.primary}
								fontSize={FontSize._16}
								fontFamily={Fonts.MEDIUM}
								label={`Resend`}
							/>
						</Pressable>
					</View>
				</View>

				<AppButton
					textColor={AppColors.textDark}
					fontSize={FontSize._16}
					fontFamily={Fonts.MEDIUM}
					position="end"
					buttonLabel={'Verify Now'}
					onClick={() => props.navigation.navigate(NavigationKeys.FinalUser)}
				/>
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
		bottomContainer: {
			justifyContent: 'center',
			marginTop: 20,
			flexDirection: 'row',
		},
	});
};

export default OtpScreen;
