import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { Platform } from 'react-native';
import { Alert } from 'react-native';
import { useCartStore} from '../../store/cartStore';
const services = [
  {
    id: 1,
    title: 'Vidange complète',
    description: 'Remplacement huile moteur + filtre à huile',
    price: 150,
    duration: '30 min',
    image: require('../../assets/images/mainBackground.jpg')
  },
  {
    id: 2,
    title: 'Remplacement filtre à air',
    description: 'Nettoyage boîte à air + nouveau filtre',
    price: 80,
    duration: '15 min',
    image: require('../../assets/images/boutique.jpg')
  },
  {
    id: 3,
    title: 'Diagnostic complet',
    description: 'Scan électronique + vérification mécanique',
    price: 200,
    duration: '45 min',
    image: require('../../assets/images/care-washing.jpg')
  },
  { 
    id: 4,
    title: 'Nettoyage injection',
    description: 'Décrassage système injection diesel/essence',
    price: 180,
    duration: '40 min',
    image: require('../../assets/images/entretien.jpg')
  },
];

export default function ServicesScreen() {
  const [selectedServices, setSelectedServices] = useState([]);
  const router = useRouter();
  const { addToCart } = useCartStore();
  const cartItems = useCartStore((state) => state.cartItems);

  const toggleService = (service) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const validateCart = () => {
    if (selectedServices.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins un service');
      return;
    } 
    addToCart(selectedServices);
    setSelectedServices([]);
    Alert.alert('Succès', 'Services ajoutés au panier');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nos Services</Text>
        <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cartScreen')}>
            <View>
              <Ionicons name="cart-outline" size={30} color="white" />
              {cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
      </View>

      {/* Services List */}
      <ScrollView contentContainerStyle={styles.servicesContainer}>
        {services.map(service => {
          const isSelected = selectedServices.some(s => s.id === service.id);
          return (
            <View 
              key={service.id} 
              style={[
                styles.serviceCard,
                isSelected && styles.serviceCardSelected
              ]}
            >
              <Image source={service.image} style={styles.serviceImage} />
              
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                
                <View style={styles.serviceMeta}>
                  <Text style={styles.serviceDuration}>{service.duration}</Text>
                  <Text style={styles.servicePrice}>{service.price} DT</Text>
                </View>
              </View>

              <TouchableOpacity 
                onPress={() => toggleService(service)}
                style={[styles.selectButton, isSelected && styles.selected]}
              >
                <Text style={styles.selectButtonText}>
                  {isSelected ? 'Annuler' : 'Choisir'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Fixed Bottom Bar */}
      {selectedServices.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarContent}>
            <Text style={styles.totalText}>
              {selectedServices.reduce((sum, s) => sum + s.price, 0)} DT
            </Text>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => validateCart()}
            >
              <Text style={styles.confirmButtonText}>
                Confirmer ({selectedServices.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 2 : 45,
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.PRIMARY,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: Colors.PRIMARY,
    fontSize: 12,
    fontWeight: 'bold',
  },
  servicesContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  serviceCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceCardSelected: {
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  serviceImage: {
    width: '100%',
    height: 150,
  },
  serviceInfo: {
    padding: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  serviceDescription: {
    color: '#6b7280',
    marginBottom: 12,
  },
  serviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceDuration: {
    color: '#4b5563',
    fontWeight: '500',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  selectButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.GRAY.LIGHT,
  },
  quantityButton: {
    backgroundColor: Colors.PRIMARY,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: Colors.WHITE,
    fontSize: 18,
    lineHeight: 18,
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.WHITE,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
});