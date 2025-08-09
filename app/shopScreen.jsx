import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { products } from '../data/products';
import { useStock } from '../lib/StockContext';
import { useCartStore } from '../store/cartStore';
import { StatusBar } from 'react-native';

const categories = ['Tout', 'Huile', 'Filtre', 'Grand'];
export default function ShopScreen({selectedServices, setSelectedServices}) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
 const cartCount = useCartStore((state) => state.cartItems.length);
 const { stock, setStock } = useStock();

  // Add product to cart
  const addToCart = (product) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        // Increase quantity if exists
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      // Add new product with quantity 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setSelectedServices([...selectedServices, product]);
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        // Decrease quantity if more than 1
        return prevCart.map(item =>
          item.id === productId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      }
      // Remove item completely if quantity is 1
      return prevCart.filter(item => item.id !== productId);
    });
    setSelectedServices(selectedServices.filter(item => item.id !== productId));
  };

  // Filter products based on selected category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Tout' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/home")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        {searchVisible ? (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            <TouchableOpacity onPress={() => setSearchVisible(false)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.headerTitle}>Boutique Vidange</Text>
        )}
        
        <View style={styles.headerIcons}>
          {!searchVisible && (
            <TouchableOpacity onPress={() => setSearchVisible(true)}>
              <Ionicons name="search" size={24} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.replace('/cartScreen')}>
            <View>
              <Ionicons name="cart-outline" size={24} color="black" />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories - Hide when searching */}
      {!searchVisible && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedCategory(cat);
                setSearchQuery(''); // Clear search when changing category
              }}
              style={[
                styles.categoryButton, 
                selectedCategory === cat ? styles.categoryActive : styles.categoryInactive
              ]}>
              <Text style={selectedCategory === cat ? styles.categoryTextActive : styles.categoryTextInactive}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Product Grid */}
      <ScrollView 
        style={styles.productsScroll}
        contentContainerStyle={[styles.productsContainer, {flexGrow: 1}]}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const cartItem = cart.find(item => item.id === product.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            
            return (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productImageContainer}>
                  <Image source={product.image} style={styles.productImage} resizeMode="contain" />
                </View>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <View style={styles.productPriceContainer}>
                  <Text style={styles.productPrice}>{product.price} DT</Text>
                  <View style={styles.quantityControls}>
                    {quantity > 0 && (
                      <>
                        <TouchableOpacity 
                          style={styles.quantityButton} 
                          onPress={() => removeFromCart(product.id)}
                        >
                          <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                      </>
                    )}
                    <TouchableOpacity 
                      style={styles.addButton} 
                      onPress={() => addToCart(product)}
                    >
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.noResults}>
            <Text>Aucun produit trouvé</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 60,
    height: "100%",
    flex: 1,
  },    
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cartBadge: {
    position: 'absolute',
    top: -35,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
  },
  scrollView: {
    flex: 1,
  },
  categoryScroll: {
    paddingHorizontal: 10,
    height: 50,
    marginTop: 16,
    position: "relative",
    zIndex: 1,
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    height: 40,
  },
  categoryActive: {
    backgroundColor: '#EF4444', // red-500
  },
  categoryInactive: {
    backgroundColor: '#F3F4F6', // gray-100
  },
  categoryTextActive: {
    color: 'white',
  },
  categoryTextInactive: {
    color: 'black',
  },
  productsScroll: {
    //flex: 1,
    paddingHorizontal: 10,
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
  productCard: {
    width: '48%',
    height: 300,
    backgroundColor: '#F3F4F6',
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    justifyContent: 'space-between',
  },
  productImageContainer: {
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  productTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  productDescription: {
    color: '#6B7280',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    lineHeight: 18,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingRight: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  noResults: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  quantityButton: {
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 16,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
});