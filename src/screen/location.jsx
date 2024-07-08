import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const LocationComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null); // State to store the fetched address

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      // Fetch address from coordinates
      fetchAddressFromCoordinates(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    // Replace with your Google Maps Geocoding API key
    const apiKey = "AIzaSyBHCNET6A4CoxCkLMb-5gjyzJWSGAyD2VQ";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
        console.log("Formatted Address:", formattedAddress);

       
        storeDataInThingSpeak(latitude, longitude, formattedAddress);
      } else {
        console.error("No address found for the coordinates");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const storeDataInThingSpeak = (latitude, longitude, address) => {
    
    const channelID = "2586125";
    const apiKey = "9FCBJCHUZDT0M9I8";

    const url = `https://api.thingspeak.com/update?api_key=${apiKey}&field1=${latitude}&field2=${longitude}&field3=${encodeURIComponent(address)}`;

    fetch(url, {
      method: 'POST'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Data sent to ThingSpeak:', data);
    })
    .catch(error => {
      console.error('Error sending data to ThingSpeak:', error);
    });
  };

  if (!userLocation) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={userLocation} />
      </MapView>
      {address && (
        <Text style={styles.address}>{address}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
