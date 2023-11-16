import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, Sizes } from "../constants/styles";
import DietScreen from "../screens/diet/dietScreen";
import HorasDeServicio from "../screens/dmx_horasDeServicio/horasDeServicio";
import InsightScreen from "../screens/insight/insightScreen";
import ProfileScreen from "../screens/profile/profileScreen";
import WorkoutScreen from "../screens/workout/workoutScreen";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const { t } = useTranslation();

  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [backAction])
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  function tr(key) {
    return t(`bottomTabsScreen:${key}`);
  }

  const [backClickCount, setBackClickCount] = useState(0);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primaryColor,
          tabBarInactiveTintColor: Colors.grayColor,
          tabBarLabelStyle: {
            fontSize: 14.0,
            fontFamily: "Montserrat_SemiBold",
          },
          tabBarStyle: { height: 60.0 },
          tabBarItemStyle: { marginVertical: Sizes.fixPadding - 3.0 },
        }}
      >
        <Tab.Screen
          name={tr("condicionesNormales")}
          component={HorasDeServicio}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name={tr("workout")}
          component={WorkoutScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                name="fitness-center"
                size={24}
                color={color}
                style={{
                  transform: [{ rotate: "-40deg" }],
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name={tr("insight")}
          component={InsightScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                name="collections-bookmark"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name={tr("diet")}
          component={DietScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="pot-steam-outline"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name={tr("profile")}
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="person-outline" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      {exitInfo()}
    </>
  );

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={[styles.animatedView]}>
        <Text style={{ ...Fonts.whiteColor14Medium }}>{tr("exitText")}</Text>
      </View>
    ) : null;
  }
};

const styles = StyleSheet.create({
  animatedView: {
    backgroundColor: Colors.lightBlackColor,
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BottomTabs;
