import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface AppScrollViewProps {
	navigation?: any; // Change to appropriate type
	enabled?: boolean;
	horizontal?: boolean;
	children?: ReactNode;
	extraHeight?: number;
	bounces?: boolean;
}

const AppScrollView: React.FC<AppScrollViewProps> = ({
	enabled = true,
	horizontal,
	children,
	extraHeight,
	bounces,
}) => {
	return (
		<KeyboardAwareScrollView
			bounces={bounces ?? true}
			showsVerticalScrollIndicator={false}
			style={styles.container}
			contentContainerStyle={{ flexGrow: 1 }}
			extraHeight={extraHeight ?? 100}>
			{children}
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default AppScrollView;
