const isProduction = false; // Change this to true for production

const LOCAL_URL = 'http://localhost:3001';
const BASE_URL_DEV = 'http://localhost:3001';
const BASE_URL_PROD = 'http://51.20.189.64:3001';

const DOCS = 'http://51.20.189.64:3001/api-docs#/';

const Config = {
	REACT_NATIVE_SERVER_API_FULL_URL: isProduction ? BASE_URL_PROD : BASE_URL_DEV,
	// REACT_NATIVE_SERVER_API_FULL_URL: LOCAL_URL,
	REACT_NATIVE_SERVER_API_KEY: '', // any ApiKey Here!
};

const getFullApiUrl = (endpoint: string | undefined): string | undefined => {
	if (endpoint && endpoint.length > 0) {
		return Config.REACT_NATIVE_SERVER_API_FULL_URL + endpoint;
	}
};

export { Config, getFullApiUrl };

export const FIREBASE_WEB_CLIENT_ID = `593736862384-6gt0eu9enlvk5i38kf0m9l10ar4t0phk.apps.googleusercontent.com`;
export const ANDROID_CLIENT_ID = `593736862384-uptirv0611upv03oluqdqrheg25vffph.apps.googleusercontent.com`;
