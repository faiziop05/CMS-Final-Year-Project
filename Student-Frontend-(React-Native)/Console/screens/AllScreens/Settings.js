import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "../../Colos";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { selectUser, setUser } from "../../store/userSlice";
import * as Notifications from "expo-notifications";
import axios from "axios";
import { setIsLoggedIn } from "../../store/authSlice";
import address from "../../IpAddress";

const Settings = () => {
  const users = useSelector(selectUser); // Assume user object has the userId
  const dispatch = useDispatch();
  const [cellNo, setCellNo] = useState(users.phoneNo);
  const [email, setEmail] = useState(users.email);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneNumberRegex = /^03[0-9]{9}$/;

  

  const handleUpdatePasswordButton = async () => {
    if (oldPassword === "" || password === "" || reEnterPassword === "") {
      Alert.alert("Please enter details in all three sections.");
    } else if (password.length < 8) {
      Alert.alert("Password must be at least 8 characters long.");
    } else if (!/\d/.test(password)) {
      Alert.alert("Password must contain at least one number.");
    } else if (!/[a-zA-Z]/.test(password)) {
      Alert.alert("Password must contain at least one English alphabet.");
    } else if (users.password !== oldPassword) {
      // Assuming you have user's old password in the redux store
      Alert.alert("Old Password does not match.");
    } else if (password !== reEnterPassword) {
      Alert.alert("New Password does not match.");
    } else {
      try {
        const updatedUser = { password: password, oldPassword: oldPassword }; // Send new and old passwords
        const response = await axios.put(
          `http://${address}:3000/api/students/updateStudentProfile/${users.id}`,
          updatedUser
        );
        Alert.alert("Password updated successfully.");
      } catch (error) {
        console.error("Password update failed:", error);
        Alert.alert("Update failed. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("password");
    await AsyncStorage.setItem("isLoggedIn", "false");
    dispatch(setIsLoggedIn(false));
    dispatch(setUser(''));
    await axios.post(
      `http://${address}:3000/api/students/RemoveExpoPushToken/`,
      {studentId:users.id}
    );
  };

  const handleSaveChangesButton = async () => {
    if (!phoneNumberRegex.test(cellNo)) {
      Alert.alert("Please Enter Correct Cell No.");
    } else if (!emailRegex.test(email)) {
      Alert.alert("Please Enter Correct Email Address");
    } else {
      try {
        const updatedUser = {
          phoneNo: cellNo,
          email: email,
        }; // Include pushToken if available
        const response = await axios.put(
          `http://${address}:3000/api/students/updateStudentProfile/${users.id}`,
          updatedUser
        );
        Alert.alert("Changes saved");
      } catch (error) {
        console.error("Changes failed:", error);
        Alert.alert("Update failed. Please try again.");
      }
    }
  };


  return (
    <KeyboardAvoidingView style={{ height: "100%" }} behavior="padding">
      <ScrollView style={styles.container}>
        <View style={styles.pictureNameContainer}>
          <Text style={styles.title}>Settings</Text>

          <TouchableOpacity style={styles.LogoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="red" />
            <Text style={styles.LogoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainerWrapper}>
          <View>
            <Text style={styles.DetailsHeadingText1}>User Settings </Text>
            <View>
              <Text style={styles.label}>Cell No: </Text>
              <TextInput
                onChangeText={(val) => setCellNo(val)}
                value={cellNo}
                style={styles.PassTextBox}
                keyboardType="number-pad"
              />
            </View>
            <View>
              <Text style={styles.label}>Email: </Text>
              <TextInput
                onChangeText={(val) => setEmail(val)}
                value={email}
                style={styles.PassTextBox}
              />
            </View>

            <LinearGradient
              colors={Colors.doubleLinearGredient}
              style={styles.Button}
              start={{ x: 0, y: 1 }} // Starting position of the gradient
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity onPress={handleSaveChangesButton}>
                <Text style={styles.LoginButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <View style={{ marginTop: 50 }}>
            <Text style={styles.DetailsHeadingText}>Password Settings </Text>
            <View>
              <Text style={styles.label}>Old Password: </Text>
              <TextInput
                onChangeText={(val) => setOldPassword(val)}
                placeholder=""
                style={styles.PassTextBox}
                secureTextEntry={true}
              />
            </View>
            <View>
              <Text style={styles.label}>New Password: </Text>
              <TextInput
                onChangeText={(val) => setPassword(val)}
                placeholder=""
                style={styles.PassTextBox}
                secureTextEntry={true}
              />
            </View>
            <View>
              <Text style={styles.label}>Confirm New Password: </Text>
              <TextInput
                onChangeText={(val) => setReEnterPassword(val)}
                placeholder=""
                style={styles.PassTextBox}
                secureTextEntry={true}
              />
            </View>
            <LinearGradient
              colors={Colors.doubleLinearGredient}
              style={styles.Button}
              start={{ x: 0, y: 1 }} // Starting position of the gradient
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity onPress={handleUpdatePasswordButton}>
                <Text style={styles.LoginButtonText}>Update Password</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexGrow: 1,
  },

  LogoutButton: {
    alignSelf: "flex-end",
    flexDirection: "row",
    padding: 10,
    marginHorizontal: 5,
  },
  LogoutButtonText: {
    color: "red",
    fontWeight: "900",
    marginHorizontal: 5,
  },
  pictureNameContainer: {
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? "14%" : "12%",
    marginBottom: 20,
    justifyContent: "center",
  },
  imageContianer: {
    padding: 2,
    resizeMode: "cover",
    borderColor: "blue",
    borderWidth: 0.6,
    borderRadius: 140,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 140,
  },
  DetailsHeadingText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#143782",
    marginBottom: 10,
    alignSelf: "center",
  },
  DetailsHeadingText1: {
    fontSize: 20,
    fontWeight: "700",
    color: "#143782",
    marginBottom: 10,
    alignSelf: "center",
    marginTop:20
  },
  pictureButton: {
    flexDirection: "row",
    padding: 10,
  },
  pictureButtonText: {
    color: Colors.headingDarkColor,
    fontWeight: "400",
    fontSize: 13,
  },
  PassTextBox: {
    borderRadius: 3,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: Colors.light,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 0.2,
    marginBottom: 5,
    borderColor: "rgb(200,200,200)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.dark,
  },
  detailsContainerWrapper: {
    marginHorizontal: 15,
  },
  detailsContainer: {
    flexDirection: "row",
    marginBottom: 14,
    padding: 15,
    borderRadius: 5,
    backgroundColor: Colors.light,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 0.13,
    borderColor: "gray",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: Colors.headingDarkColor,
  },
  value: {
    fontSize: 16,
    color: Colors.textDarkColor,
  },
  LoginButtonText: {
    color: Colors.light,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
  },
  Button: {
    borderRadius: 3,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderWidth: 0.2,
    marginBottom: 10,
    fontSize: 16,
    marginTop: 30,
  },
  notificationButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 3,
    backgroundColor: "orange",
    alignItems: "center",
  },
  notificationButtonText: {
    color: Colors.light,
    fontWeight: "700",
  },
});
