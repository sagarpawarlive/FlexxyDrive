import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, Image, StyleSheet, View, BackHandler } from 'react-native';
import { Fonts, FontSize } from '../../assets/fonts';
import { Icons } from '../../assets/Icons';
import AppMapComponent from '../../components/AppMapComponent';
import AppText from '../../components/AppText';
import MainContainer from '../../components/MainContainer';
import { AppHeight, AppMargin, AppPadding, WindowHeight } from '../../constants/commonStyle';
import { useTheme } from '../../theme/ThemeProvider';
import { Theme } from '../../types';
import { passengerListing } from './dummyData';
import metrics from '../../constants/metrics';
import { NavigationKeys } from '../../constants/navigationKeys';

interface PassangerScreenProps {}

const PassangerScreen = (props: PassangerScreenProps) => {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = ['20%', '60%'];

	const { AppColors, isDarkMode } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const handleSheetChanges = useCallback((index: number) => {
		console.log('handleSheetChanges', index);
	}, []);

	useEffect(() => {
		bottomSheetRef.current?.expand();
	}, []);

	useEffect(() => {
		const handleBackPress = () => {
			props?.navigation.navigate(NavigationKeys.FinalUser);
			return true; // Prevent default back button behavior
		};

		BackHandler.addEventListener('hardwareBackPress', handleBackPress);

		return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
	}, []);

	const renderPassanger = useCallback(
		({ item }: any) => {
			return (
				<View style={styles.passengerContainer}>
					<View style={styles.avatarContainer}>
						<Image style={styles.avatarImage} source={{ uri: item.image }} />
					</View>
					<View style={styles.passengerDetails}>
						<View style={styles.passengerHeader}>
							<View style={styles.nameAndCompany}>
								<AppText label={item.name} fontFamily={Fonts.MEDIUM} fontSize={FontSize._16} />
								<AppText
									label={item.company}
									left={10}
									fontFamily={Fonts.MEDIUM}
									textColor={AppColors.primary}
								/>
							</View>
							<View>
								<AppText label={item.price} fontFamily={Fonts.MEDIUM} fontSize={FontSize._16} />
							</View>
						</View>
						<AppText
							top={2}
							label={`${item.distance}  ${item.time}`}
							fontFamily={Fonts.REGULAR}
							fontSize={FontSize._12}
						/>
						<View style={styles.locationContainer}>
							<Image style={styles.locationIcon} source={Icons.icnBaselineLocation} />
							<AppText label={item.from} fontFamily={Fonts.REGULAR} fontSize={FontSize._12} />
							<Image style={styles.toArrowIcon} source={Icons.icnToArrow} />
							<AppText label={item.to} fontFamily={Fonts.REGULAR} fontSize={FontSize._12} />
						</View>
					</View>
				</View>
			);
		},
		[AppColors],
	);

	const BottomSheetBackground = ({ style }: any) => {
		return (
			<View
				style={[
					{
						backgroundColor: AppColors.background,
						borderRadius: 20,
					},
					{ ...style },
				]}
			/>
		);
	};

	return (
		<MainContainer hideTop>
			<View style={styles.container}>
				<AppMapComponent goBack={() => props.navigation.navigate(NavigationKeys.FinalUser)} />

				<BottomSheet
					ref={bottomSheetRef}
					index={1}
					snapPoints={snapPoints}
					maxDynamicContentSize={WindowHeight * 0.7}
					onChange={handleSheetChanges}
					handleIndicatorStyle={{ backgroundColor: AppColors.primary }}
					backgroundComponent={(props: any) => <BottomSheetBackground {...props} />}
					// backdropComponent={({ style }) => (
					// 	<View style={[style, { backgroundColor: 'rgba(0,0,0,0.3)', flex: 1 }]} />
					// )}
				>
					<BottomSheetScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
						<BottomSheetView style={styles.bottomSheetContent}>
							<FlatList
								nestedScrollEnabled
								showsVerticalScrollIndicator={false}
								data={passengerListing}
								renderItem={renderPassanger}
								keyExtractor={(item, index) => index.toString()}
								ItemSeparatorComponent={() => <View style={styles.separator} />}
							/>
						</BottomSheetView>
					</BottomSheetScrollView>
				</BottomSheet>
			</View>
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
		},
		map: {
			flex: 1,
		},
		bottomSheetContent: {
			flex: 1,
			padding: AppPadding._20,
			backgroundColor: AppColors.background,
		},
		passengerContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			// backgroundColor: 'green',
			// height: metrics.verticalScale(50),
		},
		avatarContainer: {
			justifyContent: 'center',
		},
		avatarImage: {
			height: AppHeight._50,
			width: AppHeight._50,
			borderRadius: metrics.moderateScale(25),
			marginLeft: metrics.horizontalScale(10),
		},
		passengerDetails: {
			flex: 1,
			marginLeft: AppMargin._20,
		},
		passengerHeader: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		nameAndCompany: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		locationContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 2,
		},
		locationIcon: {
			marginRight: 5,
		},
		toArrowIcon: {
			marginHorizontal: 5,
		},
		separator: {
			height: 20,
			backgroundColor: AppColors.border,
		},
	});
};

export default PassangerScreen;
