import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterPhoto() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!name || !photo) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    const today = new Date().toLocaleDateString("pt-BR");
    const item = { name, photo, date: today };

    const stored = await AsyncStorage.getItem("photos");
    const list = stored ? JSON.parse(stored) : [];
    list.push(item);

    await AsyncStorage.setItem("photos", JSON.stringify(list));
    Alert.alert("Sucesso", "Cadastro salvo!");
    setName("");
    setPhoto(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Foto</Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="camera-outline" size={45} color="#777" />
              <Text style={styles.placeholderText}>Selecionar imagem</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Digite o nome da pessoa"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ----------------------- ESTILOS MODERNOS -----------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f5",
    paddingTop: 60,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2d2d2d",
    marginBottom: 15,
  },

  card: {
    width: "88%",
    backgroundColor: "#1a1a1a",
    padding: 25,
    borderRadius: 20,

    // sombra bonitinha
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  imageBox: {
    width: "100%",
    height: 200,
    borderRadius: 18,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,

    // sombra suave
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },

  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    marginTop: 10,
    fontSize: 15,
    color: "#555",
  },

  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1.6,
    borderColor: "#d1d5db",
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  button: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    alignItems: "center",

    shadowColor: "#4A90E2",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
