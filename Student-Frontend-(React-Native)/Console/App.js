import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { Platform, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { addNotificationList } from './store/authSlice';
import { registerForPushNotificationsAsync, handleIncomingNotification } from './notifications';
import {
  Login,
  SuccessLoginPage,
  Courses,
  Assignments,
  ClassProceedings,
  CourseContents,
  Results,
  FeeChallan,
  CourseInfo,
  ClassProceedingSubjectInfo,
  CourseContentsSubject,
  Notification,
  TimeTable,
  CourseResultSubject,
  CourseResult,
  EnrollCoursesScreen,
  CourseHistory,
  CourseHistorySubject
} from './screens';
import { store } from './store';
import *  as NavigationBar from "expo-navigation-bar";
import { Colors } from './Colos';
const { Navigator, Screen } = createNativeStackNavigator();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

 function Main() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    Platform.OS=='android' ? NavigationBar.setBackgroundColorAsync("#000") : "";
    
  }, []);
  useEffect(() => {
    const registerForPushNotifications = async () => {
      await registerForPushNotificationsAsync();

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        handleIncomingNotification(notification, dispatch, addNotificationList);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        const url = response.notification.request.content.data.url;
        if (url) {
          Linking.openURL(url);
        }
      });
    };

    registerForPushNotifications();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(async response => {
      await handleIncomingNotification(response.notification, dispatch, addNotificationList);
    });

    return () => {
      Notifications.removeNotificationSubscription(backgroundSubscription);
    };
  }, []);

  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}>
        {isLoggedIn ? (
          <Screen name="SuccessLoginPage" component={SuccessLoginPage} />
        ) : (
          <Screen name="Login" component={Login} />
        )}
        <Screen name="Courses" component={Courses} />
        <Screen name="CourseContents" component={CourseContents} />
        <Screen name="ClassProceedings" component={ClassProceedings} />
        <Screen name="Assignments" component={Assignments} />
        <Screen name="Results" component={Results} />
        <Screen name="FeeChallan" component={FeeChallan} />
        <Screen name="CourseInfo" component={CourseInfo} />
        <Screen name="Notification" component={Notification} />
        <Screen name="TimeTable" component={TimeTable} />
        <Screen name="EnrollCoursesScreen" component={EnrollCoursesScreen} />
        <Screen name="CourseContentsSubject" component={CourseContentsSubject} />
        <Screen name="ClassProceedingSubjectInfo" component={ClassProceedingSubjectInfo} />
        <Screen name="CourseResult" component={CourseResult} />
        <Screen name="CourseResultSubject" component={CourseResultSubject} />
        <Screen name="CourseHistory" component={CourseHistory} />
        <Screen name="CourseHistorySubject" component={CourseHistorySubject} />
      </Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}


export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}