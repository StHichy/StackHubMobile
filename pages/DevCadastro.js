import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { TextInputMask } from "react-native-masked-text";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CadastroDev({ navigation }) {
  const [form, setForm] = useState({
    email: "",
    nome: "",
    cpfCnpj: "",
    cep: "",
    telefone: "",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    dataNascimento: "",
    biografia: "",
    senioridade: "",
    areaDeAtuacao: "",
  });

  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const [availableTags] = useState([
    "JavaScript", "HTML/CSS", "React", "Node.js", "Python",
    "Java", "PHP", "SQL", "Git", "UI/UX Design",
    "TypeScript", "Vue.js", "Angular", "C#", "Outro"
  ]);
  const [selectedTags, setSelectedTags] = useState([]);

  const API_URL = "http://192.168.56.1:8000/api";

  useEffect(() => {
    const fetchUserData = async () => {
      const tokenString = await AsyncStorage.getItem("jwt");
      if (!tokenString) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        navigation.navigate("Login");
        return;
      }

      try {
        const token = JSON.parse(tokenString);
        const response = await fetch(`${API_URL}/freelancer/dados`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          console.log("Resposta /freelancer/dados não é JSON:", text);
          Alert.alert("Erro", "Não foi possível ler os dados do usuário (resposta inválida).");
          return;
        }

        if (data.success && data.usuario) {
          setForm(prev => ({
            ...prev,
            nome: data.usuario.name || prev.nome,
            email: data.usuario.email || prev.email,
          }));
          // tenta encontrar id do usuário na resposta
          const possibleId = data.usuario.id ?? data.usuario.user_id ?? data.usuario.id_usuario;
          if (possibleId) setUserId(possibleId);
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) setFoto(result.assets[0].uri);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      Alert.alert("Máximo de 3 habilidades selecionadas");
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const buscarCEP = async (cepLimpo) => {
    if (cepLimpo.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (data.erro) {
        Alert.alert("CEP não encontrado!");
        return;
      }
      setForm(prev => ({
        ...prev,
        cep: prev.cep,
        estado: data.uf || "",
        cidade: data.localidade || "",
        bairro: data.bairro || "",
        rua: data.logradouro || "",
      }));
    } catch (error) {
      Alert.alert("Erro ao buscar CEP");
    }
  };

  const limparMascara = (valor = "") => String(valor).replace(/\D/g, "");

  const formatarDataISO = (valor) => {
    if (!valor) return "";
    const parts = String(valor).split("/");
    if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`;
    // se já estiver no formato sem barras (ex: 22052008), tenta converter:
    if (/^\d{8}$/.test(valor)) return `${valor.slice(4,8)}-${valor.slice(2,4)}-${valor.slice(0,2)}`;
    return valor;
  };

  const handleSubmit = async () => {
    // validações básicas
    if (!form.nome) { Alert.alert("Preencha o nome"); return; }
    if (!form.senioridade) { Alert.alert("Preencha a senioridade"); return; }
    if (selectedTags.length === 0) { Alert.alert("Selecione pelo menos uma habilidade"); return; }

    setLoading(true);
    const tokenString = await AsyncStorage.getItem("jwt");
    if (!tokenString) {
      Alert.alert("Sessão expirada", "Faça login novamente.");
      navigation.navigate("Login");
      setLoading(false);
      return;
    }
    const token = JSON.parse(tokenString);

    // monta FormData com os nomes que o backend espera
    const formData = new FormData();

    // id_usuario (se disponível)
    if (userId) formData.append("id_usuario", Number(userId));

    formData.append("apelido", form.nome);
    formData.append("cpf_cnpj", limparMascara(form.cpfCnpj));
    formData.append("telefone", limparMascara(form.telefone));
    formData.append("cep", limparMascara(form.cep));
    formData.append("estado", form.estado || "");
    formData.append("cidade", form.cidade || "");
    formData.append("bairro", form.bairro || "");
    formData.append("rua", form.rua || "");
    formData.append("area_de_atuacao", form.areaDeAtuacao || "");
    formData.append("biografia", form.biografia || "");
    formData.append("senioridade", form.senioridade || "");
    formData.append("habilidade_principal", selectedTags[0] || "");
    formData.append("habilidades", JSON.stringify(selectedTags)); // backend pode dar json_decode
    formData.append("data_nascimento", formatarDataISO(form.dataNascimento) || "");
    formData.append("saldo", 0);
    formData.append("status", "ativo");
    formData.append("user_type", "freelancer");

    if (foto) {
      const filename = foto.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      // importante: em RN o campo deve ter uri, name e type
      formData.append("foto", { uri: foto, name: filename, type });
    }

    try {
      const response = await fetch(`${API_URL}/freelancer/cadastrar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          // NÃO definir Content-Type aqui; deixe o fetch configurar o boundary
        },
        body: formData,
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("Resposta não é JSON:", text);
        Alert.alert("Erro", "O servidor retornou uma resposta inesperada (veja console).");
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
      Alert.alert("Erro", "Não foi possível conectar ao servidor. Verifique sua rede.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "email", placeholder: "E-mail", icon: "envelope", mask: null },
    { name: "nome", placeholder: "Nome", icon: "user", mask: null },
    { name: "cpfCnpj", placeholder: "CPF ou CNPJ", icon: "id-card", mask: null },
    { name: "cep", placeholder: "CEP", icon: "map-marker-alt", mask: "zip-code" },
    { name: "telefone", placeholder: "Telefone", icon: "phone", mask: "cel-phone" },
    { name: "estado", placeholder: "Estado", icon: "map", mask: null, disabled: true },
    { name: "cidade", placeholder: "Cidade", icon: "city", mask: null, disabled: true },
    { name: "bairro", placeholder: "Bairro", icon: "building", mask: null, disabled: true },
    { name: "rua", placeholder: "Rua", icon: "road", mask: null },
    { name: "dataNascimento", placeholder: "Data de Nascimento (DD/MM/YYYY)", icon: "calendar-alt", mask: "datetime" },
    { name: "senioridade", placeholder: "Senioridade (Júnior, Pleno, Sênior)", icon: "star", mask: null },
    { name: "areaDeAtuacao", placeholder: "Área de atuação", icon: "briefcase", mask: null }
  ];

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={30} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Finalize o seu cadastro</Text>

        {fields.map((field, index) => (
          <View key={index} style={styles.inputWithIcon}>
            {field.icon && <FontAwesome5 name={field.icon} style={styles.icon} />}
            {field.mask === "zip-code" ? (
              <TextInputMask
                type={'zip-code'}
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#aaa"
                value={form[field.name]}
                onChangeText={(text) => {
                  setForm({ ...form, [field.name]: text });
                  const cepLimpo = text.replace(/\D/g, "");
                  if (cepLimpo.length === 8) buscarCEP(cepLimpo);
                }}
              />
            ) : field.mask === "cel-phone" ? (
              <TextInputMask
                type={'cel-phone'}
                options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#aaa"
                value={form[field.name]}
                onChangeText={(text) => setForm({ ...form, [field.name]: text })}
              />
            ) : field.mask === "datetime" ? (
              <TextInputMask
                type={'datetime'}
                options={{ format: 'DD/MM/YYYY' }}
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#aaa"
                value={form[field.name]}
                onChangeText={(text) => setForm({ ...form, [field.name]: text })}
              />
            ) : (
              <TextInput
                style={[styles.input, field.disabled && { backgroundColor: "rgba(255,255,255,0.05)" }]}
                placeholder={field.placeholder}
                placeholderTextColor="#aaa"
                value={form[field.name]}
                onChangeText={(text) => setForm({ ...form, [field.name]: text })}
                editable={!field.disabled}
              />
            )}
          </View>
        ))}

        <TextInput
          placeholder="Biografia"
          placeholderTextColor="#aaa"
          style={[styles.input, styles.textarea]}
          multiline
          value={form.biografia}
          onChangeText={(text) => setForm({ ...form, biografia: text })}
        />

        <Text style={styles.tagsTitle}>Selecione até 3 habilidades</Text>
        <View style={styles.availableTags}>
          {availableTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, selectedTags.includes(tag) && styles.selectedTag]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={{ color: selectedTags.includes(tag) ? "#000" : "#fff", fontSize: 14 }}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.selectedTagsContainer}>
          {selectedTags.map((tag) => (
            <View key={tag} style={styles.selectedTag}>
              <Text style={{ fontSize: 12 }}>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <Text style={styles.removeTag}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.tagsCounter}>Selecionadas: {selectedTags.length}/3</Text>

        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          <Text style={{ color: "#2fff80", fontWeight: "bold" }}>{foto ? "Trocar Foto" : "Selecionar Foto"}</Text>
        </TouchableOpacity>
        {foto && <Image source={{ uri: foto }} style={styles.imagePreview} />}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#121212" size="small" /> : <Text style={styles.submitText}>Finalizar Cadastro</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0a3d1d", paddingTop: 50, paddingHorizontal: 20 },
  scrollContainer: {
    paddingBottom: 40,
    backgroundColor: "rgba(26, 182, 23, 0.1)",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(43, 255, 0, 0.3)",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "700", color: "#2fff80", textAlign: "center", marginBottom: 20 },
  inputWithIcon: { position: "relative", marginBottom: 15 },
  icon: { position: "absolute", left: 15, top: 12, fontSize: 16, color: "#2fff80", zIndex: 2 },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 12,
    paddingLeft: 45,
    borderRadius: 20,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2fff80",
    marginBottom: 15,
  },
  textarea: { height: 80, textAlignVertical: "top" },
  tagsTitle: { color: "#fff", fontWeight: "600", marginBottom: 10 },
  availableTags: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2fff80",
    marginRight: 4,
    marginBottom: 4,
  },
  selectedTag: { backgroundColor: "#2fff80", color: "#000", padding: 8, borderRadius: 20, flexDirection: "row", alignItems: "center", marginRight: 4, marginBottom: 4 },
  selectedTagsContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  removeTag: { marginLeft: 3, color: "#000", fontWeight: "bold" },
  tagsCounter: { color: "#fff", marginBottom: 10, textAlign: "center" },
  uploadBtn: { borderWidth: 2, borderColor: "#2fff80", padding: 10, borderRadius: 15, alignItems: "center", marginBottom: 10 },
  imagePreview: { width: 120, height: 120, borderRadius: 20, marginBottom: 10 },
  submitBtn: { backgroundColor: "#2fff80", padding: 14, borderRadius: 30, alignItems: "center", marginBottom: 20 },
  submitText: { color: "#121212", fontWeight: "bold", fontSize: 16 },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 10 },
});
