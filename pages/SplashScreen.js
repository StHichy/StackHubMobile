import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen({ navigation }) {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (anim, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = animateDot(dot1Anim, 0);
    const anim2 = animateDot(dot2Anim, 250);
    const anim3 = animateDot(dot3Anim, 500);

    anim1.start();
    anim2.start();
    anim3.start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 5000);

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
      clearTimeout(timer);
    };
  }, []);

  const dotStyle = (anim) => ({
    opacity: anim,
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1.2],
        }),
      },
    ],
  });

  return (
    <LinearGradient
      colors={["#0a3d1d", "#222"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.loaderCircle}>
        <View style={styles.loaderContainer}>
          <Animated.View style={[styles.dot, dotStyle(dot1Anim)]} />
          <Animated.View style={[styles.dot, dotStyle(dot2Anim)]} />
          <Animated.View style={[styles.dot, dotStyle(dot3Anim)]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,   // maior logo
    height: 140,  // maior logo
    marginBottom: 60,
  },
  loaderCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#123813', // cor escura para o círculo do loader
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1ab617',
  },
});
