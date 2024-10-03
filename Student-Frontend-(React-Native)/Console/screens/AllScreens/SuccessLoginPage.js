import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { Colors } from "../../Colos";

import Home from "./Home";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import Settings from "./Settings";

const { Screen, Navigator } = createBottomTabNavigator();
const { doubleLinearGredient, gray, light } = Colors;
const SuccessLoginPage = ({ navigation }) => {
  //add icons names here
  const screenIcons = {
    Home: "home",
    Profile: "user",
    Dashboard: "dashboard",
    Settings: "setting",
  };

  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: light, // Adjust active tab color as needed
        tabBarInactiveTintColor: gray, // Adjust inactive tab color as needed
        headerShown: false,
      }}
      tabBar={(props) => (
        <LinearGradient
          colors={doubleLinearGredient}
          
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{
            flexDirection: "row",
            
            height:
              Platform.OS === "ios"
                ? "10%"
                :Platform.OS=="android" &&  Platform.Version > 31
                ? "8%"
                : "8%",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              overflow: "hidden",
              paddingBottom: 5,
              paddingTop: 8,
            }}
          >
            {props.state.routes.map((route, index) => (
              <View key={index} style={{ flex: 1, alignItems: "center" }}>
                <TouchableOpacity
                  style={{ width: 80, height: "80%", alignItems: "center" }}
                  onPress={() => navigation.navigate(route.name)}
                >
                  <AntDesign //add logo-icon in this component
                    name={screenIcons[route.name]}
                    size={24}
                    color={props.state.index === index ? light : gray}
                  />
                  <Text style={{ color: light }}>{route.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </LinearGradient>
      )}
    >
      <Screen name="Home" component={Home} />
      <Screen name="Dashboard" component={Dashboard} />
      <Screen name="Profile" component={Profile} />
      <Screen name="Settings" component={Settings} />
    </Navigator> //add screens up here
  );
};

export default SuccessLoginPage;
