import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    timeZone: 'Asia/Kolkata', 
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const Data = ({ navigation, onSelect = () => {} }) => {
  const [locationData, setLocationData] = useState([]);
  const [npkData, setNpkData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationResponse = await fetch('https://api.thingspeak.com/channels/2586125/fields/1,2.json?api_key=HO4I0XZDMP021OVS&results=15');
        const locationDataJson = await locationResponse.json();
        setLocationData(prevLocationData => [...locationDataJson.feeds.reverse(), ...prevLocationData]);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    const fetchNpkData = async () => {
      try {
        const npkQuery = query(collection(db, 'NPK'), orderBy('timestamp', 'desc'), limit(15));
        const npkSnapshot = await getDocs(npkQuery);
        const npkData = npkSnapshot.docs.map(doc => doc.data());
        setNpkData(npkData);
      } catch (error) {
        console.error('Error fetching NPK data:', error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchLocationData(), fetchNpkData()]);
      setLoading(false);
    };

    fetchData(); 
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Button
        title="Manual Update"
        onPress={() => navigation.navigate('ManualUpdate')}
      />

<Text style={styles.header}>N, P, K Values (Firestore)</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>N</Text>
          <Text style={styles.tableHeader}>P</Text>
          <Text style={styles.tableHeader}>K</Text>
        </View>
        {npkData.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{item.nitrogen}</Text>
            <Text style={styles.tableCell}>{item.phosphorus}</Text>
            <Text style={styles.tableCell}>{item.potassium}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.header}>Location Data (Channel 1)</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Latitude</Text>
          <Text style={styles.tableHeader}>Longitude</Text>
          <Text style={styles.tableHeader}>Timestamp</Text>
        </View>
        {locationData.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{item.field1}</Text>
            <Text style={styles.tableCell}>{item.field2}</Text>
            <Text style={styles.tableCell}>{formatDate(item.created_at)}</Text>
          </View>
        ))}
      </View>

      
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff', 
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center', 
  },
  tableCell: {
    flex: 1,
    textAlign: 'center', 
    padding: 5,
  },
});

export default Data;
