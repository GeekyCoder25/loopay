/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import { useAdminDataContext } from '../../context/AdminContext';
import BackIcon from '../../../assets/images/backArrow.svg';
import RegularText from '../../components/fonts/RegularText';
import ChevronDown from '../../../assets/images/drop-down.svg';
import UserIcon from '../../components/UserIcon';
import { getFetchData } from '../../../utils/fetchAPI';
import { AppContext } from '../../components/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import IonIcon from '@expo/vector-icons/Ionicons';

const ActiveUsers = ({ navigation, route }) => {
  const { vh } = useContext(AppContext);
  const [defaultTab, setDefaultTab] = useState(route.params.defaultTab);
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const { adminData } = useAdminDataContext();
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [searchModal, setSearchModal] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const limit = Math.round(vh / 50);

  useFocusEffect(
    useCallback(() => {
      isSearching && setSearchModal(true);
    }, [isSearching]),
  );

  useEffect(() => {
    const getUsers = async () => {
      const response = await getFetchData('admin/users?userData=true');
      if (response.status === 200) {
        setUsers(response.data.data);
        setTotalUsers(response.data.total);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    setDefaultTab(route.params.defaultTab);
  }, [route.params.defaultTab]);

  useEffect(() => {
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
      const sessionTimestamp = userSession.updatedAt;
      if (checkSameDateAndTime(sessionTimestamp)) {
        setActiveUsers(prev => [...prev, userSession]);
      } else {
        setInactiveUsers(prev => [...prev, userSession]);
      }
    });
  }, [adminData]);

  function sortFunc(a, b) {
    const date1 = a.updatedAt;
    const date2 = b.updatedAt;
    let comparison = 0;
    if (date1 > date2) {
      comparison = -1;
    } else if (date1 < date2) {
      comparison = 1;
    }
    return comparison;
  }

  const handleSearch = async text => {
    try {
      // setIsLocalLoading(true);
      setSearchText(text);
      const foundHistories = users.filter(user => {
        return Object.values(user)
          .toString()
          .toLowerCase()
          .includes(text.toLowerCase());
      });

      setSearchData(foundHistories);
    } finally {
      // setIsLocalLoading(false);
    }
  };

  const handleScrollMore = async () => {
    try {
      setReloading(true);
      const response = await getFetchData(
        `admin/users?userData=true&limit=${limit}&page=${page + 1}`,
      );
      if (response.status === 200 && response.data.pageSize) {
        const uniqueIds = new Set();

        setPage(page + 1);
        setUsers(
          [...users, ...response.data].filter(obj => {
            if (!uniqueIds.has(obj.id)) {
              uniqueIds.add(obj.id);
              return true;
            }
            return false;
          }),
        );
      }
    } finally {
      setReloading(false);
    }
  };

  const handleCloseSearchModal = () => {
    setSearchModal(prev => !prev);
    setSearchData([]);
    setIsSearching(false);
    setSearchText('');
  };

  return (
    <PageContainer scroll>
      <View>
        <View style={styles.header}>
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <BackIcon />
            <BoldText style={styles.headerText}>All Users</BoldText>
            <BoldText style={styles.headerText}>{users.length}</BoldText>
          </Pressable>
          <Pressable
            onPress={() => {
              setIsSearching(true);
              setSearchModal(true);
            }}>
            <IonIcon name="search" size={20} />
          </Pressable>
        </View>
        <View style={styles.bodySelectors}>
          <Pressable
            style={{
              ...styles.bodySelector,
              backgroundColor: defaultTab ? '#525252' : '#d0d1d2',
            }}
            onPress={() => setDefaultTab(1)}>
            <BoldText
              style={{
                color: defaultTab ? '#fff' : '#1E1E1E',
              }}>
              Online User{activeUsers.length > 1 && 's'} {activeUsers.length}
            </BoldText>
          </Pressable>
          <Pressable
            style={{
              ...styles.bodySelector,
              backgroundColor: !defaultTab ? '#525252' : '#d0d1d2',
            }}
            onPress={() => setDefaultTab(0)}>
            <BoldText
              style={{
                color: !defaultTab ? '#fff' : '#1E1E1E',
              }}>
              Offline User{inactiveUsers.length > 1 && 's'}{' '}
              {inactiveUsers.length}
            </BoldText>
          </Pressable>
        </View>
      </View>
      {users.length > 0 &&
        (defaultTab ? (
          <View style={styles.users}>
            {activeUsers.sort(sortFunc).map(user => (
              <User
                key={user.email}
                userSession={user}
                status={defaultTab}
                users={users}
              />
            ))}
          </View>
        ) : (
          <View style={styles.users}>
            {inactiveUsers.sort(sortFunc).map(user => (
              <User
                key={user.email}
                userSession={user}
                status={defaultTab}
                users={users}
              />
            ))}
          </View>
        ))}
      <Modal
        visible={searchModal}
        animationType="none"
        onRequestClose={handleCloseSearchModal}>
        <View style={styles.backModal}>
          <BackIcon onPress={handleCloseSearchModal} />
          <BoldText>Cancel</BoldText>
        </View>
        <FlatList
          data={searchData}
          renderItem={({ item }) => (
            <User
              user={item}
              setSearchModal={setSearchModal}
              userSession={{ email: item.email }}
              users={users}
              isSearching={true}
            />
          )}
          keyExtractor={({ _id }) => _id}
          ListHeaderComponent={
            <View style={styles.textInputContainer}>
              <TextInput
                style={{
                  ...styles.textInput,
                  paddingLeft: 10,
                }}
                placeholder={'Search'}
                onChangeText={text => handleSearch(text)}
                autoFocus={!searchText}
                value={searchText}
              />
            </View>
          }
          ListFooterComponent={
            searchData.length &&
            (searchData.length >= searchData ? (
              <View style={styles.complete}>
                <BoldText>That&apos;s all for now</BoldText>
              </View>
            ) : (
              reloading && <ActivityIndicator color={'#1e1e1e'} />
            ))
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              {searchText && <BoldText>No Result found</BoldText>}
            </View>
          }
          onEndReachedThreshold={0.5}
          onEndReached={
            !reloading && searchData.length && users.length < totalUsers
              ? handleScrollMore
              : undefined
          }
          bounces={false}
          removeClippedSubviews
        />
      </Modal>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
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
  backModal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
    paddingLeft: 4 + '%',
  },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
    marginBottom: 10,
  },
  selectedTab: {
    backgroundColor: 'red',
  },
  headerSub: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  userExpanded: {
    paddingHorizontal: 6 + '%',
    borderBottomColor: '#525252',
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  user: {
    flexDirection: 'row',
    paddingVertical: 10,
    gap: 15,
  },
  fullName: {
    flex: 1,
    fontSize: 16,
    color: '#525252',
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
  lastSeen: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    flexDirection: 'row',
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
  textInputContainer: {
    paddingHorizontal: 3 + '%',
    paddingBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#bbb',
    marginTop: 20,
    borderRadius: 5,
    height: 35,
    fontFamily: 'OpenSans-400',
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 100 + '%',
  },
});

export default ActiveUsers;

const User = ({ status, userSession, users, isSearching }) => {
  const user = users.find(i => i.email === userSession.email);
  const [isExpanded, setIsExpanded] = useState(false);

  const lastSeen = new Date(userSession.updatedAt);
  return (
    <View style={styles.userExpanded}>
      <View style={styles.user}>
        {status === 1 ? (
          <View style={styles.active} />
        ) : (
          <View style={styles.inActive} />
        )}
        <View>
          <BoldText>{user?.userProfile.fullName}</BoldText>
          <RegularText>{user?.email}</RegularText>
        </View>

        <View style={styles.lastSeen}>
          {isSearching !== true && !status && (
            <View>
              <BoldText>{lastSeen.toLocaleDateString()}</BoldText>
              <BoldText>{lastSeen.toLocaleTimeString()}</BoldText>
            </View>
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
      {isExpanded && user && (
        <View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Email</BoldText>
            <RegularText style={styles.rowValue}>{user?.email}</RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Phone Number</BoldText>
            <RegularText style={styles.rowValue}>
              {user.userProfile.phoneNumber}
            </RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Role</BoldText>
            <RegularText style={styles.rowValue}>{user.role}</RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Account Type</BoldText>
            <RegularText style={styles.rowValue}>
              {user.accountType}
            </RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Pin set</BoldText>
            <RegularText style={styles.rowValue}>
              {user.pin ? 'true' : 'false'}
            </RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Tag Name</BoldText>
            <RegularText style={styles.rowValue}>
              {user.tagName || user.userProfile.userName}
            </RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>Referral Code</BoldText>
            <RegularText style={styles.rowValue}>
              {user.referralCode}
            </RegularText>
          </View>
          <View style={styles.row}>
            <BoldText style={styles.rowKey}>User Photo</BoldText>
            <View style={styles.rowValue}>
              <UserIcon uri={user.photoURL} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
