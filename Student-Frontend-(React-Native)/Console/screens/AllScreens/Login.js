import { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { login, setIsLoggedIn } from "../../store/authSlice";
import { setUser } from "../../store/userSlice";
import { Colors } from "../../Colos";
import { List } from "../../components";
import { data } from "../../sampleData";
import * as Notifications from "expo-notifications";
import { programOptions } from "../../programList";
const {
  blue,
  doubleLinearGredient,
  light,
  quadLinearGredient,
  loginFormConatinerColor,
} = Colors;
import  address  from "../../IpAddress";
const Login = () => {
  const dispatch = useDispatch();
  const [Session, setSession] = useState("");
  const [Program, setProgram] = useState("");
  const [RollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");

  useFocusEffect(
    useCallback(() => {
      // Clear input fields and errors when the screen gains focus
      setSession("");
      setProgram("");
      setRollNo("");
      setPassword("");
      setErrors({});
      setLoginError("");

      const fetchLoginStatus = async () => {
        try {
          const user = await AsyncStorage.getItem("user");
          const storedPassword = await AsyncStorage.getItem("password");
          if (user && storedPassword) {
            dispatch(setUser(user));
            setPassword(storedPassword);
          }
          const isLoggedInString = await AsyncStorage.getItem("isLoggedIn");
          const isLoggedIn = isLoggedInString === "true";
          if (isLoggedIn) {
            dispatch(setIsLoggedIn(true));
          }
        } catch (error) {
          console.error("Error retrieving login status:", error);
        }
      };
      fetchLoginStatus();
    }, [])
  );
  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus.status;

    if (finalStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    setExpoPushToken(token);
  };
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  const validateInputs = () => {
    let valid = true;
    let errors = {};

    if (!Session) {
      valid = false;
      errors["Session"] = "Session is required.";
    }
    if (!Program) {
      valid = false;
      errors["Program"] = "Program is required.";
    }
    if (!RollNo) {
      valid = false;
      errors["RollNo"] = "Roll Number is required.";
    } else if (!/^\d{3}$/.test(RollNo)) {
      valid = false;
      errors["RollNo"] = "Roll Number must be a 3-digit number.";
    }
    if (!password) {
      valid = false;
      errors["password"] = "Password is required.";
    } else if (!password || password.length < 6) {
      valid = false;
      errors["password"] = "Password must be at least 6 characters.";
    }

    setErrors(errors);
    return valid;
  };

  const handleLogin = async () => {

    if (validateInputs()) {
      const user = `${Session}-${Program}-${RollNo}`;

      try {
        const res = await fetch(
          `http://${address}:3000/api/studentLogin/Studentlogin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Session,
              Program,
              RollNo,
              password,
              expoPushToken,
            }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          const userId = data._id; // Assuming the response contains a userId
          await AsyncStorage.setItem("user", user);
          await AsyncStorage.setItem("userId", userId); // Store userId
          await AsyncStorage.setItem("password", password);
          await AsyncStorage.setItem("isLoggedIn", "true");
          await AsyncStorage.setItem("navigateFromLogin", "true");
          dispatch(login(user));
          dispatch(setUser({ user, userId, expoPushToken }));
          dispatch(setIsLoggedIn(true));
          setLoginError("");
        } else {
          const errorData = await res.json();
          setLoginError(
            errorData.message ||
              "Invalid Program, Session, Roll No or Password!!"
          );
        }
      } catch (error) {
        console.error("Error saving login details: ", error);
        setLoginError("An error occurred while logging in.");
      }
    }
  };

  return (
    <KeyboardAvoidingView style={{ height: "100%" ,}} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.ScrollViewContainer}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={quadLinearGredient}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{ height: "100%", justifyContent: "space-around" }}
        >
          <View style={styles.FormConatiner}>
            <View style={{ marginBottom: 10 }}>
              <View style={styles.imageLogoConatiner}>
                <Image
                  style={styles.imageLogo}
                  source={require("../../assets/MUST-Logo.png")}
                />
              </View>
              <Text style={styles.LoginHeadingText}>Student Portal Login</Text>
              <List
                setSelectedValue={(val) => setSession(val)}
                dataValue={data[0]}
              />
              {errors.Session && (
                <Text style={styles.errorText}>{errors.Session}</Text>
              )}
              <List
                setSelectedValue={(val) => setProgram(val)}
                dataValue={programOptions}
              />
              {errors.Program && (
                <Text style={styles.errorText}>{errors.Program}</Text>
              )}
              <TextInput
                onChangeText={(val) => setRollNo(val)}
                placeholder="Roll # e.g. 001"
                style={styles.PassTextBox}
                keyboardType="number-pad"
                value={RollNo}
              />
              {errors.RollNo && (
                <Text style={styles.errorText}>{errors.RollNo}</Text>
              )}
              <TextInput
                onChangeText={(val) => setPassword(val)}
                placeholder="Password"
                style={styles.PassTextBox}
                secureTextEntry={true}
                value={password}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>
            {loginError && <Text style={styles.errorText}>{loginError}</Text>}
            <LinearGradient
              colors={doubleLinearGredient}
              style={styles.LoginButton}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.LoginButtonText}>Login</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export { Login };

const styles = StyleSheet.create({
  ScrollViewContainer: {
    flexGrow: 1,

  },
  FormConatiner: {
    borderRadius: 30,
    marginHorizontal: "5%",
    backgroundColor: loginFormConatinerColor,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: "space-evenly",
    marginBottom: Platform.OS == "android" ? 60 : 20,
  },
  imageLogoConatiner: {
    width: "30%",
    alignSelf: "center",
    height: "30%",
  },
  imageLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  LoginHeadingText: {
    textAlign: "center",
    fontSize: 25,
    color: blue,
    fontWeight: "800",
    paddingBottom: 20,
  },
  PassTextBox: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: light,
    fontSize: 16,
    marginBottom: 10,
  },
  LoginButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  LoginButtonText: {
    color: light,
    fontSize: 20,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
});
