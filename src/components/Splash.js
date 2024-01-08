import React, { useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
} from 'react-native';
import CustomBackground from '../components/CustomBackground';
import {
  getIsLoggedIn,
  getSessionID,
  getToken,
  logoutUser,
} from '../../utils/storage';
import { AppContext } from './AppContext';
import { apiUrl, deleteFetchData } from '../../utils/fetchAPI';
import FaIcon from '@expo/vector-icons/FontAwesome';

const Splash = ({ navigation }) => {
  const {
    internetStatus,
    setInternetStatus,
    isChecking,
    setIsChecking,
    setIsLoggedIn,
    setAppData,
    setIsAdmin,
    setCanChangeRole,
    setIsSessionTimedOut,
    setVerified,
    vw,
  } = useContext(AppContext);

  useEffect(() => {
    console.log('splash');
  }, []);

  useEffect(() => {
    if (internetStatus === true) {
      const getDataFromStorage = async () => {
        try {
          const isLoggedIn = await getIsLoggedIn();
          setIsLoggedIn(isLoggedIn);
          const sessionID = await getSessionID();
          if (isLoggedIn) {
            const data = await getFetchData('user?popup=true');
            setAppData(data || {});
            if (
              !data ||
              Object.entries(data).length === 0 ||
              typeof data === 'string'
            ) {
              setIsLoggedIn(false);
              await deleteFetchData(`user/session/${sessionID}`);
              logoutUser();
              setIsSessionTimedOut(false);
              return navigation.replace('FirstPage');
            }
            setVerified(data.verificationStatus || false);
            const response = await getFetchData('user/role');
            if (response.role === 'admin') {
              setIsAdmin(true);
              setCanChangeRole(true);
            }
          } else {
            setIsSessionTimedOut(false);
          }
          setTimeout(() => {
            navigation.replace('FirstPage');
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      };
      getDataFromStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internetStatus]);

  const getFetchData = async apiEndpoint => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const API_URL = `${apiUrl}/${apiEndpoint}`;
    const token = await getToken();

    try {
      const response = await fetch(API_URL, {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      clearTimeout(timeout);
      if (response.status >= 400) {
        return setAppData(false);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return "Couldn't connect to server";
    }
  };

  const handleReload = async () => {
    try {
      setIsChecking(true);
      getFetchData('network').then(data => {
        if (data.network === true) {
          setInternetStatus(true);
        }
        setIsChecking(false);
      });
    } catch {
      setIsChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo} />
      <Image
        source={require('../../assets/images/splash.png')}
        resizeMode="contain"
        style={{ width: vw * 1.2, height: vw * 1.2 }}
      />
      {internetStatus || isChecking ? (
        <ActivityIndicator
          color={'#1e1e1e'}
          style={styles.activity}
          size="large"
        />
      ) : (
        <Pressable style={styles.reload} onPress={handleReload}>
          <FaIcon name="refresh" size={35} color={'#1e1e1e'} />
        </Pressable>
      )}
      <CustomBackground />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  subText: {
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'right',
    fontSize: 14,
    paddingRight: 20,
    paddingTop: 5,
  },
  activity: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  reload: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default Splash;
