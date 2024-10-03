import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../Colos";
import { BackBtn } from "../../components";
import { MaterialIcons } from "@expo/vector-icons";
import { selectUser } from "../../store/userSlice";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import address from "../../IpAddress";
const CourseHistory = ({ navigation }) => {
  const user = useSelector(selectUser); // Assume user object has the userId, Assignedcourses, session, and program
  const [error, setError] = useState(null);
  const [historyCourses, setHistoryCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const studentId = await AsyncStorage.getItem("userId");
      if (studentId) {
        const response = await axios.post(
          `http://${address}:3000/api/marks/getFinalTermCoursesByStudentId`,
          {
            studentId,
          }
        );
        setHistoryCourses(response.data);
      } else {
        console.log("User ID not found in AsyncStorage");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(new Error("No course result data available."));
      } else {
        console.log("Error fetching user data:", error);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);




  const handleClick = (item) => {
    navigation.navigate("CourseHistorySubject", {
      courseId: item?.courseId,
      SubName: item.courseName,
      session: user.session,
      program: user.program,
    });
  };

  const renderData = (item) => {
    const { courseName } = item;
    return (
      <TouchableOpacity
        onPress={() => handleClick(item)}
        style={styles.renderlistContainer}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              color: Colors.textDarkColor,
              fontWeight: "700",
              marginBottom: 6,
              fontSize: 16,
            }}
          >
            {courseName}
          </Text>
          <MaterialIcons name="navigate-next" size={25} color="blue" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <BackBtn onClick={() => navigation.pop()} />
        <Text style={styles.pageTitle}>Courses</Text>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <Text style={styles.coursesHeadingText}>Course History :</Text>
            <FlatList
              data={historyCourses}
              renderItem={({ item }) => renderData(item)}
              keyExtractor={(item) => item?.courseId?.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.flatList}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CourseHistory;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 25,
    fontWeight: "800",
    alignSelf: "center",
    color: Colors.headingDarkColor,
    marginBottom: 20,
    marginTop: 12,
  },
  coursesHeadingText: {
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 15,
    color: "#143782",
    marginBottom: 10,
  },
  renderlistContainer: {
    marginBottom: 8,
    borderRadius: 10,
    padding: 15,
    backgroundColor: Colors.light,
    shadowOffset: { width: 2, height: 7 },
    shadowColor: "black",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    marginHorizontal: 10,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: "50%",
  },
  flatList: {
    flex: 1,
  },
});
