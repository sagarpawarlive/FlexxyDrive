import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Fonts, FontSize } from '../../../../assets/fonts';
import AppButton from '../../../../components/AppButton';
import AppHeader from '../../../../components/AppHeader';
import AppText from '../../../../components/AppText';
import MainContainer from '../../../../components/MainContainer';
import { AppMargin } from '../../../../constants/commonStyle';
import { useTheme } from '../../../../theme/ThemeProvider';
import { Theme } from '../../../../types';
import AppTextInput from '../../../../components/AppTextInput';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // For form validation
import { t } from '../../../../i18n';

const AddPayments = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const onBackPress = () => {
		props.navigation.goBack();
	};

	return (
		<MainContainer>
			<View style={styles.innerMainContainer}>
				<AppHeader buttonTitle={t('addPaymentDetails')} top={AppMargin._30} onBack={onBackPress} />

				<View style={{ marginTop: AppMargin._30 }}>
					<AppTextInput
						placeholder={'Frank smith'}
						// value={formik.values.emailOrPhone}
						// onChangeText={formik.handleChange('emailOrPhone')}
						// onBlur={formik.handleBlur('emailOrPhone')}
						// showError={formik.touched.emailOrPhone && formik.errors.emailOrPhone}
					/>
					<AppTextInput
						marginTop={AppMargin._20}
						placeholder={'4040 1230 1230 3344'}
						// value={formik.values.emailOrPhone}
						// onChangeText={formik.handleChange('emailOrPhone')}
						// onBlur={formik.handleBlur('emailOrPhone')}
						// showError={formik.touched.emailOrPhone && formik.errors.emailOrPhone}
					/>
					<AppTextInput
						marginTop={AppMargin._20}
						placeholder={'30/26'}
						// value={formik.values.emailOrPhone}
						// onChangeText={formik.handleChange('emailOrPhone')}
						// onBlur={formik.handleBlur('emailOrPhone')}
						// showError={formik.touched.emailOrPhone && formik.errors.emailOrPhone}
					/>
					<AppTextInput
						marginTop={AppMargin._20}
						placeholder={'356'}
						// value={formik.values.emailOrPhone}
						// onChangeText={formik.handleChange('emailOrPhone')}
						// onBlur={formik.handleBlur('emailOrPhone')}
						// showError={formik.touched.emailOrPhone && formik.errors.emailOrPhone}
					/>
				</View>

				<AppButton
					bottom={AppMargin._30}
					textColor={AppColors.textDark}
					fontSize={FontSize._16}
					fontFamily={Fonts.MEDIUM}
					position="end"
					buttonLabel={'SAVE CARD'}
					onClick={() => {}} // Trigger Formik form submission
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
	});
};

export default AddPayments;
