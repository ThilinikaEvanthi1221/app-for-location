

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../utils/color';
import {Image} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Home = () => {
    const navigation = useNavigation ();
    const handleLogin = () =>{
        navigation.navigate("Login");
    }
    const handleSignup = () =>{
        navigation.navigate("Sign-Up");
    }
  return (
    <ScrollView>
    <View style={styles.container}>
      <Image source={require("../assets/background.jpg")} style={styles.main}/>
      <Text style={styles.title}>Welcome to NPK Data tracker </Text>
      <Text style={styles.head}>“Unlock Your Soil’s Potential {'\n'}
        with Precise  </Text>
      <Text style={styles.track}>NPK Tracking!" </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton}
        onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sign} onPress={handleSignup}>
            <Text style={styles.signText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
};
export default Home;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
       
    },
    main:{
        height: 250,
        width:231,
       marginTop:40,
    },
    title:{
       fontSize:25, 
       color: colors.green,
       textAlign:"center",
       marginBottom:10,
       marginTop:60,
    },
    head:{
        fontSize:30,
        textAlign:"center",
        marginBottom:10,
    },
    track:{
        fontSize:25,
        color:colors.green,
        marginBottom:70,
    },
    buttonContainer:{
        flexDirection:"row",
        borderWidth:1,
        borderColor: colors.dark,
        width:"70%",
        height:60,
        borderRadius:100,
        marginTop:30,
       
    },
    loginButton:{
        justifyContent:"center",
        alignItems:"center",
        width:"50%",
        backgroundColor: colors.green,
        borderRadius:100,
    },
    loginText:{
    color: colors.white, 
    fontSize:18,
    },
    sign:{
        justifyContent:"center",
        alignItems:"center",
        width: "50%",
    },
    signText:{
        fontSize:18,
    }
});

