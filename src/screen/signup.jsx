import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../utils/color';
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

const SignUp = () => {
    const screenWidth = Dimensions.get('window').width;
    const containerWidth = screenWidth * 0.9;
    const [secureEntry, setSecureEntry] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                createdAt: new Date(),
            });
            Alert.alert("User registered successfully");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Error registering user", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.hey}>Let's get</Text>
                <Text style={styles.welcome}>started</Text>
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
                <View style={[styles.passwordContainer, { width: containerWidth }]}>
                    <SimpleLineIcons name={"lock"} size={25} color={colors.green} />
                    <TextInput
                        style={styles.input}
                        placeholder='Confirm your password'
                        placeholderTextColor={colors.green}
                        secureTextEntry={secureEntry}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
                        <SimpleLineIcons name={"eye"} size={25} color={colors.green} />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignUp;

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
        marginVertical: 20,
    },
    signupButton: {
        backgroundColor: colors.green,
        borderRadius: 100,
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 35,
        marginTop: 10,
    },
    signupText: {
        color: colors.white,
        fontSize: 18,
        textAlign: "center",
        padding: 10,
    }
});
