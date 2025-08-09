import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import React from 'react';

export default function SettingsMenu() {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Statistiques',
      icon: 'analytics-outline',
      navigateTo: '/orders/StatisticsScreen',
      description: 'Suivre les performances globales',
    },
    {
      title: 'Paniers validés',
      icon: 'cart-outline',
      navigateTo: '/orders/validatedOrders',
      description: 'Voir l’historique des commandes',
    },
    {
      title: 'Travailleurs',
      icon: 'people-circle-outline',
      navigateTo: '/wokersScreens/WorkersListScreen',
      description: 'Gérer l’équipe et les rôles',
    },
    {
      title: 'Compte',
      icon: 'person-outline',
      navigateTo: '/logIn',
      description: 'Se deconnecter',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎯 Tableau de Bord</Text>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.cardWrapper}
          onPress={() => router.push(item.navigateTo)}
        ><View
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconWrapper}>
                <Ionicons name={item.icon} size={26} color={Colors.PRIMARY} />
              </View>

              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>

              <Ionicons name="chevron-forward" size={22} color="#bbb" />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#eef2f5',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    color: Colors.PRIMARY,
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: "outfit-bold",
    letterSpacing: 0.5,
  },
  cardWrapper: {
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    backgroundColor: '#f9fafc',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#fdecea',
    padding: 10,
    borderRadius: 12,
    marginRight: 15,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
