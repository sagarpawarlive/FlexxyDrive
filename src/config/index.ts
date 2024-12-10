const isProduction = false; // Change this to true for production

const BASE_URL_DEV = 'http://localhost:3001';
const BASE_URL_PROD = 'http://localhost:3001';

const Config = {
	REACT_NATIVE_SERVER_API_FULL_URL: isProduction ? BASE_URL_PROD : BASE_URL_DEV,
	REACT_NATIVE_SERVER_API_KEY: '', // any ApiKey Here!
};

const getFullApiUrl = (endpoint: string | undefined): string | undefined => {
	if (endpoint && endpoint.length > 0) {
		return Config.REACT_NATIVE_SERVER_API_FULL_URL + endpoint;
	}
};

export { Config, getFullApiUrl };

export const FIREBASE_WEB_CLIENT_ID = `593736862384-6gt0eu9enlvk5i38kf0m9l10ar4t0phk.apps.googleusercontent.com`;
