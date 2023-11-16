import {StyleSheet,Pressable,Button,Text,View,SafeAreaView,StatusBar,ScrollView,BackHandler,TextInput,Image,Dimensions,TouchableOpacity,Alert} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { useFocusEffect } from "@react-navigation/native";
import { authCarrierDriver, eld } from "../../data/commonQuerys";
import { useSelector, useDispatch } from "react-redux";
import {setCurrentDriver} from "../../redux/actions";
import usuarios from './usuarios.json';
import Constants from 'expo-constants';
const { width } = Dimensions.get("window");
import tailwind from "twrnc";

export const App = () => {


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
           <Text style={tailwind`text-5xl font-bold mb-6`}>
               Iniciar Sesión
           </Text>    
           </View>
    );
  }

  const usuariotext = () => {
    return (
      <View style={styles.textFieldWrapStyle}>
        <TextInput
          value={usuario}
          placeholder={"usuarioHOS"}
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
          placeholder={"Contrseña"}
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
      <TouchableOpacity
          activeOpacity={0.99}
          style={styles.buttonStyle}
          onPress={authUser}
        >
          <Text style={{ ...Fonts.whiteColor16Bold }}>{"ingresar"}</Text>
        </TouchableOpacity>
    )
  }


    const [usuario, setusuario] = useState({});
    const [password,setpassword] = useState('');
    const [driver, setDriver] = useState({});

    const authUser = async () => {
      return await authCarrierDriver(usuario, password).then(
        async (driver) => {
          if (driver) {
            try {
              // STORE USER DATA
              // await AsyncStorage.setItem(
              //   "currentDriver",
              //   JSON.stringify(driver)
              // ).then(async () => {
              //   navigation.push("BluetoothDevices");
              // });
              // dispatch(
              //   setCurrentDriver(
              //     driver,
              //     eldData,
              //     acumulatedVehicleKilometers,
              //     lastDriverStatus
              //   )
              // );
              navigation.push("BluetoothDevices");
            } catch {
              (err) => console.log(err);
            }
          } else {
            setDriver(undefined);
          }
        }
      );
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
        <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: Sizes.fixPadding,
        }}
        >
        <Text>{"version 1.0"}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default App;

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

// import React, { useState } from 'react';
// import {StyleSheet,Button,Text,View,SafeAreaView,StatusBar,ScrollView,BackHandler,TextInput,Image,Dimensions,TouchableOpacity,Alert} from "react-native";
// import { Colors, Fonts, Sizes } from "../../constants/styles";
// import Constants from 'expo-constants';
// import usuarios from './usuarios.json'; // Ruta correcta al archivo JSON

// const Login = () => {
//   const [usuario, setUsuario] = useState('');
//   const [contrasena, setContrasena] = useState('');

//   const handleLogin = () => {
//     // Buscar el usuario en el JSON
//     const usuarioEncontrado = usuarios.usuarios.find(
//       (u) => u.usuario === usuario && u.contrasena === contrasena
//     );

//     if (usuarioEncontrado) {
//       // Usuario autenticado, puedes redirigir o mostrar otro componente
//       Alert.alert('¡Bienvenido!', `Hola ${usuario}`);
//     } else {
//       // Usuario no encontrado o contraseña incorrecta
//       Alert.alert('Error', 'Usuario o contraseña incorrectos');
//     }
//   };

//   function logoIcon() {
//     return (
//       <View style={styles.mainLogo.container}>
//         <Image
//           source={require("../../assets/images/icons/logo.png")}
//           style={{
//             ...styles.mainLogo.logo,
//           }}
//         />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
//       <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
//       <View style={{ flex: 1 }}>
//         {logoIcon()}
//          <View style={{ padding: 20, marginTop: Constants.statusBarHeight }}>
//          <TextInput
//         placeholder="Usuario"
//         onChangeText={(text) => setUsuario(text)}
//         value={usuario}
//       />
//       <TextInput
//         placeholder="Contraseña"
//         onChangeText={(text) => setContrasena(text)}
//         value={contrasena}
//         secureTextEntry
//         style={{ marginTop: 10 }}
//       />
//       <Button title="Iniciar sesión" onPress={handleLogin} style={{ marginTop: 20 }} />
//     </View>
//         {/* {header()}
//         <ScrollView showsVerticalScrollIndicator={false}>
//           {usuarioHOSTextField()}
//           {passwordTextField()}
//           {signinButton()}
//           {driverStatus == "D" ? motionAlert() : null}
//         </ScrollView> */}
//       </View>
//     </SafeAreaView>
//     // <View style={{ padding: 20, marginTop: Constants.statusBarHeight }}>
//     //   <TextInput
//     //     placeholder="Usuario"
//     //     onChangeText={(text) => setUsuario(text)}
//     //     value={usuario}
//     //   />
//     //   <TextInput
//     //     placeholder="Contraseña"
//     //     onChangeText={(text) => setContrasena(text)}
//     //     value={contrasena}
//     //     secureTextEntry
//     //     style={{ marginTop: 10 }}
//     //   />
//     //   <Button title="Iniciar sesión" onPress={handleLogin} style={{ marginTop: 20 }} />
//     // </View>
//   );
// };

// export default Login;


// const styles = StyleSheet.create({
//   loaderGif: {
//     container: {
//       marginHorizontal: Sizes.fixPadding * 2.0,
//       marginTop: Sizes.fixPadding * 2.0,
//       marginBottom: Sizes.fixPadding * 3.0,
//       flexDirection: "row",
//       alignItems: "center",
//     },
//     // width: width / 10,
//     // height: width / 10,
//     resizeMode: "contain",
//   },
//   mainLogo: {
//     container: {
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     logo: {
//       // width: width / 2,
//       // height: width / 2,
//       resizeMode: "contain",
//     },
//   },
//   headerWrapStyle: {
//     marginBottom: Sizes.fixPadding * 3.0,
//     marginTop: Sizes.fixPadding * 6.0,
//     marginHorizontal: Sizes.fixPadding * 2.0,
//     textAlign: "center",
//     ...Fonts.blackColor24SemiBold,
//   },
//   textFieldWrapStyle: {
//     borderColor: Colors.grayColor,
//     borderWidth: 1.0,
//     borderRadius: Sizes.fixPadding - 2.0,
//     padding: Sizes.fixPadding,
//     marginHorizontal: Sizes.fixPadding * 2.0,
//     marginBottom: Sizes.fixPadding * 2.0,
//   },
//   buttonStyle: {
//     backgroundColor: Colors.primaryColor,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: Sizes.fixPadding,
//     paddingVertical: Sizes.fixPadding + 5.0,
//     marginHorizontal: Sizes.fixPadding * 2.0,
//     marginTop: Sizes.fixPadding * 3.5,
//     marginBottom: Sizes.fixPadding * 2.0,
//   },
//   alertStyle: {
//     backgroundColor: Colors.redColor,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: Sizes.fixPadding,
//     paddingVertical: Sizes.fixPadding + 5.0,
//     marginHorizontal: Sizes.fixPadding * 2.0,
//     marginTop: Sizes.fixPadding * 3.5,
//     marginBottom: Sizes.fixPadding * 2.0,
//   },
//   passwordFieldStyle: {
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: Sizes.fixPadding - 5.0,
//   },
// });