import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import Logo from '../../assets/images/logoDark.svg';
import CustomBackground from '../components/CustomBackground';
import RegularText from './fonts/RegularText';
import {
  getIsLoggedIn,
  getSessionID,
  getToken,
  logoutUser,
} from '../../utils/storage';
import { AppContext } from './AppContext';
import { apiUrl, deleteFetchData, putFetchData } from '../../utils/fetchAPI';
import FaIcon from '@expo/vector-icons/FontAwesome';

const Splash = ({ navigation }) => {
  const {
    internetStatus,
    setInternetStatus,
    isChecking,
    setIsChecking,
    setIsLoggedIn,
    setAppData,
    vw,
  } = useContext(AppContext);

  useEffect(() => {
    console.log('splash');
  }, []);

  useEffect(() => {
    if (internetStatus === true) {
      const getDataFromStorage = async () => {
        setIsLoggedIn(await getIsLoggedIn());
        const sessionID = await getSessionID();
        await putFetchData(`user/session/${sessionID}`, {
          lastSeen: new Date(),
        });
        if (await getIsLoggedIn()) {
          const data = await getFetchData('user');
          await setAppData(data);
          if (!data || Object.entries(data).length === 0) {
            setIsLoggedIn(false);
            await deleteFetchData(`user/session/${sessionID}`);
            logoutUser();
            setIsLoggedIn(false);
          }
        }
        await navigation.replace('FirstPage');
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
      <CustomBackground />
      <View style={styles.logo}>
        <Logo width={vw * 0.7} height={vw * 0.14} />
        <RegularText
          style={{ ...styles.subText, fontSize: Math.round(vw * 0.035) }}>
          ...your favorite midnight pay pal
        </RegularText>
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    flex: 1.3,
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
  },
  reload: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default Splash;
