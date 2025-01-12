import { Icons } from '../assets/Icons';
import { t } from '../i18n';

export const imagesData = [
	{ id: 1, src: Icons.icnGoogle, label: 'Google' },
	{ id: 2, src: Icons.icnApple, label: 'Apple' },
	{ id: 3, src: Icons.icnFacebook, label: 'Facebook' },
];

export const ImagesDataAndroid = [
	{ id: 1, src: Icons.icnGoogle, label: 'Google' },
	{ id: 3, src: Icons.icnFacebook, label: 'Facebook' },
];

export const fuelType = [
	'Petrol',
	'Diesel',
	'Electric',
	'Hybrid (Petrol/Electric)',
	'Hybrid (Diesel/Electric)',
	'CNG',
	'Other',
];

export const AddDocumentsOptions = [
	{ id: 1, icon: Icons.icnLargePicker, name: t('drivingLicence'), description: t('anOfficialDocument') },
	{ id: 2, icon: Icons.icnCamera, name: t('uploadPhoto'), description: t('captureSelfie') },
];
