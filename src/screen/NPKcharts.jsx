import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { db } from '../../firebaseConfig'; 
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const NpkChart = () => {
  const [npkData, setNpkData] = useState({ N: 0, P: 0, K: 0 });
  const [loading, setLoading] = useState(true);
  const [documentId, setDocumentId] = useState(null); 

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const fetchDataFromFirestore = async () => {
    try {
      const q = query(collection(db, 'NPK'), orderBy('timestamp', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const latestDoc = querySnapshot.docs[0];
        const data = latestDoc.data();
        console.log('Fetched latest data from Firestore:', data);
        setNpkData({
          N: parseFloat(data.nitrogen),
          P: parseFloat(data.phosphorus),
          K: parseFloat(data.potassium)
        });
        setDocumentId(latestDoc.id); 
      } else {
        console.log('No documents found.');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>NPK Data</Text>
      </View>
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {/* Nitrogen */}
          <View style={[styles.bar, { height: npkData.N * 5, backgroundColor: 'rgba(0, 128, 0, 0.8)' }]}>
            <Text style={styles.label}>{npkData.N.toFixed(2)}</Text>
          </View>
          {/* Phosphorus */}
          <View style={[styles.bar, { height: npkData.P * 5, backgroundColor: 'rgba(255, 0, 0, 0.8)' }]}>
            <Text style={styles.label}>{npkData.P.toFixed(2)}</Text>
          </View>
          {/* Potassium */}
          <View style={[styles.bar, { height: npkData.K * 5, backgroundColor: 'rgba(0, 0, 255, 0.8)' }]}>
            <Text style={styles.label}>{npkData.K.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.legend}>
          <View style={[styles.legendItem, { backgroundColor: 'rgba(0, 128, 0, 0.8)' }]} />
          <Text>Nitrogen</Text>
          <View style={[styles.legendItem, { backgroundColor: 'rgba(255, 0, 0, 0.8)' }]} />
          <Text>Phosphorus</Text>
          <View style={[styles.legendItem, { backgroundColor: 'rgba(0, 0, 255, 0.8)' }]} />
          <Text>Potassium</Text>
        </View>
      </View>
      {/* Display document ID at the bottom */}
      <View style={styles.documentIdContainer}>
        <Text style={styles.documentIdText}>Document ID: {documentId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  header: {
    marginBottom: 10,
    alignItems: 'center'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: Dimensions.get('window').width - 40,
    height: 300,
    borderRadius: 10,
    overflow: 'hidden'
  },
  bar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10
  },
  label: {
    fontSize: 12,
    color: '#fff'
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  legendItem: {
    width: 20,
    height: 20,
    marginRight: 8
  },
  documentIdContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  documentIdText: {
    fontSize: 14,
    color: '#666'
  }
});

export default NpkChart;
