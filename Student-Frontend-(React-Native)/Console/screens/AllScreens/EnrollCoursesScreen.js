import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackBtn, MultipleList } from "../../components";
import { Colors } from "../../Colos";
import LinearGradient from "react-native-gifted-charts/src/Components/common/LinearGradient";
import { useFocusEffect } from "@react-navigation/native";
import address from "../../IpAddress";
const EnrollCoursesScreen = ({navigation}) => {
  const [session, setSession] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableReEnrollCourses, setAvailableReEnrollCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedReEnrollCourses, setSelectedReEnrollCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  useEffect(() => {
    if (session && program && semester) {
      fetchAvailableCourses();
    }
  }, [session, program, semester]);

  useEffect(() => {
    if (session && program && semester) {
      fetchAvailableRenrollCourses();
    }
  }, [session, program, semester]);

  const fetchUserData = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        const response = await axios.get(
          `http://${address}:3000/api/students/students/${id}`
        );
        const userData = response.data;
        
        setSession(userData.session);
        setProgram(userData.program);
        setSemester(userData.semester);
      } else {
        setError("User ID not found in AsyncStorage");
      }
    } catch (error) {
      setError("Error fetching user data");
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      const response = await axios.get(
        `http://${address}:3000/api/available-courses/get`,
        {
          params: { session, program, semester, userId:id},
        }
      );
      const transformedData = transformCoursesData(response.data);
      setAvailableCourses(transformedData);
      checkErrorState(transformedData, availableReEnrollCourses);
    } catch (error) {
      if (error.response) {
        setError("No available courses found in the backend.");
      } else if (error.request) {
        setError("Network error, please check your connection.");
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRenrollCourses = async () => {
    const userId = await AsyncStorage.getItem("userId");
    try {
      const response = await axios.get(
        `http://${address}:3000/api/available-ReEnroll-courses/get`,
        {
          params: { session, program, semester, userId },
        }
      );
      const transformedData = transformCoursesData(response.data);
      setAvailableReEnrollCourses(transformedData);
      checkErrorState(availableCourses, transformedData);
    } catch (error) {
      if (error.response) {
        setError("No available re-enroll courses found in the backend.");
      } else if (error.request) {
        setError("Network error, please check your connection.");
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const transformCoursesData = (courses) => {
    return courses.map((course) => ({
      key: course._id,
      value: course.courseName,
    }));
  };

  const checkErrorState = (compulsoryCourses, reEnrollCourses) => {
    
      if (!compulsoryCourses && compulsoryCourses.length ==0 || !reEnrollCourses && reEnrollCourses.length == 0) {
        setError("No available courses to enroll.");
      } else {
        setError(null); // Clear any previous error if there are available courses
      }
  };
  

  const handleEnroll = async () => {
    if (selectedCourses.length === 0 && selectedReEnrollCourses.length === 0) {
      Alert.alert("Error", "Please select at least one course to enroll.");
      return;
    }

    const allSelectedCourses = [...selectedCourses, ...selectedReEnrollCourses];

    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        await axios.post(`http://${address}:3000/api/students/enroll`, {
          studentId: userId,
          courseIds: allSelectedCourses,
        });
        Alert.alert("Success", "Enrolled in courses successfully");
      } else {
        setError("User ID not found in AsyncStorage");
      }
    } catch (error) {
      Alert.alert("Error", "Error enrolling in courses");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <BackBtn onClick={() => navigation.pop()} />
        <Text style={styles.pageTitle}>Enroll Courses</Text>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text>{error}</Text>
          </View>
        ) : (
          <>
            {availableCourses.length > 0 && (
              <>
                <Text style={styles.header}>
                  Compulsory Courses for Semester {semester}
                </Text>
                <MultipleList
                  setSelectedValue={(keys) => setSelectedCourses(keys)}
                  dataValue={availableCourses}
                />
              </>
            )}
            {availableReEnrollCourses.length > 0 && (
              <>
                <Text style={styles.header}>
                  Re-Enroll Courses for Semester {semester}
                </Text>
                <MultipleList
                  setSelectedValue={(keys) => setSelectedReEnrollCourses(keys)}
                  dataValue={availableReEnrollCourses}
                />
              </>
            )}
            {availableCourses.length === 0 && availableReEnrollCourses.length === 0 && (
              <Text style={styles.NoCoursesMsg}>No available courses to enroll</Text>
            )}
            <LinearGradient
              colors={Colors.doubleLinearGredient}
              style={styles.Button}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity onPress={handleEnroll}>
                <Text style={styles.LoginButtonText}>
                  Enroll in Selected Courses
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 25,
    fontWeight: "800",
    alignSelf: "center",
    color: Colors.headingDarkColor,
    marginBottom: 20,
  },
  NoCoursesMsg: {
    display: "flex",
    textAlign: "center",
    marginVertical: "10%",
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EnrollCoursesScreen;
