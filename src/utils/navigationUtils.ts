import React from 'react';

// Create a ref for the navigator
export const navigationRef = React.createRef<any>();

// Navigation service with common navigation actions
const navigate = (name: string, params?: any) => {
	navigationRef.current?.navigate(name, params);
};

const goBack = () => {
	navigationRef.current?.goBack();
};

const reset = (index: any, routes: any) => {
	console.log(navigationRef, '<== navigationRef');

	navigationRef.current?.reset({
		index,
		routes,
	});
};

// Other possible actions
const replace = (name: any, params?: any) => {
	navigationRef.current?.replace(name, params);
};

const getCurrentRoute = () => {
	return navigationRef.current?.getCurrentRoute();
};

const popToTop = () => {
	navigationRef.current?.popToTop();
};

export { navigate, goBack, reset, getCurrentRoute, replace, popToTop };
