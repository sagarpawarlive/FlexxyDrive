import { Platform } from 'react-native';
import metrics from '../../../../../../src/constants/metrics';

const iosFonts = {
	REGULAR: 'Onest-Regular',
	MEDIUM: 'Onest-Medium',
	BOLD: 'Onest-Bold',
};

const androidFonts = {
	REGULAR: 'Onest-Regular',
	MEDIUM: 'Onest-Medium',
	BOLD: 'Onest-Bold',
};

export const Fonts = {
	...(Platform.OS === 'ios' ? iosFonts : androidFonts),
};

export const FontSize = {
	_40: metrics.moderateScale(40),
	_39: metrics.moderateScale(39),
	_38: metrics.moderateScale(38),
	_37: metrics.moderateScale(37),
	_36: metrics.moderateScale(36),
	_35: metrics.moderateScale(35),
	_34: metrics.moderateScale(34),
	_33: metrics.moderateScale(33),
	_32: metrics.moderateScale(32),
	_30: metrics.moderateScale(30),
	_28: metrics.moderateScale(28),
	_26: metrics.moderateScale(26),
	_25: metrics.moderateScale(25),
	_24: metrics.moderateScale(24),
	_23: metrics.moderateScale(23),
	_22: metrics.moderateScale(22),
	_21: metrics.moderateScale(21),
	_20: metrics.moderateScale(20),
	_18: metrics.moderateScale(18),
	_16: metrics.moderateScale(16),
	_15: metrics.moderateScale(15),
	_14: metrics.moderateScale(14),
	_13: metrics.moderateScale(13),
	_12: metrics.moderateScale(12),
	_11: metrics.moderateScale(11),
	_10: metrics.moderateScale(10),
};
