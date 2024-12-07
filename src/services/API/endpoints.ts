export const ENDPOINT = {
	//Auth
	LOGIN: '/auth/login', //post
	SIGNUP: '/auth/signup', //post
	GOOGLE_LOGIN: '/auth/google-login', //post
	FACEBOOK_LOGIN: '/auth/facebook-login', //post
	APPLE_LOGIN: '/auth/apple-login', //post
	ADD_PHONE_NUMBER: '/auth/add-phone-number', //post
	SEND_SMS_OTP: '/auth/send-sms-otp', //post
	SEND_EMAIL_OTP: '/auth/send-email-otp', //post

	//Drivers
	SET_DRIVER_INFO: '/api/driver/info', //post
	GET_DRIVER_INFO: '/api/driver/info', //get
	UPDATE_DRIVER_INFO: '/api/driver/info', //put
	DELETE_DRIVER_INFO: '/api/driver/info', //delete

	// Driver car details
	SET_DRIVER_CAR_DETAILS: '/api/driver/car-details', //post
	GET_DRIVER_CAR_DETAILS: '/api/driver/car-details', //get
	UPDATE_DRIVER_CAR_DETAILS: '/api/driver/car-details', // /{car-id} put
	DELETE_DRIVER_CAR_DETAILS: '/api/driver/car-details', // /{car-id} delete
};
