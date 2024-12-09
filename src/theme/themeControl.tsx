import { useDispatch, useSelector } from 'react-redux';
import { setIsDarkMode, setIsThemeSystemSetting } from '../store/reducers/userdataSlice';

export const useThemeControl = () => {
	const commonData = useSelector((state: any) => state.commonData);
	const dispatch = useDispatch();

	const setDarkMode = () => {
		dispatch(setIsThemeSystemSetting(false));
		dispatch(setIsDarkMode(true));
	};

	const setLightMode = () => {
		dispatch(setIsThemeSystemSetting(false));
		dispatch(setIsDarkMode(false));
	};

	const setDefaultTheme = () => {
		dispatch(setIsThemeSystemSetting(true));
	};

	const setToggleTheme = () => {
		commonData.isDarkMode == true ? setLightMode() : setDarkMode();
	};

	return {
		setDarkMode,
		setLightMode,
		setDefaultTheme,
		setToggleTheme,
	};
};
