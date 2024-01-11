import React, { useState, useEffect } from 'react';
import { ScrollView,View, Text, TouchableOpacity, StyleSheet, Image,Dimensions, Modal} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Entypo } from '@expo/vector-icons';
import * as Progress from "react-native-progress";
const { width } = Dimensions.get("window");
import { Input, Overlay } from "react-native-elements";
import { Colors, Fonts, Sizes } from "../../constants/styles";
const languageModule = require('../../global_functions/variables');
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getEventTypeCode, postDriverEvent } from "../../data/commonQuerys";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDriver, setDriverStatus } from "../../redux/actions";
import { getCurrentDriver } from "../../config/localStorage";
import { TextInput } from "react-native-paper";

const PrincipalScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  //Declaración de variables
  const [language, setlanguage] = useState('');
  const [exemptModal, setexemptModal] = useState(false);
  const [showAnnotationDialog, setAnnotationDialog] = useState(false);
  const [currentAnnotation, setCurrentAnnotarion] = useState("");
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showObservacionesDialog, setShowObservacionesDialog] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [tempDriverStatus, setTempDriverStatus] = useState("");
  const [selectedObservaciones, setSelectedObservaciones] = useState([]);
  const {eldData,currentDriver,driverStatus,acumulatedVehicleKilometers,lastDriverStatus,trackingTimestamp} = useSelector((state) => state.eldReducer);

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

  //Esta funcion triplica los posteos de eventos checar!!
  // useEffect(() => {
  //   getCurrentDriver().then((currentDriver) => {
  //     dispatch(
  //       setCurrentDriver(
  //         currentDriver,
  //         eldData,
  //         acumulatedVehicleKilometers,
  //         lastDriverStatus
  //       )
  //     );
  //   });
  // }, []);

  //resolver el problema de que no se actualiza el estado del driver
  // useEffect(() => {
  //   if (driverStatus == "ON" && acumulatedVehicleKilometers > 0) {
  //     setShowStopDialog(true);
  //   } else {
  //     setShowStopDialog(false);
  //   }
  // }, [driverStatus]);

  useEffect(() => {
    const aksTheDriverIfHeStoped = setTimeout(() => {
      postEvent(1);
    }, 60000);
    if (!showStopDialog) {
      clearTimeout(aksTheDriverIfHeStoped);
    }
  }, [showStopDialog]);
  
  //Funciones
  const postEvent = async (recordOrigin, observaciones) => {
    await postDriverEvent(
      {
        recordStatus: 1,
        recordOrigin: recordOrigin,
        type: getEventTypeCode(tempDriverStatus).type,
        code: getEventTypeCode(tempDriverStatus).code,
      },
      currentAnnotation,
      tempDriverStatus,
      currentDriver,
      eldData,
      acumulatedVehicleKilometers,
      lastDriverStatus
    ).then((eventData) => {
      setShowStatusDialog(false);
      setAnnotationDialog(false);
      setCurrentAnnotarion("");
      if (eventData?.dutyStatus == "ON" && observaciones == undefined) {
             setShowObservacionesDialog(true);
      }
    });
  };

  const changeDriverStatus = (status, dialog) => {
    if(currentDriver.exemptDriverConfiguration.value == "E"){
      setexemptModal(true)
    }else{
      if (driverStatus != status) {
        setTempDriverStatus(status);
        switch (status) {
          case "ON":
          case "D":
          case "SB":
          case "PS":
          case "OFF-DUTY":
            if (dialog == undefined) {
              setShowStatusDialog(true);
            } else if (dialog == false) {
              // postEvent(2);
              dispatch(
                setDriverStatus(
                  eldData,
                  currentDriver,
                  status,
                  acumulatedVehicleKilometers,
                  driverStatus,
                  2
                )
              );
            }
            return;
            //Issue terminado desde otro punto del sprint
          case "YM":  //Agregamos solo un comentario 
          case "PC":  //Aqui tambien
            return setAnnotationDialog(true);
          default:
            return postEvent(1);
        }
      }
    }

  };

  const handleMenuPress = () => {
    navigation.push('AppMenu');
  };

  function traducirStatus(status){
    switch (status) {
      case "ON":
        return "onDuty";
      case "OFF-DUTY":
        return "offDuty";
      case "D":
        return "driving";
      case "SB":
        return "Sleeper";
      case "PS":
        return "passenger";
      case "PC":
        return "PERSONAL";
      case "YM":
        return "Movimiento de patio";
      default:
        return "No identificado";
    }
  }

  const desactivarExemptModal = () => {
    setexemptModal(false);
  };


  //Funciones de renderizado
  function header() {
    return (
      <View style={styles.header}>
      <Image
      source={require("../../assets/images/icons/appIcon.png")}
      style={{ width: 45.0, height: 45.0, borderRadius: 22.5, left: -8 }}
      />
      <Text style={styles.title}>{languageModule.lang(language, 'hoursofservice')}</Text>
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
    )
  }

  function userInfo() {
    return (
      <View style={styles.userInfo}>
      <Text style={styles.userName}>{languageModule.lang(language, 'driverName') + ": "+ currentDriver?.displayName}</Text>
      <View style={styles.innerSeparator} />
      <Text style={{color:"#4CAF50"}}>{languageModule.lang(language, 'driverStatus') + ": "}{driverStatus}</Text>
      <Text >{`${languageModule.lang(language, 'latitude')}: ${eldData?.coords?.latitude? eldData?.coords?.latitude.toFixed(3): `${languageModule.lang(language, 'loading')}`}`}</Text>
      <Text >{`${languageModule.lang(language, 'longitude')}: ${eldData?.coords?.longitude? eldData?.coords?.longitude.toFixed(3): `${languageModule.lang(language, 'loading')}`}`}</Text>
      <Text>
        {`${languageModule.lang(language, 'Updatedon')}: ${new Date(
          trackingTimestamp
        ).toDateString()} ${new Date(
          trackingTimestamp
        ).toLocaleTimeString()}`}
      </Text>
      </View>
    )
  }

  function controlesNavegacion() {
    return (
      <View style={styles.body}>
          <TouchableOpacity
              style={[
                styles.centerButton,
                { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -60 }, { translateY: -60 }] },
                driverStatus === 'OFF-DUTY' && styles.selectedButton,
                currentDriver?.exemptDriverConfiguration?.value == "E" && styles.disabledButton,
              ]}
              onPress={() => changeDriverStatus('OFF-DUTY')}
            >
              <Text style={[styles.buttonText, driverStatus === 'OFF-DUTY' && styles.selectedText]}>
                {languageModule.lang(language, 'offDuty')}
              </Text>
            </TouchableOpacity>           
          <View style={styles.controlContainer}>
            {/* Botones ON-D */}
            <View style={styles.stateButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.stateButton,
                  driverStatus === 'ON' && styles.selectedButton,
                  currentDriver?.exemptDriverConfiguration?.value == "E" && styles.disabledButton,
                ]}
                onPress={() => changeDriverStatus('ON')}
              >
                <Text style={[styles.buttonText, driverStatus === 'ON' && styles.selectedText]}>
                  {languageModule.lang(language, 'onDuty')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.stateButton,
                  driverStatus === 'D' && styles.selectedButton,
                  currentDriver?.exemptDriverConfiguration?.value == "E" && styles.disabledButton,
                ]}
                onPress={() => changeDriverStatus('D')}
              >
                <Text style={[styles.buttonText, driverStatus === 'D' && styles.selectedText]}>
                  {languageModule.lang(language, 'driving')}
                </Text>
              </TouchableOpacity>
            </View>
            {/* Botones SB-PS */}
            <View style={styles.stateButtonsRow}>
              {/* Botones a la derecha */}
              <TouchableOpacity
                style={[
                  styles.stateButton,
                  driverStatus === 'SB' && styles.selectedButton,
                  { right: -25 },
                  currentDriver?.exemptDriverConfiguration?.value == "E" && styles.disabledButton,
                ]}
                onPress={() => changeDriverStatus('SB')}
              >
                <Text style={[styles.buttonText, driverStatus === 'SB' && styles.selectedText]}>
                  {languageModule.lang(language, 'Sleeper')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.stateButton,
                  driverStatus === 'PS' && styles.selectedButton,
                  { marginLeft: 80 },
                  currentDriver?.exemptDriverConfiguration?.value == "E" && styles.disabledButton,
                ]}
                onPress={() => changeDriverStatus('PS')}
              >
                <Text style={[styles.buttonText, driverStatus === 'PS' && styles.selectedText]}>
                  {languageModule.lang(language, 'passenger')}
                </Text>
              </TouchableOpacity>
            </View>
            {/* Botones YARD-PERSONAL */}
            <View style={styles.stateButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.stateButton,
                  driverStatus === 'YM' && styles.selectedButton,
                  !currentDriver?.yard && styles.disabledButton,
                  currentDriver?.exemptDriverConfiguration?.value == "E" && styles.disabledButton,
                ]}
                onPress={() => currentDriver?.yard == true ? changeDriverStatus("YM") : null}
              >
                <Text style={[styles.buttonText, driverStatus === 'YM' && styles.selectedText]}>
                  YARD
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.stateButton,
                  driverStatus === 'PC' && styles.selectedButton,
                  !currentDriver?.personalUse && styles.disabledButton,
                  currentDriver?.exemptDriverConfiguration?.value == "E" && styles.disabledButton,
                ]}
                onPress={() => currentDriver?.personalUse == true ? changeDriverStatus("PC"): null}
              >
                <Text style={[styles.buttonText, driverStatus === 'PC' && styles.selectedText]}>
                  PERSONAL
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    )
  }

  function posibleViolacion() {
    return (
      <View style={{  margin: Sizes.fixPadding * 2.0,}}>
      <Text >
        {languageModule.lang(language, 'posibleViolation') + ": "}
        {`${5}h ${36}m`}
      </Text>
      <Text >
        {`(${14} Hrs ${languageModule.lang(language, 'onDuty')})`}
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
    )
  }

  function statusDialog() {
    return (
      <Overlay
        isVisible={showStatusDialog}
        onBackdropPress={() => setShowStatusDialog(false)}
        overlayStyle={{
          width: width - 40.0,
          borderRadius: Sizes.fixPadding - 2.0,
          padding: 0.0,
        }}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 2.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Text style={{ textAlign: "center", ...Fonts.blackColor18Bold }}>
            {languageModule.lang(language, 'warning')}
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: Sizes.fixPadding + 5.0,
              ...Fonts.blackColor16Medium,
            }}
          >
            {languageModule.lang(language, 'areYouSureYouWantTo') + " " + languageModule.lang(language, 'changeTo') + " " + languageModule.lang(language, traducirStatus(tempDriverStatus)) + "?"}
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: Sizes.fixPadding + 5.0,
              ...Fonts.blackColor16Medium,
            }}
          >
          </Text>
          <TouchableOpacity
            activeOpacity={0.99}
            onPress={async () => {
              dispatch(
                setDriverStatus(
                  eldData,
                  currentDriver,
                  tempDriverStatus,
                  acumulatedVehicleKilometers,
                  driverStatus,
                  2
                )
              );
              setShowStatusDialog(false);
            }}
            style={styles.buttonStyle}
          >
            <Text style={{ ...Fonts.whiteColor16Bold }}>{languageModule.lang(language, 'confirm')}</Text>
          </TouchableOpacity>
          <Text
            onPress={() => setShowStatusDialog(false)}
            style={{ textAlign: "center", ...Fonts.grayColor16SemiBold }}
          >
            {languageModule.lang(language, 'cancel')}
          </Text>
        </View>
      </Overlay>
    );
  }

  function anotationDialog() {
    return (
      <Overlay
        isVisible={showAnnotationDialog}
        onBackdropPress={() => setAnnotationDialog(false)}
        overlayStyle={{
          width: width - 40.0,
          borderRadius: Sizes.fixPadding - 2.0,
          padding: 0.0,
        }}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 2.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Text style={{ textAlign: "center", ...Fonts.blackColor18Bold }}>
            {languageModule.lang(language, 'comment')}
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: Sizes.fixPadding + 5.0,
              ...Fonts.blackColor16Medium,
            }}
          >
            {`${languageModule.lang(language, 'ifyouWish')} ${languageModule.lang(language, 'youCanAddAComment')}`}
          </Text>
          <TextInput
            value={currentAnnotation}
            onChangeText={(text) => setCurrentAnnotarion(text)}
            style={styles.textFieldStyle}
            activeUnderlineColor={Colors.primaryColor}
            underlineColor={Colors.grayColor}
          />
          <TouchableOpacity
            activeOpacity={0.99}
            onPress={async () => {
              dispatch(
                setDriverStatus(
                  eldData,
                  currentDriver,
                  tempDriverStatus,
                  acumulatedVehicleKilometers,
                  driverStatus,
                  2,
                  currentAnnotation
                )
              );
              setAnnotationDialog(false);
            }}
            style={styles.buttonStyle}
          >
            <Text style={{ ...Fonts.whiteColor16Bold }}>{languageModule.lang(language, 'confirm')}</Text>
          </TouchableOpacity>
          <Text
            onPress={() => setAnnotationDialog(false)}
            style={{ textAlign: "center", ...Fonts.grayColor16SemiBold }}
          >
            {languageModule.lang(language, 'cancel')}
          </Text>
        </View>
      </Overlay>
    );
  }

  function observacionesDialog() {
    const observaciones = [
      "Pre-TI",
      "Post-TI",
      languageModule.lang(language, 'loading'),
      languageModule.lang(language, 'unloading'),
      languageModule.lang(language, 'hooking'),
      languageModule.lang(language, 'dropping'),
      languageModule.lang(language, 'repairing'),
      languageModule.lang(language, 'DOTInspection'),
      languageModule.lang(language, 'other'),
    ];

    const Checkbox = ({ label }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.99}
          style={{
            flexDirection: "row",
          }}
          onPress={() => {
            seleccionarObservacion(label);
          }}
        >
          <View
            style={{
              ...styles.radioButtonStyle,
              borderColor: Colors.grayColor,
            }}
          >
            <MaterialCommunityIcons
              name="check"
              size={16}
              color={
                selectedObservaciones.indexOf(label) > -1
                  ? Colors.blackColor
                  : Colors.whiteColor
              }
            />
          </View>
          <Text
            style={{
              marginLeft:  Sizes.fixPadding,
              marginRight: Sizes.fixPadding,
              ...Fonts.blackColor16Medium,
            }}
          >
            {label}
          </Text>
        </TouchableOpacity>
      );
    };

    function observacionOption({ option, last }) {
      return (
        <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
          <TouchableOpacity
            activeOpacity={0.99}
            style={{
              flexDirection:  "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Checkbox label={option} />
            </View>
          </TouchableOpacity>

          {last ? (
            <View>
              <View
                style={{
                  marginVertical: Sizes.fixPadding * 2.0,
                  backgroundColor: Colors.lightGrayColor,
                  height: 1.0,
                }}
              />
              <View>
                <Text style={{ ...Fonts.grayColor14Regular }}>
                  {languageModule.lang(language, 'other')}
                </Text>
                <TextInput
                  // value={numeroDelCamion}
                  // onChangeText={(text) => updateState({ numeroDelCamion: text })}
                  style={styles.textFieldStyle}
                  activeUnderlineColor={Colors.primaryColor}
                />
              </View>
            </View>
          ) : (
            <View
              style={{
                marginVertical: Sizes.fixPadding * 2.0,
                backgroundColor: Colors.lightGrayColor,
                height: 1.0,
              }}
            />
          )}
        </View>
      );
    }
    return (
      <Overlay
        isVisible={showObservacionesDialog}
        onBackdropPress={() => setShowObservacionesDialog(false)}
        overlayStyle={{
          width: width - 40.0,
          borderRadius: Sizes.fixPadding - 2.0,
          padding: 0.0,
        }}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 2.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              marginBottom: Sizes.fixPadding * 2,
              ...Fonts.blackColor18Bold,
            }}
          >
            {languageModule.lang(language, 'observations')}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false} height={400}>
            {observaciones.map((observacion, i) => {
              return observacionOption({
                option: observacion,
                last: i + 1 == observaciones.length ? true : false,
              });
            })}
          </ScrollView>
          <TouchableOpacity
            activeOpacity={0.99}
            onPress={() => {
              // navigation.push("Inspeccion");
              setShowObservacionesDialog(false);
            }}
            style={styles.buttonStyle}
          >
            <Text style={{ ...Fonts.whiteColor16Bold }}>{languageModule.lang(language,'confirm')}</Text>
          </TouchableOpacity>
          <Text
            onPress={() => setShowObservacionesDialog(false)}
            style={{ textAlign: "center", ...Fonts.grayColor16SemiBold }}
          >
            {languageModule.lang(language, 'cancel')}
          </Text>
        </View>
      </Overlay>
    );
  }

  function stopDialog() {
    return (
      <Overlay
        isVisible={showStopDialog}
        onBackdropPress={() => setShowStopDialog(false)}
        overlayStyle={{
          width: width - 40.0,
          borderRadius: Sizes.fixPadding - 2.0,
          padding: 0.0,
        }}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 2.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Text style={{ textAlign: "center", ...Fonts.blackColor18Bold }}>
            {languageModule.lang(language, 'warning')}
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: Sizes.fixPadding + 5.0,
              ...Fonts.blackColor16Medium,
            }}
          >
            {languageModule.lang(language, 'StopMovementDetected')}
          </Text>
          {/* <Text
            style={{
              textAlign: "center",
              marginTop: Sizes.fixPadding + 5.0,
              ...Fonts.blackColor16Medium,
            }}
          >
            {driverStatus}
          </Text> */}
          <TouchableOpacity
            activeOpacity={0.99}
            onPress={async () => {
              setShowStopDialog(false);
              await changeDriverStatus("ON", false);

            }}
            style={styles.buttonStyle}
          >
            <Text style={{ ...Fonts.whiteColor16Bold }}>
              {languageModule.lang(language, 'changeTo') + " " + languageModule.lang(language, 'onDuty')}
            </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    );
  }

  function expemtDriver(expemtDriverComment) {
    return (
      <View>
        <TouchableOpacity activeOpacity={0.99} style={styles.alertStyle}>
          <Text
            style={{
              ...Fonts.whiteColor16Bold,
              textAlign: "center",
            }}
          >
            {languageModule.lang(language, "exemptDriver")}
          </Text>
          <Text
            style={{
              ...Fonts.whiteColor16Bold,
              textAlign: "center",
            }}
          >
            {expemtDriverComment}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function showAlertExempt() {
    return (
      <Modal
        visible={exemptModal}
        transparent={true}
        // animationType="slide"
        onRequestClose={desactivarExemptModal}
      >
        <View style={styles2.modalContainer}>
          <View style={styles2.modalContent}>
            <Text style={styles2.textoAlerta}>{`${languageModule.lang(language, 'exemptDriver')}`}</Text>
            <Text>{`${languageModule.lang(language, 'youAreNotAllowed')} ${currentDriver?.exemptDriverConfiguration?.comment}`}</Text>
            <TouchableOpacity onPress={desactivarExemptModal}>
              <Text style={styles2.botonCerrar}>{languageModule.lang(language, 'close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  //Graficas de estadisticas
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
          {languageModule.lang(language, 'driving')}
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

  //pantalla a retornar
  return (
      <ScrollView showsVerticalScrollIndicator={false} >
      <View style={styles.container}>
        {header()}
        <View style={styles.separator} />
        {userInfo()}
        {currentDriver?.exemptDriverConfiguration?.value == "E"
            ? expemtDriver(currentDriver?.exemptDriverConfiguration?.comment)
            : null}
        <View style={styles.separator} />
        {controlesNavegacion()}
        <View style={styles.separator} />
        {posibleViolacion()}
        <View style={styles.separator} />
        <View style={styles.graphsContainer}>
        {manejandoInfo()}
        {onTurnoInfo()}
        {onCicloInfo()}
      </View>
      </View>
      {showAlertExempt()}
      {statusDialog()}
      {anotationDialog()}
      {observacionesDialog()}
      {stopDialog()}
      </ScrollView>
  );
  };

  const styles = StyleSheet.create({
    disabledButton: {
      opacity: 0.5,
    },
    radioButtonStyle: {
      width: 18.0,
      height: 18.0,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.0,
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxContainer: {
      flexDirection: "row",
      marginBottom: 20,
    },
    checkbox: {
      alignSelf: "center",
    },
    label: {
      margin: 8,
    },
    textFieldStyle: {
      ...Fonts.blackColor14Medium,
      paddingHorizontal: Sizes.fixPadding,
    },
    continueBtn: {
      wrap: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding,
        flexDirection: "row",
        alignItems: "center",
      },
      touchableOpacity: {
        elevation: 2.0,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: Sizes.fixPadding - 2.0,
        paddingVertical: Sizes.fixPadding + 2.0,
        flex: 1,
        borderWidth: 1.0,
      },
      btnStyle: {
        marginLeft: Sizes.fixPadding,
      },
      btnStyleBig: {
        marginLeft: Sizes.fixPadding,
        height: Sizes.fixPadding * 10,
      },
      touchableOpacityRound: {
        alignItems: "center",
        justifyContent: "center",
      },
      btnStyleRound: {
        position: "absolute",
        top: Sizes.fixPadding - 220,
        right: Sizes.fixPadding * 10,
        padding: Sizes.fixPadding + 5.0,
        borderRadius: 100,
        borderWidth: 8.0,
      },
      btnActive: {
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.whiteColor,
      },
      btnDeactivated: {
        backgroundColor: Colors.grayColor,
        borderColor: Colors.whiteColor,
      },
      btnSelected: {
        borderColor: Colors.whiteColor,
        backgroundColor: Colors.yellowColor,
      },
    },
    headerWrapStyle: {
      marginVertical: Sizes.fixPadding + 5.0,
      marginHorizontal: Sizes.fixPadding * 2.0,
      alignItems: "center",
      justifyContent: "space-between",
    },
    newNotificationBellStyle: {
      position: "absolute",
      width: 8.0,
      height: 8.0,
      borderRadius: 4.0,
      backgroundColor: Colors.redColor,
      right: 2.5,
      top: 5.0,
      borderColor: Colors.whiteColor,
      borderWidth: 1.0,
    },
    joinNowButtonStyle: {
      backgroundColor: Colors.blackColor,
      borderRadius: Sizes.fixPadding,
      paddingVertical: Sizes.fixPadding - 5.0,
      paddingHorizontal: Sizes.fixPadding + 2.0,
      marginTop: Sizes.fixPadding * 2.0,
      marginBottom: Sizes.fixPadding - 5.0,
    },
    todayInfoWrapStyle: {
      backgroundColor: Colors.whiteColor,
      elevation: 2.0,
      alignItems: "center",
      borderRadius: Sizes.fixPadding - 7.0,
    },
    sessionStartTimeWrapStyle: {
      marginTop: Sizes.fixPadding - 7.0,
      borderColor: { success: Colors.primaryColor, error: Colors.redColor },
      borderWidth: 1.0,
      borderRadius: Sizes.fixPadding,
      paddingHorizontal: Sizes.fixPadding + 5.0,
      paddingVertical: Sizes.fixPadding - 8.0,
    },
    mealsCategoryWrapStyle: {
      alignItems: "center",
      backgroundColor: Colors.whiteColor,
      elevation: 2.0,
      position: "absolute",
      bottom: -30.0,
      paddingHorizontal: Sizes.fixPadding * 2.0,
      paddingVertical: Sizes.fixPadding + 5.0,
      borderRadius: Sizes.fixPadding - 2.0,
    },
    foodImageStyle: {
      width: width / 1.5,
      height: width / 2.5,
      resizeMode: "stretch",
      borderRadius: Sizes.fixPadding - 2.0,
    },
    trainerInfoWrapStyle: {
      marginRight: Sizes.fixPadding * 2.0,
      width: width / 2.5,
      elevation: 2.0,
      borderRadius: Sizes.fixPadding - 2.0,
      backgroundColor: Colors.whiteColor,
    },
    currencyWrapStyle: {
      margin: Sizes.fixPadding - 3.0,
      alignSelf: "flex-end",
      backgroundColor: Colors.primaryColor,
      width: 18.0,
      height: 18.0,
      borderRadius: 9.0,
      alignItems: "center",
      justifyContent: "center",
    },
    trainerDetailWrapStyle: {
      paddingVertical: Sizes.fixPadding - 5.0,
      paddingHorizontal: Sizes.fixPadding,
      justifyContent: "space-between",
    },
    workoutThumbImageStyle: {
      width: width / 1.7,
      height: width / 2.8,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonStyle: {
      backgroundColor: Colors.primaryColor,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Sizes.fixPadding,
      paddingVertical: Sizes.fixPadding + 5.0,
      marginTop: Sizes.fixPadding * 2.0,
      marginBottom: Sizes.fixPadding,
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
      marginTop: -37, // Mover el encabezado hacia arriba
      marginBottom: 8, // Agregar un poco de espacio debajo del encabezado
    },
    title: {
      left: -18,
      fontSize: 20, // Aumentar el tamaño del título
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
      zIndex: 1,
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
      elevation: 35,
      zIndex: 2,                 // Numero superior en zIndex para superponer el boton, issue completado en otro anterior
      borderWidth: 1,
      borderColor: '#4CAF50'
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

  const styles2 = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    boton: {
      padding: 10,
      backgroundColor: 'lightblue',
      borderRadius: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    textoAlerta: {
      fontSize: 18,
      marginBottom: 10,
    },
    botonCerrar: {
      color: "#cc0b0a",
      fontSize: 16,
    },
  });

  export default PrincipalScreen;





