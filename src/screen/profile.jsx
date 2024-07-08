import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../utils/color';
import {Image} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const App = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Hello, React Native!</Text>
      </View>
    );
  };