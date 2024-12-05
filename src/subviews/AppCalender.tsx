import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';

interface MyModalComponentProps {
	isVisible: boolean;
	onClose: () => void;
	onDateSelect: (selectedDate: string) => void; // New prop to send selected date
}

const MyModalComponent: React.FC<MyModalComponentProps> = ({ isVisible, onClose, onDateSelect }) => {
	// Handle when a day is pressed
	const onDayPress = (day: any) => {
		console.log('Selected day:', day.dateString);
		onDateSelect(day.dateString); // Send selected date to parent component
		onClose(); // Optionally close the modal after selecting a date
	};

	return (
		<Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
			<View style={styles.modalContent}>
				<Text style={styles.modalTitle}>Select a Date</Text>
				<Calendar
					// Initially selected day
					current={'2024-12-06'}
					minDate={'1995-01-01'}
					maxDate={'2024-12-31'}
					onDayPress={onDayPress}
					monthFormat={'yyyy MM'}
					hideArrows={false}
					renderArrow={direction => <Text>{direction === 'left' ? '<' : '>'}</Text>}
				/>
				<Button title="Close" onPress={onClose} />
			</View>
		</Modal>
	);
};

export default MyModalComponent;

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
});
