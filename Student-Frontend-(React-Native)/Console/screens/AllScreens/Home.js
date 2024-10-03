import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome6,
  MaterialCommunityIcons,
  Foundation,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, SmallHomeIcon } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { setUser } from "../../store/userSlice";
import { useFocusEffect } from "@react-navigation/native";
import address from "../../IpAddress";
const HorizontalList = [
  {
    Icon: MaterialIcons,
    onclick: "TimeTable",
    name: "schedule",
    text: "Time Table",
  },
  {
    Icon: FontAwesome6,
    onclick: "FeeChallan",
    name: "money-check",
    text: "Fee Challan",
  },
  {
    Icon: MaterialIcons,
    onclick: "EnrollCoursesScreen",
    name: "library-books",
    text: "Enroll Courses",
  },
  {
    Icon: MaterialCommunityIcons,
    onclick: "CourseHistory",
    name: "history",
    text: "Course History",
  },
];

const Home = ({ navigation }) => {
  const [student, setStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const dispatch = useDispatch();

  const fetchUserId = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      return id;
    } catch (error) {
      console.error("Error fetching user ID from AsyncStorage:", error);
      return null;
    }
  };

  const fetchUserData = async (id) => {
    try {
      setRefreshing(true);
      if (id) {
        const response = await axios.get(
          `http://${address}:3000/api/students/${id}`
        );
        setStudent(response.data);
      } else {
        console.error("User ID not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem("notification");
      const notifications = storedNotifications
        ? JSON.parse(storedNotifications)
        : [];
      setNotificationCount(notifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const id = await fetchUserId();
    await fetchUserData(id);
    await fetchNotificationCount();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const checkAndRefresh = async () => {
        const navigateFromLogin = await AsyncStorage.getItem("navigateFromLogin");
        if (navigateFromLogin === "true") {
          const id = await fetchUserId();
          await fetchUserData(id);
          await fetchNotificationCount();
          await AsyncStorage.removeItem("navigateFromLogin");
        }
      };
      checkAndRefresh();
      fetchNotificationCount(); // Call fetchNotificationCount whenever the screen comes into focus
    }, [])
  );

  useEffect(() => {
    const initialize = async () => {
      const id = await fetchUserId();
      await fetchUserData(id);
      await fetchNotificationCount();
      setLoading(false);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (student) {
      dispatch(setUser(student));
    }
  }, [student]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.ScreenHeadingText}>Home</Text>
      {loading ? (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <Text style={styles.errorMsg}>Error fetching data</Text>
      ) : null}
      <FlatList
        data={[]}
        ListHeaderComponent={
          <>
            <View style={styles.WelcomeNotificationWrapper}>
              <Text style={styles.welcomeText}>Welcome Back: {student.fullName}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Notification")}
                style={styles.notificationiconscontainer}
              >
                <MaterialIcons name="notifications-none" size={28} color="orange" />
                {notificationCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notificationCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.HorizontalLine} />
            <View style={styles.bottomContainerWrapper}>
              <FlatList
                data={HorizontalList}
                renderItem={({ item }) => (
                  <SmallHomeIcon
                    Icon={item.Icon}
                    onclick={() => navigation.navigate(item.onclick)}
                    name={item.name}
                    text={item.text}
                  />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View style={styles.HorizontalLine} />
            <View style={styles.cardwrapperContainer}>
              <Card
                Icon={MaterialCommunityIcons}
                onclick={() => navigation.navigate("Courses")}
                name="bookshelf"
                text="Courses"
              />
              <Card
                Icon={MaterialCommunityIcons}
                onclick={() => navigation.navigate("CourseContents")}
                name="file-document-outline"
                text="Course Contents"
              />
              <Card
                Icon={MaterialIcons}
                onclick={() => navigation.navigate("ClassProceedings")}
                name="timeline"
                text="Class Proceedings"
              />
              <Card
                Icon={MaterialIcons}
                onclick={() => navigation.navigate("Assignments")}
                name="assignment"
                text="Assignments"
              />
              <Card
                Icon={Ionicons}
                onclick={() => navigation.navigate("Results")}
                name="stats-chart-outline"
                text="Results"
              />
              <Card
                Icon={Foundation}
                onclick={() => navigation.navigate("CourseResult")}
                name="results"
                text="Course Result"
              />
            </View>
          </>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
  },
  ScreenHeadingText: {
    fontWeight: "900",
    fontSize: 25,
    color: "#3f3f3f",
    alignSelf: "center",
    marginBottom: 15,
    marginTop: Platform.OS === "ios" ? 0 : 12,
  },
  welcomeText: {
    fontWeight: "600",
    fontSize: 20,
    color: "#3f3f3f",
    marginBottom: 10,
  },
  cardwrapperContainer: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    shadowOffset: { width: -4, height: 10 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  WelcomeNotificationWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginTop: 5,
  },
  notificationiconscontainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  bottomContainerWrapper: {
    backgroundColor: "#fff",
    shadowOffset: { width: 2, height: 7 },
    shadowColor: "black",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  HorizontalLine: {
    backgroundColor: "#0001",
    height: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorMsg: {
    textAlign: "center",
    color: "red",
  },
});
