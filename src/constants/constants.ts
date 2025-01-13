import { Platform, Alert } from 'react-native';
import { name as appName } from '../../app.json';
import { Images } from '../assets/images';
import { t } from '../i18n';

export const APP_TITLE = appName;
export const isIOS = Platform.OS === 'ios';

export const nativeAlert = async (msg: string, title = APP_TITLE) => {
	Alert.alert(title, msg);
};

export const nativeAlertwithAction = async (title: string, msg: string, callback = (result: boolean) => {}) => {
	Alert.alert(title, msg, [
		{
			text: 'Cancel',
			onPress: () => callback(false),
			style: 'cancel',
		},
		{ text: 'OK', onPress: () => callback(true) },
	]);
};

export const generateUniqueFileName = originalName => {
	const timestamp = new Date().getTime(); // Get current timestamp
	const extension = originalName.split('.').pop(); // Get the file extension
	return `${timestamp}.${extension}`;
};

export const onboardingDummyData = [
	{
		id: 1,
		img: Images.imgOnboarding1,
		title: t('onboardingTitleOne'),
		// description: 'desc',
	},
	{
		id: 2,
		img: Images.imgOnboarding2,
		title: t('onboardingTitleTwo'),
		description: 'desc',
	},
	{
		id: 3,
		img: Images.imgOnboarding3,
		title: t('onboardingTitleThree'),
		description: 'desc',
	},
];
