import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface AppScrollViewProps {
	navigation?: any; // Change to appropriate type
	enabled?: boolean;
	horizontal?: boolean;
	children?: ReactNode;
}

const AppScrollView: React.FC<AppScrollViewProps> = ({
	enabled = true,
	horizontal,
	children,
}) => {
	return (
		<KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={styles.container} extraHeight={100}>
			<ScrollView
				horizontal={horizontal}
				showsVerticalScrollIndicator={false}
				scrollEnabled={enabled}>
				{children}
			</ScrollView>
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default AppScrollView;