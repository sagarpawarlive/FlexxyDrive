export interface Theme {
	[x: string]: string | undefined;
	background: string;
	text: string;
	textDark: string;
	white: string;
	primary: string;
	primaryTransparent: string;
	primaryTransparent8: string;
	secondary: string;
	secondaryTransparent: string;
	placeholder: string;
	backButton: string;
	error: string;
	success: string;
	warning: string;
	modalBackground: string;
	verifiedColor: string;
	textInputBorderColor?: string;
	verified?: string;
}
