import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './pages/SplashScreen';
import Home from './pages/Home';
import Login from './pages/LoginScreen';
import Register from './pages/CadastroScreen';
import ModalList from './pages/modallist';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen

          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        {/* Telas de autenticação */}
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Cadastro" 
          component={Register} 
          options={{  headerShown: false, 
            title: "Criar Conta",
            headerStyle: {
              backgroundColor: '#0a3d1d',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontFamily: 'HankenGrotesk-SemiBold',
            }
           }}
        />
        
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={{  headerShown: false,
            title: "Início",
            headerStyle: {
              backgroundColor: '#0a3d1d',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontFamily: 'HankenGrotesk-SemiBold',
            }
          }}
        />
        
<Stack.Screen 
  name="ModalList" 
  component={ModalList}
  options={{  
    headerShown: false,
    title: "Lista",
    headerStyle: { backgroundColor: '#0a3d1d' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontFamily: 'HankenGrotesk-SemiBold' }
  }}
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
