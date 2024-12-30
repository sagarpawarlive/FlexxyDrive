import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { Icons } from '../assets/Icons';
import { Fonts, FontSize } from '../assets/fonts';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { AppMargin, borderRadius10 } from '../constants/commonStyle';
import { useTheme } from '../theme/ThemeProvider';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const { height } = Dimensions.get('window');

const AddNewContact = ({ isVisible, onClose, title, onSaveContact }: any) => {
	const { AppColors } = useTheme();

	// Formik initialization
	const formik = useFormik({
		initialValues: {
			name: '',
			phoneNumber: '',
			email: '',
		},
		validationSchema: Yup.object({
			name: Yup.string().required('Fullname is required'),
			phoneNumber: Yup.string().required('Phone number is required'),
			email: Yup.string().email('Invalid email format').optional(),
		}),
		onSubmit: values => {
			onSaveContact(values);
			formik.resetForm(); // Reset form after saving
			onClose(); // Close the modal
		},
	});

	return (
		<Modal
			isVisible={isVisible}
			backdropColor={'#2C3E50CC'}
			onBackdropPress={onClose}
			onBackButtonPress={onClose}
			style={styles.modal}
			avoidKeyboard
			onModalHide={() => formik.resetForm()}
			animationIn="slideInUp"
			animationOut="slideOutDown">
			<View style={[styles.modalContent, { backgroundColor: AppColors.modalBackground }]}>
				<View style={styles.header}>
					<TouchableOpacity onPress={onClose} style={styles.closeButton}>
						<Image style={styles.closeIcon} source={Icons.icnClose} />
					</TouchableOpacity>
					<View style={{ flexGrow: 1, alignItems: 'center' }}>
						<AppText fontFamily={Fonts.REGULAR} fontSize={FontSize._20} title={title} />
					</View>
					<View style={{ height: 30, width: 30 }} />
				</View>

				{/* Name input */}
				<AppTextInput
					backgroundColor={AppColors.modalBackground}
					placeholder="Fullname"
					value={formik.values.name}
					onChangeText={formik.handleChange('name')}
					onBlur={formik.handleBlur('name')}
					showError={formik.touched.name && formik.errors.name}
				/>

				{/* Phone number input */}
				<AppTextInput
					maxLength={15}
					backgroundColor={AppColors.modalBackground}
					placeholder="Phone number"
					value={formik.values.phoneNumber}
					onChangeText={formik.handleChange('phoneNumber')}
					onBlur={formik.handleBlur('phoneNumber')}
					showError={formik.touched.phoneNumber && formik.errors.phoneNumber}
				/>

				{/* Email input */}
				<AppTextInput
					backgroundColor={AppColors.modalBackground}
					placeholder="Email (optional)"
					value={formik.values.email}
					onChangeText={formik.handleChange('email')}
					onBlur={formik.handleBlur('email')}
					showError={formik.touched.email && formik.errors.email}
				/>

				{/* Save Button */}
				<AppButton
					top={AppMargin._20}
					textColor={AppColors.textDark}
					fontSize={FontSize._16}
					fontFamily={Fonts.MEDIUM}
					buttonLabel={'Save'}
					onClick={formik.handleSubmit}
				/>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
	},
	modalContent: {
		backgroundColor: 'white',
		width: '100%',
		padding: 16,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	closeButton: {
		padding: 8,
		borderRadius: 15,
	},
	closeIcon: { height: 30, width: 30 },
	listItem: {
		...borderRadius10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	separator: {
		marginVertical: 20,
		height: 1,
		marginHorizontal: 20,
	},
});

export default AddNewContact;
