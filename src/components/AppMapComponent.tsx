import React, { useEffect, useRef, useState } from 'react';
import { Image, PermissionsAndroid, Platform, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';
import Location from '../services/locationServices';
import { darkTheme, lightTheme } from '../theme/AppColors';
import AppHeader from './AppHeader';
import { AppMargin } from '../constants/commonStyle';
import metrics from '../constants/metrics';
import { Icons } from '../assets/Icons';
import { useTheme } from '../theme/ThemeProvider';

interface AppMapComponentProps {
	children?: React.ReactNode;
	goBack: () => void;
}

const AppMapComponent = (props: AppMapComponentProps) => {
	// State variables
	const [initialRegion, setInitialRegion] = useState<any>(null);
	const [coordinateAddress, setCoordinateAddress] = useState<any>(null);
	const [mapLocation, setMapLocation] = useState<any>(null);
	const colorScheme = useColorScheme();
	const { AppColors, isDarkMode } = useTheme();

	// Determine the theme based on the color scheme
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const mapRef = useRef<any>(null);

	const markerCoordinates = { latitude: 52.4, longitude: 18.7 };

	const requestLocationPermission = async () => {
		if (Platform.OS === 'android') {
			const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
			return granted === PermissionsAndroid.RESULTS.GRANTED;
		}
		return true;
	};

	const animateMapToLocation = (location: any) => {
		if (mapRef.current) {
			mapRef.current.animateToRegion(
				{
					latitude: location.latitude,
					longitude: location.longitude,
					latitudeDelta: 20.417346741928917, // Zoom level
					longitudeDelta: 17.138553019029175, // Zoom level
				},
				1000, // Animation duration in milliseconds
			);
		}
	};

	// Fetch user's current location and update the map region
	useEffect(() => {
		const fetchCurrentLocation = async () => {
			const hasPermission = await requestLocationPermission();

			if (hasPermission) {
				const currentLocation = await Location.getCurrentPosition();
				console.log('Fetched current location:', currentLocation);

				// Set initial region based on current location
				const newRegion = {
					latitude: currentLocation?.latitude ?? 23.1, // Default fallback latitude
					longitude: currentLocation?.longitude ?? 72.5, // Default fallback longitude
					latitudeDelta: currentLocation?.latitudeDelta ?? 0.0922, // Default zoom level
					longitudeDelta: currentLocation?.longitudeDelta ?? 0.0421, // Default zoom level
				};

				setInitialRegion(newRegion);
				setCoordinateAddress(newRegion);
				setMapLocation(newRegion);

				setTimeout(() => {
					animateMapToLocation(markerCoordinates);
				}, 1000);
			}
		};

		fetchCurrentLocation();
	}, []);

	const getMapStyle = theme => {
		return [
			{
				elementType: 'geometry',
				stylers: [
					{
						color: '#212121', // Dark background for the map
					},
				],
			},
			{
				elementType: 'labels.icon',
				stylers: [
					{
						visibility: 'off', // Hide map icons for better contrast
					},
				],
			},
			{
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#FFFFFF', // White text for labels to enhance contrast
					},
				],
			},
			{
				elementType: 'labels.text.stroke',
				stylers: [
					{
						color: '#212121', // Dark stroke behind text for readability
					},
				],
			},
			{
				featureType: 'administrative',
				elementType: 'geometry.fill',
				stylers: [
					{
						color: '#757575', // Medium gray for administrative areas
					},
				],
			},
			{
				featureType: 'landscape',
				elementType: 'geometry',
				stylers: [
					{
						color: '#212121', // Dark background for landscapes
					},
				],
			},
			{
				featureType: 'poi',
				elementType: 'geometry',
				stylers: [
					{
						color: '#424242', // Darker points of interest (POI)
					},
				],
			},
			// Adjust roads to ensure visibility with bright colors
			{
				featureType: 'road',
				elementType: 'geometry',
				stylers: [
					{
						color: '#6600CCF', // Bright orange for roads (try different colors if needed)
					},
				],
			},
			{
				featureType: 'road.arterial',
				elementType: 'geometry',
				stylers: [
					{
						color: '#6600CCF', // Bright orange for arterial roads
					},
				],
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry',
				stylers: [
					{
						color: '#6600CCF', // High-contrast bright red-orange for highways
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'geometry',
				stylers: [
					{
						color: '#079ED9', // Contrasting teal for water bodies
					},
				],
			},
			{
				featureType: 'transit',
				elementType: 'geometry',
				stylers: [
					{
						color: '#009688', // Teal color for transit lines
					},
				],
			},
		];
	};

	const onBackPress = () => {
		props.goBack();
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => props.goBack()}
				style={{
					top: metrics.verticalScale(50),
					left: metrics.horizontalScale(25),
					zIndex: 1,
					position: 'absolute',
					height: metrics.moderateScale(40),
					width: metrics.moderateScale(40),
					backgroundColor: AppColors.secondary,
					borderRadius: metrics.moderateScale(25),
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<Image
					style={{ tintColor: AppColors.text, right: metrics.horizontalScale(1) }}
					resizeMode="contain"
					source={Icons.icnBack}
				/>
			</TouchableOpacity>
			{/* <AppHeader buttonTitle={''} top={AppMargin._30} onBack={onBackPress} /> */}
			{/* Render the map only if initialRegion is set */}
			{initialRegion && (
				<MapView
					ref={mapRef}
					style={styles.map}
					customMapStyle={getMapStyle(theme)}
					initialRegion={initialRegion}
					provider="google"
					showsUserLocation={true}
					onRegionChangeComplete={region => {
						console.log('Region changed to:', region);
					}}>
					{/* Static markers */}
					<Marker coordinate={markerCoordinates} />
					<Marker coordinate={{ latitude: 52.1, longitude: 18.4 }} />
					<Marker coordinate={{ latitude: 52.6, longitude: 18.3 }} />
					<Marker coordinate={{ latitude: 51.6, longitude: 18.0 }} />
					<Marker coordinate={{ latitude: 53.1, longitude: 18.8 }} />
					<Marker coordinate={{ latitude: 52.9, longitude: 19.4 }} />
					<Marker coordinate={{ latitude: 52.2, longitude: 21 }} />
					<Marker coordinate={{ latitude: 52.4, longitude: 21 }} />
					<Marker coordinate={{ latitude: 51.8, longitude: 20 }} />

					{props.children}
				</MapView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		flex: 1, // Ensure map takes the full container space
	},
});

export default AppMapComponent;
