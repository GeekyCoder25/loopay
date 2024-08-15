import React, { useEffect, useState } from 'react';
import BoldText from '../../components/fonts/BoldText';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Profile from '../HomePages/Profile';
import RegularText from '../../components/fonts/RegularText';
import useFetchData from '../../../utils/fetchAPI';

const DevicesAndSessions = ({ navigation }) => {
  const { getFetchData } = useFetchData();
  const [activeSessions, setActiveSessions] = useState(null);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  useEffect(() => {
    const getSessions = async () => {
      const fetchedResult = await getFetchData('user/session');
      const data = fetchedResult.data;
      fetchedResult.status === 200 && setActiveSessions(data.sessions);
      setIsLocalLoading(false);
    };
    getSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Profile navigation={navigation}>
      <View style={styles.DandC}>
        <BoldText style={styles.DandCHeader}>Devices and Sessions</BoldText>
        {!isLocalLoading ? (
          activeSessions?.length > 0 && (
            <View style={styles.card}>
              {activeSessions.map(session => (
                <Session
                  key={session.deviceID}
                  session={session}
                  activeSessions={activeSessions}
                />
              ))}
            </View>
          )
        ) : (
          <ActivityIndicator
            size={'large'}
            color={'#1e1e1e'}
            style={styles.loading}
          />
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
    marginVertical: 20,
    borderRadius: 10,
    // paddingVertical: 20,
  },
  loading: {
    marginTop: 15 + '%',
  },
  session: {
    // height: 100,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 5,
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  sessionLast: {
    // height: 100,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 5,
    paddingVertical: 20,
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

  const checkSameDateAndTime = sessionTimestamp => {
    const sessionDate = new Date(sessionTimestamp);
    const currentDate = new Date();
    const timeDifference = currentDate - sessionDate;
    const minutesDifference = timeDifference / (1000 * 60);

    return (
      sessionDate.toLocaleDateString() === currentDate.toLocaleDateString() &&
      sessionDate.getHours() === currentDate.getHours() &&
      (sessionDate.getMinutes() === currentDate.getMinutes() ||
        minutesDifference <= 5)
    );
  };

  useEffect(() => {
    checkSameDateAndTime(session.lastSeen)
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
          : styles.sessionLast
      }>
      <BoldText>
        {session.deviceManufacturer} - {session.deviceName}
      </BoldText>
      <RegularText>{session.deviceModel}</RegularText>
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
