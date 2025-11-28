import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.replace("Home");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bem-vindo 👋</Text>
        <Text style={styles.subtitle}>Entre para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#8A8A8A"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#8A8A8A"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Criar uma conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 🔹 Fundo com gradiente fake usando duas cores complementares
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#E6EBFF",
  },

  // 🔹 Card elegante
  card: {
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 22,

    // Sombras mais atuais
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    color: "#1B1B1D",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#707070",
    marginBottom: 30,
    marginTop: 6,
  },

  // 🔹 Inputs modernos
  input: {
    width: "100%",
    backgroundColor: "#F8F9FE",
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",

    fontSize: 16,
  },

  // 🔹 Botão elegante
  button: {
    backgroundColor: "#384BFF",
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",

    shadowColor: "#384BFF",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  // 🔹 Link estiloso
  link: {
    color: "#384BFF",
    textAlign: "center",
    marginTop: 22,
    fontSize: 16,
    fontWeight: "600",
  },
});
