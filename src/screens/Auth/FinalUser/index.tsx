import { uploadData } from 'aws-amplify/storage';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Keyboard, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { FontSize, Fonts } from '../../../assets/fonts';
import { Icons } from '../../../assets/Icons';
import AppButton from '../../../components/AppButton';
import AppScrollView from '../../../components/AppScrollView';
import AppText from '../../../components/AppText';
import MainContainer from '../../../components/MainContainer';
import { AppContainer, AppHeight, AppMargin } from '../../../constants/commonStyle';
import { NavigationKeys } from '../../../constants/navigationKeys';
import { ENDPOINT } from '../../../services/API/endpoints';
import { _showToast } from '../../../services/UIs/ToastConfig';
import { useTheme } from '../../../theme/ThemeProvider';
import { Theme } from '../../../types';
import { logout, updateUserState } from '../../../store/reducers/userdataSlice';
import { Images } from '../../../assets/images';
import { nativeAlertwithAction } from '../../../constants/constants';
import metrics from '../../../constants/metrics';
import { t } from '../../../i18n';
import { apiGet } from '../../../services/API/apiServices';
import AppLoader from '../../../components/AppLoader';

const FinalUser = (props: any) => {
	const dispatch = useDispatch();
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const userDataSlice = useSelector(state => state?.userDataSlice ?? {});
	const { userData } = userDataSlice ?? {};
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { driverInfo = {}, passengerInfo = {} } = userData?.data?.user ?? {};
	const { isVerified } = driverInfo ?? {};

	const handleLogout = () => {
		dispatch(logout());
		props.navigation.navigate(NavigationKeys.SigninScreen);
	};

	const onPressLogout = () => {
		nativeAlertwithAction(t('logout'), t('logoutConfirm'), status => {
			if (status) {
				handleLogout();
			}
		});
	};

	const api_getDriverInfo = async () => {
		const params = { token: userData?.data?.token };
		setIsLoading(true);
		const response = await apiGet(ENDPOINT.GET_PROFILE_INFO, '', params);
		if (response?.success) {
			dispatch(updateUserState({ ...response?.data }));
			setIsLoading(false);
		} else {
			setIsLoading(false);
			_showToast(response.message, 'error');
		}
	};

	useEffect(() => {
		api_getDriverInfo();
	}, [props.navigation]);

	// onClick={() => {
	// 	props.navigation.navigate(NavigationKeys.AuthNavigator, {
	// 		screen: NavigationKeys.DriverInformation,
	// 	});
	// }}

	const onPressOffer = () => {
		if (isVerified) {
			props.navigation.navigate(NavigationKeys.PassangerScreen);
		} else {
			props.navigation.navigate(NavigationKeys.AuthNavigator, {
				screen: NavigationKeys.DriverInformation,
				params: {
					type: 1, // Add the type parameter
				},
			});
		}
	};

	const onPressBook = () => {
		if (passengerInfo?.isVerified) {
			props.navigation.navigate(NavigationKeys.PassangerScreen);
		} else {
			props.navigation.navigate(NavigationKeys.AuthNavigator, {
				screen: NavigationKeys.DriverInformation,
				params: {
					type: 2, // Add the type parameter
				},
			});
		}
	};

	return (
		<MainContainer>
			<View style={styles.primaryContainer}>
				<AppScrollView bounces={false} extraHeight={metrics.verticalScale(250)}>
					<View style={[AppContainer]}>
						<View style={[styles.logoContainer]}>
							<AppText
								fontSize={FontSize._36}
								fontFamily={Fonts.MEDIUM}
								title={t('welcomeToFlexxyDrive')}
							/>

							<View style={styles.buttonsMainContainer}>
								<Pressable onPress={onPressBook} style={styles.buttonsContainer}>
									<Image source={Images.imgBookride1} />
									<AppText
										fontSize={FontSize._14}
										fontFamily={Fonts.BOLD}
										textColor={AppColors.text}
										top={metrics.verticalScale(10)}
										title={t('bookRide')}
									/>
								</Pressable>

								<Pressable
									onPress={onPressOffer}
									style={[styles.buttonsContainer, { marginLeft: metrics.horizontalScale(20) }]}>
									<Image source={Images.imgBookride2} />
									<AppText
										fontSize={FontSize._14}
										fontFamily={Fonts.BOLD}
										textColor={AppColors.text}
										top={metrics.verticalScale(10)}
										title={t('offerRide')}
									/>
								</Pressable>
							</View>
						</View>
					</View>

					<TouchableOpacity onPress={onPressLogout} style={styles.logoutButton}>
						<AppText
							fontSize={FontSize._14}
							fontFamily={Fonts.BOLD}
							textColor={AppColors.text}
							title={t('logout')}
						/>
					</TouchableOpacity>
				</AppScrollView>
			</View>
			<AppLoader isLoading={isLoading} />
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		logoContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		primaryContainer: { flex: 1, backgroundColor: AppColors.background },
		imageContainer: {
			justifyContent: 'center',
			alignItems: 'center',
		},
		logoutButton: {
			// flex: 1,
			// backgroundColor: 'red',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			padding: 10,
			alignSelf: 'center',
			marginVertical: 20,
		},
		buttonsContainer: {
			padding: metrics.horizontalScale(30),
			borderRadius: 10,
			borderWidth: 1,
			borderColor: AppColors.textInputBorderColor,
			justifyContent: 'center',
			alignItems: 'center',
		},
		buttonsMainContainer: {
			flexDirection: 'row',
			padding: metrics.verticalScale(70),
		},
	});
};

export default FinalUser;
