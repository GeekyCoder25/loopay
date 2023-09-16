import BackArrow from '../../assets/images/backArrow.svg';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { hideTabRoutes } from '../config/config';
import { useContext, useEffect } from 'react';
import RegularText from './fonts/RegularText';
import { AppContext } from './AppContext';

const Back = ({ goBack, onPress, route }) => {
  const { isAdmin, setIsAdmin, canChangeRole, setShowTabBar } =
    useContext(AppContext);

  useEffect(() => {
    const decision = () => {
      if (hideTabRoutes.includes(route?.name)) return false;
    };
    const status = decision();
    Platform.OS === 'android'
      ? setShowTabBar(status === false ? status : true)
      : setTimeout(() => {
          setShowTabBar(status === false ? status : true);
        }, 300);
  }, [route?.name, setShowTabBar]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={!onPress ? () => goBack() : onPress}
        style={styles.container}>
        <BackArrow />
        <Text style={styles.text}>Back</Text>
      </Pressable>
      {canChangeRole && (
        <Pressable style={styles.switch} onPress={() => setIsAdmin(true)}>
          <RegularText style={styles.switchText}>
            Switch to {isAdmin ? 'User' : 'Admin'}
          </RegularText>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    padding: 8,
  },
  text: {
    fontFamily: 'OpenSans-600',
    fontSize: 18,
  },
});
export default Back;
