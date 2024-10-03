import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../Colos";
import { BackBtn } from "../../components";
import { MaterialIcons } from "@expo/vector-icons";
import { selectUser } from "../../store/userSlice";
import { useSelector } from "react-redux";

const Courses = ({ navigation }) => {
  const user = useSelector(selectUser); // Assume user object has the userId and Assignedcourses
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.Assignedcourses || user.Assignedcourses.length === 0) {
      setError("No courses Enrolled.");
    }
  }, [user]);

  const handleClick = (item) => {
    navigation.navigate("CourseInfo", {
      courseId: item.courseId,
      SubName: item.courseName,
      teacherName: item.teacherName,
      courseCode: item.courseCode,
    });
  };

  const renderData = (item) => {
    const { courseName } = item;
    return (
      <TouchableOpacity
        onPress={() => handleClick(item)}
        style={styles.renderlistContiner}
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
    <SafeAreaView>
      <View style={styles.container}>
        <BackBtn onClick={() => navigation.pop()} />
        <Text style={styles.pageTitle}>Courses</Text>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <Text style={styles.coursesHeadingText}>Registered Courses :</Text>
            <FlatList
              data={user.Assignedcourses}
              renderItem={({ item }) => renderData(item)}
              showsVerticalScrollIndicator={false}
              style={styles.SectionList}
              ListEmptyComponent={
                <Text style={styles.noCoursesText}>
                  No courses assigned to the user.
                </Text>
              }
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Courses;

const styles = StyleSheet.create({
  container: {
    height: "100%",
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
  renderlistContiner: {
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
  noCoursesText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});
