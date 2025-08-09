import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import CarSize from "../components/carSize";
import Detaille from "../components/Detaille";
import Services from "../components/Services";
import Colors from "../constants/Colors";

export default function WashServiceScreen({item, selectedServices, setSelectedServices}) {
    const [selectedTab, setSelectedTab] = useState("Services");
    const customizedServices = [
      {
        id: 1000,
        title: "Dashboard",
        price: 10,
        icon: require("../assets/images/icons/dashboard.png"),
      },
      {
        id: 1001,
        title: "Siège",
        price: 20,
        icon: require("../assets/images/icons/car-seat.png"),
      },
      {
        id: 1002,
        title: "Tapis",
        price: 30,
        icon: require("../assets/images/icons/floor-mat.png"),
      },
      {
        id: 1003,
        title: "Moteur",
        price: 40,
        icon: require("../assets/images/icons/engine.png"),
      },
    ];
    const services = [
      {
        id: 2000,
        title: "En détail",
        price: 0,
        icon: <FontAwesome5 name="car" size={24} color="#d32f2f" />,
      },
      {
        id: 2001,
        title: "Lavage exterieur",
        price: 50,
        icon: <FontAwesome5 name="car" size={24} color="#d32f2f" />,
      },
      {
        id: 2002,
        title: "Lavage interieur",
        price: 80,
        icon: <FontAwesome5 name="wheelchair" size={24} color="#d32f2f" />,
      },
      {
        id: 2003,
        title: "Lavage moteur",
        price: 90,
        icon: <Entypo name="tools" size={24} color="#d32f2f" />,
      },
      {
        id: 2004,
        title: "Service des phares",
        price: 60,
        icon: <Entypo name="light-up" size={24} color="#d32f2f" />,
      },
    ];
    const washCarSizes = [
      {
        id: 3000,
        title: "Petite voiture",
        price: 10,
        icon: require("../assets/images/icons/sedan-car.png"),
      },
      {
        id: 3001,
        title: "Voiture moyenne",
        price: 15,
        icon: require("../assets/images/icons/pickup-car.png"),
      },
      {
        id: 3002,
        title: "SUV / 4x4",
        price: 20,
        icon: require("../assets/images/icons/suv-car.png"),
      },
      {
        id: 3003,
        title: "Utilitaire",
        price: 25,
        icon: require("../assets/images/icons/passenger-van.png"),
      },
    ];

    const toggleService = (service) => {
      if (selectedServices.some(s => s.id === service.id)) {
          setSelectedServices(selectedServices.filter(s => s.id !== service.id));
      } else {
          // For car sizes, remove any existing size first
          if (service.id >= 3000 && service.id < 4000) { // Assuming car sizes have IDs 3000-3999
              const updatedServices = selectedServices.filter(s => 
                  !(s.id >= 3000 && s.id < 4000)
              );
              setSelectedServices([...updatedServices, service]);
          } else {
              setSelectedServices([...selectedServices, service]);
          }
      }
    };
  return (
    <SafeAreaView style={styles.container} edges={["top"]}> 
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Image
         source={item?.icon ?? require("../assets/images/icons/car.png")}
         style={styles.headerImage}
        />
        <View style={styles.info}>
          <Text style={styles.title}>
            {item?.title ?? "No Title"}
          </Text>
          <Text style={styles.address}>
            {item?.address ?? "No Address"}
          </Text>
          <Text style={styles.rating}>
            <Text style={styles.star}>
              <Ionicons name="bag-check" size={16} color={Colors.PRIMARY} />
            </Text>{" "}
            ({6} Services aujourd'hui)
          </Text>
        </View>
        {item?.id === 1 && (
          <View>
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setSelectedTab("Services")}>
            <Text
              style={[
                styles.tab,
                selectedTab === "Services" && styles.activeTab,
              ]}
            >
              Services
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab("Détaillé")}>
            <Text
              style={[
                styles.tab,
                selectedTab === "Détaillé" && styles.activeTab,
              ]}
            >
              Détaillé
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab("Taille")}>
            <Text
              style={[styles.tab, selectedTab === "Taille" && styles.activeTab]}
            >
              Taille de véhicule
            </Text>
          </TouchableOpacity>
        </View>
        {selectedTab === "Services" && (
          <Services
            services={services}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            toggleService={toggleService}
          />
        )}
        {selectedTab === "Détaillé" && (
          <Detaille
            customizedServices={customizedServices}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            toggleService={toggleService}
          />
        )}

        {selectedTab === "Taille" && (
          <View style={{ padding: 16 }}>
            <CarSize
              washCarSizes={washCarSizes}
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
              toggleService={toggleService}
            />
          </View>
        )}
      </View>
      )}
      </ScrollView>
      </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",      
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight - 40 : 60,
      bottom: 0,
    },
    headerImage: {
      width: "100%",
      height: 270,
      resizeMode: "cover",
      borderBottomLeftRadius: 60,
      borderBottomRightRadius: 60,
    },
    info: { padding: 16 },
    title: { fontSize: 20, fontWeight: "bold" },
    address: { color: "gray", marginVertical: 4 },
    rating: { color: Colors.PRIMARY, fontWeight: "bold" },
    star: { color: Colors.PRIMARY, fontSize: 16 },
  
    tabs: {
      flexDirection: "row",
      justifyContent: "space-around",
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    tab: { paddingVertical: 10, fontWeight: "bold", color: "#777" },
    activeTab: {
      color: Colors.PRIMARY,
      borderBottomWidth: 2,
      borderColor: Colors.PRIMARY,
    },
    topBarButtonsContainer: {
      position: "absolute",
      top: 40,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 1,
    },
    backButton: {
      padding: 10,
    },
    cartButton: {
      backgroundColor: "#fff", // or any color you like
      borderRadius: 25, // half of width/height to make it circular
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: "auto", // push to right in flex row
      marginRight: 10,
      elevation: 5, // adds shadow on Android
      shadowColor: "#000", // adds shadow on iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    cartCount: {
      position: "absolute",
      top: -5,
      right: -5,
      backgroundColor: Colors.PRIMARY,
      borderRadius: 10,
      width: 13,
      height: 13,
      justifyContent: "center",
      alignItems: "center",
    },
    bookNow: {
      backgroundColor: "#d32f2f",
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    bookNowText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  });