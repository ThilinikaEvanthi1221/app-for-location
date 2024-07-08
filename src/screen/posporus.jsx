import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../utils/color';
import {Image} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const posporus = () => {
    return (
      <View >
        <Text >P value</Text>
      </View>
    );
  };

export default posporus;