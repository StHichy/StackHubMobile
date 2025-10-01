import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Pressable, 
  Dimensions, 
  Animated,
  Modal,
  ScrollView 
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const profiles = [
  { 
    img: require('../assets/dev2.jpg'), 
    name: 'Alexandre, 25', 
    job: 'Dev Java', 
    skills: ['HTML5', 'JavaScript', 'CSS'], 
    reviews: 58, 
    rating: 4.5,
    portfolio: {
      projects: [
        { name: 'Sistema de E-commerce', description: 'Plataforma completa de e-commerce com carrinho e pagamento' },
        { name: 'App de Gestão Financeira', description: 'Aplicativo para controle de gastos e investimentos' },
      ],
      experience: '3 anos como desenvolvedor Java',
      education: 'Bacharel em Ciência da Computação',
      technologies: ['Java', 'Spring Boot', 'Hibernate', 'MySQL', 'React']
    }
  },
  { 
    img: require('../assets/dev3.jpg'), 
    name: 'Carlos, 27', 
    job: 'Dev Python', 
    skills: ['Python', 'Django', 'SQL'], 
    reviews: 42, 
    rating: 5,
    portfolio: {
      projects: [
        { name: 'Sistema de Análise de Dados', description: 'Plataforma para análise e visualização de dados' },
        { name: 'Bot de Automação', description: 'Bot para automação de tarefas repetitivas' }
      ],
      experience: '4 anos como desenvolvedor Python',
      education: 'Mestrado em Inteligência Artificial',
      technologies: ['Python', 'Django', 'Pandas', 'TensorFlow', 'PostgreSQL']
    }
  },
  { 
    img: require('../assets/programdor.jpg'), 
    name: 'Arthur, 28', 
    job: 'Dev React', 
    skills: ['React', 'Redux', 'Node'], 
    reviews: 30, 
    rating: 4,
    portfolio: {
      projects: [
        { name: 'App de Delivery', description: 'Aplicativo completo de delivery com React Native' },
        { name: 'Dashboard Admin', description: 'Painel administrativo com gráficos e relatórios' },
      ],
      experience: '5 anos como desenvolvedor Front-end',
      education: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
      technologies: ['React', 'React Native', 'Node.js', 'MongoDB', 'TypeScript']
    }
  },
];

export default function App() {
  const [profileIndex, setProfileIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const currentProfile = profiles[profileIndex];

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const handleGestureEnd = ({ nativeEvent }) => {
    const { translationX, translationY } = nativeEvent;

    if(translationX > 120) animateSwipe('right');
    else if(translationX < -120) animateSwipe('left');
    else if(translationY < -120) animateSwipe('up');
    else resetPosition();
  };

  const animateSwipe = (dir) => {
    let toX = 0, toY = 0;
    if(dir === 'right') toX = width;
    if(dir === 'left') toX = -width;
    if(dir === 'up') toY = -height;

    Animated.timing(translateX, { toValue: toX, duration: 300, useNativeDriver: true }).start();
    Animated.timing(translateY, { toValue: toY, duration: 300, useNativeDriver: true }).start(() => {
      translateX.setValue(0);
      translateY.setValue(0);
      setProfileIndex((profileIndex + 1) % profiles.length);
    });
  };

  const resetPosition = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true, bounciness: 10 }).start();
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 10 }).start();
  };

  const likeOpacity = translateX.interpolate({ inputRange: [0, 150], outputRange: [0, 1], extrapolate: 'clamp' });
  const nopeOpacity = translateX.interpolate({ inputRange: [-150, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  const superOpacity = translateY.interpolate({ inputRange: [-150, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#0a3d1d", "#222"]}
        locations={[0, 1]}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={handleGestureEnd}>
            <Animated.View style={[styles.card, { transform: [{ translateX }, { translateY }] }]}>
              <Image source={currentProfile.img} style={styles.cardImage} />
              
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.imageOverlay}
              />
              
              {/* Botão de + no canto superior direito */}
              <Pressable 
                style={styles.plusButton}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="add-circle" size={32} color="#fff" />
              </Pressable>
              
              <View style={styles.cardInfo}>
                <Text style={styles.name}>{currentProfile.name}</Text>
                <Text style={styles.job}>{currentProfile.job}</Text>
                
                <View style={styles.skillsContainer}>
                  {currentProfile.skills.map((skill, idx) => (
                    <View key={idx} style={styles.skillBubble}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.reviewsContainer}>
                  <Text style={styles.reviews}>{currentProfile.reviews} avaliações</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>{currentProfile.rating}</Text>
                  </View>
                </View>
              </View>

              <Animated.Text style={[styles.actionLabel, styles.likeLabel, { opacity: likeOpacity }]}>LIKE</Animated.Text>
              <Animated.Text style={[styles.actionLabel, styles.nopeLabel, { opacity: nopeOpacity }]}>NOPE</Animated.Text>
              <Animated.Text style={[styles.actionLabel, styles.superLabel, { opacity: superOpacity }]}>SUPER LIKE</Animated.Text>
            </Animated.View>
          </PanGestureHandler>

          <View style={styles.buttonContainer}>
            <Pressable onPress={() => animateSwipe('left')} style={[styles.actionButton, styles.nopeButton]}>
              <Ionicons name="close" size={30} color="#fff" />
            </Pressable>
            <Pressable onPress={() => animateSwipe('up')} style={[styles.actionButton, styles.superButton]}>
              <Ionicons name="star" size={30} color="#fff" />
            </Pressable>
            <Pressable onPress={() => animateSwipe('right')} style={[styles.actionButton, styles.likeButton]}>
              <Ionicons name="heart" size={30} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Modal do Portfólio */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Portfólio - {currentProfile.name}</Text>
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </Pressable>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Experiência</Text>
                  <Text style={styles.sectionText}>{currentProfile.portfolio.experience}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Formação</Text>
                  <Text style={styles.sectionText}>{currentProfile.portfolio.education}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Tecnologias</Text>
                  <View style={styles.techContainer}>
                    {currentProfile.portfolio.technologies.map((tech, index) => (
                      <View key={index} style={styles.techBubble}>
                        <Text style={styles.techText}>{tech}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Projetos</Text>
                  {currentProfile.portfolio.projects.map((project, index) => (
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

        <View style={styles.navBar}>
          <Pressable style={styles.navItem}>
            <Ionicons name="home" size={28} color="#fff" />
          </Pressable>
          <Pressable style={styles.navItem}>
            <Ionicons name="search" size={28} color="#fff" />
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
            <MaterialCommunityIcons name="shopping" size={28} color="#fff" />
          </Pressable>
          <Pressable style={styles.navItem}>
            <Ionicons name="menu" size={28} color="#fff" />
          </Pressable>
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
    height: '50%',
  },
  // Botão de + no canto superior direito
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
  cardInfo: { 
    padding: 25,
    paddingBottom: 30,
  },
  name: { 
    color: '#fff', 
    fontSize: 32, 
    fontWeight: 'bold',
    marginBottom: 5,
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
  rating: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  actionLabel: { 
    position: 'absolute', 
    alignSelf: 'center', 
    fontSize: 36, 
    fontWeight: 'bold', 
    letterSpacing: 2, 
    opacity: 0, 
    top: 50,
    borderWidth: 3,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  likeLabel: {
    color: '#00ff00',
    borderColor: '#00ff00',
  },
  nopeLabel: {
    color: '#ff0000',
    borderColor: '#ff0000',
  },
  superLabel: {
    color: '#800080',
    borderColor: '#800080',
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: width * 0.7, 
    marginTop: 20,
  },
  actionButton: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  likeButton: {
    backgroundColor: '#333',
  },
  nopeButton: {
    backgroundColor: '#333',
  },
  superButton: {
    backgroundColor: '#333',
  },
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
    borderLeftColor: '#00ff00',
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
});