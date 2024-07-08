import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManualUpdate = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [n, setN] = useState('');
  const [p, setP] = useState('');
  const [k, setK] = useState('');
  const [data, setData] = useState([]);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('savedData');
        if (savedData !== null) {
          setData(JSON.parse(savedData));
          console.log('Data loaded from AsyncStorage:', JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    fetchData();
  }, []);

  
  const saveData = async (newData) => {
    try {
      await AsyncStorage.setItem('savedData', JSON.stringify(newData));
      console.log('Data saved to AsyncStorage:', newData);
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  
  const sendDataToThingSpeak = async (tsData) => {
    try {
      const response = await fetch(`https://api.thingspeak.com/update.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tsData),
      });

      if (response.ok) {
        console.log('Data uploaded to ThingSpeak successfully.');
      } else {
        console.error('Failed to upload data to ThingSpeak.');
      }
    } catch (error) {
      console.error('Error uploading data to ThingSpeak:', error);
    }
  };

  const handleAdd = async () => {
    if (!latitude || !longitude || !n || !p || !k) {
      console.error('Please fill in all fields.');
      return;
    }

    const newData = {
      id: Date.now().toString(),
      latitude,
      longitude,
      n,
      p,
      k,
    };

    const updatedData = [...data, newData];
    setData(updatedData);
    await saveData(updatedData);

    
    const tsData = {
      api_key: '9FCBJCHUZDT0M9I8', 
      field1: latitude.toString(),
      field2: longitude.toString(),
      field3: n.toString(),
      field4: p.toString(),
      field5: k.toString(),
    };
    sendDataToThingSpeak(tsData);

    
    setLatitude('');
    setLongitude('');
    setN('');
    setP('');
    setK('');
  };

  return (
    <View style={styles.container}>
      <Text>Manual Update to ThingSpeak Channel</Text>
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
      />
      <TextInput
        style={styles.input}
        placeholder="N Value"
        value={n}
        onChangeText={setN}
      />
      <TextInput
        style={styles.input}
        placeholder="P Value"
        value={p}
        onChangeText={setP}
      />
      <TextInput
        style={styles.input}
        placeholder="K Value"
        value={k}
        onChangeText={setK}
      />
      <Button title="Add to Table" onPress={handleAdd} />

      <View style={styles.tableContainer}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{item.latitude}</Text>
              <Text style={styles.cell}>{item.longitude}</Text>
              <Text style={styles.cell}>{item.n}</Text>
              <Text style={styles.cell}>{item.p}</Text>
              <Text style={styles.cell}>{item.k}</Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <View style={styles.row}>
              <Text style={styles.headerCell}>Latitude</Text>
              <Text style={styles.headerCell}>Longitude</Text>
              <Text style={styles.headerCell}>N Value</Text>
              <Text style={styles.headerCell}>P Value</Text>
              <Text style={styles.headerCell}>K Value</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  tableContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
});

export default ManualUpdate;

