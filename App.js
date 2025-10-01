import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './pages/SplashScreen';
import Home from './pages/Home';
import Login from './pages/LoginScreen';
import Register from './pages/CadastroScreen';
import ModalList from './pages/modallist';
import CategorySelection from './pages/CategorySelection';
import EmpCadastro from './pages/EmpCadastro';
import DevCadastro from './pages/DevCadastro';
import SwapScreen from './pages/SwapScreen';

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
          options={{  
            headerShown: false, 
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
            headerShown: false,
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
        <Stack.Screen 
          name="CategorySelection" 
          component={CategorySelection}
          options={{  
            headerShown: false,
            title: "Selecionar Categoria",
            headerStyle: { backgroundColor: '#0a3d1d' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontFamily: 'HankenGrotesk-SemiBold' }
          }}
        />
         <Stack.Screen 
          name="EmpCadastro" 
          component={EmpCadastro}
          options={{  
            headerShown: false,
            headerTintColor: '#fff',
            headerTitleStyle: { fontFamily: 'HankenGrotesk-SemiBold' }
          }}
        />
        <Stack.Screen 
          name="DevCadastro" 
          component={DevCadastro}
          options={{  
            headerShown: false,
            headerTintColor: '#fff',
            headerTitleStyle: { fontFamily: 'HankenGrotesk-SemiBold' }
          }}
        />
        <Stack.Screen 
          name="Swap" 
          component={SwapScreen}
          options={{  
            headerShown: false,
            title: "Descubra Desenvolvedores",
            headerStyle: { backgroundColor: '#0a3d1d' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontFamily: 'HankenGrotesk-SemiBold' }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}