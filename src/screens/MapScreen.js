import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const MapScreen = () => {
	const [pin, setPin] = useState({ latitude: 49.2606, longitude: -123.246 });

	return (
		<View>
			<GooglePlacesAutocomplete
				placeholder='Search'
				fetchDetails={true}
				GooglePlacesSearchQuery={{
					rankby: 'distance',
				}}
				onPress={(data, details = null) => {
					// 'details' is provided when fetchDetails = true
					console.log(data, details);
					setPin({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
					});
				}}
				query={{
					key: 'API_KEY',
					language: 'en',
					component: 'country:ca',
					radius: 30000,
					location: `${pin.latitude}, ${pin.longitude}`,
				}}
				styles={{
					container: { flex: 0, position: 'absolute', width: '100%', zIndex: 1 },
					listView: { backgroundColor: 'white' },
				}}
			/>
			<MapView
				style={styles.map}
				// ref={(ref) => (this.mapView = ref)}
				showsMyLocationButton={true}
				initialRegion={{
					latitude: 49.2606,
					longitude: -123.246,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
				provider='google'

				onPress={ (event) => {
					console.log(event.nativeEvent.coordinate)
					let data = {
					  "coordinates": event.nativeEvent.coordinate
					}
					fetch("http://localhost:8000/api/detection", {
					  method: "POST",
					  body: JSON.stringify(data)
					})
					  .then(response => response.json())
					  .then(response => {
						console.log(response.content);
						console.log(response.originator.name)
					  })
					  .catch(err => {
						console.log(err);
					  });
				  } }
				>
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
};

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

export default MapScreen;
