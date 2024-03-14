import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,Image,TouchableOpacity,ScrollView,SafeAreaView,StyleSheet,Dimensions,StatusBar,} from 'react-native';
import { Colors, Fonts, Sizes } from '../../../constants/styles';
import { useDispatch, useSelector } from "react-redux";
import { getCurrentDriver, currentCMV } from "../../../config/localStorage";
import { startVehicleMeters } from "../../../redux/actions";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');
const languageModule = require('../../../global_functions/variables');

const PerfilVehiculo = ({ navigation }) => {
  const dispatch = useDispatch();

  //Declaracion de variables
  const [language, setlanguage] = useState("");
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [remolqueSeleccionado, setRemolqueSeleccionado] = useState(null);
  const [state, setState] = useState({
    numeroDelCamion: "",
    numeroDelTrailer: "",
    vinDelCamion: "",
    odometroVisual: "",
  });
  const {
      numeroDelCamion,
      vinDelCamion,
      numeroDelTrailer,
      numeroDeDocumentoDeEnvio,
      odometroVisual,
  } = state;
  const [vehiculos, setVehiculos] = useState([
    { id: 1, 
      nombre: 'Vehículo 1',
      numero: 29, 
      VIN: "1293FKA102183",
      licensePlate: "123-ABC",
      registeredState: "TX",
      imagen: require('../../../assets/images/trucks/truck3.png') },
  ]);

  const [remolques, setRemolques] = useState([
    { id: 1, 
      nombre: 'Remolque 1', 
      numero: 1,
      registeredState: "CA",
      imagen: require('../../../assets/images/trailers/trailer.png') },
  ]);


  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  
  const { acumulatedVehicleKilometers } = useSelector(
    (state) => state.eldReducer
  );

  //Uso de efectos de inicio del screen

  //Aqui obtenemos el idioma seleccionado desde la primera pantalla
  useEffect(() => {
    const getPreferredLanguage = async () => {
       try {
         setlanguage(await AsyncStorage.getItem("preferredLanguage"));
         console.log(language);
       } catch (error) {
         console.log(error);
       }
    };
    getPreferredLanguage();
  }, []);

  //Aqui obtenemos la data del api 
  useEffect(() => {
    const setData = async () => {
      await currentCMV().then(async (currentCMV) => {
        if (currentCMV) {
          
          currentCMV.odometroVisual = `${Math.round(
            acumulatedVehicleKilometers * 0.621371 + currentCMV.odometroVisual
          )}`;
          return updateState(currentCMV);
        }
        return await getCurrentDriver().then((driver) => {
          updateState({
            id: driver?.cmv?.id ? driver?.cmv?.id : "",
            numeroDelCamion: driver?.cmv?.number ? driver?.cmv?.number : "",
            vinDelCamion: driver?.cmv?.vin ? driver?.cmv?.vin : "",
          });
        });
      });
    };
    setData();
  }, []);

  //funcines de la pantalla
  const updateCMVProfile = async () => {
  return await AsyncStorage.setItem("currentCMV", JSON.stringify(state)).then(
    async () => {
      dispatch(startVehicleMeters());
      navigation.reset({
        index: 0,
        routes: [{ name: 'PrincipalScreen' }],
      });
    }
  );
  };

  const handleSeleccionarVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculoSeleccionado === vehiculo ? null : vehiculo);
    setRemolqueSeleccionado(null); // Cerrar la tarjeta del remolque seleccionado
  };

  const handleSeleccionarRemolque = (remolque) => {
    setRemolqueSeleccionado(remolqueSeleccionado === remolque ? null : remolque);
    setVehiculoSeleccionado(null); // Cerrar la tarjeta del vehículo seleccionado
  };

  const handleEditar = (seleccionado) => {
    // Implementa la lógica para editar el vehículo seleccionado
    console.log(`Editar ${seleccionado.nombre}`);
  };
  

 //funciones de renderizado 


  const selectedVehicle = () => {
  return (
    <View style={{...styles.container, marginTop: 5}}>
      <Text style={{...styles.title, fontSize: 15}}>{languageModule.lang(language, "selectedVehicle") + ":"}</Text>

      {/* Información del vehículo seleccionado */}
      {vehiculoSeleccionado && (
        <View style={styles.infoTarjeta}>
          <Image source={vehiculoSeleccionado.imagen} style={styles.infoTarjetaImagen} />
          <Text>{"VIN:" + vehiculoSeleccionado.VIN}</Text>
          <Text>{languageModule.lang(language, "licensePlate")+ ":" + vehiculoSeleccionado.licensePlate}</Text>
          <Text>{languageModule.lang(language, "vehicleRegistrationPlace")+ ":" + vehiculoSeleccionado.registeredState}</Text>
          <TouchableOpacity
            style={{...styles.editButton, backgroundColor: 'transparent'}}
            onPress={() => handleEditar(vehiculoSeleccionado)}
          >
            <MaterialIcons  name="edit" size={24} />
          </TouchableOpacity>
        </View>
      )}

      {/* Renderizar la lista de vehículos */}
      {vehiculos.length === 0 ? (
        <Text>{languageModule.lang(language, 'thereisNovehicleSelected')}</Text>
      ) : (
        vehiculos.map((vehiculo) => (
          <TouchableOpacity
            key={vehiculo.id}
            style={styles.vehiculoItem}
            onPress={() => {
              handleSeleccionarVehiculo(vehiculo);
              // Llama a la función selectedTrailer() al seleccionar un vehículo
              selectedTrailer();
            }}
          >
            <Text>{languageModule.lang(language, 'vehicleNumber') + ":"}</Text>
            <Text>{vehiculo.numero}</Text>
            <Image source={vehiculo.imagen} style={styles.vehiculoImagen} />
          </TouchableOpacity>
        ))
      )}
    </View>
  );
  };

  const selectedTrailer = () => {
  return(
    <View style={{...styles.container, marginTop: 5}}>
      <Text style={{...styles.title, fontSize: 15}}>{languageModule.lang(language, "selectedVehicle") + ":"}</Text>

      {/* Información del remolque seleccionado */}
      {remolqueSeleccionado && (
        <View style={styles.infoTarjeta}>
          <Image source={remolqueSeleccionado.imagen} style={styles.infoTarjetaImagen} />
          <Text>{ languageModule.lang(language, 'trailerNumber') + ": " + remolqueSeleccionado.numero}</Text>
          <Text>{languageModule.lang(language, "trailerRegistrationPlace")+ ": " + remolqueSeleccionado.registeredState}</Text>
          <TouchableOpacity
            style={{...styles.editButton, backgroundColor: 'transparent'}}
            onPress={() => handleEditar(remolqueSeleccionado)}
          >
            <MaterialIcons  name="edit" size={24} />
          </TouchableOpacity>
        </View>
      )}

      {/* Renderizar la lista de remolques */}
      {remolques.length === 0 ? (
        <Text>{languageModule.lang(language, 'thereisNotrailerSelected')}</Text>
      ) : (
        remolques.map((remolque) => (
          <TouchableOpacity
            key={remolque.id}
            style={styles.vehiculoItem}
            onPress={() => handleSeleccionarRemolque(remolque)}
          >
            <Text>{languageModule.lang(language, 'trailerNumber') + ":"}</Text>
            <Text>{remolque.numero}</Text>
            <Image source={remolque.imagen} style={styles.vehiculoImagen} />
          </TouchableOpacity>
        ))
      )}
    </View>
  );
  }

 
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Text style={styles.title}>{languageModule.lang(language, 'vehicleProfile')}</Text>
      <ScrollView >
      <View style={styles2.buttonContainer}>
        <TouchableOpacity style={styles2.button}>
          <Image
            source={require('../../../assets/images/trucks/truck3.png')}
            style={styles2.buttonImage}
          />
          <Text style={styles2.buttonText}>{languageModule.lang(language, "selectVehicle")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles2.button}>
          <Image
            source={require('../../../assets/images/trailers/trailer.png')}
            style={styles2.buttonImage}
          />
          <Text style={styles2.buttonText}>{languageModule.lang(language, "selectTrailer")}</Text>
        </TouchableOpacity>
        </View>
        {selectedVehicle()}
        {selectedTrailer()}
        </ScrollView>
      <TouchableOpacity style={styles.submitButton} onPress={updateCMVProfile}>
        <Text style={styles.submitButtonText}>{languageModule.lang(language, 'save')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2,
    paddingTop: Sizes.fixPadding * 2,
  },
  vehiculoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#eee', // Color de fondo gris claro
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: -10,
  },
  vehiculoImagen: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoTarjeta: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff', // Fondo blanco
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  infoTarjetaImagen: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#3498db', // Color azul brillante
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff', // Texto blanco
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: Sizes.fixPadding * 2,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: Sizes.fixPadding * 2,
  },
  inputLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: Sizes.fixPadding,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 1.5,
    fontSize: 16,
  },
  submitButton: {
    top: -39,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 1.5,
    marginTop: Sizes.fixPadding * 2,
  },
  submitButtonText: {
    color: Colors.whiteColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Fondo blanco
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Color de texto oscuro
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ffffff', // Verde elegante
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    width: 140,
    height: 180,
  },
  buttonImage: {
    width: 140,
    height: 100,
    marginBottom: 5,
  },
  buttonText: {
    color: '#000000', // Texto blanco
  },
});

export default PerfilVehiculo;

