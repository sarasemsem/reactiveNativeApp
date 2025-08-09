import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../lib/authContext';

export default function LogUp() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { register } = useAuth();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const validateFields = () => {
    let isValid = true;
  
    if (!fullName.trim()) {
      setFullNameError("Full name is required.*");
      isValid = false;
    } else {
      setFullNameError("");
    }
  
    if (!password.trim()) {
      setPasswordError("Password is required.*");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.*");
      isValid = false;
    } else {
      setPasswordError("");
    }
  
    if (!phoneNumber.trim()) {
      setPhoneError("Phone number is required.*");
      isValid = false;
    } else if (!/^[0-9]+$/.test(phoneNumber)) {
      setPhoneError("Phone number must be numeric.*");
      isValid = false;
    } else {
      setPhoneError("");
    }
  
    // Handle generated email if empty
    if (!email.trim()) {
      setEmail(`${phoneNumber.replace(/\D/g, "")}@noemail.com`);
    } else {
      setEmailError("");
    }
  
    return isValid;
  };
  

  const onCreateAccountPress = async () => {
    console.log("Creating account...");
    if (!validateFields()) return;
    console.log("Fields are valid");
    const res = await register(email, password,fullName,phoneNumber);
    console.log("Register response:", res);
    if (res.success) {
      Alert.alert("Success", "Account created successfully!");
      router.replace('/logIn');
    } else {
      Alert.alert("Error", res.msg || "Failed to register.");
    }
  };
  

  return (
    <ImageBackground
      style={styles.backgroundImage}
      resizeMode="cover"
      source={require('../assets/images/Wheels_Cleaning.jpg')}
    >
      <View style={styles.safeArea}>
        <TouchableOpacity onPress={() => router.push('/logIn')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Create{'\n'}Account</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor="#B5B5B5"
                onChangeText={setFullName}
              />
              <AntDesign name="user" size={20} color="#1F1F1F" style={styles.icon} />
            </View>
            {fullNameError ? <Text style={styles.errorText}>{fullNameError}</Text> : null}

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#B5B5B5"
                onChangeText={setEmail}
              />
              <AntDesign name="mail" size={20} color="#1F1F1F" style={styles.icon} />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#B5B5B5"
                secureTextEntry
                onChangeText={setPassword}
              />
              <Feather name="eye-off" size={20} color="#1F1F1F" style={styles.icon} />
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Mobile number"
                placeholderTextColor="#B5B5B5"
                keyboardType="phone-pad"
                onChangeText={setPhoneNumber}
              />
              <AntDesign name="phone" size={20} color="#1F1F1F" style={styles.icon} />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>

          <TouchableOpacity style={styles.DoneButton} onPress={onCreateAccountPress}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.replace('/logIn')}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'outfit-ExtraBold',
    alignSelf: 'flex-start',
    fontSize: 50,
    color: '#ffffff',
    textAlign: 'left',
    marginTop: 100,
    marginBottom: 20,
    lineHeight: 54,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
    marginTop: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'outfit-Regular',
    color: '#1F1F1F',
    paddingVertical: 15,
  },
  DoneButton: {
    backgroundColor: '#ef2a39',
    paddingVertical: 15,
    borderRadius: 15,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    borderRadius: 15,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -23,
    marginLeft: 8,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
});
