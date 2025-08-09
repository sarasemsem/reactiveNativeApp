import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Layout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: Colors.PRIMARY,
      tabBarInactiveTintColor: Colors.GRAY.MEDIUM,
      tabBarStyle: {
        backgroundColor: "#fff",
        paddingVertical: 8,
      },
     }}>
      <Tabs.Screen name="home" 
      options={{ title: 'Accueil',
      tabBarIcon:(({color})=><Ionicons name="home-sharp" size={24} color={color} />)
      }} />
      <Tabs.Screen name="services" 
      options={{
        tabBarIcon:(({color})=><AntDesign name="tool" size={24} color={color} />)
        }}  />
      <Tabs.Screen name="clients"
      options={{
        tabBarIcon:(({color})=><FontAwesome5 name="users" size={24} color={color} />)
        }}  />
      <Tabs.Screen name="stock" 
      options={{
        tabBarIcon:(({color})=><FontAwesome5 name="box" size={24} color={color} />)
        }}  />
      <Tabs.Screen name="settings"
      options={{
        tabBarIcon:(({color})=><Ionicons name="settings-sharp" size={24} color={color} />)
        }} />
      
    </Tabs>
  )
}