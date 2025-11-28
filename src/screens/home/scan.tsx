import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
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

  // 🔹 Solicita permissão ao carregar
  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  // 🔹 Leitura do QR
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setLink(data);
    Alert.alert("QR Code lido ✔️", data);
  };

  // 🔹 Salvar
  const handleSave = async () => {
    if (!link.trim() || !name.trim()) {
      Alert.alert("Atenção", "Preencha o nome e escaneie um QR code.");
      return;
    }

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

    Alert.alert("Salvo!", "O link foi armazenado com sucesso.");
    setLink("");
    setName("");
    setScanned(false);
  };

  // 🔹 Sem permissão carregada ainda
  if (!permission)
    return (
      <View style={styles.center}>
        <Text style={{ color: "#333" }}>Carregando permissões...</Text>
      </View>
    );

  // 🔹 Permissão negada
  if (!permission.granted)
    return (
      <View style={styles.center}>
        <Text style={styles.deniedText}>Permissão da câmera negada</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir acesso</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>
      {!scanned ? (
        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View style={styles.form}>
          <Text style={styles.title}>QR Code escaneado!</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite um nome para o link"
            placeholderTextColor="#aaa"
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
    backgroundColor: "#F2F4F7",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  deniedText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },

  form: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 45,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    color: "#222",
  },

  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1.4,
    borderColor: "#D0D5DD",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: "#007AFF",

    shadowColor: "#007AFF",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,

    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#007AFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
