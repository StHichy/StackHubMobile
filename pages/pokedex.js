import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Switch,
  Alert,
  Dimensions,
  ScrollView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function PokedexScreen() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonData, setPokemonData] = useState(null);
  const [allPokemons, setAllPokemons] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isShiny, setIsShiny] = useState(false);
  const [evolutionData, setEvolutionData] = useState([]);

  const API_BASE = "https://pokeapi.co/api/v2";

  // Buscar dados de um Pokémon específico
  const fetchPokemonInfo = async (nameOrId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/pokemon/${nameOrId.toLowerCase()}`);
      if (!res.ok) throw new Error("Pokémon não encontrado");
      const data = await res.json();

      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();

      const evoRes = await fetch(speciesData.evolution_chain.url);
      const evoData = await evoRes.json();

      // Buscar dados completos das evoluções
      const evolutionNames = getEvolutions(evoData.chain);
      const evolutionDetails = await Promise.all(
        evolutionNames.map(name => 
          fetch(`${API_BASE}/pokemon/${name}`)
            .then(res => res.json())
            .catch(() => null) // Ignora erros em evoluções individuais
        )
      );

      setPokemonData({
        ...data,
        speciesData,
        evolutionChain: evoData.chain,
      });

      setEvolutionData(evolutionDetails.filter(item => item !== null));
      setIsShiny(false);
      setShowAll(false);
    } catch (err) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar lista de todos os Pokémons
  const fetchAllPokemons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/pokemon?limit=151`);
      const data = await res.json();
      const details = await Promise.all(
        data.results.map((p) => fetch(p.url).then((r) => r.json()))
      );
      setAllPokemons(details);
      setShowAll(true);
      setPokemonData(null);
      setEvolutionData([]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Evoluções
  const getEvolutions = (chain, acc = []) => {
    if (!chain) return acc;
    acc.push(chain.species.name);
    chain.evolves_to.forEach((next) => getEvolutions(next, acc));
    return acc;
  };

  // Renderizar card de cada Pokémon
  const renderPokemonCard = ({ item }) => (
    <TouchableOpacity
      style={styles.pokeCard}
      onPress={() => fetchPokemonInfo(item.name)}
    >
      <Image
        source={{ uri: item.sprites.front_default }}
        style={{ width: 60, height: 60 }}
      />
      <Text style={{ color: "#fff", fontSize: 12, textAlign: "center" }}>
        {item.id} - {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Renderizar card de evolução
  const renderEvolutionCard = (evolution) => (
    <TouchableOpacity
      key={evolution.id}
      onPress={() => fetchPokemonInfo(evolution.name)}
      style={styles.evoCard}
    >
      <Image
        source={{ uri: evolution.sprites.front_default }}
        style={styles.evoImage}
      />
      <Text style={styles.evoName}>{evolution.name}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#000000", "#1a1a1a", "#3b3b98"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Centro Pokémon</Text>
        <Text style={styles.subtitle}>Qual Pokémon você deseja ver?</Text>

        {/* Input */}
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome ou ID"
            placeholderTextColor="#888"
            value={pokemonName}
            onChangeText={setPokemonName}
            onSubmitEditing={() => fetchPokemonInfo(pokemonName)}
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => fetchPokemonInfo(pokemonName)}
          >
            <Text style={styles.searchText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Botão Ver Todos */}
        <TouchableOpacity style={styles.allBtn} onPress={fetchAllPokemons}>
          <Text style={styles.allBtnText}>Ver Todos os Pokémons</Text>
        </TouchableOpacity>

        {/* Loading */}
        {loading && <Text style={styles.loading}>Carregando...</Text>}

        {/* Info de um Pokémon */}
        {pokemonData && !loading && (
          <View style={styles.card}>
            <Text style={styles.pokemonName}>
              #{pokemonData.id} - {pokemonData.name.toUpperCase()}
            </Text>

            <Image
              source={{
                uri: isShiny
                  ? pokemonData.sprites.front_shiny
                  : pokemonData.sprites.front_default,
              }}
              style={styles.pokemonImage}
            />

            {/* Toggle Shiny */}
            <View style={styles.shinyWrapper}>
              <Text style={{ color: "#fff" }}>Shiny</Text>
              <Switch
                value={isShiny}
                onValueChange={setIsShiny}
                thumbColor={isShiny ? "#ffd700" : "#ccc"}
              />
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Informações Básicas</Text>
              <Text style={styles.info}>
                <Text style={styles.infoLabel}>Tipo: </Text>
                {pokemonData.types.map((t) => t.type.name).join(", ")}
              </Text>
              <Text style={styles.info}>
                <Text style={styles.infoLabel}>Geração: </Text>
                {pokemonData.speciesData.generation.name}
              </Text>
              <Text style={styles.info}>
                <Text style={styles.infoLabel}>Gênero: </Text>
                {pokemonData.speciesData.gender_rate === -1
                  ? "Sem Gênero"
                  : "Masculino/Feminino"}
              </Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.description}>
                {pokemonData.speciesData.flavor_text_entries.find(
                  (e) => e.language.name === "en"
                )?.flavor_text.replace(/\n|\f/g, " ")}
              </Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Status</Text>
              {pokemonData.stats.map((s) => (
                <View key={s.stat.name} style={styles.statRow}>
                  <Text style={styles.statLabel}>
                    {s.stat.name.toUpperCase()}:
                  </Text>
                  <Text style={styles.statValue}>{s.base_stat}</Text>
                </View>
              ))}
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Evoluções</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.evoScrollView}
                contentContainerStyle={styles.evoContentContainer}
              >
                {evolutionData.map(renderEvolutionCard)}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Lista com todos os Pokémons */}
        {showAll && !loading && (
          <View style={styles.allPokemonsContainer}>
            <Text style={styles.sectionTitle}>Todos os Pokémons</Text>
            <FlatList
              data={allPokemons}
              numColumns={3}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderPokemonCard}
              contentContainerStyle={styles.flatListContent}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    color: "#5cba38",
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  searchWrapper: {
    flexDirection: "row",
    marginBottom: 10,
    width: "100%",
    maxWidth: 400,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    color: "#000",
    fontSize: 16,
  },
  searchBtn: {
    backgroundColor: "#33c60e",
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 50,
  },
  searchText: { 
    color: "#fff", 
    fontSize: 18 
  },
  allBtn: {
    backgroundColor: "#217a14",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  allBtnText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16,
  },
  loading: { 
    color: "#fff", 
    marginTop: 20,
    fontSize: 16,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    width: "100%",
    maxWidth: 400,
  },
  pokemonName: { 
    color: "#fff", 
    fontSize: 20, 
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  pokemonImage: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 10,
  },
  shinyWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  infoSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#5cba38",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  info: { 
    color: "#fff", 
    marginBottom: 5,
    fontSize: 14,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  description: {
    color: "#ddd",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  statLabel: {
    color: "#ddd",
    fontSize: 14,
  },
  statValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  evoScrollView: {
    maxHeight: 140,
  },
  evoContentContainer: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  evoCard: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 12,
    margin: 5,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  evoImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  evoName: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    textTransform: "capitalize",
  },
  allPokemonsContainer: {
    width: "100%",
    marginTop: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  pokeCard: {
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    width: (windowWidth - 60) / 3,
  },
});