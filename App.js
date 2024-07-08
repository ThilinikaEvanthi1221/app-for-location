import React from 'react';
import 'react-native-screens';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Home from './src/screen/home';
import Login from './src/screen/login';
import Sign from './src/screen/signup';
import Main from './src/screen/main';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/utils/color';
import Potassium from './src/screen/potassium';
import Phosphorus from './src/screen/posporus';
import Nitrogen from './src/screen/nitrogen';
import data from './src/screen/data';
import Location from './src/screen/location';
import ManualUpdate from './src/screen/ManualUpdate';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import useAuth from './src/hooks/useAuth';
import NPKCharts from './src/screen/NPKcharts';


const home = 'Home';
const list = 'List';
const settings = 'Settings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  const{user} = useAuth();

  if(user){
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={home} component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Sign-Up" component={Sign}/>
        <Stack.Screen name="Main" component={Main}/>
        <Stack.Screen name="Potassium" component={Potassium}/>
        <Stack.Screen name="Phosphorus" component={Phosphorus}/>
        <Stack.Screen name="Nitrogen" component={Nitrogen}/>
        <Stack.Screen name="data" component={data}/>
        <Stack.Screen name="Location" component={Location}/>
        <Stack.Screen name="ManualUpdate" component={ManualUpdate}/>
        <Stack.Screen name="NPKcharts" component={NPKCharts}/>
        
      
      </Stack.Navigator>
    );

  }else{
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={home} component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Sign-Up" component={Sign}/>
        <Stack.Screen name="Main" component={Main}/>
        <Stack.Screen name="Potassium" component={Potassium}/>
        <Stack.Screen name="Phosphorus" component={Phosphorus}/>
        <Stack.Screen name="Nitrogen" component={Nitrogen}/>
        <Stack.Screen name="data" component={data}/>
      </Stack.Navigator>
    );

  }
  // return (
  //   <Stack.Navigator screenOptions={{ headerShown: false }}>
  //     <Stack.Screen name={home} component={Home} />
  //     <Stack.Screen name="Login" component={Login} />
  //     <Stack.Screen name="Sign-Up" component={Sign}/>
  //     <Stack.Screen name="Main" component={Main}/>
  //     <Stack.Screen name="Potassium" component={Potassium}/>
  //     <Stack.Screen name="Phosphorus" component={Phosphorus}/>
  //     <Stack.Screen name="Nitrogen" component={Nitrogen}/>
  //     <Stack.Screen name="data" component={data}/>
  //   </Stack.Navigator>
  // );
}

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.colorBar} />
      <NavigationContainer>
        <HomeStack />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greendark,
  },
  colorBar: {
    height: 30,
    width: '100%',
  },
});
