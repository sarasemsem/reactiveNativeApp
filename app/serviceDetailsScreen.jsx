import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBarButtons from "../components/TopBarButtons";
import Colors from "../constants/Colors";
import { useCartStore } from "../store/cartStore";
import { useItemStore } from "../store/itemStore";
import RepairServiceScreen from "./repairServiceScreen";
import ShopScreen from "./shopScreen";
import VidangeVehiculeScreen from "./vidangeVehicule";
import WashServiceScreen from "./washServiceScreen";

export default function ServiceDetailsScreen() {
  const router = useRouter();
  const item = useItemStore((state) => state.item);
  const addToCart = useCartStore((state) => state.addToCart);
  const cartCount = useCartStore((state) => state.cartItems.length);
  const [selectedServices, setSelectedServices] = useState([]);

  const allServices = useMemo(() => {
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
    return [...services, ...customizedServices, ...washCarSizes];
  }, []);
  const handleAddToCart = () => {
    if (selectedServices.length === 0) {
      Alert.alert("Erreur", "Veuillez ajouter au moins un service");
      return;
    }

    addToCart(selectedServices);
    setSelectedServices([]);
    Alert.alert("Succès", "Services ajoutés au panier");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight + -90 : -50 }} edges={["top"]}>
      {/*<View style={{paddingTop: Platform.OS === "android" ? StatusBar.c^^urrentHeight -50 : -50}}>*/}
      {item.id !== 2 && (
        <TopBarButtons isBackButton={true} />
        )}
      {/*</View>*/}
      <View style={styles.container}>
        {item.id === 1 && (
          <WashServiceScreen
            item={item}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
          />
        )}

        {item.id === 0 && (
          <View style={{ flex: 1, backgroundColor: Colors.GRAY.LIGHT }}>
            <RepairServiceScreen
              item={item}
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSelectedServices([])}
              >
                <Text style={styles.clearText}>Effacer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddToCart}
              >
                <Text style={styles.saveText}>
                  Ajouter au panier (
                  {selectedServices.reduce((sum, s) => sum + (s.price || 0), 0)}{" "}
                  DT)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {item.id === 3 && (
          <View style={{ flex: 1 }}>
            <VidangeVehiculeScreen
              item={item}
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
            />
          </View>
        )}
        {item.id === 2 && (
          <View style={{ flex: 1 }}>
            <ShopScreen selectedServices={selectedServices} setSelectedServices={setSelectedServices}/>
          </View>
        )}

        {item.id !== 0 && (
          <View > 
            <TouchableOpacity style={styles.bookNow} onPress={handleAddToCart}>
              <Text style={styles.bookNowText}>
                Ajouter au panier (
                {selectedServices.reduce((sum, s) => sum + (s.price || 0), 0)}{" "}
                DT)
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding : 20,
    backgroundColor: Colors.GRAY.LIGHT,
  },
  clearButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  saveButton: {
    flex: 2,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  clearText: {
    color: "#555",
    fontWeight: "bold",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bookNow: {
    backgroundColor: "#d32f2f",
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  bookNowText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
