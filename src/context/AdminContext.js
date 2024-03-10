import { createContext, useContext, useEffect, useState } from 'react';
import { getFetchData } from '../../utils/fetchAPI';
import { AppContext } from '../components/AppContext';
import useInterval from '../../utils/hooks/useInterval';
import NoInternet from '../components/NoInternet';
import LoadingModal from '../components/LoadingModal';
import { logoutUser } from '../../utils/storage';
import { allCurrencies } from '../database/data';
import ToastMessage from '../components/ToastMessage';

export const AdminContext = createContext();

const AdminContextComponent = ({ children }) => {
  const {
    isSessionTimedOut,
    walletRefresh,
    setIsLoading,
    isLoggedIn,
    setIsLoggedIn,
    setAppData,
    setCanChangeRole,
    setVerified,
  } = useContext(AppContext);
  const [adminData, setAdminData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFunc, setModalFunc] = useState();
  const [verifications, setVerifications] = useState([]);
  const [failToFetch, setFailToFetch] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setVerified(false);
      logoutUser();
      setIsLoggedIn(false);
      setAppData({});
      setCanChangeRole(false);
      allCurrencies.shift();
      ToastMessage('Your account has been logged in on another device');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminDatas = async () => {
    try {
      !adminData && !isSessionTimedOut && setIsLoading(true);
      const response = await getFetchData('admin');
      if (response.status === 200) {
        return setAdminData(response.data);
      }
      if (response.status === 401 && isLoggedIn) {
        return handleLogout();
      }
      throw new Error(response.data);
    } catch (err) {
      console.log('adminFetchError,', err.message);
      setFailToFetch(true);
    } finally {
      setIsLoading(false);
    }
  };

  useInterval(() => {
    fetchAdminDatas();
  }, 60000);

  useEffect(() => {
    fetchAdminDatas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletRefresh]);

  return (
    <AdminContext.Provider
      value={{
        adminData,
        setAdminData,
        modalOpen,
        setModalOpen,
        modalFunc,
        setModalFunc,
        verifications,
        setVerifications,
      }}>
      {adminData ? children : failToFetch ? <NoInternet /> : <LoadingModal />}
    </AdminContext.Provider>
  );
};

export default AdminContextComponent;
export const useAdminDataContext = () => useContext(AdminContext);
