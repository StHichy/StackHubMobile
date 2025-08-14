import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.outerContainer}>
      {/* Espaço para logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Container preto maior envolvendo o formulário */}
      <View style={styles.loginWrapper}>
        {/* Container que envolve o formulário */}
        <View style={styles.innerContainer}>

          {/* Label Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="exemplo@gmail.com"
            placeholderTextColor="rgba(0,0,0,0.5)"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Label Senha */}
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="rgba(0,0,0,0.5)"
            secureTextEntry
          />

          {/* Link Esqueci minha senha */}
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Logar</Text>
          </TouchableOpacity>

          {/* Link Cadastro no final */}
 <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
  <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 , textDecorationLine: "underline",fontSize: 13, fontWeight: '600'}}>
Ainda não tem uma conta? Cadastre-se</Text>
</TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#4a2a66", // background atualizado
    justifyContent: "flex-start",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 80,
  },
  logo: {
    width: 300,
    height: 300,
  },
  loginWrapper: {
    marginTop: -30,
    width: 350,
    height: 425,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // preto com 40% de opacidade no fundo
    padding: 30,
    borderRadius: 40,
    marginHorizontal: 10,
  },
  innerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // branco com 10% de opacidade no fundo
    padding: 20,
    height: 350,
    borderRadius: 32,
    justifyContent: "center",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
    marginTop: 20,
    fontWeight: "600",
  },
  input: {
    height: 40,
    borderRadius: 500,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.7)", // branco com 70% de opacidade no fundo
  },
  forgotPasswordText: {
    color: "#fff",
    textAlign: "right",
    marginBottom: 15,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#540076",
    height: 40,
    width: 100,
    borderRadius: 500,
    marginLeft: 70,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 40,
    alignItems: "center",
    marginBottom: 20,
  },
  registerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
