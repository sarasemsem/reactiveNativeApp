import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../constants/Colors';
import { useStock } from '../../lib/StockContext';
import { products } from '../../data/products';
// Catégories disponibles
const categories = ['Tous', 'Huile', 'Filtre', 'Accessoires', 'Pièces'];

export default function Stock() {
  const [stock, setStock] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]);
  const [newImage, setNewImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à vos photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1]
    });

    if (!result.canceled) {
      setNewImage(result.assets[0].uri);
    }
  };

  const addProduct = () => {
    if (!newProduct || !newQuantity || !newPrice || !newImage) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs et sélectionner une image');
      return;
    }

    setStock(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newProduct,
        quantity: parseInt(newQuantity),
        price: parseFloat(newPrice),
        category: newCategory,
        image: newImage,
      },
    ]);
    setNewProduct('');
    setNewQuantity('');
    setNewPrice('');
    setNewImage(null);
    Alert.alert('Succès', 'Produit ajouté avec succès');
  };

  const updateQuantity = (id, change) => {
    setStock(prev =>
      prev.map(p =>
        p.id === id ? { ...p, quantity: Math.max(p.quantity + change, 0) } : p
      )
    );
  };

  const updatePrice = (id, newPrice) => {
    setStock(prev =>
      prev.map(p =>
        p.id === id ? { ...p, price: parseFloat(newPrice) || 0 } : p
      )
    );
  };

  const updateCategory = (id, newCategory) => {
    setStock(prev =>
      prev.map(p =>
        p.id === id ? { ...p, category: newCategory } : p
      )
    );
  };

  const showProductDetails = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const deleteProduct = (id) => {
    Alert.alert(
      'Supprimer le produit',
      'Êtes-vous sûr de vouloir supprimer ce produit?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', onPress: () => {
          setStock(prev => prev.filter(p => p.id !== id));
          Alert.alert('Succès', 'Produit supprimé avec succès');
        }},
      ]
    );
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2) + ' €';
  };
  const allProducts = [...stock, ...products];

  // Filtrer les produits par catégorie et recherche
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderItem = ({ item }) => {
    const imageSource = 
    typeof item.image === 'number' ? item.image : { uri: item.image };
    return (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => showProductDetails(item)}
    >
      <Image source={imageSource} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={[styles.categoryBadge, {backgroundColor: getCategoryColor(item.category)}]}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.quantityText}>Stock: {item.quantity}</Text>
          <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
        </View>
        <View style={styles.quantityButtons}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={(e) => {
              e.stopPropagation();
              updateQuantity(item.id, 1);
            }}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={(e) => {
              e.stopPropagation();
              updateQuantity(item.id, -1);
            }}
          >
            <Ionicons name="remove" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          deleteProduct(item.id);
        }}
      >
        <Ionicons name="trash" size={25} color={Colors.GREY} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

  // Couleurs pour chaque catégorie
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Huile': return '#3B82F6'; // blue-500
      case 'Filtre': return '#10B981'; // emerald-500
      case 'Accessoires': return '#F59E0B'; // amber-500
      case 'Pièces': return '#8B5CF6'; // violet-500
      default: return Colors.PRIMARY;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>Gestion de Stock</Text>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.GRAY} style={styles.searchIcon} />
          <TextInput
            placeholder="Rechercher un produit..."
            placeholderTextColor={Colors.GRAY.MEDIUM}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* Filtres par catégorie */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && {
                  backgroundColor: getCategoryColor(category),
                }
              ]}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Formulaire d'ajout */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ajouter un nouveau produit</Text>
          
          <TextInput
            placeholder="Nom du produit"
            placeholderTextColor="#888"
            value={newProduct}
            onChangeText={setNewProduct}
            style={styles.input}
          />
          
          <View style={styles.rowInputs}>
            <TextInput
              placeholder="Quantité"
              placeholderTextColor="#888"
              value={newQuantity}
              onChangeText={setNewQuantity}
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
            />
            <TextInput
              placeholder="Prix (€)"
              placeholderTextColor="#888"
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
            />
          </View>

          {/* Sélecteur de catégorie */}
          <View style={styles.categoryPicker}>
            <Text style={styles.categoryLabel}>Catégorie:</Text>
            <View style={styles.categoryOptions}>
              {categories.filter(c => c !== 'Tous').map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setNewCategory(category)}
                  style={[
                    styles.categoryOptionButton,
                    newCategory === category && {
                      backgroundColor: getCategoryColor(category),
                    }
                  ]}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    newCategory === category && styles.categoryOptionTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={pickImage} 
            style={styles.imagePickerButton}
          >
            {newImage ? (
              <>
                <Image source={{ uri: newImage }} style={styles.previewImage} />
                <Text style={styles.imagePickerText}>Changer l'image</Text>
              </>
            ) : (
              <>
                <Ionicons name="image" size={24} color={Colors.PRIMARY} />
                <Text style={styles.imagePickerText}>Sélectionner une image</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={addProduct} 
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Ajouter le produit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>
          {selectedCategory === 'Tous' ? 'Tous les produits' : selectedCategory} ({filteredProducts.length})
        </Text>
        
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Aucun produit en stock</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </ScrollView>

      {/* Modal pour les détails du produit */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                <Image 
                  source={typeof selectedProduct.image === 'number' ? selectedProduct.image : { uri: selectedProduct.image }} 
                  style={styles.modalImage} 
                />

                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                
                <View style={styles.modalInfoContainer}>
                  <Text style={styles.modalQuantity}>
                    Stock: {selectedProduct.quantity}
                  </Text>
                  <Text style={styles.modalPrice}>
                    Prix: {formatPrice(selectedProduct.price)}
                  </Text>
                </View>

                <View style={styles.modalCategoryContainer}>
                  <Text style={styles.modalCategoryLabel}>Catégorie:</Text>
                  <View style={styles.modalCategoryOptions}>
                    {categories.filter(c => c !== 'Tous').map((category) => (
                      <TouchableOpacity
                        key={category}
                        onPress={() => updateCategory(selectedProduct.id, category)}
                        style={[
                          styles.modalCategoryButton,
                          selectedProduct.category === category && {
                            backgroundColor: getCategoryColor(category),
                          }
                        ]}
                      >
                        <Text style={[
                          styles.modalCategoryText,
                          selectedProduct.category === category && styles.modalCategoryTextActive
                        ]}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TextInput
                  placeholder="Nouveau prix"
                  placeholderTextColor="#888"
                  value={selectedProduct.price.toString()}
                  onChangeText={(value) => updatePrice(selectedProduct.id, value)}
                  keyboardType="numeric"
                  style={styles.modalPriceInput}
                />
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.modalButton}
                    onPress={() => {
                      updateQuantity(selectedProduct.id, 1);
                      setIsModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>+ Ajouter stock</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.modalButtonDanger]}
                    onPress={() => {
                      updateQuantity(selectedProduct.id, -1);
                      setIsModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>- Retirer stock</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.DARK,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontFamily: 'outfit-medium',
  },
  categoryScroll: {
    marginBottom: 15,
  },
  categoryContainer: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  categoryText: {
    fontFamily: 'outfit-medium',
    color: Colors.DARK,
  },
  categoryTextActive: {
    color: 'white',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    marginBottom: 15,
    color: Colors.DARK,
  },
  input: {
    backgroundColor: Colors.LIGHT_GRAY,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    color: Colors.DARK,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryPicker: {
    marginBottom: 15,
  },
  categoryLabel: {
    fontFamily: 'outfit-medium',
    marginBottom: 10,
    color: Colors.DARK,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryOptionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  categoryOptionText: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.DARK,
  },
  categoryOptionTextActive: {
    color: 'white',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    color: 'white',
    fontFamily: 'outfit-medium',
    fontSize: 12,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: Colors.LIGHT_GRAY,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
    marginBottom: 15,
  },
  imagePickerText: {
    marginLeft: 10,
    color: Colors.PRIMARY,
    fontSize: 16,
    fontFamily: 'outfit-medium',
  },
  previewImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontFamily: 'outfit-bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    marginLeft: 20,
    marginBottom: 15,
    color: Colors.DARK,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    color: Colors.GRAY,
    fontSize: 16,
    fontFamily: 'outfit-medium',
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: Colors.DARK,
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quantityText: {
    color: Colors.GRAY,
    fontSize: 14,
    fontFamily: 'outfit-medium',
  },
  priceText: {
    color: Colors.PRIMARY,
    fontSize: 14,
    fontFamily: 'outfit-bold',
  },
  quantityButtons: {
    flexDirection: 'row',
  },
  quantityButton: {
    backgroundColor: Colors.DARK,
    borderRadius: 6,
    padding: 5,
    marginRight: 8,
  },
  deleteButton: {
    padding: 12,
    marginLeft: 10,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginBottom: 10,
    textAlign: 'center',
    color: Colors.DARK,
  },
  modalInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  modalQuantity: {
    fontSize: 16,
    color: Colors.GRAY,
    fontFamily: 'outfit-medium',
  },
  modalPrice: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontFamily: 'outfit-bold',
  },
  modalCategoryContainer: {
    width: '100%',
    marginBottom: 20,
  },
  modalCategoryLabel: {
    fontFamily: 'outfit-medium',
    marginBottom: 10,
    color: Colors.DARK,
  },
  modalCategoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  modalCategoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  modalCategoryText: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.DARK,
  },
  modalCategoryTextActive: {
    color: 'white',
  },
  modalPriceInput: {
    backgroundColor: Colors.LIGHT_GRAY,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'outfit-medium',
  },
  modalButtons: {
    width: '100%',
  },
  modalButton: {
    backgroundColor: Colors.DARK,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonDanger: {
    backgroundColor: Colors.DANGER,
  },
  modalButtonText: {
    color: 'white',
    fontFamily: 'outfit-bold',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
});