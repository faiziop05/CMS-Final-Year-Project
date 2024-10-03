import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SectionList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../Colos";
import { BackBtn } from "../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import address from "../../IpAddress";
const ClassProceedingSubjectInfo = ({ route, navigation }) => {
  const { courseId, SubName } = route.params;
  const [courseAttendance, setCourseAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseData = async () => {
    try {
      const studentId = await AsyncStorage.getItem("userId");

      if (studentId) {
        const response = await axios.post(
          `http://${address}:3000/api/attendance/getAttendancebyID`,
          {
            studentId,
            courseId,
          }
        );
        setCourseAttendance(response.data);
      } else {
        setError(new Error("User ID not found in AsyncStorage"));
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(new Error("No attendance data available."));
      } else {
        console.log("Error fetching user data:", error);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  const renderData = (item) => {
    const statusColor = item.isChecked ? "green" : "red";
    return (
      <View style={styles.renderlistContiner}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "800", marginBottom: 6 }}>Date: </Text>
          <Text>{item.date}</Text>
        </View>
        <View style={styles.renderlistInnerContiner}>
          <View style={{ width: "70%", flexDirection: "row" }}>
            <Text style={{ fontWeight: "800" }}>Topic: </Text>
            <Text>{item.title}</Text>
          </View>
          <Text
            style={[
              { color: statusColor },
              { alignSelf: "flex-end", fontSize: 18, fontWeight: "800" },
            ]}
          >
            {item.isChecked ? "P" : "A"}
          </Text>
        </View>
      </View>
    );
  };

  const attendancedata = courseAttendance?.map(
    (attendanceData) => attendanceData.attendanceData[0]
  );

  const theoryData =
    attendancedata?.filter((attendance) => attendance.class === "Theory") || [];
  const labData =
    attendancedata?.filter((attendance) => attendance.class === "Lab") || [];

  const sections = [
    { title: "Theory Classes", data: theoryData },
    { title: "Lab Classes", data: labData },
  ];

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <BackBtn onClick={() => navigation.pop()} />
        <Text style={styles.pageTitle}>{SubName}</Text>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text>{error.message}</Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => renderData(item)}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.dataMessage}>No Attendance Data Found</Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ClassProceedingSubjectInfo;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    alignSelf: "center",
    color: Colors.headingDarkColor,
    marginBottom: 20,
    marginTop: 12,
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
  renderlistInnerContiner: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  SectionList: {
    // marginHorizontal: "6%",
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center",
    color: Colors.dark,
  },
  dataMessage: {
    display: "flex",
    alignSelf: "center",
    marginVertical: "60%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
