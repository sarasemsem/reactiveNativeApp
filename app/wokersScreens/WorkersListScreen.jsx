import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function WorkersListScreen() {
  const router = useRouter();
  const [workers, setWorkers] = useState([]);
  const [expandedWorker, setExpandedWorker] = useState(null);

  const toggleWorkerDetails = (workerId) => {
    setExpandedWorker(expandedWorker === workerId ? null : workerId);
  };

// Add new worker
const addNewWorker = () => {
  router.push('/wokersScreens/addWorkerScreen');
};

// Edit existing worker
const editWorker = (workerId) => {
  try {
    router.push({ pathname: '/wokersScreens/addWorkerScreen', params: { id: workerId } });
  } catch (error) {
  }
};


  const deleteWorker = async (workerId) => {
    setWorkers(workers.filter(worker => worker.id !== workerId));
    try {
      await deleteDoc(doc(db, "workers", workerId)); // if using Firebase
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'workers'), (snapshot) => {
      const newData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setWorkers(prevWorkers => {
        // Keep existing items not in the new snapshot
        const existingIds = new Set(newData.map(worker => worker.id));
        const uniqueOldWorkers = prevWorkers.filter(w => !existingIds.has(w.id));
        return [...uniqueOldWorkers, ...newData];
      });
    });
  
    return unsubscribe;
  }, []);
  

  return (
        <SafeAreaView style={styles.safeArea}> 
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back-circle-sharp" size={30} color={Colors.PRIMARY}
                         style={{paddingRight: 20}} />
                      </TouchableOpacity>
                <Text style={styles.headerText}>Gestion des travailleurs</Text>
            </View>
    <View style={styles.container}> 
      {/* Add New Worker Button */}
      <TouchableOpacity style={styles.addButton} 
      onPress={ () => addNewWorker()}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Ajouter un mécanicien</Text>
      </TouchableOpacity>

      {/* Workers List */}
      <FlatList
        data={workers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.workerCard}>
            <TouchableOpacity 
              style={styles.workerHeader}
              onPress={() => toggleWorkerDetails(item.id)}
            >
              <View>
                <Text style={styles.workerName}>{item.name}</Text>
                {item.role?.value && (
                  <Text style={styles.workerRole}>{item.role?.value}</Text>
                )}
              </View>
              <Ionicons 
                name={expandedWorker === item.id ? 'chevron-up' : 'chevron-down'} 
                size={24} 
                color={Colors.PRIMARY} 
              />
            </TouchableOpacity>

            {expandedWorker === item.id && (
              <View style={styles.workerDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="call" size={20} color="red" />
                  <Text style={styles.detailText}>{item.contact}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="mail" size={20} color="red" />
                  <Text style={styles.detailText}>{item.email}</Text>
                </View>
                <View style={styles.detailRow}>
                <Ionicons name="checkmark-circle" size={20} 
                color={item.availability?.name === 'Disponible' ? 'green' : 'red'} />
                  <Text style={styles.detailText}>{item.availability?.name}</Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => editWorker(item.id)}
                  >
                    <Ionicons name="create" size={18} color="white" />
                    <Text style={styles.actionButtonText}>Modifier</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => deleteWorker(item.id)}
                  >
                    <Ionicons name="trash" size={18} color="white" />
                    <Text style={styles.actionButtonText}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
      </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    top: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 60,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  headerContainer: {
    flexDirection: 'row',
    position: "absolute",
    paddingLeft: 20,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: Colors.GRAY.LIGHT,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    fontFamily: 'outfit-bold',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: "relative",
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  workerCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    overflow: 'hidden',
  },
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.BLACK,
    fontFamily: 'outfit-bold',
  },
  workerRole: {
    fontSize: 14,
    color: Colors.GRAY.DARK,
    marginTop: 5,
  },
  workerDetails: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY.LIGHT,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.BLACK,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: Colors.PRIMARY,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});