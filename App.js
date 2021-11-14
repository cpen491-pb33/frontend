import React, { useState } from 'react';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function App() {
	const [pin, setPin] = useState({ latitude: 49.2606, longitude: -123.246 });
	const [region, setRegion] = useState({
		latitude: 49.2606,
		longitude: -123.246,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	});

	return (
		<View style={{ marginTop: 50, flex: 1 }}>
			<GooglePlacesAutocomplete
				placeholder='Search'
				fetchDetails={true}
				GooglePlacesSearchQuery={{
					rankby: 'distance',
				}}
				onPress={(data, details = null) => {
					// 'details' is provided when fetchDetails = true
					console.log(data, details);
					setRegion({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					});
				}}
				query={{
					key: 'AIzaSyDPElsc6CXwUH3HfcMITKLA-veUQjFG71A',
					language: 'en',
					component: 'country:ca',
					radius: 30000,
					location: `${region.latitude}, ${region.longitude}`,
				}}
				styles={{
					container: { flex: 0, position: 'absolute', width: '100%', zIndex: 1 },
					listView: { backgroundColor: 'white' },
				}}
			/>
			<MapView
				style={styles.map}
				initialRegion={{
					latitude: 49.2606,
					longitude: -123.246,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
				provider='google'
			>
				<Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
				<Marker
					coordinate={pin}
					pinColor='green'
					draggable={true}
					onDragStart={(e) => {
						console.log('Drag start', e.nativeEvent.coordinates);
					}}
					onDragEnd={(e) => {
						setPin({
							latitude: e.nativeEvent.coordinate.latitude,
							longitude: e.nativeEvent.coordinate.longitude,
						});
					}}
				>
					<Callout>
						<Text>I am here</Text>
					</Callout>
				</Marker>
				<Circle center={pin} radius={1000} />
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	map: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
});
