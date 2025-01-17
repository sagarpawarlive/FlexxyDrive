export const ENDPOINT = {
	//aws s3 base url
	AWS_BASEURL_S3: `https://flexxydriveweb5bdce-dev.s3.eu-central-1.amazonaws.com/`,

	//Auth
	LOGIN: '/auth/login', //post
	SIGNUP: '/auth/signup', //post
	GOOGLE_LOGIN: '/auth/google-login', //post
	FACEBOOK_LOGIN: '/auth/facebook-login', //post
	APPLE_LOGIN: '/auth/apple-login', //post
	ADD_PHONE_NUMBER: '/auth/add-phone-number', //post
	SEND_SMS_OTP: '/auth/send-sms-otp', //post
	SEND_EMAIL_OTP: '/auth/send-email-otp', //post
	FORGOT_PASSWORD_SEND_OTP: '/auth/forgot-password/send-otp', //post
	FORGOT_PASSWORD_VERIFY_OTP: '/auth/forgot-password/verify-otp', //post

	VERIFY_OTP: '/auth/verify-otp', //post

	//Drivers
	SET_DRIVER_INFO: '/api/driver/info', //post
	SET_PASSENGER_INFO: '/passenger/info', //post
	GET_DRIVER_INFO: '/api/driver/info', //get
	GET_PROFILE_INFO: '/auth/profile', //get
	UPDATE_DRIVER_INFO: '/api/driver/info', //put
	DELETE_DRIVER_INFO: '/api/driver/info', //delete

	// Driver car details
	SET_DRIVER_CAR_DETAILS: '/api/driver/car-details', //post
	GET_DRIVER_CAR_DETAILS: '/api/driver/car-details', //get
	UPDATE_DRIVER_CAR_DETAILS: '/api/driver/car-details', // /{car-id} put
	DELETE_DRIVER_CAR_DETAILS: '/api/driver/car-details', // /{car-id} delete

	//Verify Document
	VERIFY_DOCUMENT: '/verification/document', //post

	//Car details
	GET_BRAND: '/carsdata/brands', //get
	GET_MODELS: '/carsdata/models', //get

	UPDATE_RESET_PASSWORD: '/auth/reset-password',
};
