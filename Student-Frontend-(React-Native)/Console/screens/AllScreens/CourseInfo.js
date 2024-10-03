import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../Colos";
import { BackBtn } from "../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import address from "../../IpAddress";
const CourseInfo = ({ route, navigation }) => {
  const { SubName, courseId,teacherName,courseCode } = route.params;

  const [courseAttendance, setCourseAttendance] = useState([]);

  const fetchCourseData = async () => {
    try {
      const studentId = await AsyncStorage.getItem("userId");

      if (studentId) {
        const response = await axios.post(`http://${address}:3000/api/attendance/getAttendancebyID`, {
          studentId,
          courseId
        });
        setCourseAttendance(response.data);
      } else {
        console.log("User ID not found in AsyncStorage");
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);
  const attendancedata = courseAttendance?.map((attendanceData) => {
    return attendanceData.attendanceData[0]
  });
  const theoryData = attendancedata?.filter(attendance => attendance.class === 'Theory') || [];
  const theoryPresents = theoryData?.filter(attendance => attendance.isChecked) || 0;
  const theoryAbsents = theoryData?.filter(attendance => !attendance.isChecked) || 0;

  const labData = attendancedata?.filter(attendance => attendance.class === 'Lab') || [];
  const LabPresents = labData?.filter(attendance => attendance.isChecked) || 0;
  const LAbAbsents = labData?.filter(attendance => !attendance.isChecked) || 0;


  const sections = [
    {
      title: "Course Info",
      data: [
        { key: "Course Title:", value: SubName },
        { key: "Taecher Name:", value: teacherName },
        { key: "Course Code:", value: courseCode },
        { key: "Credits:", value: attendancedata[0]?.creditHours },
      ],
    },
    {
      title: "Theory Details",
      data: [
        { key: "Total Theory Lectures:", value: theoryData?.length },
        { key: "Theory Presents:", value: theoryPresents.length },
        { key: "Theory Absents:", value: theoryAbsents.length },
        {
          key: "Theory Percentage:",
          value: theoryData.length!=0
            ? ((theoryPresents.length/theoryData.length)*100).toFixed(2) + "%"
            : "Theory lectures data is not available.",
        },
      ],
    },
    {
      title: "Lab Details",
      data: [
        { key: "Total Lab Lectures:", value: labData.length },
        { key: "Lab Presents:", value: LabPresents.length },
        { key: "Lab Absents:", value: LAbAbsents.length },
        {
          key: "Lab Percentage:",
          value: labData.length!=0
            ? Number((LabPresents.length/labData.length)*100).toFixed(2) + "%"
            : "Lab lectures data is not available.",
        },
      ],
    },
  ];

  const renderData = ({ item }) => (
    <View style={styles.renderlistContainer}>
      <Text style={styles.keyText}>{item.key} </Text>
      <Text style={styles.valueText}>{item.value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackBtn onClick={() => navigation.pop()} />
      <Text style={styles.pageTitle}>{SubName}</Text>
      {attendancedata ? (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.key + index}
          renderItem={renderData}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
        />
      ) : (
        <Text style={styles.loadingText}>Loading course details...</Text>
      )}
    </SafeAreaView>
  );
};

export default CourseInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    color: Colors.headingDarkColor,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: Colors.light,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
    color: "#00bc",
  },
  renderlistContainer: {
    display:"flex",
    flexDirection:"row",
    backgroundColor: Colors.light,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  keyText: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 6,
    color: Colors.headingDarkColor,
  },
  valueText: {
    fontSize: 16,
    color: Colors.textDark,
    width:'60%'
    
    
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: Colors.textDark,
  },
});
