import I18n from 'react-native-i18n';
import English from './labels/english.json';
import German from './labels/german.json';
import Japanese from './labels/japanese.json';
import Spanish from './labels/spanish.json';

// Configure i18n
I18n.fallbacks = true;
I18n.translations = {
	en: English,
	de: German,
};

// You can set the initial locale here if needed
// I18n.locale = 'en';

// Create a translation function
export const t = (name: any, params = {}) => {
	return I18n.t(name, params);
};
