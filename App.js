import React from 'react';
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


const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        >

          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="BluetoothScreen" component={BluetoothScreen} />
          <Stack.Screen name="PrincipalScreen" component={PrincipalScreen} />
          <Stack.Screen name="AppMenu" component={AppMenu} />
          <Stack.Screen name="LogBook" component={LogBook} />
          <Stack.Screen name="Diagnostico" component={Diagnostico} />
          <Stack.Screen name="PerfilVehiculo" component={PerfilVehiculo} />
          <Stack.Screen name="Violaciones" component={Violaciones} />
          <Stack.Screen name="PerfilConductor" component={PerfilConductor} />
          <Stack.Screen name="AcercaDelELD" component={AcercaDelELD} />
          <Stack.Screen name="Anotaciones" component={Anotaciones} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};


export default App;


