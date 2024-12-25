import { useDispatch } from 'react-redux';
import { APIMethods } from './methods';
import { logout } from '../../store/reducers/userdataSlice';
import { replace, reset } from '../../utils/navigationUtils';
import { NavigationKeys } from '../../constants/navigationKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../../store';
// Define a function to easily call GET API

const state = store.getState();

export const apiGet = async (endpoint: string, params: any = {}, customHeaders: any = {}) => {
	try {
		const response = await APIMethods.get(endpoint, params, customHeaders);
		if (response?.statusCode === 401) {
			reset(0, [{ name: NavigationKeys.AuthNavigator }]);
			store.dispatch(logout());
			return response;
		}
		return response; // Return the response or any further processing
	} catch (error) {
		console.error('Error in GET API:', error);
		throw error;
	}
};

// Define a function to easily call POST API
export const apiPost = async (endpoint: string, data: any, customHeaders: any = {}) => {
	try {
		const response = await APIMethods.post(endpoint, data, customHeaders);
		if (response?.statusCode === 401) {
			reset(0, [{ name: NavigationKeys.AuthNavigator }]);
			store.dispatch(logout());
			return response;
		}
		return response; // Return the response or any further processing
	} catch (error) {
		console.error('Error in POST API:', error);
		throw error;
	}
};
