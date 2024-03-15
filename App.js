import React, { useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { useWindowDimensions } from 'react-native';
import store from './redux/store';
import { TimerProvider } from './global_functions/timerFunctions';

import DrawerMenu from './screens/principalScreen/Menu/DrawerMenu';
import LoginScreen from './screens/auth/loginScreen';
import BluetoothScreen from './screens/bluetooth/bluetoothScreen';
import BluetoothScreenReal from "./screens/bluetooth/bluetoothScreenReal";
import PrincipalScreen from './screens/principalScreen/principalScreen';
import AppMenu from './screens/principalScreen/Menu/appMenu';
import LogBook from './screens/principalScreen/logBook/logBook';
import Diagnostico from './screens/principalScreen/diagnostico/diagnostico';
import PerfilVehiculo from './screens/principalScreen/perfilVehiculo/perfilVehiculo';
import elegirVehiculo from "./screens/principalScreen/perfilVehiculo/elegirVehiculo";
import Violaciones from './screens/principalScreen/violaciones/violaciones';
import PerfilConductor from './screens/principalScreen/perfilConductor/perfilConductor';
import AcercaDelELD from './screens/principalScreen/acercadeELD/acercadeELD';
import Anotaciones from './screens/principalScreen/anotaciones/anotaciones';
import CertificacionELD from './screens/principalScreen/certificacion/certificacionELD';
import CertificarLogs from './screens/principalScreen/certificacion/certificarLogs';
import IngresoSegundoChofer from './screens/principalScreen/entradaSegundoChofer/ingresoSegundoChofer';
import Notificaciones from './screens/principalScreen/notificaciones/notificaciones';
import Envios from './screens/principalScreen/envios/envios';
import NuevoEnvio from './screens/principalScreen/envios/nuevoEnvio';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigator = ({ handleLogout }) => {
  const dimensions = useWindowDimensions();

  return (
    <Drawer.Navigator
      initialRouteName="PrincipalScreen"
      drawerContent={(props) => <DrawerMenu {...props} handleLogout={handleLogout} />}
      screenOptions={{
        drawerType: 'front',   
        drawerPosition:"right",
        drawerStyle: { width: '70%' }
      }} 
    >
      <Drawer.Screen
        name="PrincipalScreen"
        component={PrincipalScreen}
        options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

const MainStackNavigator = ({ handleLogout }) => (
  <Stack.Navigator>
    <Stack.Screen name="BluetoothScreen" component={BluetoothScreen} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }} />
    <Stack.Screen name="BluetoothScreenReal" component={BluetoothScreenReal} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }} />
    <Stack.Screen name="Diagnostico" component={Diagnostico} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}/>
    <Stack.Screen name="PerfilVehiculo" component={PerfilVehiculo} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}/>
    <Stack.Screen name="ElegirVehiculo" component={elegirVehiculo} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}/>
    <Stack.Screen name="PrincipalScreen" options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}>
      {props => <DrawerNavigator {...props} handleLogout={handleLogout} />}
    </Stack.Screen>
    <Stack.Screen name="LogBook" component={LogBook} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}/>
    <Stack.Screen name="Violaciones" component={Violaciones} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}/>
    <Stack.Screen name="PerfilConductor" component={PerfilConductor} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}/>
    <Stack.Screen name="AcercaDelELD" component={AcercaDelELD} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}/>
    <Stack.Screen name="Anotaciones" component={Anotaciones} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}/>
    <Stack.Screen name="CertificacionELD" component={CertificacionELD} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}/>
    <Stack.Screen name="CertificarLogs" component={CertificarLogs} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}/>
    <Stack.Screen name="IngresoSegundoChofer" component={IngresoSegundoChofer} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}/>
    <Stack.Screen name="Notificaciones" component={Notificaciones} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}/>
    <Stack.Screen name="Envios" component={Envios} options={{ drawerLabel: null, drawerIcon: null, headerShown: false }}/> 
  </Stack.Navigator>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Lógica de autenticación aquí
  }, []);

  const handleLogout = () => {
    AsyncStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Provider store={store}>
      <TimerProvider>
        <NavigationContainer>
          {isAuthenticated ? (
            <MainStackNavigator handleLogout={handleLogout} />
          ) : (
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            >
              <Stack.Screen name="LoginScreen">
                {props => <LoginScreen {...props} handleLogin={handleLogin} />}
              </Stack.Screen>
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </TimerProvider>
    </Provider>
  );
};

export default App;
