/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useAdminDataContext } from '../../context/AdminContext';
import RegularText from '../../components/fonts/RegularText';
import ChevronDown from '../../../assets/images/drop-down.svg';
import { ScrollView } from 'react-native-gesture-handler';
import UserIcon from '../../components/UserIcon';
import { allCurrencies } from '../../database/data';
import { useNavigation } from '@react-navigation/native';
import { addingDecimal } from '../../../utils/AddingZero';
import BackIcon from '../../../assets/images/backArrrow.svg';
import SortIcon from '../../../assets/images/sort.svg';

const Users = ({ navigation }) => {
  const { adminData } = useAdminDataContext();
  const { users, userDatas } = adminData;
  const [selectedTab, setSelectedTab] = useState(1);
  const [sortStatus, setSortStatus] = useState('date');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);

  const sortMethods = ['date', 'status'];

  function sortFunc(a, b) {
    const date1 = a.createdAt;
    const date2 = b.createdAt;
    let comparison = 0;

    if (date1 > date2) {
      comparison = -1;
    } else if (date1 < date2) {
      comparison = 1;
    }
    return comparison;
  }

  useEffect(() => {
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
    setActiveUsers([]);
    setInactiveUsers([]);
    adminData.lastActiveSessions.forEach(session => {
      const userSession = session.sessions[0]?.lastSeen;
      if (checkSameDateAndTime(userSession)) {
        setActiveUsers(prev => [
          ...prev,
          users.find(user => user.email === session.email),
        ]);
      } else {
        setInactiveUsers(prev => [
          ...prev,
          users.find(user => user.email === session.email),
        ]);
      }
    });
  }, [adminData, users]);

  return (
    <PageContainer style={styles.body}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <BackIcon />
          <BoldText style={styles.headerText}>All Users</BoldText>
        </Pressable>
        <BoldText style={styles.headerText}>{users.length}</BoldText>
      </View>
      <View style={styles.bodySelectors}>
        <Pressable
          style={{
            ...styles.bodySelector,
            backgroundColor: selectedTab ? '#525252' : '#d0d1d2',
          }}
          onPress={() => setSelectedTab(1)}>
          <BoldText
            style={{
              color: selectedTab ? '#fff' : '#1E1E1E',
            }}>
            Active Users
          </BoldText>
        </Pressable>
        <Pressable
          style={{
            ...styles.bodySelector,
            backgroundColor: !selectedTab ? '#525252' : '#d0d1d2',
          }}
          onPress={() => setSelectedTab(0)}>
          <BoldText
            style={{
              color: !selectedTab ? '#fff' : '#1E1E1E',
            }}>
            Blocked Users
          </BoldText>
        </Pressable>
      </View>

      {selectedTab ? (
        <>
          <View style={styles.headerSub}>
            <BoldText style={styles.headerSubText}>User</BoldText>
            <Pressable
              style={styles.headerSubRight}
              onPress={() => setModalOpen(true)}>
              <BoldText style={styles.headerSubTextRight}>
                {sortStatus}
              </BoldText>
              <SortIcon />
            </Pressable>
          </View>
          <ScrollView style={styles.users}>
            {sortStatus === 'date' &&
              users
                .filter(user => user.status === 'active')
                .sort(sortFunc)
                .map(user => (
                  <User
                    key={user._id}
                    user={user}
                    userData={userDatas.find(
                      userData => user.email === userData.email,
                    )}
                  />
                ))}
            {sortStatus === 'status' &&
              activeUsers
                .filter(user => user.status === 'active')
                .sort(sortFunc)
                .map(user => (
                  <User
                    key={user._id}
                    user={user}
                    userData={userDatas.find(
                      userData => user.email === userData.email,
                    )}
                    activeStatus
                  />
                ))}
            {sortStatus === 'status' &&
              inactiveUsers
                .filter(user => user.status === 'active')
                .sort(sortFunc)
                .map(user => (
                  <User
                    key={user._id}
                    user={user}
                    userData={userDatas.find(
                      userData => user.email === userData.email,
                    )}
                    activeStatus
                  />
                ))}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={styles.headerSub}>
            <BoldText style={styles.headerSubText}>User</BoldText>
            <View style={styles.headerSubRight}>
              <BoldText>
                <BoldText style={styles.headerSubTextRight}>Blocked </BoldText>
                date
              </BoldText>
            </View>
          </View>
          <ScrollView style={styles.users}>
            {users
              .filter(user => user.status === 'blocked')
              .map(user => (
                <User
                  key={user._id}
                  user={user}
                  userData={userDatas.find(
                    userData => user.email === userData.email,
                  )}
                />
              ))}
          </ScrollView>
        </>
      )}
      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setModalOpen(prev => !prev)}>
        <Pressable
          style={styles.overlay}
          onPress={() => setModalOpen(prev => !prev)}>
          <View style={styles.modal}>
            <View style={styles.modal}>
              <View style={styles.modal}>
                {sortMethods.map(status => (
                  <Pressable
                    key={status}
                    style={styles.status}
                    onPress={() => {
                      setSortStatus(status);
                      setModalOpen(false);
                    }}>
                    <BoldText style={styles.statusText}>{status}</BoldText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  body: {},
  header: {
    paddingHorizontal: 5 + '%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerText: {
    fontSize: 20,
  },
  bodySelectors: {
    flexDirection: 'row',
    alignItems: 'space-between',
  },
  bodySelector: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  selectedTab: {
    backgroundColor: 'red',
  },
  headerSub: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  headerSubText: {
    flex: 1,
    paddingLeft: 5 + '%',
  },
  headerSubRight: {
    flex: 1,
    paddingLeft: 30 + '%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  headerSubTextRight: {
    textTransform: 'capitalize',
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.7,
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: 100 + '%',
    width: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 100 + '%',
    maxWidth: 300,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  status: {
    width: 95 + '%',
    padding: 20,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  statusText: {
    textTransform: 'capitalize',
  },
  users: {
    gap: 10,
  },
  userExpanded: {
    paddingHorizontal: 5 + '%',
    borderBottomColor: '#525252',
    borderBottomWidth: 0.3,
    paddingVertical: 15,
  },
  user: {
    flexDirection: 'row',
    gap: 15,
  },
  active: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#006e53',
    marginTop: 7,
  },
  inActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#bbbbbb',
    marginTop: 7,
  },
  blocked: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ED4C5C',
    marginTop: 7,
  },
  fullName: {
    flex: 1.5,
    fontSize: 18,
    color: '#525252',
    fontFamily: 'OpenSans-600',
  },
  date: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15 + '%',
  },
  online: {
    color: '#006E53',
    fontStyle: 'italic',
    fontWeight: '700',
    fontSize: 16,
  },
  offline: {
    color: '#525252',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
  },
  rowKey: {
    flex: 1,
  },
  rowValue: {
    flex: 1,
  },
  history: {
    backgroundColor: '#eee',
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopColor: '#868585',
    borderTopWidth: 0.2,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#000',
    borderRadius: 25,
  },
  historyContent: {
    flex: 1,
    gap: 3,
  },
  creditAmount: {
    color: '#006E53',
    fontSize: 16,
    marginRight: 5,
  },
  debitAmount: {
    color: 'red',
    fontSize: 16,
    marginRight: 5,
  },
});
export default Users;

const User = ({ user, userData, activeStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState();
  const { adminData } = useAdminDataContext();

  const checkSameDateAndTime = sessionTimestamp => {
    if (sessionTimestamp) {
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
    }
  };
  useEffect(() => {
    adminData.lastActiveSessions
      .filter(session => session.email === user.email)
      .forEach(userSession => {
        userSession = userSession.sessions[0]?.lastSeen;
        checkSameDateAndTime(userSession) && setStatus(true);
      });
  }, [adminData.lastActiveSessions, user.email]);

  return (
    <View style={styles.userExpanded}>
      <View style={styles.user}>
        {user.status === 'blocked' ? (
          <View style={styles.blocked} />
        ) : status ? (
          <View style={styles.active} />
        ) : (
          <View style={styles.inActive} />
        )}
        <RegularText style={styles.fullName}>
          {userData.userProfile.fullName}
        </RegularText>
        <View style={styles.date}>
          {activeStatus ? (
            status ? (
              <BoldText style={styles.online}>Online</BoldText>
            ) : (
              <RegularText style={styles.offline}>Offline</RegularText>
            )
          ) : user.status === 'blocked' ? (
            <BoldText>{new Date(user.blockedAt).toLocaleDateString()}</BoldText>
          ) : (
            <BoldText>{new Date(user.createdAt).toLocaleDateString()}</BoldText>
          )}
          <Pressable
            onPress={() => setIsExpanded(prev => !prev)}
            style={{
              transform: [{ rotateZ: isExpanded ? '180deg' : '0deg' }],
            }}>
            <ChevronDown />
          </Pressable>
        </View>
      </View>
      {isExpanded && (
        <View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Email</BoldText>
            <RegularText style={styles.rowValue}>{userData.email}</RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Phone Number</BoldText>
            <RegularText style={styles.rowValue}>
              {userData.userProfile.phoneNumber}
            </RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Role</BoldText>
            <RegularText style={styles.rowValue}>{user.role}</RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Account Type</BoldText>
            <RegularText style={styles.rowValue}>
              {userData.accountType}
            </RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Pin set</BoldText>
            <RegularText style={styles.rowValue}>
              {userData.pin ? 'true' : 'false'}
            </RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Tag Name</BoldText>
            <RegularText style={styles.rowValue}>
              {userData.tagName || userData.userProfile.userName}
            </RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Referral Code</BoldText>
            <RegularText style={styles.rowValue}>
              {userData.referralCode}
            </RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>User Photo</BoldText>
            <View style={styles.rowValue}>
              <UserIcon uri={userData.photoURL} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const Transaction = ({ transaction }) => {
  const navigation = useNavigation();
  const {
    senderName,
    receiverName,
    senderPhoto,
    receiverPhoto,
    amount,
    transactionType,
    createdAt,
    currency,
  } = transaction;

  const date = new Date(createdAt);
  const historyTime = convertTo12HourFormat(
    `${date.getHours()}:${date.getMinutes()}`,
  );

  function convertTo12HourFormat(time24) {
    let [hours, minutes] = time24.split(':');
    let period = 'AM';

    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) {
        hours -= 12;
      }
    }

    if (hours === '00') {
      hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
  }

  const currencySymbol = allCurrencies.find(
    id => currency === id.currency,
  )?.symbol;

  return transactionType?.toLowerCase() === 'credit' ? (
    <Pressable
      onPress={() =>
        navigation.navigate('TransactionHistoryDetails', {
          previousScreen: 'Users',
          ...transaction,
        })
      }
      style={styles.history}>
      <UserIcon uri={senderPhoto} />
      <View style={styles.historyContent}>
        <BoldText>{senderName}</BoldText>
        <RegularText>
          {date.toLocaleDateString()}, {historyTime}s{' '}
        </RegularText>
      </View>
      <View style={styles.amount}>
        <BoldText style={styles.creditAmount}>
          +{currencySymbol + addingDecimal(Number(amount).toLocaleString())}
        </BoldText>
      </View>
    </Pressable>
  ) : (
    <Pressable
      onPress={() =>
        navigation.navigate('TransactionHistoryDetails', {
          previousScreen: 'Users',
          ...transaction,
        })
      }
      style={styles.history}>
      <UserIcon uri={receiverPhoto} />
      <View style={styles.historyContent}>
        <BoldText>{receiverName}</BoldText>
        <RegularText>
          {date.toLocaleDateString()}, {historyTime}
        </RegularText>
      </View>
      <View style={styles.amount}>
        <BoldText style={styles.debitAmount}>
          -{currencySymbol + addingDecimal(Number(amount).toLocaleString())}
        </BoldText>
      </View>
    </Pressable>
  );
};
