import React, { useContext } from 'react';
import TransactionHistoryParams from '../pages/MenuPages/TransactionHistoryParams';
import Back from '../components/Back';
import { AppContext } from '../components/AppContext';
import { BackHandler, Modal } from 'react-native';

const PushNotificationNavigator = ({ notification, setIsFromNotification }) => {
  const { isSessionTimedOut } = useContext(AppContext);

  const handleClose = () => {
    setIsFromNotification(false);
    if (isSessionTimedOut) {
      BackHandler.exitApp();
    }
  };
  const handleNotification = async () => {
    setIsFromNotification(false);
  };

  const output = () => {
    switch (notification?.notificationType) {
      case 'transaction':
        return (
          <>
            <Back onPress={handleClose} />
            <TransactionHistoryParams
              route={{ params: notification.data }}
              isFromNotification={true}
            />
          </>
        );
      case 'notification':
        handleNotification();
        break;
      default:
        handleClose();
        break;
    }
  };
  return (
    <Modal visible={true} onRequestClose={handleClose}>
      {output()}
    </Modal>
  );
};

export default PushNotificationNavigator;
