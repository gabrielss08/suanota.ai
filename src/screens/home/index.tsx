import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

type SavedLink = {
  name: string;
  link: string;
  date: string;
};

export default function HomeScreen({ navigation }: any) {
  const [links, setLinks] = useState<SavedLink[]>([]);
  const isFocused = useIsFocused();

  // 🔹 Carregar lista sempre que a tela voltar ao foco
  useEffect(() => {
    loadLinks();
  }, [isFocused]);

  const loadLinks = async () => {
    const stored = await AsyncStorage.getItem("links");
    setLinks(stored ? JSON.parse(stored) : []);
  };

  const renderItem = ({ item }: { item: SavedLink }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.link}>{item.link}</Text>
      <Text style={styles.date}>📅 {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus QR Codes Salvos</Text>

      {links.length === 0 ? (
        <Text style={styles.empty}>Nenhum QR code salvo ainda.</Text>
      ) : (
        <FlatList
          data={links}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate("Scan")}
      >
        <Text style={styles.scanText}>+ Escanear novo QR</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🔹 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#222",
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  link: {
    fontSize: 14,
    marginTop: 5,
    color: "#007AFF",
  },
  date: {
    fontSize: 12,
    marginTop: 10,
    color: "#555",
  },
  scanButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  scanText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
});
