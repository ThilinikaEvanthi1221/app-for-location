
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { colors } from '../utils/color';
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const Login = () => {
    const screenWidth = Dimensions.get('window').width;
    const containerWidth = screenWidth * 0.9;
    const [secureEntry, setSecureEntry] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleSignup = () => {
        navigation.navigate("Sign-Up");
    }

    const handleMain = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                console.log('User logged in: ', user);
                navigation.navigate("Main");
            })
            .catch(error => {
                console.error('Error logging in: ', error);
                Alert.alert("Error logging in", error.message);
            });
    }

    return (
        <ScrollView>
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.hey}>Hey,</Text>
                <Text style={styles.welcome}>Welcome</Text>
                <Text style={styles.back}>Back!</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={[styles.inputContainer, { width: containerWidth }]}>
                    <Ionicons name={"mail-outline"} size={25} color={colors.green} />
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your email'
                        placeholderTextColor={colors.green}
                        keyboardType='email-address'
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={[styles.passwordContainer, { width: containerWidth }]}>
                    <SimpleLineIcons name={"lock"} size={25} color={colors.green} />
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your password'
                        placeholderTextColor={colors.green}
                        secureTextEntry={secureEntry}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
                        <SimpleLineIcons name={"eye"} size={25} color={colors.green} />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity>
                <Text style={styles.forget}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={handleMain}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.continueText}>or continue with</Text>
            <TouchableOpacity style={styles.googleButton}>
                <Image source={require("../assets/google.png")} style={styles.googleImage} />
                <Text style={styles.googleText}>Google</Text>
            </TouchableOpacity>
            <View style={styles.account}>
                <Text style={styles.do}>Don't have an account?</Text>
                <TouchableOpacity onPress={handleSignup}>
                    <Text style={styles.signup}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textContainer: {
        marginVertical: 40,
        marginTop: 120,
        color: colors.greendark,
        marginLeft: 15,
    },
    hey: {
        fontSize: 32,
        color: colors.greendark,
    },
    welcome: {
        fontSize: 32,
        color: colors.greendark,
    },
    back: {
        fontSize: 32,
        color: colors.greendark,
        marginBottom: 0,
    },
    formContainer: {
        marginTop: 0,
        alignItems: 'center', 
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: colors.dark,
        flexDirection: "row",
        borderRadius: 100,
        paddingHorizontal: 20,
        alignItems: "center",
        height: 40,
        marginVertical: 20,
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
    },
    passwordContainer: {
        borderWidth: 1,
        borderColor: colors.dark,
        flexDirection: "row",
        borderRadius: 100,
        paddingHorizontal: 20,
        alignItems: "center",
        height: 40,
    },
    forget: {
        textAlign: "right",
        color: colors.greendark,
        marginRight: 20,
        marginTop: 10,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    loginButton: {
        backgroundColor: colors.green,
        borderRadius: 100,
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 35,
        marginTop: 10,
    },
    loginText: {
        color: colors.white,
        fontSize: 18,
        textAlign: "center",
        padding: 10,
    },
    continueText: {
        textAlign: "center",
        marginVertical: 20,
        fontSize: 12,
        color: colors.greendark,
    },
    googleButton: {
        flexDirection: "row",
        borderWidth: 2,
        borderColor: colors.green,
        borderRadius: 100,
        width: "80%",
        marginLeft: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    googleImage: {
        height: 20,
        width: 17,
    },
    googleText: {
        fontSize: 18,
        padding: 10,
        color: colors.greendark,
    },
    account: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
        gap: 2,
    },
    do: {
        color: colors.greendark,
    },
    signup: {
        color: colors.greendark,
        fontWeight: 'bold',
    }
});
