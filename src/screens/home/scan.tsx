import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SavedLink = {
  name: string;
  link: string;
  date: string;
};

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [link, setLink] = useState("");
  const [name, setName] = useState("");

  // 🔹 Solicita permissão na montagem
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // 🔹 Função ao detectar QR code
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return; // evita leitura dupla
    setScanned(true);
    setLink(data);
    Alert.alert("QR Code lido!", data);
  };

  // 🔹 Salva no AsyncStorage
  const handleSave = async () => {
    if (!link.trim() || !name.trim()) {
      Alert.alert("Atenção", "Preencha o nome e escaneie um QR code.");
      return;
    }

    try {
      const stored = await AsyncStorage.getItem("links");
      const list: SavedLink[] = stored ? JSON.parse(stored) : [];

      list.push({
        name,
        link,
        date: new Date().toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      await AsyncStorage.setItem("links", JSON.stringify(list));

      Alert.alert("Sucesso ✅", "Link salvo com sucesso!");
      setName("");
      setLink("");
      setScanned(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o link.");
    }
  };

  // 🔹 Permissão de câmera
  if (!permission)
    return (
      <View style={styles.center}>
        <Text>Solicitando permissão da câmera...</Text>
      </View>
    );

  if (!permission.granted)
    return (
      <View style={styles.center}>
        <Text>Permissão negada para usar a câmera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Permitir</Text>
        </TouchableOpacity>
      </View>
    );

  // 🔹 Interface principal
  return (
    <View style={styles.container}>
      {!scanned ? (
        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View style={styles.form}>
          <Text style={styles.title}>QR Code escaneado!</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite um nome para o link"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScanned(false)}>
            <Text style={styles.link}>Escanear novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// 🔹 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#007AFF",
    marginTop: 15,
    fontWeight: "600",
  },
});
