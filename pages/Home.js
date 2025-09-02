import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons';

export default function Home({ navigation }) {
  return (
    <View style={styles.fullContainer}>
      <LinearGradient
        colors={["#0a3d1d", "#222"]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header com imagem, título e menu */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={require('../assets/mulher.jpg')} 
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcome}>Boas-vindas, Cleide</Text>
              <Text style={styles.subtitle}>Nome da empresa/função</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.sidebarButton}
            onPress={() => navigation.openDrawer()}
          >
            <Feather name="menu" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/* Container 1: Instruções */}
            <View style={styles.contentContainer}>
              <Text style={styles.instruction}>
                Você precisa finalizar o seu cadastro para poder continuar e desfrutar a nossa plataforma, 
                tendo acesso a todo o conteúdo.
              </Text>
              
              <TouchableOpacity
                style={styles.mainButton} 
                onPress={() => navigation.navigate('Cadastro')}
              >
                <Text style={styles.mainButtonText}>FINALIZAR CADASTRO!</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.divider} />
            
            {/* Container 2: Ajuda e informações */}
            <View style={styles.contentContainer}>
              <Text style={styles.helpTitle}>ESTÁ COM ALGUMA DÚVIDA?</Text>
              <Text style={styles.helpText}>
                Conheça mais sobre todas as funcionalidades do nosso sistema, como usar, 
                um pouco da empresa e todos os membros da equipe.
              </Text>
              
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={() => navigation.navigate('Sobre')}
              >
                <Text style={styles.secondaryButtonText}>SAÍBA MAIS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      
      {/* Barra de Navegação Inferior com 5 itens */}
      <View style={styles.navBar}>
        <Pressable style={styles.navItem}>
          <Ionicons name="home" size={30} color="#fff" />
        </Pressable>
        
        <Pressable style={styles.navItem}>
          <Ionicons name="search" size={30} color="#fff" />
        </Pressable>
        
        <Pressable style={[styles.navItem, styles.activeNavItem]}>
          <View style={styles.activeNavIconContainer}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.navIconImage}
              resizeMode="contain"
            />
          </View>
        </Pressable>
        
        <Pressable style={styles.navItem}>
          <MaterialCommunityIcons name="shopping" size={30} color="#fff" />
        </Pressable>
        
        <Pressable style={styles.navItem}>
          <Ionicons name="person" size={30} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  sidebarButton: {
    padding: 10,
    backgroundColor: '#454545',
    borderRadius: 50,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    backgroundColor: '#454545',
    borderRadius: 12,
    padding: 25,
    marginBottom: 25,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcome: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 4,
    fontFamily: "HankenGrotesk-SemiBold",
    textAlign: "left",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "HankenGrotesk-Regular",
    textAlign: "left",
  },
  instruction: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "HankenGrotesk-Regular",
  },
  mainButton: {
    backgroundColor: "#1ab617",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "HankenGrotesk-Bold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: "80%",
    marginVertical: 15,
  },
  helpTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 15,
    fontFamily: "HankenGrotesk-SemiBold",
    textAlign: "center",
  },
  helpText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "HankenGrotesk-Regular",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#1ab617",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 182, 23, 0.1)',
  },
  secondaryButtonText: {
    color: "#1ab617",
    fontSize: 22,
    fontFamily: "HankenGrotesk-SemiBold",
  },
  // Estilos para a barra de navegação
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#454545',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  },
  activeNavIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: "#3a3a3a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navIconImage: {
    width: 70,
    height: 70,
  },
});