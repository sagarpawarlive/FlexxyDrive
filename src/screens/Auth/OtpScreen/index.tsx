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
import AppLoader from '../../../components/AppLoader';
import { APIMethods } from '../../../services/API/methods';
import { ENDPOINT } from '../../../services/API/endpoints';
import { _showToast } from '../../../services/UIs/ToastConfig';
import { setUserData } from '../../../store/reducers/userdataSlice';

const OtpScreen = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const otpNumber = props?.route?.params?.phone;
	const newUser = props?.route?.params?.newUser;
	console.log('[ / { newUser }] ------->', newUser);
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const [otpValue, setOtpValue] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [enableResend, setEnableResend] = useState(true);

	const onBackPress = () => {
		props.navigation.goBack();
	};

	const api_verifyOtp = async () => {
		let params = {
			identifier: otpNumber,
			otp: otpValue,
		};

		setIsLoading(true);
		const response: any = await APIMethods.post(ENDPOINT.VERIFY_OTP, params);
		if (response.statusCode == 200) {
			props.navigation.navigate(NavigationKeys.FinalUser);
			dispatch(setUserData(newUser));
		} else {
			_showToast(response?.message, 'error');
		}
		setIsLoading(false);
	};

	const resentOtp = async () => {
		if (enableResend) {
			setEnableResend(false);
			const responseOtp: any = await APIMethods.post(
				ENDPOINT.SEND_SMS_OTP,
				{
					phoneNumber: otpNumber,
				},
				[],
			);

			if (responseOtp?.message) {
				_showToast(responseOtp.message, 'info');
			}

			setTimeout(() => {
				setEnableResend(true);
			}, 15000);
		}
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
						onSubmitPress={api_verifyOtp}
						defaultValue={otpValue}
						handleTextChange={val => setOtpValue(val)}
					/>

					<View style={styles.bottomContainer}>
						<AppText fontSize={FontSize._16} fontFamily={Fonts.REGULAR} label={`Don't receive a code?`} />
						<Pressable onPress={resentOtp}>
							<AppText
								left={5}
								textColor={enableResend ? AppColors.primary : 'gray'}
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
					onClick={api_verifyOtp}
				/>
			</View>

			<AppLoader isLoading={isLoading} />
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
