import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';  // Importing Ionicons for the search icon

const LocationComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
      fetchAddressFromCoordinates(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    const apiKey = "AIzaSyBHCNET6A4CoxCkLMb-5gjyzJWSGAyD2VQ";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
      } else {
        console.error("No address found for the coordinates");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const fetchCoordinatesFromAddress = async (address) => {
    const apiKey = "AIzaSyBHCNET6A4CoxCkLMb-5gjyzJWSGAyD2VQ";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setDestinationLocation(location);
        fetchRoute(location.lat, location.lng);
      } else {
        console.error("No coordinates found for the address");
        setDestinationLocation(null);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setDestinationLocation(null);
    }
  };

  const fetchRoute = async (destLat, destLng) => {
    if (userLocation) {
      const apiKey = "AIzaSyBHCNET6A4CoxCkLMb-5gjyzJWSGAyD2VQ";
      const origin = `${userLocation.latitude},${userLocation.longitude}`;
      const destination = `${destLat},${destLng}`;
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes.length > 0) {
          console.log("Directions API response:", data);
          const points = data.routes[0].overview_polyline.points;
          const decodedPoints = decodePolyline(points);
          setRouteCoordinates(decodedPoints);
        } else {
          console.error("No route found");
          setRouteCoordinates([]);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        setRouteCoordinates([]);
      }
    }
  };

  const decodePolyline = (t) => {
    let index = 0, len = t.length;
    const array = [];
    let lat = 0, lng = 0;
    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      array.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
    }
    return array;
  };

  const handleDestinationSubmit = () => {
    if (destinationAddress) {
      fetchCoordinatesFromAddress(destinationAddress);
    }
  };

  if (!userLocation) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const mapRegion = {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter destination address"
          value={destinationAddress}
          onChangeText={setDestinationAddress}
        />
        <TouchableOpacity onPress={handleDestinationSubmit}>
          <Ionicons name="search" size={25} color="gray" />
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        region={mapRegion}
      >
        {userLocation && (
          <Marker
            coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
            title="Your Location"
          />
        )}
        {destinationLocation && (
          <Marker
            coordinate={{ latitude: destinationLocation.lat, longitude: destinationLocation.lng }}
            title="Destination Location"
            pinColor="red"
          />
        )}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="blue"
            strokeWidth={3}
          />
        )}
      </MapView>
      {address && (
        <Text style={styles.address}>{address}</Text>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    elevation: 3,
    zIndex: 1, // Ensures it stays on top of the map
    alignItems: 'center', // Aligns text input and icon
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '85%',
    paddingHorizontal: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  address: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationComponent;
