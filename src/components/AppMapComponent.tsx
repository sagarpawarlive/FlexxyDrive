import React, { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';
import Location from '../services/locationServices';

interface AppMapComponentProps {
	children?: React.ReactNode;
}

const AppMapComponent = (props: AppMapComponentProps) => {
	// State variables
	const [initialRegion, setInitialRegion] = useState<any>(null);
	const [coordinateAddress, setCoordinateAddress] = useState<any>(null);
	const [mapLocation, setMapLocation] = useState<any>(null);

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

	return (
		<View style={styles.container}>
			{/* Render the map only if initialRegion is set */}
			{initialRegion && (
				<MapView
					ref={mapRef}
					style={styles.map}
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
