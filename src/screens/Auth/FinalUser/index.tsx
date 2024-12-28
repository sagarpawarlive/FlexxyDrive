import { uploadData } from 'aws-amplify/storage';
import { useFormik } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch } from 'react-redux';
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
import { logout } from '../../../store/reducers/userdataSlice';
import { Images } from '../../../assets/images';
import { nativeAlertwithAction } from '../../../constants/constants';

const FinalUser = (props: any) => {
	const dispatch = useDispatch();
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const handleLogout = () => {
		dispatch(logout());
		props.navigation.navigate(NavigationKeys.IntroScreen);
	};

	const onPressLogout = () => {
		nativeAlertwithAction('Logout', 'Are you sure you want to logout?', status => {
			if (status) {
				handleLogout();
			}
		});
	};

	return (
		<MainContainer>
			<View style={styles.primaryContainer}>
				<AppScrollView bounces={false} extraHeight={AppHeight._350}>
					<View style={[AppContainer]}>
						<View style={styles.imageContainer}>
							<Image resizeMode="contain" source={Images.imgSplash} />
						</View>

						<View style={[styles.logoContainer]}>
							<AppText fontSize={FontSize._24} fontFamily={Fonts.BOLD} title={'Welcome to FlexxyDrive'} />
						</View>

						<View style={{ marginTop: AppMargin._50 }}>
							<AppButton
								top={AppMargin._40}
								fontSize={FontSize._16}
								textColor={AppColors.primary}
								fontFamily={Fonts.MEDIUM}
								buttonLabel={'Book A Ride'}
								bgColor={AppColors.background}
								borderWidth={1}
								onClick={() => alert('under development')} // Optimized image picker call
							/>

							<AppButton
								top={AppMargin._40}
								fontSize={FontSize._16}
								textColor={AppColors.primary}
								fontFamily={Fonts.MEDIUM}
								buttonLabel={'Offer A Ride'}
								bgColor={AppColors.background}
								borderWidth={1}
								onClick={() => {
									props.navigation.navigate(NavigationKeys.AuthNavigator, {
										screen: NavigationKeys.DriverInformation,
									});
								}}
							/>

							{/* <AppButton
								top={AppMargin._40}
								fontSize={FontSize._16}
								textColor={AppColors.primary}
								fontFamily={Fonts.MEDIUM}
								buttonLabel={'Logout'}
								bgColor={AppColors.background}
								borderWidth={1}
								onClick={onPressLogout}
							/> */}
						</View>
					</View>

					<TouchableOpacity onPress={onPressLogout} style={styles.logoutButton}>
						<AppText
							fontSize={FontSize._14}
							fontFamily={Fonts.BOLD}
							textColor={AppColors.primary}
							title={'Logout'}
						/>
					</TouchableOpacity>
				</AppScrollView>
			</View>
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		logoContainer: {
			marginTop: AppMargin._50,
			justifyContent: 'center',
			alignItems: 'center',
		},
		primaryContainer: { flex: 1, backgroundColor: AppColors.background },
		imageContainer: {
			// height: 100,
			// width: '100%',
			// marginTop: AppMargin._90,
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
	});
};

export default FinalUser;
