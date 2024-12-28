import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { AppHeight, AppMargin, borderRadius10 } from '../constants/commonStyle';
import { Fonts, FontSize } from '../assets/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { Icons } from '../assets/Icons';

const AppFuelPicker = ({
	options,
	unselectedText,
	setSelectedItem,
	selectedItem,
	marginTop,
	borderWidth,
	borderBottomWidth,
}: any) => {
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

	const renderItem = ({ item, index }) => (
		<TouchableOpacity
			style={[styles.option, { borderBottomWidth: index !== options.length - 1 ? 1 : 0 }]}
			onPress={() => selectItem(item, index)}>
			<Text style={[styles.optionText, { color: AppColors.white }]}>{item}</Text>
		</TouchableOpacity>
	);

	return (
		<View
			style={[
				styles.container,
				{
					borderColor: AppColors.white,
					marginTop: marginTop,
					borderWidth: borderWidth ?? 1,
					borderBottomWidth: borderBottomWidth ?? 1,
				},
			]}>
			{/* Touchable to open or close the picker */}
			<TouchableOpacity style={styles.pickerButton} onPress={togglePicker}>
				<Text style={[styles.pickerText, { color: AppColors.white }]}>{selectedItem || unselectedText}</Text>
				<Image style={{ transform: [{ rotate: isPickerOpen ? '90deg' : '270deg' }] }} source={Icons.icnBack} />
			</TouchableOpacity>

			{/* Custom dropdown that opens/closes */}
			{isPickerOpen && (
				<View style={styles.dropdown}>
					<FlatList
						style={{ height: 200 }}
						data={options}
						keyExtractor={(item, index) => index.toString()} // or use unique IDs if available
						renderItem={renderItem}
						nestedScrollEnabled
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',

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

export default AppFuelPicker;
