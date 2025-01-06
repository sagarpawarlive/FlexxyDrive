import * as React from 'react';
import { Text, View, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import MainContainer from '../../components/MainContainer';
import MapView, { Marker } from 'react-native-maps';
import Location from '../../services/locationServices';
import { MAP_KEY } from '../../config';

interface MapScreenProps {}

const MapScreen = (props: MapScreenProps) => {
	const [initialRegion, setInitialRegion] = React.useState<any>({
		latitude: 37.78825,
		longitude: -122.4324,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	});
	const [coordinateAddress, setCoordinateAddress] = React.useState<any>(null);
	const [mapLocation, setMapLocation] = React.useState<any>(null);

	// Request location permission for Android
	const requestLocationPermission = async () => {
		if (Platform.OS == 'android') {
			const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
			return granted === PermissionsAndroid.RESULTS.GRANTED;
		}
		return true;
	};

	React.useEffect(() => {
		const fetchCurrentLocation = async () => {
			const hasPermission = await requestLocationPermission();
			if (hasPermission) {
				let currentLocation = await Location.getCurrentPosition();
				console.log('Fetched current location:', currentLocation);

				const initialRegion = {
					latitude: currentLocation.latitude,
					longitude: currentLocation.longitude,
					latitudeDelta: currentLocation.latitudeDelta ?? 0.0922, // Default zoom level
					longitudeDelta: currentLocation.longitudeDelta ?? 0.0421, // Default zoom level
				};

				// Update the state with the fetched location data
				setInitialRegion(initialRegion);
				setCoordinateAddress(initialRegion); // This can be used to store address info if needed
				setMapLocation(initialRegion);
			}
		};

		fetchCurrentLocation();
	}, []);

	return (
		<MainContainer>
			<View style={styles.container}>
				<MapView
					style={{ flex: 1 }}
					provider="google"
					initialRegion={initialRegion} // Pass initialRegion to the MapView
					showsUserLocation={true} // Show user location on the map
					followUserLocation={true} // Keep the map centered on user's location
				>
					{/* {mapLocation && (
						<Marker
							coordinate={{
								latitude: mapLocation?.latitude,
								longitude: mapLocation?.longitude,
							}}
							title="Current Location"
						/>
					)} */}
				</MapView>
			</View>
		</MainContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default MapScreen;
