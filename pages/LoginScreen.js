import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather"; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = "http://192.168.0.113:8000/api";

  const handleLogin = async () => {
    if (!email) {
      Alert.alert("Erro", "O email é obrigatório");
      return;
    }
    if (!password || password.length < 8) {
      Alert.alert("Erro", "A senha deve ter pelo menos 8 caracteres");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // pega resposta como texto cru
      const text = await response.text();
      console.log("Resposta da API:", text);

      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = {};
      }

      if (response.ok && data.access_token) {
        await AsyncStorage.setItem("jwt", JSON.stringify(data.access_token));
        Alert.alert("Sucesso", "Login realizado com sucesso!");
        navigation.navigate("Home");
      } else {
        Alert.alert("Erro", data.message || "Falha no login. Verifique as credenciais.");
      }
    } catch (error) {
      console.log("Erro na requisição:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <LinearGradient
      colors={["#0a3d1d", "#222"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.brandSection}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Card de login */}
        <View style={styles.formSection}>
          <Text style={styles.title}>Acesse sua conta</Text>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Icon name="mail" size={20} color="#444" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="exemplo@stackhub.com"
              placeholderTextColor="rgba(0,0,0,0.6)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Senha */}
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={20} color="#444" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="rgba(0,0,0,0.6)"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#444"
                style={styles.togglePassword}
              />
            </TouchableOpacity>
          </View>

          {/* Esqueci senha */}
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
          </TouchableOpacity>

          {/* Botão login */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          {/* Cadastro */}
          <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
            <Text style={styles.registerText}>
              Não tem login? Cadastre-se
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Social login */}
          <View style={styles.socialLogin}>
            <TouchableOpacity style={styles.socialBtn}>
              <Icon name="github" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Icon name="facebook" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Icon name="twitter" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            © 2025 StackHub. Todos os direitos reservados.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0)",
    justifyContent: "center",
    padding: 15,
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 10,
  },
  formSection: {
    backgroundColor: "rgb(69,69,69)",
    borderRadius: 20,
    padding: 25,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "HankenGrotesk-SemiBold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 30,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 45,
    fontFamily: "HankenGrotesk-SemiBold",
  },
  togglePassword: {
    marginLeft: 8,
  },
  forgotPassword: {
    color: "#1ab617",
    textAlign: "right",
    textDecorationLine: "underline",
    marginBottom: 15,
    fontFamily: "HankenGrotesk-SemiBold",
  },
  button: {
    backgroundColor: "#1ab617",
    borderRadius: 30,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "HankenGrotesk-SemiBold",
    fontSize: 16,
  },
  registerText: {
    color: "#fff",
    textAlign: "center",
    textDecorationLine: "underline",
    marginBottom: 20,
    fontFamily: "HankenGrotesk-SemiBold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 15,
  },
  socialLogin: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  socialBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  footer: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    fontFamily: "HankenGrotesk-SemiBold",
  },
});
