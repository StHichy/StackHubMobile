import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function CadastroScreen({ navigation }) {
  return (
    <View style={styles.outerContainer}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Container principal */}
      <View style={styles.loginWrapper}>
        <View style={styles.innerContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} placeholder="Digite seu nome" />

          <Text style={styles.label}>E-mail</Text>
          <TextInput style={styles.input} placeholder="Digite seu e-mail" keyboardType="email-address" />

          <Text style={styles.label}>Senha</Text>
          <TextInput style={styles.input} placeholder="Digite sua senha" secureTextEntry />

          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput style={styles.input} placeholder="Confirme sua senha" secureTextEntry />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.registerLink}>
            <Text style={styles.registerText}>Já tem uma conta? Faça Login </Text>
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
    backgroundColor: "#4a2a66",
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
    marginTop: -60,
    width: 350,
    height:510,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 15,
    borderRadius: 40,
    marginHorizontal: 10,
  },
  innerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 30,
    height: 475,
    borderRadius: 32,
    justifyContent: "center",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    height: 40,
    borderRadius: 500,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  button: {
    backgroundColor: "#540076",
    height: 40,
    width: 150,
    borderRadius: 500,
    alignSelf: "center",
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
    marginTop: 20,
    alignItems: "center",
    marginBottom: 20,},
  registerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
