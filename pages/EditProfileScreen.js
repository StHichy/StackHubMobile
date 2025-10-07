import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  Dimensions,
  Image,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

// --- Configurações ---
const API_URL = "http://192.168.0.113:8000/api";
const LEVELS = ["Júnior", "Pleno", "Sênior", "Especialista"];
const DEFAULT_AVATAR_URL = "https://via.placeholder.com/150/0000FF/FFFFFF?text=User";

// Dados fictícios para Portfólio
const DUMMY_PORTFOLIO_BASE = {
  technologies: ["Java", "Spring Boot", "React Native", "PostgreSQL", "AWS"],
  projects: [
    { name: "E-commerce Backend", description: "API RESTful para plataforma de vendas online." },
    { name: "Mobile App", description: "Aplicativo móvel para gerenciamento de tarefas e projetos." },
    { name: "Sistema de Logs Distribuído", description: "Serviço de coleta e análise de logs em tempo real." },
  ],
};

// --- NavBar ---
const NavBar = ({ navigation, handleDropdownChange }) => (
  <View style={styles.navBar}>
    <Pressable style={styles.navItem} onPress={() => console.log('Pasta Pressionada')}>
      <Ionicons name="folder" size={28} color="#fff" />
    </Pressable>
    <Pressable style={styles.navItem} onPress={() => console.log('Clipboard Pressionado')}>
      <FontAwesome5 name="clipboard-list" size={28} color="#fff" />
    </Pressable>
    <Pressable style={[styles.navItem, styles.activeNavItem]}>
      <View style={styles.activeNavIconContainer}>
        {/* Você precisa garantir que '../assets/logo.png' está acessível ou substitua por um ícone */}
        <Ionicons name="person" size={28} color="#fff" />
      </View>
    </Pressable>
    <Pressable style={styles.navItem} onPress={() => navigation.navigate("ChatList")}>
      <MaterialCommunityIcons name="chat" size={28} color="#fff" />
    </Pressable>
    <Dropdown
      style={[styles.dropdownNav]}
      containerStyle={styles.dropdownContainer}
      placeholderStyle={styles.dropdownPlaceholder}
      selectedTextStyle={styles.dropdownSelected}
      itemTextStyle={styles.dropdownItemText}
      activeColor="#1a1a1a"
      data={[{ label: "Perfil", value: "perfil" }, { label: "Sair", value: "logout" }]}
      labelField="label"
      valueField="value"
      placeholder={<Ionicons name="menu" size={26} color="#fff" />}
      onChange={handleDropdownChange}
    />
  </View>
);

// --- Modal do Portfólio ---
const PortfolioModal = ({ visible, onClose, portfolioData }) => (
  <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Portfólio</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={30} color="#ff4d4d" />
          </Pressable>
        </View>
        <ScrollView style={styles.modalBody}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Biografia</Text>
            <Text style={styles.sectionText}>{portfolioData.description}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tecnologias/Habilidades</Text>
            <View style={styles.techContainer}>
              {portfolioData.technologies.map((tech, index) => (
                <View key={index} style={styles.techBubble}>
                  <Text style={styles.techText}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projetos</Text>
            {portfolioData.projects.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectDescription}>{project.description}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

// --- Auxiliares ---
const calculateAge = (dateString) => {
  if (!dateString) return '';
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age.toString();
};

// --- Componente Principal ---
const ProfileScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Incluído 'bairro' e 'rua' no estado inicial
  const [form, setForm] = useState({
    nome: "", apelido: "", data_nascimento: "", telefone: "", cep: "", cidade: "", estado: "", bairro: "", rua: "", // <-- Adicionados
    profissao: "", nivel: LEVELS[0], skills: "", biografia: "", profilePicUrl: DEFAULT_AVATAR_URL
  });

  const [cardData, setCardData] = useState({
    nome: "Nome, 00", profissao: "Profissão", nivel: "Nível", skills: [], avaliacoes: 0, foto: ""
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Permissão necessária", "Precisamos de permissão para acessar sua galeria.");
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1,1], quality: 0.8 });
    if (!result.canceled) { setForm(prev => ({ ...prev, profilePicUrl: result.assets[0].uri })); setImageFile(result.assets[0].uri); }
  };

  // --- Busca ---
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    const tokenString = await AsyncStorage.getItem("jwt");
    if (!tokenString) { Alert.alert("Sessão expirada"); navigation.navigate("Login"); setLoading(false); return; }
    try {
      const token = JSON.parse(tokenString);
      const response = await fetch(`${API_URL}/perfil`, { method:"GET", headers:{ Authorization:`Bearer ${token}`, Accept:"application/json" } });
      const text = await response.text();
      const data = JSON.parse(text);
      
      if (data.success && data.usuario) {
        // Combina dados do usuário e freelancer/empresa (assumindo que freelancer contém endereço)
        const user = { ...data.usuario, ...(data.usuario.freelancer||{}), ...(data.usuario.empresa||{}) }; 
        const skillsArray = (user.habilidades || '').split(',').map(s=>s.trim()).filter(s=>s);
        const age = user.data_nascimento ? calculateAge(user.data_nascimento) : '';
        
        setForm({
          nome: user.name || '',
          apelido: user.apelido || '',
          data_nascimento: user.data_nascimento || '',
          telefone: user.telefone || '',
          cep: user.cep || '',
          cidade: user.cidade || '',
          estado: user.estado || '',
          bairro: user.bairro || '', // <-- Carregando bairro
          rua: user.rua || '', // <-- Carregando rua
          profissao: user.area_de_atuacao || '',
          nivel: user.senioridade || LEVELS[0],
          skills: user.habilidades || '',
          biografia: user.biografia || '',
          profilePicUrl: user.profile_pic_url || DEFAULT_AVATAR_URL
        });
        
        setCardData({
          nome: `${user.name || 'Nome'}, ${age || '00'}`,
          profissao: user.area_de_atuacao || user.habilidade_principal || 'Profissão',
          nivel: user.senioridade || 'Nível',
          skills: skillsArray,
          avaliacoes: user.avaliacoes || 0,
          foto: user.foto_url || DEFAULT_AVATAR_URL
        });
      } else Alert.alert("Erro", data.message || "Não foi possível carregar os dados.");
    } catch(e){ console.log(e); Alert.alert("Erro de conexão"); }
    finally{ setLoading(false); }
  }, [navigation]);

  // --- Salvar ---
  const handleEditProfile = async () => {
    setIsSaving(true);
    const tokenString = await AsyncStorage.getItem("jwt");
    if (!tokenString) { Alert.alert("Sessão expirada"); navigation.navigate("Login"); setIsSaving(false); return; }
    
    // Lista de campos que seu servidor DEVE ESPERAR.
    // Garanta que esta lista combine EXATAMENTE com os campos 'fillable' no Laravel.
    const fieldsToSubmit = {
      name: form.nome,
      apelido: form.apelido,
      telefone: form.telefone,
      data_nascimento: form.data_nascimento,
      cep: form.cep,
      estado: form.estado,
      cidade: form.cidade,
      bairro: form.bairro, // Endereço/Empresa
      rua: form.rua, // Endereço/Empresa
      area_de_atuacao: form.profissao, // Empresa ou Perfil
      habilidades: form.skills, // Freelancer
      habilidade_principal: form.skills.split(',')[0] || '', // Freelancer
      senioridade: form.nivel, // Freelancer
      biografia: form.biografia, // Freelancer
    };
    
    const formData = new FormData();
    
    // Adiciona apenas os campos definidos acima
    Object.keys(fieldsToSubmit).forEach(key => {
        // Envia apenas se o valor não for null, mas permite string vazia ('')
        if (fieldsToSubmit[key] !== null && fieldsToSubmit[key] !== undefined) {
            formData.append(key, fieldsToSubmit[key]);
        }
    });

    if (imageFile) {
      const filename = imageFile.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';
      // Ajuste para iOS, se necessário
      const finalUri = Platform.OS === 'ios' ? imageFile.replace('file://','') : imageFile;
      formData.append('foto', { uri: finalUri, name: filename, type });
    }

    try{
      const token = JSON.parse(tokenString);
      // Incluí o header 'Content-Type': 'multipart/form-data' no fetch para garantir
      // que o Laravel reconheça corretamente o FormData, embora o fetch faça isso
      // automaticamente, dependendo da plataforma.
      const response = await fetch(`${API_URL}/perfil/salvar`, { 
          method:'POST', 
          headers:{ 
              Authorization:`Bearer ${token}`, 
              Accept:'application/json',
              'Content-Type': 'multipart/form-data', // Recomenda-se adicionar este header para FormData
          }, 
          body:formData 
      });
      
      const text = await response.text();
      // Tenta parsear JSON. Se falhar, exibe a resposta crua.
      let data;
      try {
          data = JSON.parse(text);
      } catch (e) {
          console.log("Response text was not JSON:", text);
          Alert.alert("Erro de Resposta", "O servidor retornou uma resposta inválida. Verifique o console para detalhes.");
          return;
      }
      
      if(response.ok && data.success){ 
          Alert.alert("Perfil atualizado!"); 
          setImageFile(null); 
          fetchUserData(); 
      }
      else Alert.alert("Erro", data.message || `Não foi possível salvar (${response.status})`);
      
    }catch(err){ 
        console.log("Network Error or API call failed:", err); 
        Alert.alert("Erro de rede", "Não foi possível conectar ao servidor."); 
    }
    finally{ setIsSaving(false); }
  };

  useEffect(()=>{ fetchUserData(); }, [fetchUserData]);
const handleDeleteAccount = async () => {
  Alert.alert(
    "Confirmar exclusão",
    "Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.",
    [
      { text: "Cancelar", style: "cancel" },
      { text: "Deletar", style: "destructive", onPress: async () => {
          const tokenString = await AsyncStorage.getItem("jwt");
          if (!tokenString) { 
            Alert.alert("Sessão expirada"); 
            navigation.navigate("Login"); 
            return; 
          }

          try {
            const token = JSON.parse(tokenString);
            const response = await fetch(`${API_URL}/perfil/deletar`, {
              method: "DELETE",
              headers: { 
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            });

            const text = await response.text();
            let data;
            try { data = JSON.parse(text); } catch(e){ data = {}; }

            if(response.ok && data.success){
              Alert.alert("Conta deletada", "Sua conta foi removida com sucesso.");
              AsyncStorage.removeItem("jwt");
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } else {
              Alert.alert("Erro", data.message || "Não foi possível deletar a conta.");
            }

          } catch(err){
            console.log(err);
            Alert.alert("Erro de rede", "Não foi possível conectar ao servidor.");
          }
      }}
    ]
  );
};
  const handleDropdownChange = (item) => {
    if(item.value === 'logout') {
      AsyncStorage.removeItem('jwt');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  if(loading) return (
    <View style={[styles.container,{justifyContent:'center',alignItems:'center',backgroundColor:'#1a1a1a'}]}>
      <ActivityIndicator size="large" color="#4CAF50"/>
      <Text style={{color:'#fff',marginTop:10}}>Carregando Perfil...</Text>
    </View>
  );

  const formFields = [
    { key: 'nome', placeholder: 'NOME COMPLETO' },
    { key: 'apelido', placeholder: 'APELIDO' },
    { key: 'data_nascimento', placeholder: 'DATA DE NASCIMENTO (AAAA-MM-DD)', keyboardType: 'default' },
    { key: 'telefone', placeholder: 'TELEFONE', keyboardType: 'phone-pad' },
    { key: 'cep', placeholder: 'CEP' },
    { key: 'cidade', placeholder: 'CIDADE' },
    { key: 'estado', placeholder: 'ESTADO' },
    { key: 'bairro', placeholder: 'BAIRRO' }, // <-- NOVO CAMPO
    { key: 'rua', placeholder: 'RUA' }, // <-- NOVO CAMPO
    { key: 'profissao', placeholder: 'PROFISSÃO/ÁREA DE ATUAÇÃO' },
    { key: 'skills', placeholder: 'HABILIDADES (Separadas por vírgula)' },
    { key: 'biografia', placeholder: 'BIOGRAFIA', multiline: true },
  ];

  return (
    <GestureHandlerRootView style={{flex:1}}>
      <SafeAreaView style={{flex:1,backgroundColor:'#1a1a1a'}}>
        <LinearGradient colors={['#1a1a1a','#2d2d2d']} style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* --- Formulário de Edição --- */}
            <View style={styles.editSection}>
              <View style={styles.headerBar}>
                <Pressable onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={28} color="#fff"/></Pressable>
                <Text style={styles.headerTitle}>PREENCHA OS CAMPOS ABAIXO</Text>
                <Pressable onPress={handleEditProfile} disabled={isSaving}><Ionicons name="arrow-forward" size={28} color={isSaving?"#777":"#4CAF50"}/></Pressable>
              </View>

              <View style={styles.formContainer}>
                <Pressable style={styles.profilePicContainer} onPress={pickImage}>
                  <Image source={{uri:form.profilePicUrl}} style={styles.profilePic}/>
                  <Text style={styles.changePicText}>Mudar foto do perfil</Text>
                </Pressable>

                {formFields.map((field)=>( 
                  <TextInput key={field.key}
                    style={[styles.input,field.multiline?styles.biografiaInput:null]}
                    placeholder={field.placeholder}
                    placeholderTextColor="#aaa"
                    keyboardType={field.keyboardType || 'default'}
                    value={form[field.key]}
                    onChangeText={text=>setForm(prev=>({...prev,[field.key]:text}))}
                    multiline={field.multiline}
                  />
                ))}

                <View style={styles.levelContainer}>
                  <Text style={styles.levelLabel}>Nível</Text>
                  {LEVELS.map(level=>(
                    <Pressable key={level} style={[styles.levelRadio,form.nivel===level && styles.levelRadioActive]} onPress={()=>setForm(prev=>({...prev,nivel:level}))}>
                      <Text style={[styles.levelRadioText,form.nivel===level && styles.levelRadioTextActive]}>{level}</Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable style={[styles.editButton,isSaving&&styles.editButtonDisabled]} onPress={handleEditProfile} disabled={isSaving}>
                  {isSaving?<ActivityIndicator color="#fff"/>:<Text style={styles.editButtonText}>SALVAR</Text>}
                </Pressable>
                <Pressable style={[styles.deleteButton]} onPress={handleDeleteAccount}>
  <Text style={styles.deleteButtonText}>DELETAR CONTA</Text>
</Pressable>

              </View>
            </View>

            {/* --- Card --- */}
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Image source={{uri:cardData.foto}} style={styles.cardImage}/>
                <Pressable style={styles.plusButton} onPress={()=>setModalVisible(true)}><Ionicons name="add" size={30} color="#fff"/></Pressable>
                <LinearGradient colors={['transparent','rgba(0,0,0,0.6)','rgba(0,0,0,0.8)']} style={styles.imageOverlay}/>
                <View style={styles.cardInfo}>
                  <Text style={styles.statusOnline}>online</Text>
                  <Text style={styles.name}>{cardData.nome}</Text>
                  <View style={styles.levelBadge}><Text style={styles.levelBadgeText}>{cardData.nivel.toLowerCase()}</Text></View>
                  <Text style={styles.job}>{cardData.profissao}</Text>
                  <View style={styles.skillsContainer}>
                    {cardData.skills.map((s,i)=><View key={i} style={styles.skillBubble}><Text style={styles.skillText}>{s}</Text></View>)}
                  </View>
                  <View style={styles.reviewsContainer}><Text style={styles.reviews}>{cardData.avaliacoes} avaliações</Text><View style={styles.ratingContainer}>{[1,2,3,4,5].map(s=><FontAwesome key={s} name="star" size={20} color="#FFD700" style={{marginHorizontal:1}}/>)}</View></View>
                  <View style={styles.portfolioSection}><Text style={styles.portfolioTitle}>Portfólio</Text><Text style={styles.portfolioSubtitle}>Clique no '+' para ver Biografia e Projetos</Text></View>
                </View>
              </View>
            </View>

          </ScrollView>

          <PortfolioModal visible={modalVisible} onClose={()=>setModalVisible(false)} portfolioData={{...DUMMY_PORTFOLIO_BASE, technologies:cardData.skills.length>0?cardData.skills:DUMMY_PORTFOLIO_BASE.technologies, description:form.biografia||"Nenhuma biografia disponível"}}/>
          <NavBar navigation={navigation} handleDropdownChange={handleDropdownChange}/>
        </LinearGradient>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

// --- Estilos ---

const styles = StyleSheet.create({
  deleteButton: {
  backgroundColor: '#ff4d4d',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 15,
},
deleteButtonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
},

  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80 + 20, 
    alignItems: 'center',
    paddingTop: 20,
  },
  
  // --- Estilos da Seção de Edição (Top) ---
  editSection: {
    width: width * 0.95,
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formContainer: {
    paddingHorizontal: 5,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  changePicText: {
    color: '#4CAF50',
    marginTop: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  biografiaInput: {
      height: 100, 
      textAlignVertical: 'top',
      paddingTop: 12,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  levelLabel: {
    color: '#fff',
    marginRight: 10,
    fontSize: 16,
    fontWeight: '600',
    minWidth: 100, // Garante que a label não quebre o layout facilmente
  },
  levelRadio: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
    marginRight: 8,
    marginBottom: 5,
  },
  levelRadioActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  levelRadioText: {
    color: '#aaa',
    fontSize: 14,
  },
  levelRadioTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  editButtonDisabled: {
      backgroundColor: '#777', 
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // --- Estilos do Card de Visualização (Bottom) ---
  cardContainer: {
    width: width,
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    height: height * 0.5,
    borderRadius: 25,
    backgroundColor: '#333',
    overflow: 'hidden',
    marginBottom: 30,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%', 
  },
  plusButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardInfo: {
    padding: 25,
    paddingBottom: 30,
  },
  statusOnline: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  name: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
    marginBottom: 5,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  job: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 15,
    opacity: 0.9,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  skillBubble: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  skillText: {
    color: '#fff',
    fontSize: 16,
  },
  reviewsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 15,
  },
  reviews: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portfolioSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 10,
  },
  portfolioTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  portfolioSubtitle: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
  },

  // --- Estilos do Modal ---
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 22,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  techBubble: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  techText: {
    color: '#fff',
    fontSize: 14,
  },
  projectItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  projectName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  projectDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 18,
  },
  
  // --- Estilos da NavBar (Bottom) ---
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  activeNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  activeNavIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#505050ff', 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  navIconImage: {
    width: 70,
    height: 70,
    tintColor: '#fff', 
  },
  dropdownNav: {
    width: 83,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    backgroundColor: "#2d2d2d",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  dropdownPlaceholder: {
    color: "#fff",
    textAlign: "center",
  },
  dropdownSelected: {
    color: "#4CAF50", 
    fontSize: 14,
    textAlign: "center",
  },
  dropdownItemText: {
    color: "#fff",
    fontSize: 16,
    paddingVertical: 8, 
  },
});

export default ProfileScreen;
