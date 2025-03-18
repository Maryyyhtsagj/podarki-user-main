import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export const getFcmToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
    console.log(fcmToken);
    return fcmToken;
  } catch (error) {
    alert(error?.message);
  }
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    getFcmToken();
  }
}

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    console.log('background state', remoteMessage.notification);
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        console.log('remote message', remoteMessage.notification);
      }
    });
};

const postFcmToken = async token => {
  let checkToken = await getFcmToken();
  console.log(' await Fcm Token:', checkToken);

  try {
    const res = await axios.post(
      'http://79.174.80.241:3001/api/users/fcm',
      {
        is_seller: 'true',
        token: checkToken,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('res of users/fcm', res.data);
  } catch (e) {
    if (e.response && e.response.data && e.response.data.message) {
      console.log('Error message:', e.response.data.message);
    } else {
      console.log('Error:', e);
    }
  }
};
