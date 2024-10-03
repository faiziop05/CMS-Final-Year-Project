import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";
import { Colors } from "../../Colos";
import { encode } from "base64-arraybuffer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import address from "../../IpAddress";
const Profile = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector(selectUser); // Assume user object has the userId
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfilePicture = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      const response = await axios.get(
        `http://${address}:3000/api/profile/getprofilepicture/${id}`,
        {
          responseType: "arraybuffer",
        }
      );
      const imageBase64 = `data:${
        response.headers["content-type"]
      };base64,${encode(response.data)}`;
      setProfilePicture(imageBase64);
    } catch (error) {
      setError("Error fetching profile picture.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfilePicture();
  }, []);

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 5], // Change this line
      quality: 1,
    });
    

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadProfilePicture = async () => {
    if (selectedImage) {
      setModalVisible(true); // Show modal when upload starts
      setUploadStatus("Uploading..."); // Set initial status
  
      const formData = new FormData();
      formData.append("file", {
        uri: selectedImage,
        name: "profile_picture.jpg",
        type: "image/jpeg",
      });
      formData.append("userId", user.id); // Append userId to formData
  
      try {
        const response = await axios.post(
          `http://${address}:3000/api/profile/uploadprofile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            },
          }
        );
  
        if (response.status === 200) {
          setUploadStatus("Image uploaded.");
          setSelectedImage(null);
          fetchProfilePicture(); // Fetch the updated profile picture
        } else {
          setUploadStatus("Upload failed.");
        }
      } catch (error) {
        setUploadStatus("Upload failed.");
      } finally {
        setTimeout(() => {
          setModalVisible(false); // Hide modal after upload completes
        }, 1500);
      }
    } else {
      setUploadStatus("No image selected to upload.");
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pictureNameContainer}>
        <Text style={styles.title}>Student Profile</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : profilePicture ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: profilePicture }} style={styles.image} />
          </View>
        ) : (
          <View style={styles.centered}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: profilePicture }} style={styles.image} />
            </View>
            <Text style={styles.errormsg}>
              No profile picture found, upload one.
            </Text>
          </View>
        )}
        <View style={styles.pictureButton}>
          <TouchableOpacity onPress={selectImage} style={styles.pictureButton}>
            <MaterialCommunityIcons
              name="image-edit-outline"
              size={24}
              color="blue"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pictureButton}
            onPress={uploadProfilePicture}
          >
            <Feather name="upload" size={24} color="blue" />
          </TouchableOpacity>
        </View>
        {selectedImage && (
          <Text style={styles.statusMessage}>Image selected for upload.</Text>
        )}
        {uploadStatus && (
          <Text style={styles.statusMessage}>{uploadStatus}</Text>
        )}
      </View>
      <View style={styles.detailsContainerWrapper}>
        <Text style={styles.DetailsHeadingText}>Student Details</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user.fullName}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Roll Number:</Text>
          <Text style={styles.value}>MUST/{user.username}/AJK</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Program:</Text>
          <Text style={styles.value}>{user.program}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Registered Courses:</Text>
          <Text style={styles.value}>{user.Assignedcourses?.length}</Text>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{uploadStatus}</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(250,250,250)",
    backgroundColor: "#fff",
  },
  pictureNameContainer: {
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? "14%" : "12%",
    marginBottom: 20,
    justifyContent: "center",
  },
  imageContainer: {
    padding: 2,
    resizeMode: "cover",
    borderColor: "blue",
    borderWidth: 0.6,
    borderRadius: 140,
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 140,
  },
  DetailsHeadingText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#143782",
    marginBottom: 10,
    alignSelf: "center",
  },
  pictureButton: {
    flexDirection: "row",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.dark,
  },
  detailsContainerWrapper: {
    marginHorizontal: 15,
  },
  detailsContainer: {
    flexDirection: "row",
    marginBottom: 14,
    padding: 15,
    borderRadius: 5,
    backgroundColor: Colors.light,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 0.13,
    borderColor: "gray",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: Colors.headingDarkColor,
  },
  value: {
    fontSize: 16,
    color: Colors.textDarkColor,
  },
  progressContainer: {
    width: "80%",
    alignSelf: "center",
    marginTop: 10,
  },
  progressText: {
    textAlign: "center",
    marginTop: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errormsg: {
    color: "red",
  },
  statusMessage: {
    color: "green",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
