import { createContext, useContext, useEffect, useState } from 'react';
import useFetchData from '../../utils/fetchAPI';
import { AppContext } from '../components/AppContext';
import useInterval from '../../utils/hooks/useInterval';
import NoInternet from '../components/NoInternet';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

export const AdminContext = createContext();

const AdminContextComponent = ({ children }) => {
  const { getFetchData } = useFetchData();
  const { isSessionTimedOut, walletRefresh, setIsLoading } =
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
      {adminData ? children : failToFetch ? <NoInternet /> : <LoadingModal />}
    </AdminContext.Provider>
  );
};

export default AdminContextComponent;
export const useAdminDataContext = () => useContext(AdminContext);

const LoadingModal = () => {
  return (
    <Modal visible={true} animationType="fade" transparent>
      <Pressable style={styles.overlay} />
      <View style={styles.modalContainer}>
        <ActivityIndicator
          size={'large'}
          color={'#1e1e1e'}
          style={styles.modal}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 0.7,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 99,
  },
  modalContainer: {
    position: 'absolute',
    height: 100 + '%',
    width: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
