import { createContext, useContext, useEffect, useState } from 'react';
import useFetchData from '../../utils/fetchAPI';
import { AppContext } from '../components/AppContext';

export const NotificationsContext = createContext();

const NotificationsContextComponent = ({ children }) => {
  const { getFetchData } = useFetchData();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
