import { Octicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/Colors";

export default function VidangeVehiculeScreen({
  selectedServices,
  setSelectedServices,
}) {
  // Service type states
  const [selectedService, setSelectedService] = useState("vente-seule");
  const [serviceId] = useState(Date.now()); // ID unique constant pour cette session

  // Product states
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Huile 5W-30 synthétique",
      description: "5L - Compatible avec la plupart des véhicules récents",
      price: 35,
      quantity: 0,
      category: "huile",
    },
    {
      id: 2,
      name: "Huile 10W-40 semi-synthétique",
      description: "5L - Pour véhicules plus anciens",
      price: 28,
      quantity: 0,
      category: "huile",
    },
    {
      id: 3,
      name: "Filtre à huile standard",
      description: "Pour la plupart des véhicules",
      price: 12,
      quantity: 0,
      category: "filtre",
    },
    {
      id: 4,
      name: "Filtre à huile haut de gamme",
      description: "Longue durée de vie",
      price: 18,
      quantity: 0,
      category: "filtre",
    },
    {
      id: 5,
      name: "Joint de vidange",
      description: "Joint d'étanchéité pour bouchon de vidange",
      price: 3.5,
      quantity: 0,
      category: "autre",
    },
  ]);

  const [comment, setComment] = useState("");

  // Service prices
  const servicePrices = {
    "vente-changement": 40,
    "changement-seul": 45,
  };

  // Calculate totals
  const calculateProductTotal = () => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const calculateServiceTotal = () => {
    if (selectedService === "vente-changement")
      return servicePrices["vente-changement"];
    if (selectedService === "changement-seul")
      return servicePrices["changement-seul"];
    return 0;
  };

  const calculateTotal = () => {
    return calculateProductTotal() + calculateServiceTotal();
  };

  // Update product quantity and service
  const updateQuantity = (id, value) => {
    const newQuantity = Math.max(0, parseInt(value) || 0);
    
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product =>
        product.id === id ? { ...product, quantity: newQuantity } : product
      );
      
      // Mise à jour automatique du service après changement de quantité
      updateService(updatedProducts);
      
      return updatedProducts;
    });
  };
  // Update service in selectedServices
  const updateService = (currentProducts) => {
    const productTotal = currentProducts.reduce(
      (total, product) => total + product.price * product.quantity, 0
    );
    const serviceTotal = calculateServiceTotal();
    const total = productTotal + serviceTotal;

    // Ne pas ajouter de service vide
    if (total <= 0) {
      setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
      return;
    }

    const serviceData = {
      id: serviceId,
      title: getServiceTitle(),
      price: total,
      icon: <Octicons name="tools" size={24} color="#d32f2f" />,
      serviceDetails: {
        type: selectedService,
        comment: comment,
        products: currentProducts.filter(p => p.quantity > 0),
        servicePrice: serviceTotal,
        productTotal: productTotal,
        date: new Date().toISOString()
      }
    };

    setSelectedServices(prev => {
      const existingIndex = prev.findIndex(s => s.id === serviceId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = serviceData;
        return updated;
      }
      return [...prev, serviceData];
    });
  };
  // Update service when comment or service type changes
  useEffect(() => {
    updateService(products);
  }, [comment, selectedService]);

  const getServiceTitle = () => {
    switch(selectedService) {
      case "vente-seule":
        return "Vente produits vidange";
      case "vente-changement":
        return "Vente + Changement d'huile";
      case "changement-seul":
        return "Changement d'huile";
      default:
        return "Service Vidange";
    }
  };
  // Render product items
  const renderProductItem = (product) => (
    <View key={product.id} style={styles.productItem}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>
      <Text style={styles.productPrice}>{product.price.toFixed(2)} DT</Text>
      <View style={styles.quantitySelector}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(product.id, product.quantity - 1)}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={product.quantity.toString()}
          onChangeText={(value) => updateQuantity(product.id, value)}
        />

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(product.id, product.quantity + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render service details
  const renderServiceDetails = () => (
    <View style={styles.serviceDetails}>
      <Text style={styles.sectionTitle}>Détails du service</Text>
      {selectedService === "vente-changement" && (
        <>
          <Text>Le service inclut:</Text>
          <Text>- Vidange de l'huile usagée</Text>
          <Text>- Remplacement du filtre à huile</Text>
          <Text>- Remplacement du joint</Text>
          <Text>
            - Mise à jour de l'indicateur de maintenance (si possible)
          </Text>
          <Text>- Contrôle visuel rapide</Text>
          <Text style={styles.servicePrice}>
            Prix du service: {servicePrices["vente-changement"].toFixed(2)} DT
          </Text>
        </>
      )}
      {selectedService === "changement-seul" && (
        <>
          <Text>
            Vous apportez vos propres produits et nous effectuons la vidange.
          </Text>
          <Text>Le service inclut:</Text>
          <Text>- Vidange de l'huile usagée</Text>
          <Text>- Remplacement du filtre à huile</Text>
          <Text>- Remplacement du joint</Text>
          <Text>
            - Mise à jour de l'indicateur de maintenance (si possible)
          </Text>
          <Text>- Contrôle visuel rapide</Text>
          <Text style={styles.servicePrice}>
            Prix du service: {servicePrices["changement-seul"].toFixed(2)} DT
          </Text>
        </>
      )}
    </View>
  );

  // Render order summary
  const renderOrderSummary = () => (
    <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
    >
    <View style={styles.orderSummary}>
      <Text style={styles.sectionTitle}>Résumé de la commande</Text>

      {selectedService !== "changement-seul" &&
        products
          .filter((p) => p.quantity > 0)
          .map((product) => (
            <Text key={`summary-${product.id}`}>
              - {product.name} (x{product.quantity})
            </Text>
          ))}

      {selectedService === "vente-changement" && (
        <Text>- Service de vidange</Text>
      )}

      {selectedService === "changement-seul" && (
        <Text>- Service de vidange (apportez vos produits)</Text>
      )}

      <Text style={styles.totalText}>
        Total: {calculateTotal().toFixed(2)} DT
      </Text>

      <Text style={styles.commentLabel}>
        Ajouter un commentaire (optionnel)
      </Text>
      <TextInput
        style={styles.commentInput}
        multiline
        placeholder="Informations supplémentaires sur votre véhicule ou demande particulière..."
        value={comment}
        onChangeText={setComment}
      />
    </View>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Service Vidange Véhicule</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Choisir le type de service</Text>

        <View style={styles.serviceOptions}>
          <TouchableOpacity
            style={[
              styles.serviceOption,
              selectedService === "vente-seule" && styles.selectedOption,
            ]}
            onPress={() => setSelectedService("vente-seule")}
          >
            <Text style={styles.optionTitle}>Vente de produits</Text>
            <Text style={styles.optionDescription}>
              Acheter huile, filtres, etc. sans intervention
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.serviceOption,
              selectedService === "vente-changement" && styles.selectedOption,
            ]}
            onPress={() => setSelectedService("vente-changement")}
          >
            <Text style={styles.optionTitle}>Vente + Changement</Text>
            <Text style={styles.optionDescription}>
              Acheter les produits + prestation de vidange
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.serviceOption,
              selectedService === "changement-seul" && styles.selectedOption,
            ]}
            onPress={() => setSelectedService("changement-seul")}
          >
            <Text style={styles.optionTitle}>Changement seul</Text>
            <Text style={styles.optionDescription}>
              Service payant (vous apportez vos produits)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Products Section */}
        {(selectedService === "vente-seule" ||
          selectedService === "vente-changement") && (
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Produits</Text>

            <Text style={styles.categoryTitle}>Huile moteur</Text>
            {products
              .filter((p) => p.category === "huile")
              .map(renderProductItem)}

            <Text style={styles.categoryTitle}>Filtres</Text>
            {products
              .filter((p) => p.category === "filtre")
              .map(renderProductItem)}

            <Text style={styles.categoryTitle}>Autres</Text>
            {products
              .filter((p) => p.category === "autre")
              .map(renderProductItem)}

            <Text style={styles.subTotal}>
              Total des produits: {calculateProductTotal().toFixed(2)} DT
            </Text>
          </View>
        )}

        {/* Service Details Section */}
        {(selectedService === "vente-changement" ||
          selectedService === "changement-seul") &&
          renderServiceDetails()}

        {/* Order Summary */}
        {renderOrderSummary()}
      </ScrollView>
{/*       <View>
      <TouchableOpacity style={styles.validateButton}>
        <Text style={styles.validateButtonText}>Valider la commande</Text>
      </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.GRAY.LIGHT,
  },
  header: {
    position: "absolute",
    //top: -50,
    left: 0,
    right: 0,
    zIndex: 1,
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 30 : 60,
    paddingBottom: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginTop: 20,
    position: "relative",
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingHorizontal: 20,
    marginTop: 50,
    paddingTop: 20,
    paddingBottom: 50,
  },
  mainTitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    fontWeight: "bold",
    color: Colors.WHITE,
    textAlign: "center",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.GRAY.DARK,
    marginTop: 8,
    marginBottom: 12,
  },
  serviceOptions: {
    marginBottom: 24,
  },
  serviceOption: {
    borderWidth: 1,
    borderColor: Colors.GRAY.LIGHT,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "white",
  },
  selectedOption: {
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    backgroundColor: "#f8fafc",
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.PRIMARY,
    marginBottom: 4,
  },
  optionDescription: {
    color: Colors.GRAY.MEDIUM,
  },
  productsSection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.PRIMARY,
    marginTop: 16,
    marginBottom: 8,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.GRAY.LIGHT,
    borderRadius: 6,
    marginBottom: 8,
  },
  productInfo: {
    flex: 2,
  },
  productName: {
    fontWeight: "500",
  },
  productDescription: {
    fontSize: 12,
    color: Colors.GRAY.MEDIUM,
  },
  productPrice: {
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
    marginRight: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 4,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: Colors.GRAY.LIGHT,
    borderRadius: 4,
    padding: 8,
    textAlign: 'center',
    marginHorizontal: 8,
    width: 50,
  },
  serviceDetails: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.GRAY.LIGHT,
  },
  servicePrice: {
    fontWeight: "bold",
    marginTop: 8,
  },
  orderSummary: {
    backgroundColor: Colors.WHITE,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY.LIGHT,
    marginBottom: 10,
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 16,
    textAlign: "right",
  },
  subTotal: {
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 16,
  },
  commentLabel: {
    marginTop: 16,
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.GRAY.LIGHT,
    borderRadius: 6,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
  },
  validateButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    float: "bottom",
    zIndex: 1,
    width: "100%",
  },
  validateButtonText: {
    color: Colors.WHITE,
    fontWeight: "bold",
    fontSize: 16,
  },
});
