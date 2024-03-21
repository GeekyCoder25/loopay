import { createContext, useContext, useEffect, useState } from 'react';
import { AppContext } from '../components/AppContext';
import useFetchData from '../../utils/fetchAPI';

export const RequestFundsContext = createContext();

const NotificationsContextComponent = ({ children }) => {
  const { getFetchData } = useFetchData();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletRefresh]);

  return (
    <RequestFundsContext.Provider value={{ requestFunds, setRequestFunds }}>
      {children}
    </RequestFundsContext.Provider>
  );
};

export default NotificationsContextComponent;

export const useRequestFundsContext = () => useContext(RequestFundsContext);
