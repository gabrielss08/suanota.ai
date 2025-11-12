import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserData = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o app, verifica se há login salvo
  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem("@user_logged");
      if (savedUser) setUser(savedUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const usersData = await AsyncStorage.getItem("@users_db");
    const users: UserData[] = usersData ? JSON.parse(usersData) : [];

    const userFound = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!userFound) {
      throw new Error("E-mail ou senha incorretos!");
    }

    await AsyncStorage.setItem("@user_logged", email);
    setUser(email);
  };

  const register = async (email: string, password: string) => {
    const usersData = await AsyncStorage.getItem("@users_db");
    const users: UserData[] = usersData ? JSON.parse(usersData) : [];

    const alreadyExists = users.some((u) => u.email === email);
    if (alreadyExists) throw new Error("Usuário já cadastrado!");

    users.push({ email, password });
    await AsyncStorage.setItem("@users_db", JSON.stringify(users));
    await AsyncStorage.setItem("@user_logged", email);
    setUser(email);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("@user_logged");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
