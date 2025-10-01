import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

export default function CategorySelection({ navigation }) {
  const categories = [
    {
      id: "empresa",
      title: "Empresa / Empresário",
      icon: "briefcase",
      description:
        "Categoria para quem deseja contratar serviços. Se você precisa de um site, sistema, app ou solução digital, selecione esta opção.",
      route: "EmpCadastro",
    },
    {
      id: "freelancer",
      title: "Desenvolvedor / Freelancer",
      icon: "laptop-code",
      description:
        "Categoria para quem oferece serviços de desenvolvimento. Se você cria sites, sistemas ou aplicativos, esta opção é para você.",
      route: "DevCadastro",
    },
  ];

  return (
    <LinearGradient
      colors={["#0a3d1d", "#1a1a1a"]}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Selecione sua categoria</Text>

        <View style={styles.categories}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(cat.route)}
            >
              <FontAwesome5
                name={cat.icon}
                size={50}
                color="#2fff80"
                style={styles.icon}
              />
              <Text style={styles.cardTitle}>{cat.title}</Text>
              <Text style={styles.cardDescription}>{cat.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    width: "95%",
    maxWidth: 960,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(43, 255, 0, 0.3)",
    borderWidth: 2,
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
  },
  categories: {
    flexDirection: "column", // <-- agora fica um em cima do outro
    width: "100%",
    gap: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
    alignItems: "center",
  },
  icon: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 20,
  },
});
