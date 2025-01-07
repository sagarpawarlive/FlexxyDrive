import Geolocation from '@react-native-community/geolocation';

interface locationItem {
	latitude: number;
	longitude: number;
	latitudeDelta: number;
	longitudeDelta: number;
}

const Location = {
	watchId: null as number | null,

	askPermission: async function () {
		Geolocation.requestAuthorization();
	},

	getCurrentPosition: async function (): Promise<any> {
		let current_loc: locationItem = { latitude: 0.0, longitude: 0.0, latitudeDelta: 0, longitudeDelta: 0 };
		try {
			const position: any = await new Promise((resolve, reject) => {
				Geolocation.getCurrentPosition(resolve, reject, {
					enableHighAccuracy: false,
					maximumAge: 30000,
					timeout: 10000,
				});
			});

			let location: any = position.coords;
			current_loc.latitude = location.latitude;
			current_loc.longitude = location.longitude;
			current_loc.latitudeDelta = location.latitudeDelta ?? 0;
			current_loc.longitudeDelta = location.longitudeDelta ?? 0;
			return current_loc;
		} catch (error) {
			console.log('!@@ position catch error', error);
			return { latitude: 0.0, longitude: 0.0 };
		}
	},

	startWatchingPosition: function (callback: (location: locationItem) => void) {
		if (this.watchId === null) {
			this.watchId = Geolocation.watchPosition(
				position => {
					const { latitude, longitude } = position.coords;
					callback({ latitude, longitude });
				},
				error => console.log('!@@ watchPosition error', error),
				{ enableHighAccuracy: false, distanceFilter: 0 },
			);
		}
	},

	stopWatchingPosition: function () {
		if (this.watchId !== null) {
			Geolocation.clearWatch(this.watchId);
			this.watchId = null;
		}
	},
};

export default Location;
