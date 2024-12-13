import { uploadData } from 'aws-amplify/storage';
import { useFormik } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
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

const FinalUser = (props: any) => {
	const dispatch = useDispatch();
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	return (
		<MainContainer>
			<View style={styles.primaryContainer}>
				<AppScrollView bounces={false} extraHeight={AppHeight._350}>
					<View style={[AppContainer]}>
						<View style={styles.logoContainer}>
							<AppText fontSize={FontSize._40} fontFamily={Fonts.BOLD} title={'LOGO'} />
						</View>

						<View style={[styles.logoContainer, { marginTop: AppMargin._100 }]}>
							<AppText fontSize={FontSize._24} fontFamily={Fonts.BOLD} title={'Welcome to FlexxyDrive'} />
						</View>
						<View style={{ marginTop: AppMargin._100 }}>
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

							<AppButton
								top={AppMargin._40}
								fontSize={FontSize._16}
								textColor={AppColors.primary}
								fontFamily={Fonts.MEDIUM}
								buttonLabel={'Logout'}
								bgColor={AppColors.background}
								borderWidth={1}
								onClick={() => {
									dispatch(logout());
									props.navigation.navigate(NavigationKeys.IntroScreen);
								}}
							/>
						</View>
					</View>
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
	});
};

export default FinalUser;
