import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { BackBtn } from "../../components";
import { clearNotificationsList } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addNotificationList } from "../../store/authSlice";

const Notification = ({ navigation }) => {
  const notificationsList = useSelector(
    (state) => state.auth.notificationsList
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const item = await AsyncStorage.getItem("notification");
        if (item) {
          dispatch(addNotificationList(JSON.parse(item)));
        }
      } catch (error) {
        console.error("Error retrieving login status:", error);
      }
    };
    fetchData();
  }, []);

  const RenderFunc = (item) => {
    if (!item) {
      return null;
    }
    if (!item.request) {
      return null;
    }
    if (!item.request.content) {
      return null;
    }
    const timestamp = item.date;
    const date = new Date(timestamp * 1000);
    const formattedDate = date.toLocaleString();

    return (
        <View style={styles.renderlistContiner}>
          <View
            style={{
              backgroundColor: "#f3f3f3",
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderRadius: 150,
              alignSelf: "center",
            }}
          >
            <Entypo name="notification" size={30} color="orange" />
          </View>
          <View style={{ marginHorizontal: 7,flex:1 }}>
            <View style={{ flexDirection: "row", padding: 5 }}>
              <Text
                style={{ fontWeight: "800", color: Colors.headingDarkColor }}
              >
                Date:{" "}
              </Text>
              <Text
                style={{
                  flexWrap: "wrap",
                  width: "80%",
                  color: "#222",
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                {formattedDate}
              </Text>
            </View>
            <View style={{ flexDirection: "row", padding: 5 }}>
              <Text
                style={{ fontWeight: "800", color: Colors.headingDarkColor }}
              >
                Desciption:{" "}
              </Text>
              <Text
                style={{
                  flexWrap: "wrap",
                  width: "80%",
                  color: "#222",
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                {item.request.content.body}
              </Text>
            </View>
          </View>
        </View>
    );
  };
  const handleCLearfunct = () => {
    AsyncStorage.removeItem("notification");
    dispatch(clearNotificationsList());
  };

  return (
    <SafeAreaView style={{ flex: 1,  }}>
      <BackBtn onClick={() => navigation.pop()} />
      <Text style={styles.ScreenHeadingText}>Notifications</Text>
      {notificationsList.length > 0 ? (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginHorizontal: 20 }}
            onPress={() => handleCLearfunct()}
          >
            <Text
              style={{
                color: "blue",
                fontWeight: "900",
                fontSize: 17,
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              Clear
            </Text>
          </TouchableOpacity>
          <FlatList
            data={notificationsList[0]}
            renderItem={({ item }) => RenderFunc(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      ) : (
        <View style={styles.renderlistContiner}>
          <Text>There are no Notifications right at the moment</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  ScreenHeadingText: {
    fontWeight: "900",
    fontSize: 25,
    color: "#3f3f3f",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 12,
  },
  renderlistContiner: {
    backgroundColor: "#fff",
    flexDirection: "row",
    flex: 0,
    marginBottom: 8,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    borderLeftWidth:3,
    borderLeftColor:"orange",
    borderRightWidth:3,
    borderRightColor:"orange"
  },
});
