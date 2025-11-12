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
      <Text style={styles.title}>Perfil</Text>
      <Text>Email: {user?.email}</Text>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#4a90e2", padding: 12, borderRadius: 8, marginTop: 30 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
