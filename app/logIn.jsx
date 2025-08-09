import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../lib/authContext";

export default function LogIn() {
  const navigation = useNavigation();
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [identifier, setIdentifier] = React.useState(""); // email or phone
  const [identifierError, setIdentifierError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const { signIn } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const onSignInPress = async () => {
    setIdentifierError("");
    setPasswordError("");
  
    if (!identifier.trim()) {
      setIdentifierError("Email ou numéro requis");
      return;
    }
  
    if (!password.trim()) {
      setPasswordError("Mot de passe est requis");
      return;
    }
  
    const isEmail = identifier.includes("@");
    const loginIdentifier = isEmail
      ? identifier.trim()
      : `${identifier.replace(/\D/g, "")}@noemail.com`;
  
    const result = await signIn(loginIdentifier, password);
  
    if (result.success) {
      router.push("home");
    } else {
      if (result.msg?.toLowerCase().includes("email") || result.msg?.toLowerCase().includes("phone")) {
        setIdentifierError("Adresse email ou numéro invalide");
      } else if (result.msg?.toLowerCase().includes("password")) {
        setPasswordError("Mot de passe incorrect");
      } else {
        setIdentifierError("Erreur de connexion");
        setPasswordError(result.msg || "");
      }
    }
  };
  

  return (
    <View style={styles.safeArea}>
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require("../assets/images/Wheels_Cleaning.jpg")}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.loginTitle}>Bienvenue</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.welcomeText}>Good to see you back!</Text>
              <Ionicons name="heart-sharp" size={16} color="white" style={{ marginLeft: 4 }} />
            </View>

          </View>
          <View style={styles.inputContainer}>
            <TextInput
  style={styles.textInput}
  placeholder="Email ou Numéro"
  placeholderTextColor="#B5B5B5"
  keyboardType="default"
  autoCapitalize="none"
  onChangeText={(text) => {
    setIdentifier(text);
    setIdentifierError("");
  }}
/>

          </View>
          {identifierError ? (
            <Text style={styles.errorText}>{identifierError}</Text>
          ) : null}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#B5B5B5"
              secureTextEntry={true}
              autoCapitalize="none"
              onChangeText={(password) => {
                setPassword(password);
                setPasswordError(""); // Clear the error as the user types
              }}
            />
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          <View>
            <TouchableOpacity
              style={styles.buttonContainer}
              activeOpacity={0.8}
              onPress={() => onSignInPress()}
            >
                <Text style={styles.nextText}>Connecter</Text>
            </TouchableOpacity>
            <Text style={styles.askText}>Don't have an account?</Text>
            <TouchableOpacity
            onPress={()=> router.replace('/logUp')}
            >
              <Text style={styles.signUpText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontFamily: "inter-light",
    fontSize: 19,
    fontWeight: "300",
    lineHeight: 35,
    color: "#ffffff",
    textAlign: "left",
    marginBottom: 10,
  },
  loginTitle: {
    fontFamily: "inter-bold",
    fontSize: 52,
    fontWeight: "700",
    lineHeight: 51,
    color: "#ffffff",
    textAlign: "left",
  },
  inputContainer: {
    width: "100%",
    height: 52,
    backgroundColor: "#f8f8f8",
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  textInput: {
    fontSize: 14,
    fontFamily: "inter-regular",
    color: "#1F1F1F",
  },
  buttonContainer: {
    padding: 10,
    alignSelf: "center",
    width: "100%",
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
    backgroundColor: "#ef2a39",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    width: 300,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Android shadow
  },
  nextText: {
    fontFamily: "Inter",
    fontSize: 17,
    color: "#f3f3f3",
  },
  signUpText: {
    fontFamily: "Inter",
    fontSize: 17,
    marginTop: 5,
    lineHeight: 22,
    color: "#ef2a39",
    textAlign: "center",
  },
  askText: {
    fontFamily: "Inter",
    fontSize: 15,
    marginTop: 10,
    lineHeight: 22,
    color: "#f3f3f3",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginLeft: 8,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  titleContainer: {
    marginBottom: 100,
  },
});
