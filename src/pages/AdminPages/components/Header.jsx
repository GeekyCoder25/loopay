import React, { useContext, useEffect } from 'react';
import BarIcon from '../../../../assets/images/bar.svg';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppContext } from '../../../components/AppContext';
import BoldText from '../../../components/fonts/BoldText';
import UserIcon from '../../../components/UserIcon';
import Bell from '../../../../assets/images/bell.svg';
import BellActive from '../../../../assets/images/bellActive.svg';
import { useAdminDataContext } from '../../../context/AdminContext';

const Header = ({ navigation }) => {
  const { appData } = useContext(AppContext);
  const { adminData } = useAdminDataContext();
  const fullName = appData.userProfile.fullName;
  const unReadNotifications = adminData.unReadNotifications;
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.openDrawer()}>
        <BarIcon />
      </Pressable>
      <View style={styles.headerIcons}>
        <BoldText>{fullName}</BoldText>
        <Pressable
          onPress={() => navigation.navigate('ProfileNavigator')}
          style={styles.userImageContainer}>
          <UserIcon />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Notifications')}>
          {unReadNotifications ? <BellActive /> : <Bell />}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
    gap: 10,
  },
});
export default Header;
