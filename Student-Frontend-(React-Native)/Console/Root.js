import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

const Root = () => {
  useEffect(() => {
    if (Platform.OS == "android") {
      async function customizeNavigationBar() {
        NavigationBar.setPositionAsync("absolute");
        NavigationBar.setBackgroundColorAsync("#00000077");
      }

      customizeNavigationBar();
    }
    return () => {
    };
  }, []);
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default Root;
