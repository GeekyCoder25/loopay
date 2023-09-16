import { createContext, useContext, useEffect, useState } from 'react';
import { getFetchData } from '../../utils/fetchAPI';
import { AppContext } from '../components/AppContext';

export const NotificationsContext = createContext();

const NotificationsContextComponent = ({ children }) => {
  const { walletRefresh } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      const response = await getFetchData('user/notification');
      if (response.status === 200) {
        setNotifications(response.data);
      }
    };
    getNotifications();
  }, [walletRefresh]);

  useEffect(() => {
    setUnread(
      notifications.filter(notification => notification.status === 'unread'),
    );
  }, [notifications]);
  return (
    <NotificationsContext.Provider
      value={{ notifications, setNotifications, unread }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContextComponent;

export const useNotificationsContext = () => useContext(NotificationsContext);
