import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { TextInputMask } from "react-native-masked-text";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CadastroEmpresa({ navigation }) {
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    nome: "",
    cep: "",
    telefone: "",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    cpfCnpj: "",
    area: "",
    bio: "",
  });

  const API_URL = "http://192.168.56.1:8000/api";

  // --- Busca dados do usuário logado
  useEffect(() => {
    const fetchUserData = async () => {
      const tokenString = await AsyncStorage.getItem("jwt");
      if (!tokenString) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        navigation.navigate("Login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/empresa/dados`, {
          method: "GET",
          headers: { Authorization: `Bearer ${JSON.parse(tokenString)}` },
        });
        const data = await response.json();
        if (data.success && data.usuario) {
          setForm((prev) => ({
            ...prev,
            nome: data.usuario.name || "",
            email: data.usuario.email || "",
          }));
        } else {
          Alert.alert("Erro", data.message || "Não foi possível carregar os dados.");
        }
      } catch (err) {
        console.log("Erro ao carregar dados:", err);
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
      }
    };

    fetchUserData();
  }, []);

  // --- Seleção de foto
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setFoto(result.assets[0].uri);
  };

  // --- Busca automática de CEP
  const buscarCEP = async (cepLimpo) => {
    if (cepLimpo.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (data.erro) {
        Alert.alert("CEP não encontrado!");
        return;
      }
      setForm((prev) => ({
        ...prev,
        estado: data.uf || "",
        cidade: data.localidade || "",
        bairro: data.bairro || "",
        rua: data.logradouro || "",
      }));
    } catch (error) {
      Alert.alert("Erro ao buscar CEP");
    }
  };

  // --- Função para enviar cadastro
const handleCadastrar = async () => {
  setLoading(true);
  const tokenString = await AsyncStorage.getItem("jwt");
  if (!tokenString) {
    Alert.alert("Sessão expirada", "Faça login novamente.");
    navigation.navigate("Login");
    setLoading(false);
    return;
  }

  const limparMascara = (valor) => valor.replace(/\D/g, "");

  const formData = new FormData();
  
  // Mapeando campos para o que o backend espera
  formData.append("cpf_cnpj", limparMascara(form.cpfCnpj));
  formData.append("telefone", limparMascara(form.telefone));
  formData.append("cep", limparMascara(form.cep));
  formData.append("estado", form.estado);
  formData.append("cidade", form.cidade);
  formData.append("bairro", form.bairro);
  formData.append("rua", form.rua);
  formData.append("area_de_atuacao", form.area);
  formData.append("biografia", form.bio);
  // Campos extras que o backend espera
  formData.append("saldo", 5000);
  formData.append("status", "ativo");

  if (foto) {
    const filename = foto.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    formData.append("foto", { uri: foto, name: filename, type });
  }

  try {
    const response = await fetch(`${API_URL}/empresa/cadastrar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(tokenString)}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.log("Resposta não é JSON:", text);
      Alert.alert("Erro", "O servidor retornou uma resposta inesperada.");
      setLoading(false);
      return;
    }

    if (data.success) {
      Alert.alert("Sucesso!", "Cadastro finalizado com sucesso!");
      navigation.navigate("Swap");
    } else {
      Alert.alert("Erro", data.message || "Não foi possível finalizar o cadastro.");
    }
  } catch (err) {
    console.error("Erro no fetch:", err);
    Alert.alert(
      "Erro",
      "Não foi possível conectar ao servidor. Verifique sua rede e tente novamente."
    );
  } finally {
    setLoading(false);
  }
};



  return (
    <LinearGradient colors={["#0a3d1d", "#1a1a1a"]} style={styles.gradientBackground}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={30} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Finalize o seu cadastro</Text>

        {[
          { name: "email", placeholder: "E-mail", icon: "envelope", mask: null },
          { name: "nome", placeholder: "Nome", icon: "user", mask: null },
          { name: "cep", placeholder: "CEP", icon: "map-marker-alt", mask: "zip-code" },
          { name: "telefone", placeholder: "Telefone", icon: "phone", mask: "cel-phone" },
          { name: "estado", placeholder: "Estado", icon: null },
          { name: "cidade", placeholder: "Cidade", icon: null },
          { name: "bairro", placeholder: "Bairro", icon: null },
          { name: "rua", placeholder: "Rua", icon: null },
          { name: "cpfCnpj", placeholder: "CPF ou CNPJ", icon: "id-card", mask: null },
          { name: "area", placeholder: "Área de Atuação", icon: "briefcase", mask: null },
        ].map((field, idx) => (
          <View key={idx} style={styles.inputWithIcon}>
            {field.icon && <FontAwesome5 name={field.icon} style={styles.icon} />}
            {field.mask ? (
              <TextInputMask
                type={field.mask}
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#aaa"
                value={form[field.name]}
                onChangeText={(text) => {
                  setForm({ ...form, [field.name]: text });
                  if (field.name === "cep") {
                    const cepLimpo = text.replace(/\D/g, "");
                    if (cepLimpo.length === 8) buscarCEP(cepLimpo);
                  }
                }}
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#aaa"
                value={form[field.name]}
                onChangeText={(text) => setForm({ ...form, [field.name]: text })}
              />
            )}
          </View>
        ))}

        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Biografia"
          placeholderTextColor="#aaa"
          multiline
          value={form.bio}
          onChangeText={(text) => setForm({ ...form, bio: text })}
        />

        <Text style={styles.label}>Foto de perfil</Text>
        <View style={styles.fileContainer}>
          {foto ? (
            <>
              <Image source={{ uri: foto }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeFileBtn} onPress={() => setFoto(null)}>
                <Text style={styles.removeFileText}>×</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
              <Text style={{ color: "#2fff80", fontWeight: "bold" }}>Selecionar Foto</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleCadastrar} disabled={loading}>
          {loading ? <ActivityIndicator color="#121212" size="small" /> : <Text style={styles.submitText}>Finalizar Cadastro</Text>}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: { flex: 1, padding: 20 },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "rgba(26, 182, 23, 0.1)",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(43, 255, 0, 0.3)",
  },
  title: { fontSize: 28, fontWeight: "700", color: "#2fff80", textAlign: "center", marginBottom: 20 },
  inputWithIcon: { marginBottom: 15, position: "relative" },
  icon: { position: "absolute", left: 15, top: 15, fontSize: 18, color: "#2fff80", zIndex: 2 },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 14,
    paddingLeft: 45,
    borderRadius: 25,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2fff80",
    marginBottom: 10,
  },
  textarea: { height: 140, textAlignVertical: "top" },
  label: { color: "#fff", fontWeight: "600", marginBottom: 8, marginTop: 10 },
  fileContainer: { alignItems: "center", marginBottom: 20 },
  uploadBtn: { borderWidth: 2, borderColor: "#2fff80", padding: 12, borderRadius: 15 },
  imagePreview: { width: 130, height: 130, borderRadius: 20, marginBottom: 5 },
  removeFileBtn: { marginTop: 5 },
  removeFileText: { color: "#ff5555", fontSize: 28, fontWeight: "bold" },
  submitBtn: {
    backgroundColor: "#2fff80",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  submitText: { color: "#121212", fontWeight: "bold", fontSize: 18 },
});
