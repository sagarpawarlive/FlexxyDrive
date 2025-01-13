import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import { useTheme } from '../theme/ThemeProvider';

interface AppCalenderProps {
	isVisible: boolean;
	onClose: () => void;
	onDateSelect: (selectedDate: string) => void;
	title?: string;
}

const AppCalender: React.FC<AppCalenderProps> = ({ isVisible, onClose, onDateSelect, title, ...props }) => {
	const { AppColors } = useTheme();
	const [selectedDate, setSelectedDate] = useState(new Date('2000-01-01'));
	const [maxDate, setMaxDate] = useState(new Date());

	useEffect(() => {
		const today = new Date();
		today.setFullYear(today.getFullYear() - 18);
		setMaxDate(today);
	}, []);

	const onDateChange = (date: Date) => {
		setSelectedDate(date);
	};

	const handleSave = (date: Date) => {
		setSelectedDate(date);
		onDateSelect(date.toISOString().split('T')[0]);
		onClose();
	};

	const handleClose = () => {
		onClose();
	};

	return (
		<Modal
			backdropTransitionInTiming={500}
			backdropTransitionOutTiming={500}
			isVisible={isVisible}
			onBackdropPress={handleClose}
			backdropColor={AppColors.primaryTransparent8}
			style={styles.modal}>
			<View style={styles.modalContent}>
				<Text style={styles.modalTitle}>{title ?? 'Select a Birth Date'}</Text>
				<DatePicker
					theme="light"
					date={selectedDate}
					onDateChange={onDateChange}
					mode="date"
					maximumDate={maxDate}
				/>
				<View style={styles.buttonContainer}>
					<Button title="Close" onPress={handleClose} color={AppColors.error} />
					<Button title="Save" onPress={() => handleSave(selectedDate)} color={AppColors.primary} />
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		alignItems: 'center',
		width: 320,
	},
	modalTitle: {
		fontSize: 18,
		marginBottom: 10,
		fontWeight: 'bold',
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
		width: '100%',
	},
});

export default AppCalender;
