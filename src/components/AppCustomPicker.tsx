import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import { AppHeight, AppMargin, borderRadius10 } from '../constants/commonStyle';
import { Fonts, FontSize } from '../assets/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { Icons } from '../assets/Icons';
import AppTextInput from './AppTextInput';
import AppText from './AppText';
import metrics from '../constants/metrics';
import { t } from '../i18n';

const AppCustomPicker = ({
	options,
	unselectedText,
	setSelectedItem,
	selectedItem,
	marginTop,
	borderWidth,
	borderBottomWidth,
	showSearch,
	onSearchPress,
	setSearchItem = () => {},
	brandModalLoading = false,
}: any) => {
	// const [selectedItem, setSelectedItem] = useState('');
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const { AppColors } = useTheme();
	const [searchText, setSearchText] = useState('');

	// Toggle dropdown visibility
	const togglePicker = () => {
		setIsPickerOpen(!isPickerOpen);
	};

	// Handle selecting an option
	const selectItem = (item, index) => {
		setSelectedItem(item);
		setSearchItem(searchText);
		setIsPickerOpen(false); // Close the picker after selection
	};

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
					{selectedItem?.name || unselectedText}
				</Text>
				<Image
					tintColor={AppColors.text}
					style={{ transform: [{ rotate: isPickerOpen ? '90deg' : '270deg' }] }}
					source={Icons.icnBack}
				/>
			</TouchableOpacity>

			{showSearch && isPickerOpen && (
				<AppTextInput
					showSearch={showSearch}
					width="89%"
					placeholder={t('search')}
					value={searchText}
					marginHorizontal={20}
					onChangeText={text => {
						setSearchText(text);
						onSearchPress(searchText);
					}}

					// rightNode={
					// 	<TouchableOpacity onPress={() => onSearchPress(searchText)}>
					// 		<AppText
					// 			textColor={AppColors.primary}
					// 			fontFamily={Fonts.MEDIUM}
					// 			fontSize={FontSize._16}
					// 			title={'Search'}
					// 		/>
					// 	</TouchableOpacity>
					// }
				/>
			)}

			{/* Custom dropdown that opens/closes */}
			{isPickerOpen && (
				<View style={styles.dropdown}>
					{brandModalLoading && (
						<View
							style={{
								marginTop: metrics.moderateScale(10),
							}}>
							<ActivityIndicator animating size={'small'} />
						</View>
					)}
					<FlatList
						style={{ marginTop: metrics.moderateScale(10) }}
						data={options}
						renderItem={({ item, index }) => {
							return (
								<TouchableOpacity
									key={index}
									style={[styles.option, { borderBottomWidth: index !== options.length - 1 ? 1 : 0 }]}
									onPress={() => selectItem(item, index)}>
									<Text style={[styles.optionText, { color: AppColors.text }]}>{item?.name}</Text>
								</TouchableOpacity>
							);
						}}
						keyExtractor={(item, index) => index.toString()}
						nestedScrollEnabled
						ListEmptyComponent={
							<View
								style={{
									marginTop: metrics.moderateScale(20),
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								<AppText
									fontFamily={Fonts.REGULAR}
									fontSize={FontSize._16}
									title={showSearch ? t('noBrandsFound') : t('selectBrandFirst')}
								/>
							</View>
						}
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
		marginHorizontal: metrics.horizontalScale(20),
	},
	pickerText: {
		fontFamily: Fonts.REGULAR,
		fontSize: FontSize._16,
	},
	dropdown: {
		height: AppHeight._250,
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
		// textAlign: 'center',
	},
});

export default AppCustomPicker;
