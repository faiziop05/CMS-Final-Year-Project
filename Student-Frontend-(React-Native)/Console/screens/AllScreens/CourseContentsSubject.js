import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";
import axios from "axios";
import { Colors } from "../../Colos";
import { BackBtn } from "../../components";
import address from "../../IpAddress";
const fetchContentDetails = async (requestBody) => {
  try {
    const response = await axios.post(
      `http://${address}:3000/api/courseContents/getContentDetails`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching course content details:", error);
    throw error;
  }
};

const fetchContentFile = async (id) => {
  try {
    const response = await axios.post(
      `http://${address}:3000/api/courseContents/getContentFile`,
      { id }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching course content file:", error);
    throw error;
  }
};

const CourseContentsSubject = ({ navigation, route }) => {
  const { courseId, SubName, session, program } = route.params;
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestBody = { program, session, courseId };
        const data = await fetchContentDetails(requestBody);
        if (data.length === 0) {
          setLoading(false)
          setError(new Error("No course content available."));
        } else {
          setLoading(false)
          setCourseData(data);
        }
      } catch (err) {
        setLoading(false)
        setError("Please check your internet connection and try again!!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, program, session]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const downloadDocument = async (id) => {
    try {
      const contentFile = await fetchContentFile(id);
      const { fileData, fileName, mimeType } = contentFile;
      const fileExtension = mimeType.split("/").pop();
      const newFileName = `${fileName}.${fileExtension}`;
      const fileUri = FileSystem.documentDirectory + newFileName;

      await FileSystem.writeAsStringAsync(fileUri, fileData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (Platform.OS === "ios") {
        await shareAsync(fileUri);
      } else {
        if (Platform.OS === "android" && Platform.Version < 30) {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Permission Denied",
              "Storage permission is required to save files."
            );
            return;
          }
          await MediaLibrary.saveToLibraryAsync(fileUri);
          Alert.alert(
            "File Downloaded",
            `File '${newFileName}' saved successfully.`
          );
        } else {
          const { granted, directoryUri } =
            await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (granted) {
            const base64 = await FileSystem.readAsStringAsync(fileUri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            const createdUri =
              await FileSystem.StorageAccessFramework.createFileAsync(
                directoryUri,
                newFileName,
                mimeType
              );
            await FileSystem.writeAsStringAsync(createdUri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
            Alert.alert(
              "File Downloaded",
              `File '${newFileName}' saved successfully.`
            );
          }
        }
      }
    } catch (error) {
      console.log("Error downloading document:", error);
      Alert.alert("Error", "An error occurred while downloading the document.");
    }
  };

  const renderFunc = (item) => (
    <View style={styles.renderlistContainer}>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontWeight: "800", marginBottom: 6 }}>
          Upload Date:{" "}
        </Text>
        <Text>{formatDate(item.uploadDate)}</Text>
      </View>
      <View style={styles.renderlistInnerContainer}>
        <View style={{ width: "70%", flexDirection: "row" }}>
          <Text style={{ fontWeight: "800" }}>Title: </Text>
          <Text>{item.title}</Text>
        </View>
      </View>
      <View style={styles.renderlistInnerContainer}>
        <View style={{ width: "70%", flexDirection: "row" }}>
          <Text style={{ fontWeight: "800" }}>Description: </Text>
          <Text>{item.description}</Text>
        </View>
      </View>
      <View style={styles.BtnOuterContainer}>
        <TouchableOpacity
          onPress={() => downloadDocument(item._id)}
          style={styles.btns}
        >
          <Text style={styles.downloadBtntxt}>Download</Text>
          <Ionicons name="cloud-download-outline" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <BackBtn onClick={() => navigation.pop()} />
      <Text style={styles.screenHeadingText}>{SubName}</Text>
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
        <FlatList
          data={courseData}
          renderItem={({ item }) => renderFunc(item)}
          keyExtractor={(item) => item._id}
          style={{ marginBottom: Platform.OS === "ios" ? 5 : 90 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default CourseContentsSubject;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  screenHeadingText: {
    fontWeight: "900",
    fontSize: 25,
    color: "#3f3f3f",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 12,
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
  renderlistInnerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btns: {
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  downloadBtntxt: {
    marginRight: 5,
    fontWeight: "700",
    color: "blue",
  },
  BtnOuterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
