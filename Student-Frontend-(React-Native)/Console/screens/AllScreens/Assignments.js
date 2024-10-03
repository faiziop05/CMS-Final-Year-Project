import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { BackBtn } from "../../components";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";
import { Colors } from "../../Colos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import address from "../../IpAddress";
const fetchAssignmentDetails = async (requestBody) => {
  try {
    const response = await axios.post(
      `http://${address}:3000/api/assignment/getAssignmentDetails`,
      requestBody
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.status === 404
        ? "No data found"
        : "Network error. Please try again later."
    );
  }
};

const Assignments = ({ navigation }) => {
  const [DownloadedAssignment, setDownloadedAssignment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const user = useSelector(selectUser);
  const program = user.program;
  const session = user.session;
  const semester = user.semester;
  const rollNo = user.username;

  const loadSubmittedAssignments = async () => {
    try {
      const storedAssignments = await AsyncStorage.getItem("submittedAssignments");
      if (storedAssignments) {
        setSubmittedAssignments(JSON.parse(storedAssignments));
      }
    } catch (err) {
      console.log("Error loading submitted assignments:", err.message);
      Alert.alert("Error", "Error loading submitted assignments");
    }
  };

  const handleStatus = (item) => {
    if (submittedAssignments.includes(item._id)) {
      return "Submitted";
    } else if (new Date(item.deadline) >= new Date()) {
      return "Pending";
    } else {
      return "Not Submitted";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user.Assignedcourses && user.Assignedcourses.length > 0) {
        try {
          const requestBody = { program, session, semester };
          const data = await fetchAssignmentDetails(requestBody);
          await loadSubmittedAssignments();
          setDownloadedAssignment(data);
        } catch (err) {
          console.log("Error fetching assignment details:", err.message); // Debug log
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("No courses Enrolled.");
      }
    };
    fetchData();
  }, [semester, program, session]);

  const pickDocument = async (id) => {
    try {
      const documentSelection = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
      });
      if (documentSelection.type !== "cancel") {
        const updatedAssignments = DownloadedAssignment.map((assignment) =>
          assignment._id === id
            ? { ...assignment, selectedDocument: documentSelection }
            : assignment
        );
        setDownloadedAssignment(updatedAssignments);
      } else {
        Alert.alert("Document selection cancelled");
      }
    } catch {
      Alert.alert("Error", "Error picking document");
    }
  };
  

  const uploadDocument = async (id) => {
    const assignment = DownloadedAssignment.find(
      (assignment) => assignment._id === id
    );
    const selectedDocument = assignment?.selectedDocument;
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedDocument?.assets[0]?.uri,
        name: selectedDocument?.assets[0]?.name,
        type: selectedDocument?.assets[0]?.mimeType,
      });
      formData.append('courseId', assignment.courseId);
      formData.append('session', session);
      formData.append('program', program);
      formData.append('semester', semester);
      formData.append('rollNo', rollNo);
      formData.append('status', 'Submitted');
      formData.append('id', assignment._id);
      const response = await axios.post(
        `http://${address}:3000/api/assignment/uploadCompletedAssignment`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.status === 201) {
        Alert.alert('Success', 'File uploaded successfully.');
        const updatedSubmittedAssignments = [...submittedAssignments, id];
        setSubmittedAssignments(updatedSubmittedAssignments);
        await AsyncStorage.setItem(
          'submittedAssignments',
          JSON.stringify(updatedSubmittedAssignments)
        );
      } else {
        Alert.alert(
          'Error',
          `Failed to upload file: ${response.data.message}`
        );
      }
    } catch (error) {
      console.error('Error uploading assignment:', error.message);
      Alert.alert('Error', 'Error uploading assignment');
    }
  };


  const fetchAssignmentFile = async (id) => {
    try {
      const response = await axios.get(
        `http://${address}:3000/api/assignment/getAssignmentFile/${id}`
      );
      return response.data;
    } catch {
      Alert.alert("Error", "Error fetching assignment file");
      return null;
    }
  };

  const downloadDocument = async (id) => {
    try {
      const fileData = await fetchAssignmentFile(id);
      if (fileData) {
        const { fileData: base64Data, fileName, mimeType } = fileData;
        const fileExtension = mimeType.split("/").pop();
        const newFileName = `${fileName}.${fileExtension}`;
        const fileUri = FileSystem.documentDirectory + newFileName;

        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
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
      }
    } catch {
      Alert.alert("Error", "An error occurred while downloading the document.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderFunc = (item) => {
    const status = handleStatus(item);
    const statusColor =
      status === "Pending"
        ? "orange"
        : status === "Submitted"
        ? "green"
        : "red";

    return (
      <View style={styles.renderlistContiner}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "800", marginBottom: 6 }}>Subject: </Text>
          <Text>{item.courseTitle}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "800", marginBottom: 6 }}>
            Upload Date:{" "}
          </Text>
          <Text>{formatDate(item.uploadDate)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "800", marginBottom: 6 }}>
            Last Date:{" "}
          </Text>
          <Text>{formatDate(item.deadline)}</Text>
        </View>
        <View style={{ width: "60%", flexDirection: "row" }}>
          <Text style={{ fontWeight: "800" }}>Topic: </Text>
          <Text>{item.title}</Text>
        </View>
        <View style={styles.renderlistInnerContiner}>
          <View style={{ width: "50%", flexDirection: "row" }}>
            <Text style={{ fontWeight: "800" }}>Description: </Text>
            <Text>{item.description}</Text>
          </View>
          <Text
            style={[
              {
                color: statusColor,
              },
              { alignSelf: "flex-end", fontSize: 18, fontWeight: "800" ,marginLeft:-10},
            ]}
          >
            {status}
          </Text>
        </View>
        {status === "Pending" && (
          <View style={styles.BtnOuterContainer}>
            <TouchableOpacity onPress={() => {}} style={styles.btns}>
              <Ionicons
                name="cloud-download-outline"
                size={24}
                color="blue"
                onPress={() => downloadDocument(item._id)}
              />
            </TouchableOpacity>
            <View style={styles.btnInnerContainer}>
              <TouchableOpacity
                onPress={() => pickDocument(item._id)}
                style={styles.btns}
              >
                <AntDesign name="addfile" size={24} color="orange" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => uploadDocument(item._id)}
                style={styles.btns}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={24}
                  color="darkgreen"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackBtn onClick={() => navigation.pop()} />
      <Text style={styles.ScreenHeadingText}>Assignments</Text>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={DownloadedAssignment}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => renderFunc(item)}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </SafeAreaView>
  );
};

export default Assignments;

const styles = StyleSheet.create({
  ScreenHeadingText: {
    fontWeight: "900",
    fontSize: 25,
    color: "#3f3f3f",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 12,
  },
  safeArea:{
flex:1
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
  btnInnerContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  btns: {
    padding: 10,
    alignItems: "center",
  },
  btntext: {
    color: "#fff",
    fontWeight: "700",
  },
  SelectFilebtn: {
    color: "#fff",
    fontWeight: "700",
    width: "100%",
    padding: 10,
    alignItems: "center",
  },
  BtnOuterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50%",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
});
