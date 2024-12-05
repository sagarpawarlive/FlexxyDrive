import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AppHeight, AppMargin, borderRadius10 } from '../constants/commonStyle';
import { Fonts, FontSize } from '../assets/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { Icons } from '../assets/Icons';

const AppCustomPicker = ({ options, unselectedText, setSelectedItem, selectedItem, marginTop }: any) => {
	// const [selectedItem, setSelectedItem] = useState('');
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const { AppColors } = useTheme();
	// Toggle dropdown visibility
	const togglePicker = () => {
		setIsPickerOpen(!isPickerOpen);
	};

	// Handle selecting an option
	const selectItem = (item, index) => {
		setSelectedItem(item);
		setIsPickerOpen(false); // Close the picker after selection
	};

	return (
		<View style={[styles.container, { borderColor: AppColors.white, marginTop: marginTop }]}>
			{/* Touchable to open or close the picker */}
			<TouchableOpacity style={styles.pickerButton} onPress={togglePicker}>
				<Text style={[styles.pickerText, { color: AppColors.white }]}>{selectedItem || unselectedText}</Text>
				<Image style={{ transform: [{ rotate: isPickerOpen ? '90deg' : '270deg' }] }} source={Icons.icnBack} />
			</TouchableOpacity>

			{/* Custom dropdown that opens/closes */}
			{isPickerOpen && (
				<View style={styles.dropdown}>
					{options.map((item, index) => (
						<TouchableOpacity
							key={index}
							style={[styles.option, { borderBottomWidth: index !== options.length - 1 ? 1 : 0 }]}
							onPress={() => selectItem(item, index)}>
							<Text style={[styles.optionText, { color: AppColors.white }]}>{item}</Text>
						</TouchableOpacity>
					))}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		borderWidth: 1,
		...borderRadius10,
	},
	label: {
		fontSize: FontSize._16,
	},
	pickerButton: {
		flexDirection: 'row',

		borderRadius: 8,
		height: AppHeight._70,
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: AppMargin._20,
	},
	pickerText: {
		fontFamily: Fonts.REGULAR,
		fontSize: FontSize._16,
	},
	dropdown: {
		width: '100%',
	},
	option: {
		justifyContent: 'center',
		marginHorizontal: AppMargin._20,
		height: AppHeight._50,
		borderBottomColor: '#ccc',
	},
	optionText: {
		fontFamily: Fonts.REGULAR,
		fontSize: FontSize._16,
		// textAlign: 'center',
	},
});

export default AppCustomPicker;
