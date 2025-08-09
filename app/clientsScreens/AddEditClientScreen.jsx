import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Colors from "../../constants/Colors";
import { useClientsContext } from "../../lib/ClientsContext";
import { TouchableOpacity } from "react-native";

const AddEditClientScreen = ({ route }) => {
    const router = useRouter();
    const navigation = useNavigation();
    const { addClient, updateClient } = useClientsContext();
  const clientToEdit = route?.params?.client || null;
  const [clientsCopy, setClientsCopy] = useState([
    { id: 1, name: "Mohamed hedi", phone: "555-1234", vehicle: "Toyota Camry", licensePlate: "ABC-123", },
    { id: 2, name: "Nabil youssef", phone: "555-5678", vehicle: "Honda Civic", licensePlate: "XYZ-789", },
    { id: 3, name: "yassin korba", phone: "555-9012", vehicle: "Toyota Camry", licensePlate: "ABC-123", },
    { id: 4, name: "Nabil hedi", phone: "555-3456", vehicle: "Honda Civic", licensePlate: "XYZ-789", },
  ]);
  // State for client fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setPhone(clientToEdit.phone);
      setVehicle(clientToEdit.vehicle);
      setLicensePlate(clientToEdit.licensePlate);
    }
  }, [clientToEdit]);

  const onSave = () => {
    // Basic validation
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter the client's name.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Validation", "Please enter the client's phone number.");
      return;
    }
    if (!vehicle.trim()) {
      Alert.alert("Validation", "Please enter the vehicle model.");
      return;
    }
    if (!licensePlate.trim()) {
      Alert.alert("Validation", "Please enter the license plate.");
      return;
    }

    const clientData = {
      name: name.trim(),
      phone: phone.trim(),
      vehicle: vehicle.trim(),
      licensePlate: licensePlate.trim(),
    };

    if (clientToEdit) {
      updateClient(clientData);
    } else {
      addClient(clientData);
    }
    navigation.navigate("/clients");
    //router.replace("/clients");
  };

  const onClear = () => {
    setName("");
    setPhone("");
    setVehicle("");
    setLicensePlate("");
  };
const nav = () => {
    router.back()
};
  return (
    <View style={styles.container}>   
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={nav}>
        <Ionicons name="chevron-back-circle-sharp" size={30} color={Colors.PRIMARY}
          style={{paddingRight: 20}} />
      </TouchableOpacity>
        <Text style={styles.headerText} >
          {clientToEdit ? "Modifier Client" : "Nouveau Client"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} keyboardShouldPersistTaps="handled">
      <View style={styles.iconContainer}>
      <FontAwesome5 name="car-side" size={20} color="#d32f2f" style={styles.icon}/>
      <Text style={styles.label}>
          Remplir les champs avec les informations du client
        </Text>
      </View>
        {/* Client Name */}
        <View style={styles.containers}>
        <Text style={styles.ContainerTitle}>Informations client</Text>
        <Text style={styles.label}>Nom Client</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom Client"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
        />

        {/* Phone */}
        <Text style={styles.label}>Numéro de Téléphone</Text>
        <TextInput
          style={styles.input}
          placeholder="Numéro de Téléphone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          returnKeyType="next"
        />
        </View>

        {/* Vehicle */}
        <View style={styles.containers}>
        <Text style={styles.ContainerTitle}>Informations véhicule</Text>
        <Text style={styles.label}>Modele Véhicule</Text>
        <TextInput
          style={styles.input}
          placeholder="Modele Véhicule"
          value={vehicle}
          onChangeText={setVehicle}
          autoCapitalize="words"
          returnKeyType="next"
        />

        {/* License Plate */}
        <Text style={styles.label}>Immatriculation</Text>
        <TextInput
          style={styles.input}
          placeholder="Immatriculation"
          value={licensePlate}
          onChangeText={setLicensePlate}
          autoCapitalize="characters"
          returnKeyType="done"
        />
        </View>       
      </ScrollView>
      {/* Buttons */}
      <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Text style={styles.clearButtonText}>Effacer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>{clientToEdit ? "Modifier" : "Ajouter"}</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
    </View>
  );
};

export default AddEditClientScreen;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },

  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  safeArea: {
    position : "relative",
    flex: 1,
    backgroundColor: Colors.GRAY.LIGHT,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 65,
    paddingBottom: 18,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY.LIGHT,
    zIndex: 1,
  },
  icon: {
    marginRight: 10,
  },
  headerText: {
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    fontSize: 22,
    fontWeight: "500",
  },
  listContent: {
    position: "absolute",
    width: "100%",
    top: 60,
    padding: 20,
    paddingBottom: 40,
  },
  containers: {
    flex: 1,
    alignItems: "flex-start",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    marginTop: 15,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontFamily: "outfit",
    color: "#444",
    marginBottom: 6,
    marginTop: 12,
    fontSize: 12,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginHorizontal: 20, 
    marginBottom: 30,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#d32f2f",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginLeft: 10,
  },
  clearButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#d32f2f",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 10,
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  clearButtonText: {
    color: Colors.PRIMARY,
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  ContainerTitle: {
    fontFamily: "outfit-bold",
    color: Colors.BLACK,
    fontSize: 16,
    marginBottom: 12,
    marginTop: 12,
  },
});
