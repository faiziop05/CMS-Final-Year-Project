import { StyleSheet, Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../Colos";
const { doubleLinearGredient, light, blue } = Colors;
const SmallHomeIcon = (props) => {
  const { text, name, onclick, Icon } = props;
  return (
    <TouchableOpacity onPress={onclick} style={styles.btn}>
      <LinearGradient
        colors={doubleLinearGredient}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <Icon name={name} size={30} color={light} style={styles.icon} />
      </LinearGradient>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default SmallHomeIcon;
//styling here
const styles = StyleSheet.create({
  container: {
    borderRadius:200,
    padding:5,

  },
  btn: {
    alignItems: "center",
    marginHorizontal:10,
    borderRadius:100,
    padding:5,
    
    
  },
  icon: {
    backgroundColor: blue,
    borderRadius:100,
    elevation:10,
    shadowColor:'black',
    shadowOffset:{width:-4,height:10},
    
  },
  text: {
    color: Colors.dark,
    fontWeight: "bold",
    fontSize: 10,
    marginTop:5
    
  },
});
