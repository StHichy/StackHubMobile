import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Image, Pressable, FlatList, Modal 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

export default function ModalList({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const data = [
    { id: "1", title: "Projeto 1"},
    { id: "2", title: "Projeto 2"},
    { id: "3", title: "Projeto 3" },
    { id: "4", title: "Projeto 4"},
  ];

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.fullContainer}>
      <LinearGradient
        colors={["#0a3d1d", "#222"]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={require("../assets/mulher.jpg")} 
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcome}>Projetos do Usuario</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.sidebarButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* FlatList */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => openModal(item)}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
              <Text style={styles.modalText}>{selectedItem?.desc}</Text>
              
              <TouchableOpacity 
                style={styles.mainButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.mainButtonText}>FECHAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1 },
  gradientBackground: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  headerTextContainer: { flex: 1 },
  sidebarButton: {
    padding: 10,
    backgroundColor: "#454545",
    borderRadius: 50,
  },
  welcome: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 4,
    fontFamily: "HankenGrotesk-SemiBold",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "HankenGrotesk-Regular",
  },
  listContainer: { padding: 20, paddingBottom: 120 },
  card: {
    backgroundColor: "#454545",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    color: "#1ab617",
    fontFamily: "HankenGrotesk-Bold",
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "HankenGrotesk-Regular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#454545",
    padding: 25,
    borderRadius: 20,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    color: "#1ab617",
    fontFamily: "HankenGrotesk-Bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "HankenGrotesk-Regular",
    marginBottom: 20,
    textAlign: "center",
  },
  mainButton: {
    backgroundColor: "#1ab617",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: "center",
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "HankenGrotesk-Bold",
  },
});
