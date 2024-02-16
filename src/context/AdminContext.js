import { createContext, useContext, useEffect, useState } from 'react';
import { getFetchData } from '../../utils/fetchAPI';
import { AppContext } from '../components/AppContext';
import useInterval from '../../utils/hooks/useInterval';
import NoInternet from '../components/NoInternet';
import LoadingModal from '../components/LoadingModal';

export const AdminContext = createContext();

const AdminContextComponent = ({ children }) => {
  const { isSessionTimedOut, setIsLoading, walletRefresh } =
    useContext(AppContext);
  const [adminData, setAdminData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFunc, setModalFunc] = useState();
  const [verifications, setVerifications] = useState([]);
  const [failToFetch, setFailToFetch] = useState(false);

  const fetchAdminDatas = async () => {
    try {
      !adminData && !isSessionTimedOut && setIsLoading(true);
      const response = await getFetchData('admin');
      if (response.status === 200) {
        return setAdminData(response.data);
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
      {adminData ? children : failToFetch ? <NoInternet /> : <></>}
    </AdminContext.Provider>
  );
};

export default AdminContextComponent;
export const useAdminDataContext = () => useContext(AdminContext);
