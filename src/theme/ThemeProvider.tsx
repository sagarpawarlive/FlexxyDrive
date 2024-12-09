import React, { ReactNode, createContext, useContext } from 'react';
import { StatusBar, StatusBarStyle, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { setIsDarkMode } from '../store/reducers/userdataSlice';
import { darkTheme, lightTheme } from './AppColors';
import { Theme } from '../types';

interface ThemeContextProps {
	isDarkMode: boolean;
	toggleTheme: () => void;
	AppColors: Theme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};

interface ThemeProviderProps {
	children: ReactNode;
	isDisabled?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, isDisabled = false }) => {
	const dispatch: AppDispatch = useDispatch();
	const systemColorScheme = useColorScheme();
	const isDarkMode = useSelector((state: any) => state.userDataSlice.isDarkMode);
	const isSystemDark = useSelector((state: any) => state.userDataSlice.themeSystemSetting);

	let AppColors;

	switch (true) {
		case isDisabled:
			AppColors = lightTheme;
			break;
		case isSystemDark:
			AppColors = systemColorScheme === 'light' ? lightTheme : darkTheme;
			break;
		default:
			AppColors = isDarkMode ? darkTheme : lightTheme;
			break;
	}

	const toggleTheme = () => {
		dispatch(setIsDarkMode(!isDarkMode));
	};

	let barStyleCondition: string =
		isDisabled == true
			? 'light'
			: isSystemDark
			? systemColorScheme === 'light'
				? 'dark-content'
				: 'light-content'
			: isDarkMode
			? 'light-content'
			: 'dark-content';

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme, AppColors }}>
			<StatusBar barStyle={barStyleCondition as StatusBarStyle} />
			{children}
		</ThemeContext.Provider>
	);
};
