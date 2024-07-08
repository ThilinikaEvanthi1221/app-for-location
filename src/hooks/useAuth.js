import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../utils/color';
import {Image} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, user=>{
            console.log('got user: ', user);
            if (user){
                setUser(user);
            }else{
                setUser(null);
            }
        });
        return unsub;
    },[])
    return {user};
  };

  export default useAuth;
