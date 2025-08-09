// lib/ClientsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc,
  setDoc
} from 'firebase/firestore';
import { db } from "../config/FirebaseConfig"; // RN Firebase instance

const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  // Realtime fetch
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'clients'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClients(data);
    });

    return () => unsubscribe(); // clean up
  }, []);

  // Add client
  const addClient = async (newClient) => {
    try {
      const id = Date.now().toString(); // or use uuid
      await setDoc(doc(db, "clients", id), newClient);
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  const updateClient = async (updatedClient) => {
    try {
      const clientRef = doc(db, 'clients', updatedClient.id);
      await updateDoc(clientRef, {
        name: updatedClient.name,
        phone: updatedClient.phone,
        vehicle: updatedClient.vehicle,
        licensePlate: updatedClient.licensePlate,
      });
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };
  const deleteClient = async (id) => {
    try {
      console.log("Deleting client with ID:", id);
      await deleteDoc(doc(db, "clients", id)); // if using Firebase
      console.log("Deleted");
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };
  
  return (
    <ClientsContext.Provider value={{ clients, addClient, updateClient, deleteClient }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClientsContext = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClientsContext must be used within a ClientsProvider');
  }
  return context;
};
