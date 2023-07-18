import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Logo from '../../assets/images/logoDark.svg';
import CustomBackground from '../components/CustomBackground';
import RegularText from './fonts/RegularText';
import { getIsLoggedIn, getToken } from '../../utils/storage';
import { AppContext } from './AppContext';
import { apiUrl } from '../../utils/fetchAPI';
const Splash = ({ navigation }) => {
  const { internetStatus, setIsLoggedIn, setAppData, vw } =
    useContext(AppContext);

  useEffect(() => {
    console.log('splash');
  }, []);

  useEffect(() => {
    if (internetStatus === true) {
      const getDataFromStorage = async () => {
        setIsLoggedIn((await getIsLoggedIn()) === 'true');
        if ((await getIsLoggedIn()) === 'true') {
          const data = await getFetchData('user');
          await setAppData(data);
          if (!data || Object.entries(data).length === 0) {
            return setIsLoggedIn(false);
          }
        }
        await navigation.replace('FirstPage');
      };
      getDataFromStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internetStatus, navigation]);

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
  return (
    <View style={styles.container}>
      <CustomBackground />
      <View style={styles.logo}>
        <Logo width={`${vw}`} />
        <RegularText style={styles.subText}>
          ...your favorite midnight pay pal
        </RegularText>
      </View>
      <ActivityIndicator
        color={'#1e1e1e'}
        style={styles.activity}
        size="large"
      />
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
    flex: 1,
    justifyContent: 'flex-end',
  },
  subText: {
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'right',
    fontSize: 12,
    paddingRight: 25 + '%',
    paddingTop: 5,
  },
  activity: {
    flex: 1,
  },
});
export default Splash;
