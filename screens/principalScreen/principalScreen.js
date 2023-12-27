  import React, { useState, useEffect } from 'react';
  import { ScrollView,View, Text, TouchableOpacity, StyleSheet, Image,Dimensions,} from 'react-native';
  import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
  import { Entypo } from '@expo/vector-icons';
  import * as Progress from "react-native-progress";
  const { width } = Dimensions.get("window");
  import { Colors, Fonts, Sizes } from "../../constants/styles";
  const languageModule = require('../../global_functions/variables');
  
  const PrincipalScreen = ({ navigation }) => {
    const [selected, setSelected] = useState('');
    const [language, setlanguage] = useState('');
    //Uso de efectos de inicio del screen
    //Aqui obtenemos el idioma seleccionado desde la primera pantalla
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

    const handleMenuPress = () => {
      navigation.push('AppMenu');
    };
  
    const handleStateChange = (state) => {
      setSelected(state);
    };
    
  function onTurnoInfo() {
      return (
        <View>
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding * 2.0,
              ...Fonts.blackColor16SemiBold,
            }}
          >
            {languageModule.lang(language, 'onDuty')}
          </Text>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: Sizes.fixPadding * 2.0,
            }}
          >
            <Progress.Circle
              progress={0.65}
              size={width / 2.8}
              unfilledColor={Colors.lightGrayColor}
              borderWidth={0.0}
              color={Colors.primaryColor}
              thickness={8}
            />
            <Text
              style={{
                width: 80.0,
                height: 45.0,
                position: "absolute",
                textAlign: "center",
                ...Fonts.blackColor36SemiBold,
              }}
            >
              {"11 H"}
            </Text>
          </View>
          <Text
            style={{
              textAlign: "center",
              marginTop: Sizes.fixPadding,
              marginBottom: Sizes.fixPadding * 2.0,
              ...Fonts.primaryColor24SemiBold,
            }}
          >
            {"03:43"}
          </Text>
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>
      );
  }
  
  function onCicloInfo() {
      return (
        <View>
          <Text
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding * 2.0,
              ...Fonts.blackColor16SemiBold,
            }}
          >
            {languageModule.lang(language, 'Sleeper')}
          </Text>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: Sizes.fixPadding * 2.0,
            }}
          >
            <Progress.Circle
              progress={0.65}
              size={width / 2.8}
              unfilledColor={Colors.lightGrayColor}
              borderWidth={0.0}
              color={Colors.primaryColor}
              thickness={8}
            />
            <Text
              style={{
                width: 80.0,
                height: 45.0,
                position: "absolute",
                textAlign: "center",
                ...Fonts.blackColor36SemiBold,
              }}
            >
              {"11 H"}
            </Text>
          </View>
          <Text
            style={{
              textAlign: "center",
              marginTop: Sizes.fixPadding,
              marginBottom: Sizes.fixPadding * 2.0,
              ...Fonts.primaryColor24SemiBold,
            }}
          >
            {"03:43"}
          </Text>
        </View>
      );
  }
    
  function manejandoInfo() {
    return (
      <View>
        <Text
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginTop: Sizes.fixPadding * 2.0,
            ...Fonts.blackColor16SemiBold,
          }}
        >
          {"manejando"}
        </Text>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: Sizes.fixPadding * 2.0,
          }}
        >
          <Progress.Circle
            progress={0.65}
            size={width / 2.8}
            unfilledColor={Colors.lightGrayColor}
            borderWidth={0.0}
            color={Colors.primaryColor}
            thickness={8}
          />
          <Text
            style={{
              width: 80.0,
              height: 45.0,
              position: "absolute",
              textAlign: "center",
              ...Fonts.blackColor36SemiBold,
            }}
          >
            {"11 H"}
          </Text>
        </View>
        <Text
          style={{
            textAlign: "center",
            marginTop: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding * 2.0,
            ...Fonts.primaryColor24SemiBold,
          }}
        >
          {"03:43"}
        </Text>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
    );
  }

  function onTurnoInfo() {
    return (
      <View>
        <Text
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginTop: Sizes.fixPadding * 2.0,
            ...Fonts.blackColor16SemiBold,
          }}
        >
          {"onTurno"}
        </Text>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: Sizes.fixPadding * 2.0,
          }}
        >
          <Progress.Circle
            progress={0.65}
            size={width / 2.8}
            unfilledColor={Colors.lightGrayColor}
            borderWidth={0.0}
            color={Colors.primaryColor}
            thickness={8}
          />
          <Text
            style={{
              width: 80.0,
              height: 45.0,
              position: "absolute",
              textAlign: "center",
              ...Fonts.blackColor36SemiBold,
            }}
          >
            {"11 H"}
          </Text>
        </View>
        <Text
          style={{
            textAlign: "center",
            marginTop: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding * 2.0,
            ...Fonts.primaryColor24SemiBold,
          }}
        >
          {"03:43"}
        </Text>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
    );
  }
  
  return (
      <ScrollView showsVerticalScrollIndicator={false} >
      <View style={styles.container}>
        <View style={styles.header}>
        <Image
        source={require("../../assets/images/icons/appIcon.png")}
        style={{ width: 45.0, height: 45.0, borderRadius: 22.5, left: -20 }}
        />
        <Text style={styles.title}>Horas de servicio</Text>
            <View >
              <MaterialCommunityIcons
                name="bluetooth"
                size={26}
                color={'#cc0b0a'}
              />
            </View>
                     <View >
              <MaterialCommunityIcons
                name="truck"
                size={26}
                color={'#cc0b0a'}
              />
            </View>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          {/* Icono del menú */}
          <Entypo name="menu" size={24} color="#4CAF50" />
        </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <View style={styles.userInfo}>
        <Text style={styles.userName}>Nombre del conductor:</Text>
        <View style={styles.innerSeparator} />
        <Text style={{color:"#cc0b0a"}}>Estado: </Text>
        <Text >latitude: </Text>
        <Text >longitude: </Text>
      </View>
        <View style={styles.separator} />
        <View style={styles.body}>
          <View style={styles.controlContainer}>
          <TouchableOpacity
              style={[
                styles.centerButton,
                { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -60 }, { translateY: -60 }] },
                selected === 'OFF-DUTY' && styles.selectedButton,
              ]}
              onPress={() => handleStateChange('OFF-DUTY')}
            >
              <Text style={[styles.buttonText, selected === 'OFF-DUTY' && styles.selectedText]}>
                OFF-DUTY
              </Text>
            </TouchableOpacity>
            {/* Botones ON-D */}
            <View style={styles.stateButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.stateButton,
                  selected === 'On' && styles.selectedButton,
                ]}
                onPress={() => handleStateChange('On')}
              >
                <Text style={[styles.buttonText, selected === 'On' && styles.selectedText]}>
                  On
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.stateButton,
                  selected === 'D' && styles.selectedButton,
                ]}
                onPress={() => handleStateChange('D')}
              >
                <Text style={[styles.buttonText, selected === 'D' && styles.selectedText]}>
                  D
                </Text>
              </TouchableOpacity>
            </View>
            {/* Botones SB-PS */}
            <View style={styles.stateButtonsRow}>
              {/* Botones a la derecha */}
              <TouchableOpacity
                style={[
                  styles.stateButton,
                  selected === 'SB' && styles.selectedButton,
                  { right: -25 },
                  
                ]}
                onPress={() => handleStateChange('SB')}
              >
                <Text style={[styles.buttonText, selected === 'SB' && styles.selectedText]}>
                  SB
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.stateButton,
                  selected === 'PS' && styles.selectedButton,
                  { marginLeft: 80 },
                ]}
                onPress={() => handleStateChange('PS')}
              >
                <Text style={[styles.buttonText, selected === 'PS' && styles.selectedText]}>
                  PS
                </Text>
              </TouchableOpacity>
            </View>
            {/* Botones YARD-PERSONAL */}
            <View style={styles.stateButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.stateButton,
                  selected === 'yard' && styles.selectedButton,
                ]}
                onPress={() => handleStateChange('yard')}
              >
                <Text style={[styles.buttonText, selected === 'yard' && styles.selectedText]}>
                  yard
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.stateButton,
                  selected === 'personal' && styles.selectedButton,
                ]}
                onPress={() => handleStateChange('personal')}
              >
                <Text style={[styles.buttonText, selected === 'personal' && styles.selectedText]}>
                  personal
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.separator} />
          {/*   Posible violacion */}
        <View
          style={{
            margin: Sizes.fixPadding * 2.0,
          }}
        >
          <Text >
            {`${"Posible violacion"} ${5}h ${36}m`}
          </Text>
          <Text >
            {`(${14} Hrs ${"onDuty"})`}
          </Text><View
          style={{
            alignItems: "center",
            justifyContent: "center",
            left: 100,
          }}
        >
          <Text style={{ ...Fonts.blackColor18Bold }}>{`01:37`}</Text>
        </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.graphsContainer}>
            {manejandoInfo()}
            {onTurnoInfo()}
            {onCicloInfo()}
          </View>
    </View>
          </ScrollView>
  );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      paddingHorizontal: 20,
      paddingTop: 60,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: -35, // Mover el encabezado hacia arriba
      marginBottom: 10, // Agregar un poco de espacio debajo del encabezado
    },
    title: {
      left: -30,
      fontSize: 18, // Aumentar el tamaño del título
      fontWeight: 'bold',
      color: '#4CAF50',
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0', // Color de la línea separadora
      marginVertical: 3, // Espacio vertical entre la línea y el contenido debajo
    },
    menuButton: {
      width: 40,
      padding: 10,
      borderRadius: 8,
    },
    body: {
      flex: 1,
    },
    controlContainer: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    stateButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 6,
    },
    stateButton: {
      width: 140,
      height: 55,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#4CAF50',
      borderRadius: 10,
      margin: 5,
    },
    centerButton: {
      width: 120,
      height: 120,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 60,
      backgroundColor: '#ffffff', // Cambiar el color de fondo
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      color: '#000000',
    },
    selectedText: {
      color: '#FFFFFF',
    },
    selectedButton: {
      backgroundColor: '#4CAF50',
    },
    graphsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      borderRadius: 20,
    },
  });
  
  export default PrincipalScreen;
  

  

  
