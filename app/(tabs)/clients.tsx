import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../constants/Colors";
import { useClientsContext } from "../../lib/ClientsContext";
import { SwipeListView } from 'react-native-swipe-list-view';

const Clients = () => {
  //const router = useRouter();
  const { clients } = useClientsContext();
  const navigation = useNavigation();
  const { deleteClient } = useClientsContext();

  return (
    <View style={styles.container}>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Clients</Text>
      </View>

      <SwipeListView
  data={clients}
  keyExtractor={(item) => item.id}
  contentContainerStyle={styles.listContent}
  renderItem={({ item }) => (
    <View style={styles.clientItem}>
      <Ionicons name="person-circle-outline" size={36} color="#d32f2f" />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.clientName}>{item.name}</Text>
        <Text style={styles.clientPhone}>{item.phone}</Text>
        <View style={styles.vehicleRow}>
          <MaterialCommunityIcons name="car" size={18} color="#888" />
          <Text style={styles.vehicleText}>{item.vehicle}</Text>
          <MaterialCommunityIcons name="license" size={18} color="#888" style={{ marginLeft: 8 }} />
          <Text style={styles.licenseText}>{item.licensePlate}</Text>
        </View>
      </View>
    </View>
  )}
  ListEmptyComponent={
    <Text style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
      No clients yet.
    </Text>
  }
  renderHiddenItem={({ item }) => (
    <TouchableOpacity
      style={styles.hiddenDeleteButton}
      onPress={() => deleteClient(item.id)}
    >
      <Ionicons name="trash" size={30} color="#fff" />
    </TouchableOpacity>
  )}
  rightOpenValue={-100}
/>


      {/* Add Client Floating Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.navigate("clientsScreens/AddEditClientScreen", { client: null });
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
    </View>
  );
};

export default Clients;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.GRAY.LIGHT,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: Colors.PRIMARY,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 2 : 60,
    paddingBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "#fff",
    fontFamily: "outfit-bold",
    fontSize: 22,
    letterSpacing: 1,
  },
  listContent: {
    position: "absolute",
    width: "100%",
    top: 80,
    padding: 18,
    paddingBottom: 100,
  },
  clientItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  clientName: {
    fontWeight: "outfit-bold",
    fontSize: 16,
    color: "#222",
  },
  clientPhone: {
    color: "#555",
    fontSize: 14,
    marginBottom: 2,
  },
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  vehicleText: {
    color: "#333",
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "500",
  },
  licenseText: {
    color: "#666",
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#d32f2f",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  hiddenDeleteButton: {
    alignItems: 'flex-end',
    backgroundColor: '#d32f2f',
    paddingHorizontal: 30,
    flex: 1,
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 14,
  }, 
});
