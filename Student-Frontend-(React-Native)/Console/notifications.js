import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: true, // Ensure sound is enabled
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Permission not granted to get push token for push notification!");
    return;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    alert("Project ID not found");
    return;
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    return pushTokenString;
  } catch (e) {
    alert(`Error getting push token: ${e}`);
  }
};

export const handleIncomingNotification = async (notification, dispatch, addNotificationList) => {
  try {
    dispatch(addNotificationList(notification));

    const storedNotifications = await AsyncStorage.getItem('notification');
    let notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    notifications.unshift(notification);
    await AsyncStorage.setItem('notification', JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notification details:', error);
  }
};
