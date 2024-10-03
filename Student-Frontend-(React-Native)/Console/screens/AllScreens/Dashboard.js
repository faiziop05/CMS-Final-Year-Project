import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { BarChart, LineChartBicolor } from "react-native-gifted-charts";
import { Colors } from "../../Colos";
import { selectUser } from "../../store/userSlice";
import address from "../../IpAddress";

const fetchCGPAData = async (id) => {
  const response = await axios.get(
    `http://${address}:3000/api/resultCard/getCGPAByStudent/${id}`
  );
  return response.data;
};

const Dashboard = () => {
  const user = useSelector(selectUser); // Assume user object has assigned courses
  const [attendanceData, setAttendanceData] = useState([]);
  const [CGPAData, setCGPAData] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [loadingCGPA, setLoadingCGPA] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.post(
          `http://${address}:3000/api/attendance/getByStudentId`,
          {
            studentId: user.id,
            courseIds: user.Assignedcourses.map((course) => course.courseId),
          }
        );
        setAttendanceData(response.data);
      } catch (attendanceError) {
        setError("No Attendance data Found.");
      } finally {
        setLoadingAttendance(false);
      }
    };

    fetchAttendanceData();
  }, [user.id, user.Assignedcourses]);

  useEffect(() => {
    const fetchCGPA = async () => {
      try {
        const data = await fetchCGPAData(user.id);
  
        // Filter out any invalid data points
        const validData = data.filter(
          (item) => item && typeof item.value === "number"
        );
  
        setCGPAData(validData);
      } catch (cgpaError) {
        setError("No CGPA data found.");
      } finally {
        setLoadingCGPA(false);
      }
    };
  
    fetchCGPA();
  }, [user.id]);
  
console.log(CGPAData);

  const calculateAttendancePercentage = (data, assignedCourses) => {
    const attendanceByCourse = data.reduce((acc, curr) => {
      if (!acc[curr.courseId]) {
        acc[curr.courseId] = {
          theoryTotal: 0,
          theoryAttended: 0,
          labTotal: 0,
          labAttended: 0,
        };
      }
      if (curr.class === "Theory") {
        acc[curr.courseId].theoryTotal += 1;
        if (curr.isChecked) {
          acc[curr.courseId].theoryAttended += 1;
        }
      } else if (curr.class === "Lab") {
        acc[curr.courseId].labTotal += 1;
        if (curr.isChecked) {
          acc[curr.courseId].labAttended += 1;
        }
      }
      return acc;
    }, {});

    const colors = [
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
      "#e377c2",
      "#7f7f7f",
      "#bcbd22",
      "#17becf",
    ];

    const theoryAttendancePercentage = assignedCourses.map((course, index) => {
      const courseData = attendanceByCourse[course.courseId] || {
        theoryTotal: 0,
        theoryAttended: 0,
      };
      return {
        value:
          courseData.theoryTotal > 0
            ? Math.round(
                (courseData.theoryAttended / courseData.theoryTotal) * 100
              )
            : 0,
        label: course.courseCode,
        frontColor: colors[index % colors.length],
      };
    });

    const labAttendancePercentage = assignedCourses
      .filter(
        (course) =>
          attendanceByCourse[course.courseId] &&
          attendanceByCourse[course.courseId].labTotal > 0
      )
      .map((course, index) => {
        const courseData = attendanceByCourse[course.courseId] || {
          labTotal: 0,
          labAttended: 0,
        };
        return {
          value: Math.round(
            (courseData.labAttended / courseData.labTotal) * 100
          ),
          label: course.courseCode,
          frontColor: colors[index % colors.length],
        };
      });

    return { theoryAttendancePercentage, labAttendancePercentage };
  };

  const renderAttendanceChart = () => {
    const { theoryAttendancePercentage, labAttendancePercentage } =
      calculateAttendancePercentage(attendanceData, user.Assignedcourses);
// console.log(CGPAData.length);
// console.log(attendanceData);

    return (
      <>
        {attendanceData.length > 0 && (
          <>
            <View style={styles.chartContainer}>
              <Text style={styles.chartHeading}>
                Theory Attendance Percentage
              </Text>
              <BarChart
                isAnimated
                height={130}
                frontColor={"graygray"}
                xAxisLabelTextStyle={{ fontSize: 10 }}
                rotateLabel
                spacing={40}
                overflowTop={20}
                noOfSections={4}
                stackBorderTopLeftRadius={20}
                showValuesAsTopLabel
                showFractionalValues
                maxValue={100}
                data={theoryAttendancePercentage}
              />
            </View>
            <View style={styles.chartContainer}>
              <Text style={styles.chartHeading}>Lab Attendance Percentage</Text>
              <BarChart
                isAnimated
                height={130}
                frontColor={"graygray"}
                xAxisLabelTextStyle={{ fontSize: 10 }}
                rotateLabel
                spacing={40}
                overflowTop={20}
                noOfSections={4}
                stackBorderTopLeftRadius={20}
                showValuesAsTopLabel
                showFractionalValues
                maxValue={100}
                data={labAttendancePercentage}
              />
            </View>
          </>
        )}
        {CGPAData.length > 1  ? (
          <View style={styles.chartContainer}>
            <Text style={styles.chartHeading}>CGPA</Text>
            <LineChartBicolor
              overflowTop={20}
              noOfSections={8}
              maxValue={4}
              xAxisLabelTextStyle={{ fontSize: 10 }}
              data={CGPAData}
              rotateLabel
              showFractionalValues
              areaChart
              color="blue"
              colorNegative="red"
              startFillColorNegative="red"
              showXAxisIndices
            />
          </View>
        )
      :''}
        {attendanceData.length === 0 && CGPAData.length === 0 && (
          <View style={styles.centered}>
            <Text>{error}</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <ScrollView
      style={{ height: "100%", marginTop: Platform.OS == "ios" ? 40 : 30 }}
    >
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Dashboard</Text>
        {loadingAttendance || loadingCGPA ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          renderAttendanceChart()
        )}
      </View>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 0,
    height: "100%",
    justifyContent: "space-between",
  },
  pageTitle: {
    fontSize: 25,
    fontWeight: "800",
    alignSelf: "center",
    color: Colors.headingDarkColor,
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingBottom: 40,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  chartHeading: {
    color: Colors.headingDarkColor,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
