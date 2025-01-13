const phoneNumberCode = {
	US: {
		countryName: 'United States',
		dialingCode: '1',
	},
	DE: {
		countryName: 'Germany',
		dialingCode: '49',
	},
	IN: {
		countryName: 'India',
		dialingCode: '91',
	},
	GB: {
		countryName: 'United Kingdom',
		dialingCode: '44',
	},
	FR: {
		countryName: 'France',
		dialingCode: '33',
	},
	CA: {
		countryName: 'Canada',
		dialingCode: '1',
	},
	AU: {
		countryName: 'Australia',
		dialingCode: '61',
	},
	ES: {
		countryName: 'Spain',
		dialingCode: '34',
	},
	IT: {
		countryName: 'Italy',
		dialingCode: '39',
	},
	BR: {
		countryName: 'Brazil',
		dialingCode: '55',
	},
	JP: {
		countryName: 'Japan',
		dialingCode: '81',
	},
	CN: {
		countryName: 'China',
		dialingCode: '86',
	},
	MX: {
		countryName: 'Mexico',
		dialingCode: '52',
	},
	RU: {
		countryName: 'Russia',
		dialingCode: '7',
	},
	ZA: {
		countryName: 'South Africa',
		dialingCode: '27',
	},
	KR: {
		countryName: 'South Korea',
		dialingCode: '82',
	},
	NL: {
		countryName: 'Netherlands',
		dialingCode: '31',
	},
	SE: {
		countryName: 'Sweden',
		dialingCode: '46',
	},
	CH: {
		countryName: 'Switzerland',
		dialingCode: '41',
	},
	SG: {
		countryName: 'Singapore',
		dialingCode: '65',
	},
	AR: {
		countryName: 'Argentina',
		dialingCode: '54',
	},
	NG: {
		countryName: 'Nigeria',
		dialingCode: '234',
	},
	PK: {
		countryName: 'Pakistan',
		dialingCode: '92',
	},
	KW: {
		countryName: 'Kuwait',
		dialingCode: '965',
	},
	AE: {
		countryName: 'United Arab Emirates',
		dialingCode: '971',
	},
	TH: {
		countryName: 'Thailand',
		dialingCode: '66',
	},
	EG: {
		countryName: 'Egypt',
		dialingCode: '20',
	},
	NG: {
		countryName: 'Nigeria',
		dialingCode: '234',
	},
	PH: {
		countryName: 'Philippines',
		dialingCode: '63',
	},
	TR: {
		countryName: 'Turkey',
		dialingCode: '90',
	},
	CO: {
		countryName: 'Colombia',
		dialingCode: '57',
	},
};

const getPhoneCode = (countryCode: string) => {
	const country = phoneNumberCode?.[countryCode.toUpperCase()];
	return country ? country.dialingCode : '91';
};

export { getPhoneCode };
