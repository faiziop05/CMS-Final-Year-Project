import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../../Colos";
import { BackBtn } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Progress from "react-native-progress";
import { SectionList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import address from "../../IpAddress";
const CourseResultSubject = ({ route, navigation }) => {
  const { courseId, SubName } = route.params;
  const [courseResult, setCourseResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const transformData = (data) => {
    const assessmentCategories = {
      Quiz: "Quizzes",
      "Assignment": "Assignments",
      "Lab Assignment": "Lab Assignments",
      "Mid Term": "Mid Terms",
      "Lab Mid": "Lab Mids",
      "Final Term": "Final Terms",
      "Lab Final": "Lab Finals",
    };
    
    const courseDataMap = {};
    
    data.forEach((item) => {
      const { courseId, marksType, Marks, TotalMarks } = item;
      let assessmentType = null;
    
      // Prioritize longer matches or more specific keys
      Object.keys(assessmentCategories).forEach((key) => {
        if (marksType.includes(key)) {
          if (!assessmentType || key.length > assessmentType.length) {
            assessmentType = key;
          }
        }
      });
    
      if (!courseId || !assessmentType) return;
    
      if (!courseDataMap[courseId]) {
        courseDataMap[courseId] = {};
      }
    
      const categoryTitle = assessmentCategories[assessmentType];
    
      if (!courseDataMap[courseId][categoryTitle]) {
        courseDataMap[courseId][categoryTitle] = [];
      }
    
      courseDataMap[courseId][categoryTitle].push({
        Title: marksType,
        TotalMarks: TotalMarks || 0,
        GainedMarks: Marks,
      });
    });
    
    const transformedData = Object.keys(courseDataMap).map((courseId) => {
      const courseCategories = Object.keys(courseDataMap[courseId]).map(
        (categoryTitle) => {
          const categoryData = courseDataMap[courseId][categoryTitle];
          const overAll =
            categoryData.reduce((sum, item) => sum + item.GainedMarks, 0) /
            categoryData.length;

          return {
            title: categoryTitle,
            overAll,
            data: categoryData,
          };
        }
      );

      return {
        CourseId: courseId,
        courseData: courseCategories,
      };
    });

    return transformedData;
  };

  const fetchUserData = async () => {
    try {
      const studentId = await AsyncStorage.getItem("userId");
      if (studentId) {
        const response = await axios.post(
          `http://${address}:3000/api/marks/marks/getbyId`,
          {
            studentId,
            courseId,
          }
        );
        const transformedData = transformData(response.data);
  
        if (transformedData.length === 0) {
          setError(new Error("No course result data available."));
        } else {
          setCourseResult(transformedData);
        }
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

  const renderFunction = (item) => {
    const percentage = item.GainedMarks / item.TotalMarks;

    const barColor =
      percentage >= 0.9
        ? "green"
        : percentage >= 0.85 && percentage < 0.9
          ? "lightgreen"
          : percentage >= 0.8 && percentage < 0.85
            ? "yellow"
            : percentage >= 0.75 && percentage < 0.8
              ? "gold"
              : percentage >= 0.7 && percentage < 0.75
                ? "gold"
                : percentage >= 0.65 && percentage < 0.7
                  ? "orange"
                  : percentage >= 0.6 && percentage < 0.65
                    ? "#8B8000"
                    : percentage >= 0.55 && percentage < 0.6
                      ? "#FF8000"
                      : percentage >= 0.5 && percentage < 0.55
                        ? "#FF3000"
                        : "#f00";

    return (
      <View style={styles.TheoryLabWrapper}>
        <View style={styles.CourseInfoInnerContainer}>
          <View
            style={{
              flexDirection: "row",
              width: "75%",
              justifyContent: "center",
            }}
          >
            <Text style={[styles.TextContent, { width: "40%" }]}>
              {item.Title}
            </Text>
            <Text style={styles.TextContent}>{item.TotalMarks}</Text>
            <Text style={styles.TextContent}>{item.GainedMarks}</Text>
          </View>
          <View style={{ alignSelf: "flex-end", width: "25%" }}>
            <Progress.Bar
              color={barColor}
              width={80}
              progress={percentage}
              height={20}
            />
            <Text style={{ marginLeft: 10 }}>
              {(percentage * 100).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section }) => (
    <View style={{}}>
      <View style={{ width: "75%" }}>
        <Text style={styles.SectionsHaedings}>{section.title}</Text>
        <View
          style={{
            flexDirection: "row",
            marginLeft: 10,
            paddingHorizontal: 10,
            justifyContent: "center",
          }}
        >
          <Text style={[styles.HeadingTextContent, { width: "40%" }]}>
            Title
          </Text>
          <Text style={styles.HeadingTextContent}>Out Of</Text>
          <Text style={styles.HeadingTextContent}>Gained</Text>
        </View>
      </View>
    </View>
  );

  const renderSectionFooter = ({ section }) => {
    const percentage = section.overAll / section.data[0].TotalMarks;
    const barColor =
      percentage >= 0.9
        ? "green"
        : percentage >= 0.85 && percentage < 0.9
          ? "lightgreen"
          : percentage >= 0.8 && percentage < 0.85
            ? "yellow"
            : percentage >= 0.75 && percentage < 0.8
              ? "gold"
              : percentage >= 0.7 && percentage < 0.75
                ? "gold"
                : percentage >= 0.65 && percentage < 0.7
                  ? "orange"
                  : percentage >= 0.6 && percentage < 0.65
                    ? "#8B8000"
                    : percentage >= 0.55 && percentage < 0.6
                      ? "#FF8000"
                      : percentage >= 0.5 && percentage < 0.55
                        ? "#FF3000"
                        : "#f00";

    return (
      <View style={styles.TheoryLabWrapper}>
        <View style={styles.CourseInfoInnerContainer}>
          <View
            style={{
              flexDirection: "row",
              width: "75%",
              justifyContent: "center",
            }}
          >
            <Text
              style={[
                styles.TextContent,
                {
                  width: "40%",
                  color: "#143782",
                  fontWeight: "800",
                  fontSize: 18,
                },
              ]}
            >
              Total
            </Text>
            <Text style={styles.TextContent}>{section.data[0].TotalMarks}</Text>
            <Text style={styles.TextContent}>{section.overAll.toFixed(2)}</Text>
          </View>
          <View style={{ alignSelf: "flex-end", width: "25%" }}>
            <Progress.Bar
              color={barColor}
              width={80}
              progress={percentage}
              height={20}
            />
            <Text style={{ marginLeft: 10 }}>
              {(percentage * 100).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackBtn onClick={() => navigation.pop()} />
        <Text style={styles.pageTitle}>{SubName}</Text>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      ) : error  ? (
        <View style={styles.centered}>
          <Text >{error.message}</Text>
        </View>
      ) : (
        <SectionList
          sections={courseResult[0]?.courseData || []}
          keyExtractor={(item, index) => item.Title + index}
          renderItem={({ item }) => renderFunction(item)}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={renderSectionFooter}
        />
      )}
    </SafeAreaView>
  );
};

export default CourseResultSubject;

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
  },
  pageTitle: {
    fontSize: 25,
    fontWeight: "800",
    alignSelf: "center",
    color: Colors.headingDarkColor,
    marginBottom: 20,
    marginTop: 12,
  },
  TheoryLabWrapper: {
    backgroundColor: "#fff",
    shadowOffset: { width: 2, height: 7 },
    shadowColor: "black",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    marginHorizontal: 10,
  },
  CourseInfoInnerContainer: {
    flexDirection: "row",
    marginVertical: 6,
    backgroundColor: "rgb(245,245,250)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexWrap: "wrap",
  },
  TextHeading: {
    fontWeight: "800",
    fontSize: 16,
    color: Colors.headingDarkColor,
  },
  SectionsHaedings: {
    fontSize: 20,
    fontWeight: "700",
    color: "#143782",
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },
  TextContent: {
    fontSize: 14,
    fontWeight: "600",
    width: "28%",
  },
  HeadingTextContent: {
    fontSize: 14,
    fontWeight: "600",
    width: "28%",
    color: "#143782",
  },
  centered: {
    marginTop:"50%",
    justifyContent: "center",
    alignItems: "center",
  },
});
