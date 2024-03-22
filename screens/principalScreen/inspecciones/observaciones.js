import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
const languageModule = require('../../../global_functions/variables');
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {setKey,setDefaults,setLanguage,setRegion,fromAddress,fromLatLng,fromPlaceId,setLocationType,geocode,RequestType,} from "react-geocode";
import { Button, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Observaciones = ({navigation}) => {

    //Declaracion de variables
    const [language, setlanguage] = useState("");
    const {eldData,currentDriver,driverStatus,acumulatedVehicleKilometers,lastDriverStatus,trackingTimestamp} = useSelector((state) => state.eldReducer);
    const [location, setlocation] = useState({});


    //Uso de efectos de inicio del screen
    useEffect(() => {
        const getPreferredLanguage = async () => {
           try {
             setlanguage(await AsyncStorage.getItem("preferredLanguage"));
           } catch (error) {
             console.log(error);
           }
        };
        getPreferredLanguage();
    }, []);

    useEffect(() => {
        if(eldData?.coords?.latitude && eldData?.coords?.longitude){
          getLocation(eldData?.coords?.latitude, eldData?.coords?.longitude);  
        }  
    }, [eldData]);

    //funciones de la pantalla
    const getLocation = async (latitude, longitude) => { 

        setDefaults({
          key: "AIzaSyD7ybUYP7u9Bd-PBFJ1UHDtblyK1Y-ieEk", 
          language: language.toLocaleLowerCase().replace("eng", "en").replace("esp", "es"),
          region: language.toLocaleLowerCase().replace("eng", "en").replace("esp", "es"),
        });
    
        try {
        const { results } = await fromLatLng(latitude, longitude);
    
        if (results && results.length > 0) {
          const address = results[0].formatted_address;
          const { city, state, country } = results[0].address_components.reduce(
            (acc, component) => {
              if (component.types.includes("locality"))
                acc.city = component.long_name;
              else if (component.types.includes("administrative_area_level_1"))
                acc.state = component.long_name;
              else if (component.types.includes("country"))
                acc.country = component.long_name;
              return acc;
            },
            {}
          );
    
          const geonamesBaseUrl = "http://api.geonames.org/findNearbyJSON";
          const geonamesUsername = "danielwguzman";
          const geonamesUrl = `${geonamesBaseUrl}?lat=${latitude}&lng=${longitude}&username=${geonamesUsername}`;
    
          const geonamesResponse = await fetch(geonamesUrl);
          const geonamesData = await geonamesResponse.json();
    
          if (geonamesData && geonamesData.geonames && geonamesData.geonames.length > 0) {
            const nearestCity = geonamesData.geonames[0];
            const locationString = `${nearestCity.distance} ${languageModule.lang(language, 'kmAwayFrom')} ${nearestCity.name}, ${nearestCity.adminCodes1.ISO3166_2}`;
            const distance = nearestCity.distance;
            const distanceString = distance.toString();
            const slicedDistance = distanceString.slice(0, distanceString.indexOf('.') + 3);
            setlocation({
              "address": address,
              "city": city,
              "state": state,
              "country": country,
              "reachOf": {
                "city": nearestCity.name,
                "state": nearestCity.adminCodes1.ISO3166_2,
                "country": nearestCity.countryName,
                "distance": slicedDistance,
              }
            }); 
          } else{
            setlocation({
              "address": address,
              "city": city,
              "state": state,
              "country": country,
            });
          }
          
        } else {
          console.error("No se encontraron resultados de react-geocode.");
        }
        } catch (error) {
          console.error('Error en la geocodificación inversa:', error.message);
        }
    };

    //funcion de renderizado
    
    const footer = () => {
        return(
            <View>
            {/* Botones */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
              <Button icon={() => <Icon name="keyboard-arrow-left" size={20} />} mode="outlined" style={{ borderColor: '#333', width: '45%' }} onPress={() => {navigation.navigate('VehicleState')}}>{languageModule.lang(language, 'goBack')}</Button>
              <Button icon={() => <Icon name="keyboard-arrow-right" size={20} />} mode="contained" style={{ backgroundColor: '#0f9d58', width: '45%' }} onPress={() => {navigation.navigate('Observaciones')}}>{languageModule.lang(language, 'continue')}</Button>
            </View>
            </View>
        );
    }

    return (
    <View style={styles.container}>
      <Text style={styles.title}>{languageModule.lang(language, 'observations')}</Text>

      <Text style={styles.subtitle}>{languageModule.lang(language, 'addObservations')}:</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder={languageModule.lang(language, 'writeObservations')}
      />

      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>{languageModule.lang(language, 'Location')}:</Text>
        <TextInput
          style={styles.locationInput}
          value={location?.city + ", " + location?.state}
          editable={false}
        />
      </View>
      {footer()}
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50', // Verde elegante
    marginBottom: 70,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10
  },
  input: {
    height: 300,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 170,
  },
  locationText: {
    fontSize: 16,
    marginRight: 10,
  },
  locationInput: {
    flex: 1,
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
});

export default Observaciones;
