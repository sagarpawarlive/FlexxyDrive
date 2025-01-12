import * as Yup from 'yup';
import { t } from '../i18n';

// Common validation rules
export const usernameValidation = Yup.string().required(t('usernameRequired'));

export const passwordValidation = Yup.string().min(8, t('passwordLength8')).required(t('passwordRequired'));

export const confirmPasswordValidation = Yup.string()
	.oneOf([Yup.ref('password'), null], t('passwordMustMatch'))
	.required(t('confirmPasswordRequired'));

export const firstNameValidation = Yup.string().required(t('firstNameRequired'));

export const lastNameValidation = Yup.string().required(t('lastNameRequired'));

export const fullnameValidation = Yup.string().required(t('fullNameRequired'));

export const phoneValidation = Yup.string()
	.matches(/^[0-9]{10,15}$/, t('phone1015'))
	.required(t('phoneRequired'));

export const emailValidation = Yup.string().email(t('emailInvalid')).required(t('emailRequired'));

export const cityValidation = Yup.string().required(t('cityRequired'));

export const postCodeValidation = Yup.string().required(t('postCodeRequired'));

export const streetValidation = Yup.string().required(t('streetIsRequired'));

export const streetNumberValidation = Yup.string().required(t('streetNumberIsRequired'));

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
