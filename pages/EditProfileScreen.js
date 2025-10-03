import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Image, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Dimensões para uso em estilos (se necessário, como estava no seu código original)
const { width, height } = Dimensions.get('window');

// Dados para o Dropdown do menu (no canto superior direito)
const dropdownData = [
  { label: "Perfil", value: "perfil" },
  { label: "Sair", value: "logout" },
];

const EditProfileScreen = ({ navigation }) => {
  // Estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [nivel, setNivel] = useState('Júnior'); // Estado para o seletor de nível
  const [profissao, setProfissao] = useState('');
  const [skills, setSkills] = useState('');
  
  // Estado para o Dropdown (menu hamburguer)
  const [dropdownValue, setDropdownValue] = useState(null);

  // Função fictícia para lidar com o salvamento
  const handleSave = () => {
    console.log("Perfil salvo:", { nome, idade, nivel, profissao, skills });
    // navigation.goBack(); // Descomente para voltar à tela anterior
  };

  // Função fictícia para o dropdown
  const handleDropdownChange = (item) => {
    setDropdownValue(item.value);
    console.log("Ação do menu:", item.value);
  };

  const handleGoBack = () => {
    navigation.goBack(); 
    console.log("Voltar pressionado");
  };

  const handleEditPhoto = () => {
    console.log("Alterar foto de perfil pressionado");
  };

  const handleGoForward = () => {
    console.log("Avançar/Próxima tela pressionado");
  };

  // Componente reutilizável para o campo de texto estilizado
  const InputField = ({ placeholder, value, onChangeText, keyboardType = 'default' }) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.flexOne}>
      <LinearGradient 
        colors={['#1a1a1a', '#0d0d0d']} 
        style={styles.flexOne}
      >
        
        {/* Conteúdo da Tela de Edição */}
        <ScrollView contentContainerStyle={styles.contentContainer}>
          
          {/* Header da Tela */}
          <View style={styles.header}>
            <Pressable onPress={handleGoBack} style={styles.headerIconContainer}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            <Text style={styles.headerTitle}>
              PREENCHA OS CAMPOS ABAIXO
            </Text>
            <View style={{ width: 24 }} /> 
          </View>
          

          <View style={styles.editCard}>
            <View style={styles.editCardHeader}>
              <Text style={styles.editTitle}>Editar Perfil</Text>
              <Pressable onPress={handleGoForward}>
                <Ionicons name="arrow-forward" size={24} color="#00ff00" />
              </Pressable>
            </View>

            {/* Link para Alterar Foto */}
            <Pressable onPress={handleEditPhoto} style={styles.changePhotoLink}>
              <Text style={styles.changePhotoText}>Alterar foto do perfil</Text>
            </Pressable>

            {/* Campos de Input */}
            <InputField 
              placeholder="Nome" 
              value={nome} 
              onChangeText={setNome} 
            />
            
            <InputField 
              placeholder="Idade" 
              value={idade} 
              onChangeText={setIdade} 
              keyboardType="numeric" 
            />
            
            {/* Seletor de Nível (Júnior, Pleno, Sênior, Especialista) */}
            <View style={styles.levelContainer}>
              <Text style={styles.levelLabel}>Nível:</Text>
              <View style={styles.levelSelector}>
                {['Júnior', 'Pleno', 'Sênior', 'Especialista'].map((item) => (
                  <Pressable
                    key={item}
                    style={[
                      styles.levelButton,
                      nivel === item && styles.levelButtonActive,
                    ]}
                    onPress={() => setNivel(item)}
                  >
                    <Text 
                      style={[
                        styles.levelText, 
                        nivel === item && styles.levelTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <InputField 
              placeholder="Profissão" 
              value={profissao} 
              onChangeText={setProfissao} 
            />

            <InputField 
              placeholder="Skills (separe por vírgula)" 
              value={skills} 
              onChangeText={setSkills} 
            />

            {/* Botão Salvar */}
            <Pressable onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </Pressable>
            
          </View>
          
          {/* Espaço em Branco (para simular o card de baixo da imagem) */}
          <View style={styles.placeholderCard}>
            <Pressable style={styles.plusButton}>
              <Ionicons name="add" size={24} color="#fff" />
            </Pressable>
          </View>

        </ScrollView>

        {/* --- NavBar --- */}
        <View style={styles.navBar}>
          <Pressable style={styles.navItem}>
            <Ionicons name="folder" size={28} color="#fff" />
          </Pressable>
          <Pressable style={styles.navItem}>
            <FontAwesome5 name="clipboard-list" size={28} color="#fff" />
          </Pressable>
          <Pressable style={[styles.navItem, styles.activeNavItem]}>
            <View style={styles.activeNavIconContainer}>
              {/* Ajuste o caminho da imagem se necessário */}
              <Image 
                source={require('../assets/logo.png')} 
                style={styles.navIconImage}
                resizeMode="contain" 
              />
            </View>
          </Pressable>
          <Pressable style={styles.navItem}>
            <MaterialCommunityIcons name="chat" size={28} color="#fff" />
          </Pressable>

          {/* Dropdown (Menu Hamburguer) */}
          <View style={styles.navItem}>
            <Dropdown
              style={[styles.dropdownNav]}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelected}
              itemTextStyle={styles.dropdownItemText}
              activeColor="#1a1a1a"
              data={dropdownData}
              labelField="label"
              valueField="value"
              placeholder={<Ionicons name="menu" size={26} color="#fff" />}
              value={dropdownValue}
              onChange={handleDropdownChange}
            />
          </View>
        </View>

      </LinearGradient>
    </GestureHandlerRootView>
  );
}

// ------------------------------------------------------------------
// STYLES
// Os estilos fornecidos no prompt foram mantidos e expandidos.
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100, // Espaço para a navbar
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05, // Espaço para a barra de status/header
    alignItems: 'center',
  },
  
  // Header da Tela (topo)
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerIconContainer: {
    padding: 5,
  },
  headerTitle: {
    color: '#00ff00',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Card de Edição de Perfil
  editCard: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fundo escuro transparente
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#00ff00', // Borda verde destacada
    marginBottom: 20,
  },
  editCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  editTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  changePhotoLink: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  changePhotoText: {
    color: '#00ff00',
    textDecorationLine: 'underline',
    fontSize: 14,
  },

  // Estilos de Input
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
  },
  input: {
    color: '#fff',
    fontSize: 16,
    padding: 0,
  },

  // Seletor de Nível
  levelContainer: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  levelLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  levelSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 3,
    borderWidth: 1,
    borderColor: '#333',
  },
  levelButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  levelButtonActive: {
    backgroundColor: '#00ff00',
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  levelTextActive: {
    color: '#1a1a1a',
  },

  // Botão Salvar
  saveButton: {
    backgroundColor: '#00ff00',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Card Placeholder (Simula o card de baixo da imagem)
  placeholderCard: {
    width: '100%',
    height: height * 0.35,
    backgroundColor: '#0000ff', // Cor azul da imagem
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  // Botão Plus (Adicionar)
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
  },


  // --------------------------------------------------
  // NAV BAR (Mantido do seu código original)
  // --------------------------------------------------
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
    marginBottom: 15,
  },
  activeNavIconContainer: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#4a4a4a', 
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
  },
  // Dropdown da Navbar
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
    color: "#0f0",
    fontSize: 14,
    textAlign: "center",
  },
  dropdownItemText: {
    color: "#fff",
    fontSize: 16,
    paddingVertical: 8,
  },

  // *Outros estilos da sua folha de estilos original foram omitidos para brevidade*
});

export default EditProfileScreen;