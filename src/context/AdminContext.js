import { createContext, useContext, useEffect, useState } from 'react';
import { getFetchData } from '../../utils/fetchAPI';
import { AppContext } from '../components/AppContext';
import useInterval from '../../utils/hooks/useInterval';

export const AdminContext = createContext();

const AdminContextComponent = ({ children }) => {
  const { isSessionTimedOut, setIsLoading, walletRefresh } =
    useContext(AppContext);
  const [adminData, setAdminData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFunc, setModalFunc] = useState();

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
      }}>
      {adminData && children}
    </AdminContext.Provider>
  );
};

export default AdminContextComponent;
export const useAdminDataContext = () => useContext(AdminContext);
