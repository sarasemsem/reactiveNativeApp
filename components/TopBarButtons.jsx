import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Colors from '../constants/Colors'
import { useCartStore } from '../store/cartStore'
import { useNavigation } from '@react-navigation/native'

export default function TopBarButtons({isBackButton = true, isCartButton = true}) {
    const router = useRouter();
    const cartCount = useCartStore((state) => state.cartItems.length);
    const navigation = useNavigation();

  return (
      <View style={styles.topBarButtonsContainer}>
              {isBackButton && <TouchableOpacity
                style={styles.backButton}
                //onPress={() => router.back()
                //onPress={() => navigation.goBack()
                onPress={() => router.replace("/home")
                }
              >
                <Ionicons name="chevron-back-circle-sharp" 
                size={41} color="white" />
              </TouchableOpacity>}
              {isCartButton && <TouchableOpacity
                style={styles.cartButton}
                onPress={() => router.replace("cartScreen")}
              >
                <View>
                  <Ionicons name="bag-handle" size={24} color={Colors.PRIMARY} />
                  {cartCount > 0 && (
                    <View style={styles.cartCount}>
                      <Text style={{ color: "white", fontSize: 10 }}>
                        {cartCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>}
            </View>
  )
}
const styles = StyleSheet.create({
    topBarButtonsContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 90,
        paddingHorizontal: 16,
        paddingBottom: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 1,
      },
      backButton: {
        backgroundColor: Colors.PRIMARY, 
        borderRadius: 25, 
        width: 39,
        height: 39,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      cartButton: {
        backgroundColor: "#fff", 
        borderRadius: 25, 
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "auto", // push to right in flex row
        marginRight: 10,
        elevation: 5, // adds shadow on Android
        shadowColor: "#000", // adds shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      cartCount: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10,
        width: 13,
        height: 13,
        justifyContent: "center",
        alignItems: "center",
      },

});
