import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface userDataSliceState {
	userData: any;
	passengerData: any;
	isLogin?: boolean;
	localize?: string;
	isDarkMode?: boolean;
	themeSystemSetting?: boolean;
}

const initialState: userDataSliceState = {
	userData: {},
	passengerData: {},
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

		setPassengerData: (state, action: PayloadAction<any>) => {
			state.passengerData = action.payload;
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
		updateUserState: (state, action) => {
			state.userData = {
				...state.userData,
				data: {
					...state.userData?.data,
					user: {
						...state.userData?.data?.user,
						...action?.payload,
					},
				},
			};
		},

		updatePassengerState: (state, action) => {
			state.passengerData = {
				...state.passengerData,
				data: {
					...state.passengerData?.data,
					user: {
						...state.passengerData?.data?.user,
						...action?.payload,
					},
				},
			};
		},
	},
});

export const {
	setUserData,
	setLocalize,
	setIsLogin,
	setIsDarkMode,
	setIsThemeSystemSetting,
	logout,
	updateUserState,
	updatePassengerState,
} = userDataSlice.actions;

export default userDataSlice.reducer;
