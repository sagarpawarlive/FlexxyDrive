import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { AppHeight, AppMargin, borderRadius10 } from '../constants/commonStyle';
import { Fonts, FontSize } from '../assets/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { Icons } from '../assets/Icons';
import metrics from '../constants/metrics';

type Option = {
	key: string;
	label: string;
};

interface AppIdPickerProps {
	options: Option[];
	unselectedText: string;
	setSelectedItem: (item: string) => void;
	selectedItem: string;
	marginTop?: number;
	borderWidth?: number;
	borderBottomWidth?: number;
}

const AppIdPicker: React.FC<AppIdPickerProps> = ({
	options,
	unselectedText,
	setSelectedItem,
	selectedItem,
	marginTop,
	borderWidth,
	borderBottomWidth,
}) => {
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const { AppColors } = useTheme();

	// Toggle dropdown visibility
	const togglePicker = () => {
		setIsPickerOpen(!isPickerOpen);
	};

	// Handle selecting an option
	const selectItem = (item: Option) => {
		setSelectedItem(item.key); // Set key as the selected item
		setIsPickerOpen(false); // Close the picker after selection
	};

	const renderItem = ({ item, index }: { item: Option; index: number }) => (
		<TouchableOpacity
			style={[styles.option, { borderBottomWidth: index !== options.length - 1 ? 1 : 0 }]}
			onPress={() => selectItem(item)}>
			<Text style={[styles.optionText, { color: AppColors.text }]}>{item.label}</Text>
		</TouchableOpacity>
	);

	return (
		<View
			style={[
				styles.container,
				{
					borderColor: AppColors.textInputBorderColor,
					marginTop: marginTop,
					borderWidth: borderWidth ?? 1,
					borderBottomWidth: borderBottomWidth ?? 1,
				},
			]}>
			{/* Touchable to open or close the picker */}
			<TouchableOpacity style={styles.pickerButton} onPress={togglePicker}>
				<Text style={[styles.pickerText, { color: AppColors.text }]}>
					{selectedItem ? options.find(option => option.key === selectedItem)?.label : unselectedText}
				</Text>
				<Image style={{ transform: [{ rotate: isPickerOpen ? '90deg' : '270deg' }] }} source={Icons.icnBack} />
			</TouchableOpacity>

			{/* Custom dropdown that opens/closes */}
			{isPickerOpen && (
				<View style={styles.dropdown}>
					<FlatList
						style={{ maxHeight: metrics.moderateScale(200) }}
						data={options}
						keyExtractor={item => item.key}
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
		marginHorizontal: metrics.horizontalScale(20),
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
		marginHorizontal: metrics.horizontalScale(20),
		height: AppHeight._50,
		borderBottomColor: '#ccc',
	},
	optionText: {
		fontFamily: Fonts.REGULAR,
		fontSize: FontSize._16,
	},
});

export default AppIdPicker;