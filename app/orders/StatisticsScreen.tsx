import React, { useEffect, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { fetchCartStatistics } from '../../data/statistics';
import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StatisticsScreen() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchCartStatistics().then(setData);
  }, []);

  if (!data) return <Text style={styles.loading}>Chargement...</Text>;

  const sections = [
    { title: 'Par jour', data: Object.entries(data.daily) },
    { title: 'Par semaine', data: Object.entries(data.weekly) },
    { title: 'Par mois', data: Object.entries(data.monthly) },
  ];

  return (
    <SafeAreaView style={styles.safeArea}> 
                <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => router.back()}>
                                      <Ionicons name="chevron-back-circle-sharp" size={30} color={Colors.PRIMARY}
                                       style={{paddingRight: 20}} />
                                    </TouchableOpacity>
                    <Text style={styles.headerText}>Les statistiques</Text>
                </View>
    <View style={styles.containerView}> 
    <SectionList
      sections={sections}
      keyExtractor={([key]) => key}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
      renderItem={({ item: [period, stats] }) => (
        <View style={styles.row}>
          <Text style={styles.period}>{period}</Text>
          <Text style={styles.stats}>
            {stats.count} Service/s – {stats.total.toFixed(3)} Dt
          </Text>
        </View>
      )}
      contentContainerStyle={styles.container}
    />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    containerView: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 2 : 40,
      },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: Colors.GRAY.LIGHT,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60,
    alignItems: "center",
    paddingLeft: 15,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    color: Colors.PRIMARY,
    fontFamily: 'outfit-bold',
  },
  loading: { flex: 1, justifyContent: 'center', alignSelf: 'center' },
  container: { 
    padding: 20, backgroundColor: '#f7f7f7',
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
   },
  sectionHeader: { fontSize: 18, fontFamily: 'outfit-bold', marginTop: 20, color: Colors.PRIMARY },
  row: { flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
  },
  period: { fontSize: 14 },
  stats: { fontSize: 14, fontFamily: 'outfit-bold' },
});
