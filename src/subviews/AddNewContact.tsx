import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { Icons } from '../assets/Icons';
import { Fonts, FontSize } from '../assets/fonts';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { AppMargin, borderRadius10 } from '../constants/commonStyle';
import { useTheme } from '../theme/ThemeProvider';

const { height } = Dimensions.get('window');

const AddNewContact = ({ isVisible, onClose, title, onSaveContact }) => {
	const { AppColors } = useTheme();

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');

	const handleSave = () => {
		const newContact = { name, phone, email };
		onSaveContact(newContact);
		onClose();
		setName('');
		setPhone('');
		setEmail('');
	};

	return (
		<Modal
			isVisible={isVisible}
			backdropColor={'#2C3E50CC'}
			onBackdropPress={onClose}
			onBackButtonPress={onClose}
			style={styles.modal}
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

				<AppTextInput
					backgroundColor={AppColors.modalBackground}
					placeholder="Fullname"
					value={name}
					onChangeText={setName}
				/>
				<AppTextInput
					backgroundColor={AppColors.modalBackground}
					placeholder="Phone number"
					value={phone}
					onChangeText={setPhone}
				/>
				<AppTextInput
					backgroundColor={AppColors.modalBackground}
					placeholder="Email (optional)"
					value={email}
					onChangeText={setEmail}
				/>
				<AppButton
					top={AppMargin._20}
					textColor={AppColors.textDark}
					fontSize={FontSize._16}
					fontFamily={Fonts.MEDIUM}
					buttonLabel={'Save'}
					onClick={handleSave}
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
