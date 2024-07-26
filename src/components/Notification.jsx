import { useContext, useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';
import useFetchData from '../../utils/fetchAPI';
import { getPushNotification, setPushNotification } from '../../utils/storage';
import { AppContext } from './AppContext';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { useNavigation } from '@react-navigation/native';

export const usePushNotification = () => {
  const { postFetchData } = useFetchData();
  const { isLoggedIn } = useContext(AppContext);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      try {
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }

        if (Device.isDevice) {
          const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;

          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            return Toast.show({
              type: 'error',
              text1: 'Permission Error',
              text2: 'Failed to enable permission for push notification!',
            });
          }
          const token = await Notifications.getExpoPushTokenAsync();

          Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
            }),
          });

          return token.data;
        }
      } catch (error) {
        console.log(error);
      }
    };

    const sendTokenAPI = async token => {
      try {
        const response = await postFetchData('user/push-token', {
          token,
        });
        if (response.status === 200) {
          setPushNotification(true);
        }
      } catch (err) {
        console.log('err', err);
      }
    };

    if (isLoggedIn) {
      registerForPushNotificationsAsync().then(async token => {
        if ((await getPushNotification()) !== true) {
          sendTokenAPI(token);
        }
      });
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        try {
          if (notification) {
            const { data, title, body } = notification.request.content;
            switch (data.notificationType) {
              case 'transaction':
                if (data.data.transactionType === 'credit') {
                  Toast.show({
                    type: 'success',
                    text1: title,
                    text2: body,
                    position: Platform.OS === 'ios' ? 'bottom' : 'top',
                  });
                } else if (data.data.transactionType === 'debit') {
                  Toast.show({
                    type: 'error',
                    text1: title,
                    text2: body,
                    position: Platform.OS === 'ios' ? 'bottom' : 'top',
                  });
                }
                break;
              case 'notification':
                Toast.show({
                  type: 'success',
                  text1: title,
                  text2: body,
                  position: Platform.OS === 'ios' ? 'bottom' : 'top',
                });
                break;
              default:
                break;
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        const notification = response.notification.request.content.data;
        switch (notification.notificationType) {
          case 'transaction':
            navigation.navigate('TransactionHistoryDetails', notification.data);
            break;
          case 'notification':
            navigation.navigate('Notification', notification);
            break;
          default:
            break;
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);
};
