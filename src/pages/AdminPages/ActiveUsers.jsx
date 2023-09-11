/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { Pressable, StyleSheet, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import { useAdminDataContext } from '../../context/AdminContext';

const ActiveUsers = ({ route }) => {
  const [defaultTab, setDefaulTab] = useState(route.params.defaultTab);
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const { adminData } = useAdminDataContext();

  useEffect(() => {
    setDefaulTab(route.params.defaultTab);
    setActiveUsers([]);
    setInactiveUsers([]);

    const checkSameDateAndTime = sessionTimestamp => {
      if (sessionTimestamp) {
        const sessionDate = new Date(sessionTimestamp);
        const currentDate = new Date();
        const timeDifference = currentDate - sessionDate;
        const minutesDifference = timeDifference / (1000 * 60);

        return (
          sessionDate.toLocaleDateString() ===
            currentDate.toLocaleDateString() &&
          sessionDate.getHours() === currentDate.getHours() &&
          (sessionDate.getMinutes() === currentDate.getMinutes() ||
            minutesDifference <= 5)
        );
      }
    };

    adminData.lastActiveSessions.forEach(userSession => {
      const sessionTimestamp = userSession.sessions[0].lastSeen;
      if (checkSameDateAndTime(sessionTimestamp)) {
        setActiveUsers(prev => [...prev, userSession]);
      } else {
        setInactiveUsers(prev => [...prev, userSession]);
      }
    });
  }, [adminData, route.params.defaultTab]);

  return (
    <PageContainer scroll>
      <View>
        <Pressable
          onPress={() => setDefaulTab('active')}
          style={{
            backgroundColor: defaultTab === 'active' ? '#eee' : '#fff',
          }}>
          <BoldText>Active Users</BoldText>
        </Pressable>
        <Pressable
          onPress={() => setDefaulTab('inactive')}
          style={{
            backgroundColor: defaultTab === 'inactive' ? '#eee' : '#fff',
          }}>
          <BoldText>Inactive Users</BoldText>
        </Pressable>
      </View>

      {defaultTab === 'active' ? (
        <View>
          {activeUsers.map(user => (
            <User key={user.email} user={user} />
          ))}
        </View>
      ) : (
        <View>
          {inactiveUsers.map(user => (
            <User key={user.email} user={user} />
          ))}
        </View>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({});

export default ActiveUsers;

const User = ({ user }) => {
  const { email } = user;
  return (
    <View style={styles.user}>
      <BoldText>{email}</BoldText>
    </View>
  );
};
