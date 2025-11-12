import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

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

      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <Text>Selecionar imagem</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  imageBox: { width: 150, height: 150, borderRadius: 8, borderWidth: 1, borderColor: "#ccc", justifyContent: "center", alignItems: "center" },
  image: { width: 150, height: 150, borderRadius: 8 },
  input: { width: "100%", padding: 12, borderWidth: 1, borderRadius: 8, marginVertical: 15 },
  button: { backgroundColor: "#4a90e2", padding: 12, borderRadius: 8, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
