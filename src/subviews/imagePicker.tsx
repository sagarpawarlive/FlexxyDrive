import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Image, FlatList, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../theme/ThemeProvider';
import { Icons } from '../assets/Icons';
import { Fonts, FontSize } from '../assets/fonts';
import AppText from '../components/AppText';
import { AppMargin, borderRadius10 } from '../constants/commonStyle';
import AppButton from '../components/AppButton';

const { height } = Dimensions.get('window');

const imagePickerOptions = [
	{ id: 1, icon: Icons.icnCamera, label: 'Camera' },
	{ id: 2, icon: Icons.icnGallery, label: 'Choose from gallery' },
];

const ImagePicker = ({ isVisible, onClose, title }) => {
	const { AppColors } = useTheme();

	const renderItem = ({ item }) => (
		<Pressable onPress={() => alert(item.label)} style={[styles.listItem, { borderColor: AppColors.white }]}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Image style={{ marginHorizontal: AppMargin._30 }} source={item.icon} />
				<AppText fontFamily={Fonts.REGULAR} fontSize={FontSize._16} title={item.label} />
			</View>
		</Pressable>
	);

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

				<FlatList
					style={{ marginTop: 20 }}
					scrollEnabled={false}
					data={imagePickerOptions}
					keyExtractor={item => item.id.toString()}
					renderItem={renderItem}
					ItemSeparatorComponent={() => (
						<View style={[styles.separator, { backgroundColor: AppColors.white }]} />
					)}
				/>

				<AppButton
					top={AppMargin._20}
					textColor={AppColors.textDark}
					fontSize={FontSize._16}
					fontFamily={Fonts.MEDIUM}
					buttonLabel={'Save'}
					onClick={() => onClose()}
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

export default ImagePicker;
