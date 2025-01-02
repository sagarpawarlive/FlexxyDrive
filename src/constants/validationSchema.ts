import * as Yup from 'yup';

// Common validation rules
export const usernameValidation = Yup.string().required('Username is required');

export const passwordValidation = Yup.string()
	.min(8, 'Password must be at least 8 characters long')
	.required('Password is required');

export const confirmPasswordValidation = Yup.string()
	.oneOf([Yup.ref('password'), null], 'Passwords must match')
	.required('Confirm Password is required');

export const firstNameValidation = Yup.string().required('First name is required');

export const lastNameValidation = Yup.string().required('Last name is required');

export const fullnameValidation = Yup.string().required('Fullname is required');

export const phoneValidation = Yup.string()
	.matches(/^[0-9]{10,15}$/, 'Phone number must be 10 and 15 digits')
	.required('Phone number is required');

export const emailValidation = Yup.string().email('Invalid email').required('Email is required');

export const cityValidation = Yup.string().required('City is required');

export const postCodeValidation = Yup.string().required('Post code is required');

export const streetValidation = Yup.string().required('Street is required');

export const streetNumberValidation = Yup.string().required('Street number is required');

export const firstRegistrationValidation = Yup.number()
	.positive('Registration year must be a positive number')
	.integer('Registration year must be an integer')
	.min(1989, 'Registration year must be after 1989')
	.max(new Date().getFullYear(), 'Registration year cannot be in the future')
	.required('Registration year is required');

export const fuelValidation = Yup.string().required('Fuel type is required');

export const colorValidation = Yup.string().required('Color is required');

export const licencePlateValidation = Yup.string()
	.required('License plate number is required')
	.matches(/^[A-Z0-9]+$/, 'License plate must be alphanumeric');
