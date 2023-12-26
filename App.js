import React, { useState, useCallback, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import  store  from './redux/store'

import LoginScreen from './screens/auth/loginScreen';
import BluetoothScreen from './screens/bluetooth/bluetoothScreen';
import PrincipalScreen from './screens/principalScreen/principalScreen';
import AppMenu from './screens/principalScreen/Menu/appMenu';
import LogBook from './screens/principalScreen/logBook/logBook';
import Diagnostico from './screens/principalScreen/diagnostico/diagnostico';
import PerfilVehiculo from './screens/principalScreen/perfilVehiculo/perfilVehiculo';
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

const Stack = createStackNavigator();

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = AsyncStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); 
    }
  }, []);

  const handleLogout = () => {
    AsyncStorage.removeItem('token'); 
    setIsAuthenticated(false); 
  };

  const handleLogin = () => {
    setIsAuthenticated(true); // Establecemos el estado de autenticación como verdadero
  };


  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        >
          {isAuthenticated ? (
            <Stack.Screen name="PrincipalScreen" component={PrincipalScreen} />
          ) : (
            <Stack.Screen name="LoginScreen">
              {props => <LoginScreen {...props} handleLogin={handleLogin} />}
            </Stack.Screen>
          )}
          <Stack.Screen name="AppMenu">
            {props => <AppMenu {...props} handleLogout={handleLogout} />}
          </Stack.Screen>

          {/* <Stack.Screen name="LoginScreen" component={LoginScreen} /> */}
          <Stack.Screen name="BluetoothScreen" component={BluetoothScreen} />
          {/* <Stack.Screen name="PrincipalScreen" component={PrincipalScreen} /> */}
          {/* <Stack.Screen name="AppMenu" component={AppMenu} /> */}
          <Stack.Screen name="LogBook" component={LogBook} />
          <Stack.Screen name="Diagnostico" component={Diagnostico} />
          <Stack.Screen name="PerfilVehiculo" component={PerfilVehiculo} />
          <Stack.Screen name="Violaciones" component={Violaciones} />
          <Stack.Screen name="PerfilConductor" component={PerfilConductor} />
          <Stack.Screen name="AcercaDelELD" component={AcercaDelELD} />
          <Stack.Screen name="Anotaciones" component={Anotaciones} />
          <Stack.Screen name="CertificacionELD" component={CertificacionELD} />
          <Stack.Screen name="CertificarLogs" component={CertificarLogs} />
          <Stack.Screen name="IngresoSegundoChofer" component={IngresoSegundoChofer} />
          <Stack.Screen name="Notificaciones" component={Notificaciones} />
          <Stack.Screen name="Envios" component={Envios} />
          <Stack.Screen name="NuevoEnvio" component={NuevoEnvio} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};


export default App;


