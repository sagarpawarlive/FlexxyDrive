import { APIMethods } from './methods';

// Define a function to easily call GET API
export const apiGet = async (endpoint: string, params: any = {}, customHeaders: any = {}) => {
	try {
		const response = await APIMethods.get(endpoint, params, customHeaders);
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
		return response; // Return the response or any further processing
	} catch (error) {
		console.error('Error in POST API:', error);
		throw error;
	}
};
