import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../utils/color';
import {Image} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const layout = () => {
    return (
      <View >
        <Text >Hello, React Native!</Text>
      </View>
    );
  };

  export default layout;
