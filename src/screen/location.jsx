import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LocationComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]); // To store alternative routes
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // New state for current step

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
      
      const id = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (newLocation) => {
          setUserLocation(newLocation.coords);
          checkProximity(newLocation.coords);
        }
      );

      setWatchId(id);
    })();

    return () => {
      if (watchId) {
        watchId.remove();
      }
    };
  }, []);

  const checkProximity = (currentLocation) => {
    if (destinationLocation && routeCoordinates.length > 0) {
      const nextStep = routeCoordinates[currentStepIndex + 1];

      if (nextStep) {
        const distance = getDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          nextStep.latitude,
          nextStep.longitude
        );

        if (distance <= 100) {
          // Update to next step if close enough
          if (currentStepIndex < routeCoordinates.length - 2) {
            setCurrentStepIndex(currentStepIndex + 1);
            Alert.alert("Next Step", `Proceed to the next step.`);
          } else {
            Alert.alert("You have reached your destination!", "You have completed your route.");
          }
        }
      }
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Convert to meters
  };

  const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    const apiKey = "AIzaSyBHCNET6A4CoxCkLMb-5gjyzJWSGAyD2VQ"; // Replace with your Geocoding API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const fetchCoordinatesFromAddress = async (address) => {
    const apiKey = "AIzaSyBHCNET6A4CoxCkLMb-5gjyzJWSGAyD2VQ"; // Replace with your Geocoding API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setDestinationLocation(location);
        fetchRoute(location.lat, location.lng);
      } else {
        console.error("No coordinates found for the address", data);
        setDestinationLocation(null);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setDestinationLocation(null);
    }
  };

  const fetchRoute = async (destLat, destLng) => {
    if (userLocation) {
      const apiKey = "AIzaSyBHCNET6A4CoxCkLMb-5gjyzJWSGAyD2VQ"; // Replace with your Directions API key
      const origin = `${userLocation.latitude},${userLocation.longitude}`;
      const destination = `${destLat},${destLng}`;
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&alternatives=true&key=${apiKey}`; // Add alternatives=true for multiple routes

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const mainRoutePoints = data.routes[0].overview_polyline.points;
          const decodedPoints = decodePolyline(mainRoutePoints);
          setRouteCoordinates(decodedPoints);

          const altRoutes = data.routes.slice(1).map(route => decodePolyline(route.overview_polyline.points));
          setAlternativeRoutes(altRoutes); // Store alternative routes
        } else {
          console.error("No route found", data);
          setRouteCoordinates([]);
          setAlternativeRoutes([]); // Clear alternative routes if no route found
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        setRouteCoordinates([]);
        setAlternativeRoutes([]); // Clear alternative routes on error
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
            strokeColor="#000" // Optional: Change the color of the route
            strokeWidth={5} // Optional: Change the width of the route
          />
        )}
      </MapView>
      {routeCoordinates.length > 0 && currentStepIndex < routeCoordinates.length && (
        <Text style={styles.stepText}>
          Current Step: {currentStepIndex + 1} / {routeCoordinates.length - 1}
        </Text>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
  },
  stepText: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default LocationComponent;
