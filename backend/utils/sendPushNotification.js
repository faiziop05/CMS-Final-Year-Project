const sendPushNotification = async (expoPushToken, title, body) => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data: { title, body },
    };
  console.log(expoPushToken,title,body);
    try {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      console.log(`Notification sent to ${expoPushToken}`);
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  };
  
  export default sendPushNotification;
  