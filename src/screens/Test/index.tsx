import React, { useEffect, useMemo } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Fonts } from '../../assets/fonts';
import AppText from '../../components/AppText';
import MainContainer from '../../components/MainContainer';
import { AppDispatch } from '../../store';
import { useTheme } from '../../theme/ThemeProvider';
import { Theme } from '../../types';

declare function alert(message: string): void;

interface TestProps {
	navigation: any
}

const Test = (props: TestProps) => {

	const dispatch: AppDispatch = useDispatch();
	const { AppColors, isDarkMode } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	useEffect(() => {
		const backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
		const unsubscribe = props.navigation.addListener('focus', () => {

		});

		return () => {
			backHandler.remove();
			unsubscribe();
		}
	}, [dispatch, props.navigation]);

	return (
		<MainContainer>
			<View style={styles.container}>
				<AppText fontFamily={Fonts.BOLD} title={`Test`} />
			</View>
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			marginHorizontal: 20,
		}
	});
};

export default Test;