import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './pages/Home';
import Login from './pages/LoginScreen';
import Register from './pages/CadastroScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Telas de autenticação */}
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Cadastro" 
          component={Register} 
          options={{ 
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
          options={{ 
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}