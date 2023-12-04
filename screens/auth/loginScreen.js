import {StyleSheet,Pressable,Button,Text,View,SafeAreaView,StatusBar,ScrollView,BackHandler,TextInput,Image,Dimensions,TouchableOpacity,Alert} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import RNPickerSelect from 'react-native-picker-select';
const { width } = Dimensions.get("window");
import tailwind from "twrnc";
import AsyncStorage from '@react-native-async-storage/async-storage';
const languageModule = require('../../global_functions/variables');

export const LoginScreen = ({ navigation }) => {

  //Declaraciones de variables
  const [usuario, setusuario] = useState({});
  const [password,setpassword] = useState('');
  const [driver, setDriver] = useState({});
  const [language, setLanguage] = useState(''); // Idioma por defecto [Esp
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languageOptions, setLanguageOptions] = useState([]);

  // Obtenermos nuestro current language desde el AsyncStorage
  useEffect(() => {
    const getPreferredLanguage = async () => {
        const language = await AsyncStorage.getItem('preferredLanguage');
        setSelectedLanguage(language || '');
    };
    getPreferredLanguage();
    
    // Opciones de idioma disponibles
    const options = [
      { label: 'English', value: 'Eng' },
      { label: 'Español', value: 'Esp' },
    ];
    setLanguageOptions(options);
  }, []);

  const handleLanguageChange = async (value) => {
    try {
      await AsyncStorage.setItem('preferredLanguage', value);
      setSelectedLanguage(value); 
      setLanguage(value);
    } catch (error) {
      console.log(error);
    }
  };
  

  //Mi screen separado por componentes
  const logoIcon = () => {
    return (
      <View style={styles.mainLogo.container}>
        <Image
          source={require("../../assets/images/icons/logo_dumax.png")}
          style={{
            ...styles.mainLogo.logo,
          }}
        />
      </View>
    );
  }

  const header = () => {
    return (   
           <View
           style={tailwind` items-center justify-center `}
            >
           <Text style={tailwind`text-5xl font-bold mb-6`}>{languageModule.lang(language,'login')}</Text>    
           </View>
    );
  }

  const usuariotext = () => {
    return (
      <View style={styles.textFieldWrapStyle}>
        <TextInput
          value={usuario}
          placeholder={languageModule.lang(language,'userHOS')}
          onChangeText={(text) => setusuario(text)}
          style={{ ...Fonts.blackColor14Regular }}
          selectionColor={Colors.primaryColor}
          placeholderTextColor={"#8D8D8D"}
        />
      </View>
    );
  }

  const passwordTextField = () => {
    return (
      <View style={styles.textFieldWrapStyle}>
        <TextInput
          value={password}
          placeholder={languageModule.lang(language,'password')}
          style={{ ...Fonts.blackColor14Regular }}
          onChangeText={(text) => setpassword(text)}
          selectionColor={Colors.primaryColor}
          placeholderTextColor={"#8D8D8D"}
        />
      </View>
    )
  }

  const buttonLogin = () => {
    return (   
      <View style={styles.container}>
      <TouchableOpacity
          activeOpacity={0.99}
          style={styles.buttonStyle}
          onPress={authUser}
        >
          <Text style={{ ...Fonts.whiteColor16Bold }}>{languageModule.lang(language,'login')}</Text>
        </TouchableOpacity>
        <RNPickerSelect
        value={selectedLanguage}
        onValueChange={(value) => handleLanguageChange(value)}
        items={languageOptions}
        style={{ ...pickerSelectStyles }}
      />
        </View>
    )
  }

  const footer = () => {
    return (
      <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: Sizes.fixPadding,
          }}
        >
          <Text>{languageModule.lang(language,'latitude')}</Text>
          <Text>{languageModule.lang(language,'longitude')}</Text>
            <Text>{languageModule.lang(language,'Updatedon')}
            </Text>
          <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: Sizes.fixPadding,
          }}
        >
          <Text>{"Version 1.0"}</Text>
        </View>
        </View>
        
    )
  }

  //Funcion para autenticar al usuario
  //Coloca aqui tu funcion de inicio de sesión
  const authUser = async () => {
    navigation.push("BluetoothScreen");
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {logoIcon()}
        {header()}
        {usuariotext()}
        {passwordTextField()}
        {buttonLogin()}
        {footer()}
        <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: Sizes.fixPadding,
        }}
        >
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  loaderGif: {
    container: {
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginTop: Sizes.fixPadding * 2.0,
      marginBottom: Sizes.fixPadding * 3.0,
      flexDirection: "row",
      alignItems: "center",
    },
    width: width / 10,
    height: width / 10,
    resizeMode: "contain",
  },
  mainLogo: {
    container: {
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      width: width / 2,
      height: width / 2,
      resizeMode: "contain",
    },
  },
  headerWrapStyle: {
    marginBottom: Sizes.fixPadding * 3.0,
    marginTop: Sizes.fixPadding * 6.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    textAlign: "center",
    ...Fonts.blackColor24SemiBold,
  },
  textFieldWrapStyle: {
    borderColor: Colors.grayColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding - 2.0,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  buttonStyle: {
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 3.5,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  alertStyle: {
    backgroundColor: Colors.redColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 3.5,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  passwordFieldStyle: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Sizes.fixPadding - 5.0,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});