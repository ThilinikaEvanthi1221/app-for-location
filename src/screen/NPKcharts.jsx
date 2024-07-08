import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const token = 'BBUS-wAoI4UyyrgGXxwc2LriKkoklDY103z';
const variables = [
  { name: 'Nitrogen', id: '668a48d1a6fa587e52345bd0' },
  { name: 'Phosphorus', id: '668a48fb7bbda6811b7fd19e' },
  { name: 'Potassium', id: '668a492a90eac780ccb395d2' }
];

const NpkChart = () => {
  const [npkData, setNpkData] = useState({ N: 0, P: 0, K: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await Promise.all(
        variables.map(async (variable) => {
          const response = await fetch(`https://industrial.api.ubidots.com/api/v1.6/variables/${variable.id}/values?token=${token}`);
          const result = await response.json();
          return { [variable.name]: result.results[0].value };
        })
      );

      const newData = data.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      console.log('Fetched data:', newData); // Log the fetched data
      setNpkData({
        N: parseFloat(newData.Nitrogen),
        P: parseFloat(newData.Phosphorus),
        K: parseFloat(newData.Potassium)
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data from Ubidots:', error);
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
  }
});

export default NpkChart;
