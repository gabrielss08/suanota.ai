import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem("loggedUser");
      if (userData) setUser(JSON.parse(userData));
    })();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("loggedUser");
    router.push("/home" as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil</Text>

        <View style={styles.infoArea}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{user?.name || "Usuário"}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>

          <Text style={styles.label}>Membro desde</Text>
          <Text style={styles.value}>{user?.createdAt || "2025"}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1ebebff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: 25,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  infoArea: {
    marginBottom: 30,
  },
  label: {
    color: "#b3b3b3",
    fontSize: 14,
    marginTop: 12,
  },
  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 3,
  },
  button: {
    backgroundColor: "#e63946",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
