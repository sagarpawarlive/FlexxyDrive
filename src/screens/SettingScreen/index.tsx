import React, { useEffect, useMemo } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AppText from '../../components/AppText';
import MainContainer from '../../components/MainContainer';
import { AppMargin, AppPadding, borderRadius10 } from '../../constants/commonStyle';
import { settings } from '../../constants/string';
import { t } from '../../i18n';
import { AppDispatch } from '../../store';
import { setIsLogin, setLocalize } from '../../store/reducers/commonData.slice';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeControl } from '../../theme/themeControl';
import { NavigationKeys } from '../../constants/navigationKeys';
import { _showToast } from '../../services/UIs/ToastConfig';
import { Icons } from '../../assets/Icons';
import { FontSize, Fonts } from '../../assets/fonts';
import { nativeAlertwithAction } from '../../constants/constants';
import { Theme } from '../../types';

interface SettingScreenProps {
	navigation: any;
}

const SettingScreen = (props: SettingScreenProps) => {

	const { AppColors, isDarkMode } = useTheme();
	const { setDarkMode, setLightMode, setDefaultTheme, setToggleTheme } = useThemeControl();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const dispatch: AppDispatch = useDispatch();
	const commonData = useSelector((state: any) => state.commonData);

	const handleLogout = () => {
		nativeAlertwithAction('Logout', 'are you sure you want to logout?', (status) => {
			if (status) {
				props.navigation.reset({
					index: 0,
					routes: [{ name: NavigationKeys.AuthNavigator }]
				})
				dispatch(setIsLogin(false))
				_showToast('Logout Successful', 'success');
			}
		})
	}

	const handleSettings = (itemTitle: string) => {
		// Define types for themeActions and localizeActions || Any Other

		type ThemeActions = { [key: string]: () => void };
		type LocalizeActions = { [key: string]: () => void };
		type AccountAction = { [key: string]: () => void };

		const themeActions: ThemeActions = {
			'default_Theme': setToggleTheme,
		};

		const localizeActions: LocalizeActions = {
			'english': () => setLocalizeAndShow('en'),
			'japanese': () => setLocalizeAndShow('jp'),
			'espanol': () => setLocalizeAndShow('sp'),
		};

		function setLocalizeAndShow(locale: string) {
			dispatch(setLocalize(locale));
			_showToast('Changed Successfully', 'success');
		}

		const AccountActions: AccountAction = {
			'logout': () => handleLogout(),
		};

		themeActions[itemTitle]?.();
		localizeActions[itemTitle]?.();
		AccountActions[itemTitle]?.();
	};

	return (
		<MainContainer>
			<View style={{ marginHorizontal: 20, flex: 1 }}>
				<AppText textColor={AppColors.primary} fontFamily={Fonts.BOLD} title={t('settings')} />
				<FlatList
					data={settings}
					extraData={settings}
					key={`1`}
					contentContainerStyle={styles.flatListContainer}
					keyExtractor={(item, index) => item.id + index.toString()}
					ItemSeparatorComponent={() => <View style={{ marginVertical: AppMargin._10 }} />}
					renderItem={({ item, index }) => {
						return (
							<View style={{ padding: AppPadding._20, flex: 1, backgroundColor: AppColors.primaryTransparent, ...borderRadius10 }}>
								<AppText fontFamily={Fonts.REGULAR} textColor={AppColors.primary} label={t(item.title)} />
								<View style={{ marginVertical: AppMargin._20, height: 1, backgroundColor: AppColors.primary }} />
								<FlatList
									data={item.value}
									key={`2`}
									extraData={item.value}
									keyExtractor={(subItem) => subItem.id.toString()}
									ItemSeparatorComponent={() => <View style={{ marginVertical: AppMargin._5 }} />}
									renderItem={({ item: subItem }) => (
										<TouchableOpacity
											onPress={() => handleSettings(subItem.title)}
											style={{ flexDirection: 'row', paddingVertical: 5, alignItems: 'center', justifyContent: 'space-between' }}>
											<AppText fontFamily={Fonts.REGULAR} textColor={subItem.title === 'logout' ? AppColors.error : AppColors.text} label={t(subItem.title)} />
											{item.id == 0 && <Image tintColor={AppColors.text} style={{ height: 18, width: 18 }} source={commonData.isDarkMode ? Icons.icnLightTheme : Icons.icnDarkTheme} />}
										</TouchableOpacity>
									)}
								/>
							</View>
						)
					}}
				/>
			</View>
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		flatListContainer: {
			marginTop: AppMargin._20,
			paddingBottom: AppMargin._75,
			justifyContent: 'space-between',
		},
	});
};

export default SettingScreen;