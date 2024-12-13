import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface userDataSliceState {
	userData: any;
	isLogin?: boolean;
	localize?: string;
	isDarkMode?: boolean;
	themeSystemSetting?: boolean;
}

const initialState: userDataSliceState = {
	userData: [],
	isLogin: false,
	localize: 'en',
	isDarkMode: false,
	themeSystemSetting: true,
};

const userDataSlice = createSlice({
	name: 'userDataSlice',
	initialState,
	reducers: {
		setUserData: (state, action: PayloadAction<any>) => {
			state.userData = action.payload;
		},

		setIsLogin: (state, action: PayloadAction<boolean>) => {
			state.isLogin = action.payload;
		},

		setLocalize: (state, action: PayloadAction<string>) => {
			state.localize = action.payload;
		},

		setIsDarkMode: (state, action: PayloadAction<boolean>) => {
			state.isDarkMode = action.payload;
		},

		setIsThemeSystemSetting: (state, action: PayloadAction<boolean>) => {
			state.themeSystemSetting = action.payload;
		},

		logout: state => {
			state.userData = {};
		},
	},
});

export const { setUserData, setLocalize, setIsLogin, setIsDarkMode, setIsThemeSystemSetting, logout } =
	userDataSlice.actions;

export default userDataSlice.reducer;
