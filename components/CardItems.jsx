import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Colors from '../constants/Colors';
import { useItemStore } from '../store/itemStore';

// ✅ Move this outside the component so it's accessible in the styles below
const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

export default function CardItems({ item, index }) {
  const router = useRouter();
  const setItem = useItemStore((state) => state.setItem);

  return (
    <Animatable.View delay={index * 120} animation="slideInRight"
      duration={500} key={index} style={styles.section}>
      <View style={styles.card}>
        <Image source={item.icon} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <View style={styles.cartContainer}>
            <TouchableOpacity style={styles.cardButton}
              onPress={() => {
                setItem(item);
                router.replace('/serviceDetailsScreen');
              }}>
              <Ionicons name="cart" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginRight: 5,
  },
  card: {
    width: isTablet ? width * 0.20 : width * 0.42,
    height: isTablet ? height * 0.34 : height * 0.29,
    borderRadius: 30,
    marginRight: 10,
    marginBottom: 15,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    fontFamily: 'outfit-bold',
  },
  cardDescription: {
    fontSize: 10,
    color: 'gray',
    fontFamily: 'outfit',
  },
  cardImage: {
    width: isTablet ? width * 0.20 : width * 0.42,
    height: isTablet ? height * 0.20 : height * 0.15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  cartContainer: {
    width: "100%",
    alignItems: 'center',
    marginTop: 15,
  },
  cardButton: {
    width: "100%",
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(228, 228, 228, 0.64)",
    justifyContent: 'center',
    alignItems: 'center',
  }
});