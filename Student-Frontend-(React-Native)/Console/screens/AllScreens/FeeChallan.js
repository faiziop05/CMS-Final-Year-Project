import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BackBtn } from "../../components";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import axios from "axios";
import { Colors } from "../../Colos";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";
import address from "../../IpAddress";
const fetchChallanDetails = async (session, program, semester) => {
  try {
    const response = await axios.post(
      `http://${address}:3000/api/challan/getChallanDetails`,
      { session, program, semester }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching challan details:", error);
    throw error;
  }
};

const fetchChallanFile = async (id) => {
  try {
    const response = await axios.post(
      `http://${address}:3000/api/challan/getChallanFile`,
      { id }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching challan file:", error);
    throw error;
  }
};

const FeeChallan = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChallanDetails(
          user.session,
          user.program,
          user.semester
        );
        
        setData(data);

        setLoading(false);
      } catch (err) {
        setError("No Challan found");
        setLoading(false);
      }
    };
    fetchData();
  }, [user.session, user.program, user.semester]);

  const downloadDocument = async (id) => {
    try {
      const challanFile = await fetchChallanFile(id);
      const { fileData, fileName, mimeType } = challanFile;
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
      console.error("Error downloading document:", error);
      Alert.alert("Error", "An error occurred while downloading the document.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderFunc = (item) => {
    return (
      <View style={styles.renderlistContiner}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "800", marginBottom: 6 }}>
            Upload Date:{" "}
          </Text>
          <Text>{formatDate(item.uploadDate)}</Text>
        </View>
        <View style={styles.renderlistInnerContiner}>
          <View style={{ width: "70%", flexDirection: "row" }}>
            <Text style={{ fontWeight: "800" }}>Semester: </Text>
            <Text>{item.program}-{item.semester}st</Text>
          </View>
        </View>
        <View style={styles.renderlistInnerContiner}>
          <View style={{ width: "70%", flexDirection: "row" }}>
            <Text
              style={[
                { fontWeight: "900" },
                item.status == "Submitted"
                  ? { color: "green" }
                  : item.status == "Pending"
                  ? { color: "orange" }
                  : { color: "red" },
              ]}
            >
              {item.status}{" "}
            </Text>
          </View>
        </View>
        {item.status != "Submitted" ? (
          <View style={styles.BtnOuterContainer}>
            <TouchableOpacity
              onPress={() => downloadDocument(item._id)}
              style={styles.btns}
            >
              <Text style={styles.downloadBtntxt}>Download</Text>
              <Ionicons name="cloud-download-outline" size={24} color="blue" />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackBtn onClick={() => navigation.pop()} />
      <Text style={styles.ScreenHeadingText}>Fee Challan</Text>
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
        <FlatList
          data={data}
          renderItem={({ item }) => renderFunc(item)}
          style={{ marginBottom: Platform.OS === "ios" ? 5 : 90 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default FeeChallan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ScreenHeadingText: {
    fontWeight: "900",
    fontSize: 25,
    color: "#3f3f3f",
    alignSelf: "center",
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
  btnInnerContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
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
    marginTop: 5,
    alignSelf: "flex-end",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
