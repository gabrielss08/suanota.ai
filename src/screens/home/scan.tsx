import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [link, setLink] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: any) => {
    setScanned(true);
    setLink(data);
    Alert.alert("QR Code lido!", data);
  };

  const handleSave = async () => {
    if (!link || !name) {
      Alert.alert("Preencha o nome e escaneie um QR code");
      return;
    }

    const stored = await AsyncStorage.getItem("links");
    const list = stored ? JSON.parse(stored) : [];

    list.push({ name, link, date: new Date().toLocaleDateString("pt-BR") });
    await AsyncStorage.setItem("links", JSON.stringify(list));
    Alert.alert("Sucesso", "Link salvo!");
    setName("");
    setLink("");
    setScanned(false);
  };

  if (hasPermission === null)
    return <Text>Solicitando permissão da câmera...</Text>;
  if (hasPermission === false)
    return <Text>Permissão negada para usar a câmera</Text>;

  return (
    <View style={styles.container}>
      {!scanned ? (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View style={styles.form}>
          <Text style={styles.title}>QR Code escaneado!</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do link"
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

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  form: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: "#4a90e2", padding: 12, borderRadius: 8, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { color: "#4a90e2", marginTop: 15 },
});
