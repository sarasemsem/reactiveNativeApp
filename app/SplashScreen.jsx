import { useNavigation } from "expo-router";
import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
export default function Login() {
  const navigation = useNavigation();
  //const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/redblackCar.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View>
        <SafeAreaView>
          <ScrollView
            scrollEnabled={false}
            contentInsetAdjustmentBehavior="automatic"
          >
            <View style={styles.innerContainer}>
              <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                SEDDIK
              </Text>
              <Text style={styles.title} numberOfLines={1}>
                SERVICE AUTO
              </Text>
              </View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => 
                  navigation.navigate('logIn')
                } 
                //router.push('/logIn')}
              >
                <Text style={styles.startText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  innerContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    marginRight: "auto",
    marginLeft: "auto",
  },
  titleContainer: {
    paddingVertical: 110,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Outfit",
    fontSize: 50,
    fontWeight: "700",
    color: "#ffffff",
    position: "relative",
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    height: 52,
    width: "80%",
    position: "relative",
    left: "10%",
    backgroundColor: "#ef2a39",
    alignItems: "center",
    justifyContent: "center",
  },
  startText: {
    fontFamily: "outfit",
    fontSize: 22,
    fontWeight: "600",
    color: "#ffffff",
  },
});
