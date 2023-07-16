import React, { useEffect, useState } from 'react';
import BoldText from '../../components/fonts/BoldText';
import { StyleSheet, View } from 'react-native';
import Profile from '../HomePages/Profile';
import RegularText from '../../components/fonts/RegularText';
import { getFetchData, putFetchData } from '../../../utils/fetchAPI';
import { getSessionID } from '../../../utils/storage';

const DevicesAndSessions = ({ navigation }) => {
  const [activeSessions, setActiveSessions] = useState(null);

  useEffect(() => {
    const getSessions = async () => {
      const sessionID = await getSessionID();
      await putFetchData(`user/session/${sessionID}`, {
        lastSeen: new Date(),
      });
      const fetchedResult = await getFetchData('user/session');
      const data = fetchedResult.data;
      fetchedResult.status === 200 && setActiveSessions(data.sessions);
    };
    getSessions();
  }, []);
  return (
    <Profile navigation={navigation}>
      <View style={styles.DandC}>
        <BoldText style={styles.DandCHeader}>Devices and Sessions</BoldText>
        {activeSessions?.length > 0 && (
          <View style={styles.card}>
            {activeSessions.map(session => (
              <Session
                key={session.deviceID}
                session={session}
                activeSessions={activeSessions}
              />
            ))}
          </View>
        )}
      </View>
    </Profile>
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
    marginVertical:  20,
    borderRadius: 10,
    paddingVertical: 20,
  },
  session: {
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 5,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  sessionLast: {
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 5,
    paddingTop: 15,
  },
  lastSeen: {
    color: '#868585',
  },
  now: {
    color: '#006E53',
    fontSize: 15,
  },
  lastSeenText: {
    color: '#525252',
    fontSize: 15,
  },
});

export default DevicesAndSessions;

export const Session = ({ session, activeSessions }) => {
  const [lastSeen, setLastSeen] = useState(session.lastSeen);

  useEffect(() => {
    new Date(session.lastSeen).toLocaleDateString() ===
      new Date().toLocaleDateString() &&
    new Date(session.lastSeen).getHours() === new Date().getHours() &&
    new Date(session.lastSeen).getMinutes() === new Date().getMinutes()
      ? setLastSeen('NOW')
      : setLastSeen(
          `${new Date(session.lastSeen).toLocaleDateString()} ${new Date(
            session.lastSeen,
          ).toLocaleTimeString()}`,
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View
      style={
        activeSessions.indexOf(session) + 1 !== activeSessions.length
          ? styles.session
          : activeSessions.length === 1
          ? { ...styles.sessionLast, paddingTop: 0 }
          : styles.sessionLast
      }>
      <BoldText>
        {session.deviceManufacturer} - {session.deviceName}
      </BoldText>
      <RegularText>
        {session.osName} {session.osVersion}
      </RegularText>
      <RegularText style={styles.lastSeen}>
        Last seen <BoldText>-</BoldText>{' '}
        <BoldText style={lastSeen === 'NOW' ? styles.now : styles.lastSeenText}>
          {lastSeen}
        </BoldText>{' '}
      </RegularText>
    </View>
  );
};
