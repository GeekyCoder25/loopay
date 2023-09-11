import { createContext, useContext, useEffect, useState } from 'react';
import { getFetchData } from '../../utils/fetchAPI';
import { AppContext } from '../components/AppContext';

export const RequestFundsContext = createContext();

const NotificationsContextComponent = ({ children }) => {
  const { walletRefresh } = useContext(AppContext);
  const [requestFunds, setRequestFunds] = useState([]);

  useEffect(() => {
    const getRefreshFunds = async () => {
      const response = await getFetchData('user/request');
      if (response.status === 200) {
        setRequestFunds(response.data);
      }
    };
    getRefreshFunds();
  }, [walletRefresh]);

  return (
    <RequestFundsContext.Provider value={{ requestFunds, setRequestFunds }}>
      {children}
    </RequestFundsContext.Provider>
  );
};

export default NotificationsContextComponent;

export const useRequestFundsContext = () => useContext(RequestFundsContext);
