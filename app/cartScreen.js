import AntDesign from '@expo/vector-icons/AntDesign';
import * as Print from "expo-print";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import Colors from "../constants/Colors";
import { useCartStore } from "../store/cartStore";
import { db } from "../config/FirebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useClientStore } from '../store/clientStore';

const CartScreen = () => {
    const router = useRouter();
    const cartItems = useCartStore((state) => state.cartItems);
    const { client, clearClient } = useClientStore();

    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    const handlePrint = async () => {
        try {
            // Save each cart item to Firestore
            for (const item of cartItems) {
              const serviceDetails = item.serviceDetails || {};
              const docData = {
                title: item.title,
                description: item.description || "",
                price: item.price,
                client: serviceDetails.client?.name || null,
                worker: serviceDetails.worker?.name || null,
                createdAt: serverTimestamp()
              };
        
              await addDoc(collection(db, "cart"), docData);
            }
            try {
                const itemsToSave = cartItems.map((item) => {
                  const serviceDetails = item.serviceDetails || {};
                  return {
                    title: item.title,
                    description: item.description || "",
                    price: item.price,
                    client: serviceDetails.client?.name || null,
                    worker: serviceDetails.worker?.name || null,
                  };
                });
              
                if (!itemsToSave.length) {
                  console.warn("Cart is empty, nothing to save.");
                  return;
                }
              
                console.log("Trying to save:", itemsToSave);
              
                const docRef = await addDoc(collection(db, "validatedCarts"), {
                  items: itemsToSave,
                  total,
                  createdAt: serverTimestamp(),
                });
              
                console.log("Saved validated cart:", docRef.id);
              } catch (error) {
                console.error("Error while saving to validatedCarts:", error);
              }
              

        const htmlContent = `
          <html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        font-family: "Courier New", Courier, monospace;
        width: 300px;
        margin: 0 auto;
        background: #fff;
        padding: 20px;
        border: 1px dashed #000;
      }

      h1, .section-title {
        text-align: center;
        margin: 0;
      }

      h1 {
        font-size: 18px;
        margin-bottom: 10px;
      }

      .section-title {
        font-size: 14px;
        margin-top: 20px;
        margin-bottom: 10px;
        border-top: 1px dashed #000;
        padding-top: 10px;
      }

      .item {
        margin-bottom: 10px;
        font-size: 13px;
      }

      .item-name {
        font-weight: bold;
      }

      .summary {
        font-size: 13px;
        margin-top: 15px;
        border-top: 1px dashed #000;
        padding-top: 10px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }

      .total {
        font-weight: bold;
        font-size: 14px;
        margin-top: 10px;
      }

      .footer {
        text-align: center;
        font-size: 12px;
        margin-top: 20px;
        border-top: 1px dashed #000;
        padding-top: 10px;
      }
    </style>
  </head>
  <body>
    <h1>REÇU DE SERVICE</h1>
    <div class="section-title">Détails</div>
    ${cartItems.map(item => {
      const serviceDetails = item.serviceDetails || {};
      const clientName = serviceDetails.client?.name || "Client non spécifié";
      const workerName = serviceDetails.worker?.name || "Technicien non spécifié";
      const description = item.description || "Aucune description";
      return `
        <div class="item">
          <div class="item-name">${item.title}</div>
          <div>${description}</div>
          <div>Client: ${clientName}</div>
          <div>Technicien: ${workerName}</div>
          <div>Prix: ${item.price.toFixed(3)} Dt</div>
        </div>
      `;
    }).join("")}
    <div class="section-title">Résumé</div>
    <div class="summary">
      <div class="summary-row"><span>Sous-total</span><span>${subtotal.toFixed(3)} Dt</span></div>
      <div class="summary-row"><span>Taxe (10%)</span><span>${tax.toFixed(3)} Dt</span></div>
      <div class="summary-row total"><span>Total</span><span>${total.toFixed(3)} Dt</span></div>
    </div>
    <div class="footer">
      Merci pour votre confiance<br/>
      ${new Date().toLocaleString("fr-FR")}
    </div>
  </body>
</html>
        `;
      try {
        await Print.printAsync({
          html: htmlContent
        });
      } catch (error) {
        alert("Erreur lors de l'impression des services.");
      }
        // 🧹 Clear client and cart after print
    clearClient();
    useCartStore.getState().clearCart(); // assuming this exists
    } catch (error) {
        alert("Erreur lors de l'enregistrement des services.");
      }
    };
    const renderItem = ({ item }) => {
        // Safely handle service details
        const serviceDetails = item.serviceDetails || {};
        const clientName = serviceDetails.client?.name || "Client non spécifié";
        const workerName = serviceDetails.worker?.name || "Technicien non spécifié";
        const description = item.description || "Aucune description";

        return (
            <View style={styles.item}>
                <View style={styles.itemImage}>
                    {typeof item.icon === "number" ? (
                        <Image source={item.icon} style={styles.itemImage} />
                    ) : (
                        React.isValidElement(item.icon) ? item.icon : <Octicons name="tools" size={24} color={Colors.PRIMARY} />
                    )}
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.title}</Text>
                    <Text style={styles.itemDetailsText}>{description}</Text>
                    {item.serviceDetails && (
                        <>
                            <Text style={styles.itemDetailsText}>Client: {clientName}</Text>
                            <Text style={styles.itemDetailsText}>Technicien: {workerName}</Text>
                        </>
                    )}
                </View>
                <View style={styles.quantityControl}>
                    <Text style={styles.itemPrice}>{item.price.toFixed(3)} Dt</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.discountBanner}>
                <Text style={styles.topText}>Liste des services</Text>
                <TouchableOpacity onPress={()=> router.push("/home")}>
                    <AntDesign name="home" size={30} color={Colors.WHITE} />
                </TouchableOpacity>
            </View>
            <View style={styles.header}>
                <TouchableOpacity style={styles.circleButton} onPress={() => router.push("/home")}>
                    <Ionicons name="chevron-back" size={20} color={Colors.WHITE} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Panier ({cartItems.length})</Text>
            </View>

            <FlatList
                data={cartItems}
                keyExtractor={(item, index) => `${item.id || item.title}-${index}`}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 0.5, backgroundColor: Colors.GRAY.LIGHT, marginBottom: 20 }} />
                )}
            />

            <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                    <Text style={styles.label}>Sous-total</Text>
                    <Text style={styles.value}>{subtotal.toFixed(3)} Dt</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.label}>Taxe (10%)</Text>
                    <Text style={styles.value}>{tax.toFixed(3)} Dt</Text>
                </View>
                <View style={[styles.summaryRow, { marginTop: 10 }]}>
                    <Text style={[styles.label, { fontWeight: "bold" }]}>Total</Text>
                    <Text style={[styles.value, { fontWeight: "bold" }]}>{total.toFixed(3)} Dt</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.checkoutButton} onPress={handlePrint}> 
                <Text style={styles.checkoutText}>Valider et imprimer</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    circleButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.PRIMARY,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        margin: 12,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "500",
        fontFamily: "outfit-bold",
    },
    discountBanner: {
        flexDirection :"row",
        justifyContent: "space-between",
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingRight : 30, 
        backgroundColor: Colors.PRIMARY,
        padding: 20,
    },
    topText: {
        fontSize: 20,
        color: Colors.WHITE,
        fontWeight: "bold",
    },
    offText: {
        color: Colors.WHITE,
        position: "absolute",
        top: 30,
        right: 20,
        fontWeight: "bold",
    },
    codeText: {
        color: "#fff",
        fontSize: 16,
        marginTop: 10,
    },
    bold: {
        fontWeight: "bold",
    },
    list: {
        padding: 30,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    itemImage: {
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#eee",
        borderRadius: 10,
        marginRight: 10,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontFamily: "outfit-bold",
    },
    itemPrice: {
        color: "#888",
        fontSize: 14,
        fontFamily: "outfit",
    },
    quantityControl: {
        flexDirection: "row",
        alignItems: "center",
    },
    roundButton: {
        width: 30,
        height: 30,
        backgroundColor: "#f1f1f1",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        fontSize: 18,
    },
    quantity: {
        marginHorizontal: 10,
        fontWeight: "bold",
    },
    footerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: -10,
    },
    summaryBox: {
        backgroundColor: "#f8f8f8",
        padding: 30,
        paddingTop: 40,
        marginHorizontal: 20,
        borderRadius: 20,
        marginTop: 20,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    label: {
        color: "#888",
        fontSize: 16,
    },
    value: {
        fontFamily: "outfit",
        fontSize: 16,
    },
    checkoutButton: {
        backgroundColor: "#F33A3A",
        padding: 16,
        margin: 20,
        borderRadius: 12,
        alignItems: "center",
    },
    checkoutText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "outfit-bold",
    },
    itemDetailsText: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
    },

});
