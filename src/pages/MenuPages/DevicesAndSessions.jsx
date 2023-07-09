import React, { useContext } from 'react';
import BoldText from '../../components/fonts/BoldText';
import PageContainer from '../../components/PageContainer';
import { StyleSheet, View } from 'react-native';
import { AppContext } from '../../components/AppContext';
import Profile from '../HomePages/Profile';
import RegularText from '../../components/fonts/RegularText';

const DevicesAndSessions = ({ navigation }) => {
  const { vh } = useContext(AppContext);

  const activeSession = [
    { deviceName: 'Iphone', deviceType: '', deviceID: '54842', lastSeen: '' },
    { deviceName: 'Xiaomi', deviceType: '', deviceID: '78931', lastSeen: '' },
  ];
  return (
    <PageContainer padding={true} justify={true}>
      <Profile navigation={navigation}>
        <View style={styles.DandC}>
          <BoldText style={styles.DandCHeader}>Devices and Sessions</BoldText>
          <View style={styles.card}>
            {activeSession.map(session => (
              <View
                key={session.deviceID}
                style={
                  activeSession.indexOf(session) + 1 !== activeSession.length
                    ? styles.session
                    : styles.sessionLast
                }>
                <BoldText>{session.deviceName}</BoldText>
                <RegularText>Last seen - {session.lastSeen}</RegularText>
              </View>
            ))}
          </View>
        </View>
      </Profile>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2 + '%',
    justifyContent: 'space-between',
  },
  DandC: {},
  DandCHeader: {
    fontSize: 16,
  },
  card: {
    backgroundColor: '#eee',
    marginVertical: 20,
    borderRadius: 10,
    paddingVertical: 20,
  },
  session: {
    height: 70,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 5,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  sessionLast: {
    height: 70,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 5,
    paddingTop: 15,
  },
});

export default DevicesAndSessions;
