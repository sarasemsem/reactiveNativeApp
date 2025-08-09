import { FlatList, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";
import React from "react";
import { Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ValidatedOrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "validatedCarts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(data);
    });

    return unsubscribe;
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>
        {item.createdAt?.toDate().toLocaleString("fr-FR") || "Date inconnue"}
      </Text>
      <Text style={styles.title}>Panier ({item.items.length} services)</Text>
      {item.items.map((service, index) => (
        <View key={index} style={styles.service}>
          <Text style={styles.serviceName}>{service.title}</Text>
          <Text style={styles.serviceDetail}>Client: {service.client || 'N/A'}</Text>
          <Text style={styles.serviceDetail}>Technicien: {service.worker || 'N/A'}</Text>
          <Text style={styles.serviceDetail}>Prix: {service.price.toFixed(3)} Dt</Text>
        </View>
      ))}
      <View style={styles.totalRow}>
        <Text style={styles.total}>Total:</Text>
        <Text style={styles.totalAmount}>{item.total.toFixed(3)} Dt</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.fullContainer}>
    <SafeAreaView style={styles.safeArea}> 
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => router.back()}>
                                      <Ionicons name="chevron-back-circle-sharp" size={30} color={Colors.PRIMARY}
                                       style={{paddingRight: 20}} />
                                    </TouchableOpacity>
                <Text style={styles.headerText}>Paniers validés</Text>
            </View>
    <View style={styles.containerView}> 
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}  
    />
    </View>
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
    containerView: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 2 : 40,
    },
  container: {
    padding: 20,
  },
  fullContainer: {
    position: "relative",
    flex: 1,
  },
  safeArea: {
    position: "relative",
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: Colors.GRAY.LIGHT,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 2 : 60,
    alignItems: "center",
    paddingLeft: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    color: Colors.PRIMARY,
    fontFamily: 'outfit-bold',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
    textAlign: "right",
  },
  title: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    marginBottom: 10,
    color: Colors.PRIMARY,
  },
  service: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    paddingBottom: 5,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: "outfit-bold",
  },
  serviceDetail: {
    fontSize: 13,
    color: "#444",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  total: {
    fontFamily: "outfit-bold",
    fontSize: 15,
  },
  totalAmount: {
    fontSize: 15,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
});
