import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import * as Animatable from "react-native-animatable";
import CardItems from "../../components/CardItems";
import Colors from "../../constants/Colors";
import { useClientStore } from "@/store/clientStore";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/cartStore";
import { Client } from "@/store/clientStore";

export default function Home() {
const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([
    { id: 0, name: "Tout" },
    { id: 1, name: "Réparation" },
    { id: 2, name: "Lavage" },
    { id: 3, name: "Boutique" },
    { id: 4, name: "Entretien Mecanique" },
  ]);

 const [cardsItem, setCardsItem] = useState([
  { id: 0, title: "Réparation", categoryId: 1, description: "Divers réparations", price: 4.6, icon: require("../../assets/images/mainBackground.jpg") },
  { id: 1, title: "Lavage", categoryId: 2, description: "Lavage exterieur et interieur", price: 4.5, icon: require("../../assets/images/care-washing.jpg") },
  { id: 2, title: "Boutique", categoryId: 3, description: "Changement de pneus", price: 4.5, icon: require("../../assets/images/boutique.jpg") },
  { id: 3, title: "Vidange", categoryId: 4, description: "Huile, filtre, etc", price: 4.5, icon: require("../../assets/images/oil-changing.jpg") },
/*     { id: 4, title: "Entretien Mecanique", description: "Entretien mecanique", price: 4.5, icon: require("../../assets/images/entretien.jpg") },
 */]);

  
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [showClientResults, setShowClientResults] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { client, setClient, clearClient } = useClientStore();
  const cartItems = useCartStore((state) => state.cartItems);
  


  // Load clients
  useEffect(() => {
    const sampleClients: Client[] = [
      { id: 1, name: "Mohamed hedi", phone: "555-1234", vehicle: "Toyota Camry", licensePlate: "ABC-123" },
      { id: 2, name: "Nabil youssef", phone: "555-5678", vehicle: "Honda Civic", licensePlate: "XYZ-789" },
      { id: 3, name: "yassin korba", phone: "555-9012", vehicle: "Toyota Camry", licensePlate: "ABC-123" },
      { id: 4, name: "Nabil hedi", phone: "555-3456", vehicle: "Honda Civic", licensePlate: "XYZ-789" },
    ];
    setClients(sampleClients);
  }, []);
  const filteredCardsItem = selectedCategory.id === 0
  ? cardsItem
  : cardsItem.filter(item => item.categoryId === selectedCategory.id);
  // Handle search text changes
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredClients([]);
      setShowClientResults(false);
      return;
    }

    const filtered = clients.filter(client => 
      client.name.toLowerCase().includes(searchText.toLowerCase()) || 
      client.phone.includes(searchText)
    );

    setFilteredClients(filtered);
    setShowClientResults(filtered.length > 0);
  }, [searchText, clients]);


  const handleClientSelect = (client: Client) => {
    //setSelectedClient(client);
    setClient(client);
    setSearchText(`${client.name} (${client.phone})`);
    setShowClientResults(false);
  };

  const handleClearClient = () => {
    clearClient();
    setSearchText("");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.SafeAreaView}>
        {/* Top Bar */}
      <View style={styles.topBarContainer}>
         {/*   <View style={styles.menuButton}>
            <Ionicons name="menu-outline" size={24} color="black" />
          </View>*/}
          <View style={styles.titleContainer}>
          <Text style={styles.redTitle}>Seddik</Text>
          <Text style={[styles.BlackTitle, { fontWeight: "600" }]}>
            Service
            <Text>Auto</Text>
          </Text>
        </View> 
          {/* <View style={styles.userImageContainer}>
            <Image source={require("../../assets/images/avatar.png")} style={styles.userImage}/>
          </View> */}
          <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cartScreen')}>
                      <View>
                        <Ionicons name="cart-outline" size={30} color={Colors.PRIMARY} />
                        {cartItems.length > 0 && (
  <View style={styles.cartBadge}>
    <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
  </View>
)}
                      </View>
          </TouchableOpacity>
        </View>

        {/* Client Search Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={24} color={Colors.BLACK} />
            <TextInput
              style={styles.searchInput}
              placeholder={selectedClient ? "" : "Search client by name or phone"}
              placeholderTextColor="gray"
              value={searchText}
              onChangeText={setSearchText}
              onFocus={() => searchText.length > 0 && setShowClientResults(true)}
              editable={!selectedClient}
            />
            {selectedClient && (
              <TouchableOpacity onPress={handleClearClient}>
                <Ionicons name="close" size={24} color={Colors.PRIMARY} />
              </TouchableOpacity>
            )}
          </View>
          
          {client && (
            <View style={styles.selectedClientContainer}>
              <Text style={styles.selectedClientText}>
                Client: <Text style={styles.clientNameText}>{client.name}</Text>
              </Text>
              <Text style={styles.selectedClientPhone}>{client.phone}</Text>
            </View>
          )}
        </View>

        {/* Client Search Results */}
        {showClientResults && (
          <View style={styles.clientResultsContainer}>
            <FlatList
              data={filteredClients}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.clientItem}
                  onPress={() => handleClientSelect(item)}
                >
                  <Text style={styles.clientName}>{item.name}</Text>
                  <Text style={styles.clientPhone}>{item.phone}</Text>
                  {item.vehicle && <Text style={styles.clientVehicle}>{item.vehicle}</Text>}
                  {item.licensePlate && <Text style={styles.clientLicensePlate}>{item.licensePlate}</Text>}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              keyboardShouldPersistTaps="always"
            />
          </View>
        )}

        {/* Categories scrollbar */}
        <View style={styles.categoriesContent}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 10,
            }}
            renderItem={({ item, index }) => {
              const isSelected = item.id === selectedCategory.id;
              const textColor = isSelected ? Colors.WHITE : Colors.GRAY.DARK;
              const fontWeight = isSelected ? "bold" : "normal";

              return (
                <Animatable.View
                  delay={index * 120}
                  animation="slideInDown"
                  duration={500}
                >
                  <TouchableOpacity
                    style={[
                      styles.categoryItem,
                      isSelected && styles.selectedCategory,
                    ]}
                    onPress={() => setSelectedCategory(item)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: textColor, fontWeight },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              );
            }}
          />
        </View>
        
        {/* Services List */}
        <View style={{flex: 1}}>
          <FlatList
            data={filteredCardsItem}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                activeOpacity={0.7}
              >
                <CardItems item={item} index={index} />
              </TouchableOpacity>
            )}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
        
        {/* Add Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            if (cartItems.length > 0) {
            useCartStore.getState().clearCart();
            Alert.alert("Panier vidé")
        } else {
          Alert.alert("Panier est vide")
          }}
          }
        >
          <MaterialCommunityIcons name="cart-minus" size={24} color="white" />
        </TouchableOpacity> 
      </SafeAreaView>
    </View>
  );
}

// Updated Styles
const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  SafeAreaView: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.34)",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  searchContainer: {
    marginBottom: 10,
    marginHorizontal: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    width: "98%",
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
  },
  topBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  categoriesContent: {
    marginBottom: 10,
    marginHorizontal: 10,
  },
  selectedCategory: {
    backgroundColor: Colors.PRIMARY,
  },
  box: {
    padding: 10,
    backgroundColor: "lightblue",
  },
  userImageContainer: {
    borderRadius: 10,
    backgroundColor: "white",
    marginRight: 10,
  },
  userImage: {
    borderRadius: 10,
    height: 60,
    width: 60,
    padding: 3,
  },
  titleContainer: {
    //marginBottom: 8,
  },
  redTitle: {
    fontSize: 35,
    fontFamily: "lobster",
    color: Colors.PRIMARY,
    letterSpacing: 2,
    paddingTop: 20,
  },
  BlackTitle: {
    fontSize: 35,
    fontFamily: "lobster",
    color: Colors.BLACK,
    letterSpacing: 1,
    paddingTop: -40,
  },
  categoryItem: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(234, 234, 234, 0.91)",
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
    minWidth: 70,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "outfit",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  clientResultsContainer: {
    maxHeight: 200,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 3,
    marginTop: 5,
  },
  clientItem: {
    padding: 15,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.BLACK,
  },
  clientPhone: {
    fontSize: 14,
    color: Colors.GRAY.DARK,
    marginTop: 4,
  },
  clientVehicle: {
    fontSize: 12,
    color: Colors.GRAY.MEDIUM,
    marginTop: 2,
  },
  clientLicensePlate: {
    fontSize: 12,
    color: Colors.GRAY.MEDIUM,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.GRAY.LIGHT,
    marginHorizontal: 10,
  },
  selectedClientContainer: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  selectedClientText: {
    color: Colors.WHITE,
    fontSize: 14,
  },
  clientNameText: {
    fontWeight: 'bold',
  },
  selectedClientPhone: {
    color: Colors.WHITE,
    fontSize: 12,
    marginTop: 2,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
});