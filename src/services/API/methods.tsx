import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { getFullApiUrl } from '../../config';
import { _showToast } from '../UIs/ToastConfig';
import store from '../../store';

const TIME_OUT = 5000; // 5 seconds
const TOKEN = store.getState().userDataSlice.userData.token;

const _checkInternetConnectivity = async (): Promise<any> => {
	const netInfoState = await NetInfo.fetch();
	return netInfoState?.isConnected;
};

const get = async (endpoint: any, params: any = '', customHeaders: any = {}) => {
	const isConnected = await _checkInternetConnectivity();

	if (!isConnected) {
		_showToast('No Internet Connection!', 'error');
		return { error: 'No Internet Connection' };
	}

	let rootHeaders = {
		Authorization: `Bearer ${TOKEN}`,
	};
	console.log(customHeaders);

	if (customHeaders && Object.keys(customHeaders).length > 0) {
		rootHeaders = { ...rootHeaders, ...customHeaders };
	}

	if (endpoint && endpoint.length > 0) {
		try {
			const response = await axios.get(getFullApiUrl(endpoint) as any, {
				headers: rootHeaders,
				params: params,
				timeout: TIME_OUT,
			});
			return response?.data;
		} catch (error: any) {
			return error.response?.data;
		}
	}
	return { error: 'Endpoint not provided' };
};

const post = async (endpoint: any, data: any, customHeaders = []) => {
	const isConnected = await _checkInternetConnectivity();

	if (!isConnected) {
		_showToast('No Internet Connection', 'error');
		return { error: 'No Internet Connection' };
	}
	let rootHeaders = {
		Authorization: `Bearer ${TOKEN}`,
	};
	console.log(customHeaders);

	if (customHeaders && Object.keys(customHeaders).length > 0) {
		rootHeaders = { ...rootHeaders, ...customHeaders };
	}

	if (endpoint && endpoint.length > 0) {
		try {
			const response = await axios.post(getFullApiUrl(endpoint) as any, data, {
				headers: rootHeaders,
				timeout: TIME_OUT,
			});
			console.log(response?.data, '<---- method res');
			return response?.data;
		} catch (error: any) {
			console.log(error, '<---- method err');
			return error.response?.data;
		}
	}
	return { error: 'Endpoint not provided' };
};

const postFormData = async (endpoint: any, data: any, customHeaders = []) => {
	const isConnected = await _checkInternetConnectivity();

	if (!isConnected) {
		_showToast('No Internet Connection', 'error');
		return { error: 'No Internet Connection' };
	}

	let rootHeaders = {};

	if (customHeaders && customHeaders.length > 0) {
		rootHeaders = { ...rootHeaders, ...customHeaders };
	}

	if (endpoint && endpoint.length > 0) {
		try {
			const response = await axios.post(endpoint, data, {
				headers: {
					...rootHeaders,
					'Content-Type': 'multipart/form-data',
				},
				timeout: TIME_OUT,
			});
			return response?.data;
		} catch (error) {
			return error.response?.data;
		}
	}
	return { error: 'Endpoint not provided' };
};

export const APIMethods = {
	get,
	post,
	postFormData,
};
