import { StyleSheet, Text, Platform, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

const BackBtn = ({ onClick }) => {
  return (
    <>
      {Platform.OS === "ios" ? (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            padding: 5,
            marginLeft: 15,
            alignSelf: "flex-start",
          }}
          onPress={onClick}
        >
          <MaterialIcons name="navigate-before" size={25} color="#8E8E93" />
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
      ) : (
        ""
      )}
    </>
  );
};

export default BackBtn;

const styles = StyleSheet.create({
  backButton: {
    fontSize: 20,
    color: "#8E8E93",
    fontWeight: "700",
    alignSelf:"center",
  },
});
