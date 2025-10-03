import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Image, 
  FlatList,
  Dimensions 
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Dropdown } from 'react-native-element-dropdown'; // Importação mantida para a navbar
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

// Dados Fictícios para o Dropdown da NavBar
const dropdownData = [
  { label: "Perfil", value: "perfil" },
  { label: "Sair", value: "logout" },
];

// Dados Fictícios para a Lista de Mensagens
const chatData = [
  { id: '1', name: 'Pedro Chucas Pinheiro Soares', message: 'Projeto finalizado!', time: '9:30 - 25/09/2025', isNew: false, color: '#90EE90' },
  { id: '2', name: 'Miguel Pata Choca Abrame', message: 'Iniciamos a Sprint final.', time: '13:00 - 11/09/2025', isNew: true, color: '#00ff00' },
  { id: '3', name: 'Cauan Fonseca Prestes', message: 'Front? Joga nas costas do pai...', time: '20:50 - 08/09/2025', isNew: false, color: '#00ff00' },
  { id: '4', name: 'Carlos Henrique Ferreira', message: 'Fui expulso do prjt, 6 chapam...', time: '09:41 - 04/07/2025', isNew: false, color: '#90EE90' },
  { id: '5', name: 'Vinicius Tardellafilas Leitada', message: 'Me chamaram de carequilson :(', time: '00:59 - 28/08/2025', isNew: true, color: '#00ff00' },
  { id: '6', name: 'Daniel Lopes dos Anjos', message: 'Feeeeeeeeeraaa demais!!', time: '13:39 - 19/08/2025', isNew: false, color: '#00ff00' },
  { id: '7', name: 'Negrilson Estruoilson', message: 'Me chame de Bahanilson...', time: '17:45 - 12/08/2025', isNew: false, color: '#00ff00' },
];

const ChatListScreen = ({ navigation }) => {
  const [dropdownValue, setDropdownValue] = React.useState(null);

  // Função fictícia para a ação do dropdown da navbar
  const handleDropdownChange = (item) => {
    setDropdownValue(item.value);
    if(item.value === 'perfil') {
        // Exemplo de navegação:
        // navigation.navigate('EditProfile');
    }
    console.log("Ação do menu:", item.value);
  };
  
  // Função fictícia para lidar com o clique na conversa
  const handleChatPress = (chat) => {
    console.log(`Abrir chat com ${chat.name}`);
    // Exemplo de navegação para a tela de chat:
    // navigation.navigate('Chat', { chatId: chat.id, userName: chat.name });
  };

  // Renderização de cada item da lista
  const renderChatItem = ({ item }) => (
    <Pressable style={styles.chatItem} onPress={() => handleChatPress(item)}>
      <Ionicons name="person-circle-outline" size={48} color="#ccc" style={styles.chatAvatar} />
      <View style={styles.chatTextContainer}>
        <Text style={styles.chatName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.chatMessage} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
      <View style={styles.chatMeta}>
        <Text style={[styles.chatTime, { color: item.color }]}>
          {item.time.split(' - ')[0]}
        </Text>
        <Text style={[styles.chatDate, { color: item.color }]}>
          {item.time.split(' - ')[1]}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <GestureHandlerRootView style={styles.flexOne}>
      <LinearGradient 
        colors={['#0a3d1d', '#222']} 
        locations={[0, 1]} 
        style={styles.flexOne}
      >
        
        <View style={styles.headerContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={24} color="#ccc" />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar..."
              placeholderTextColor="#ccc"
            />
            <Pressable style={styles.addButton}>
              <Ionicons name="add" size={32} color="#fff" />
            </Pressable>
          </View>
          
 

          <Text style={styles.titleText}>
            <Text style={{ fontWeight: 'bold' }}> Mensagens</Text>
          </Text>
        </View>

        {/* --- Lista de Chats --- */}
        <FlatList
          data={chatData}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />

        {/* --- NavBar --- */}
        <View style={styles.navBar}>
          <Pressable style={styles.navItem}>
            <Ionicons name="folder" size={28} color="#fff" />
          </Pressable>
          <Pressable style={styles.navItem}>
            <FontAwesome5 name="clipboard-list" size={28} color="#fff" />
          </Pressable>
          <Pressable style={[styles.navItem, styles.activeNavItem]}>
            <View>
              <Image 
                source={require('../assets/logo.png')} 
                style={styles.navIconImage}
                resizeMode="contain" 
              />
            </View>
          </Pressable>
          <Pressable style={styles.activeNavIconContainer}>
            <MaterialCommunityIcons name="chat" size={28} color="#00ff00" />
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
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },

  // --- Header ---
  headerContainer: {
    paddingTop: height * 0.05, 
    paddingHorizontal: width * 0.05,
    paddingBottom: 20,
    position: 'relative',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.5)',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    paddingHorizontal: 10,
  },
  addButton: {
    paddingLeft: 10,
    marginLeft: 10,
  },
  
  // Ícones de Efeitos
  emblemsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 90, 
    left: width * 0.05,
    zIndex: 10,
  },
  emblemsContainerRight: {
    flexDirection: 'row',
    position: 'absolute',
    top: 90, 
    right: width * 0.05,
    zIndex: 10,
  },
  emblemIcon: {
    marginHorizontal: 4,
    opacity: 0.7,
  },

  // Título Mensagens
  titleText: {
    color: '#00ff00',
    fontSize: 22,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },

  // --- Chat List ---
  listContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: 80 + 20, // Espaço para a navbar + padding extra
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  chatAvatar: {
    marginRight: 15,
  },
  chatTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  chatName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  chatMessage: {
    color: '#ccc',
    fontSize: 14,
  },
  chatMeta: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  chatTime: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatDate: {
    fontSize: 10,
    opacity: 0.8,
  },
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
    marginBottom: 60,
  },
  navIconImage: {
    width: 60,
    height: 60,
    marginBottom: -16,
    marginLeft: -20,
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
});

export default ChatListScreen;