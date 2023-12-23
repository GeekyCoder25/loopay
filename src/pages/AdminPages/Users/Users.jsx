/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useAdminDataContext } from '../../../context/AdminContext';
import RegularText from '../../../components/fonts/RegularText';
import ChevronDown from '../../../../assets/images/drop-down.svg';
import { ScrollView } from 'react-native-gesture-handler';
import BackIcon from '../../../../assets/images/backArrow.svg';
import SortIcon from '../../../../assets/images/sort.svg';
import { getFetchData } from '../../../../utils/fetchAPI';
import { AppContext } from '../../../components/AppContext';
import IonIcon from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Users = ({ navigation }) => {
  const { walletRefresh, vh } = useContext(AppContext);
  const { adminData } = useAdminDataContext();
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState(1);
  const [sortStatus, setSortStatus] = useState('date');
  const [modalOpen, setModalOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const sortMethods = ['date', 'status'];
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
  }, [walletRefresh]);

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
  function sortFuncInactive(a, b) {
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
    setOnlineUsers([]);
    setOfflineUsers([]);
    setActiveUsers(users.filter(user => user.status === 'active'));
    setBlockedUsers(users.filter(user => user.status === 'blocked'));
    adminData.lastActiveSessions.forEach(session => {
      const userSession = session.updatedAt;
      if (checkSameDateAndTime(userSession)) {
        setOnlineUsers(prev => [
          ...prev,
          users.find(user => user.email === session.email),
        ]);
      } else {
        setOfflineUsers(prev => [
          ...prev,
          users.find(user => user.email === session.email),
        ]);
      }
    });
  }, [adminData, users]);

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
    <PageContainer style={styles.body}>
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
            backgroundColor: selectedTab ? '#525252' : '#d0d1d2',
          }}
          onPress={() => setSelectedTab(1)}>
          <BoldText
            style={{
              color: selectedTab ? '#fff' : '#1E1E1E',
            }}>
            Active User{activeUsers.length !== 1 && 's'} {activeUsers.length}
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
            Blocked User{blockedUsers.length !== 1 && 's'} {blockedUsers.length}
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
              activeUsers
                .sort(sortFunc)
                .map(user => <User key={user._id} user={user} />)}
            {sortStatus === 'status' &&
              onlineUsers
                .filter(user => user.status === 'active')
                .sort(sortFunc)
                .map(user => <User key={user._id} user={user} activeStatus />)}
            {sortStatus === 'status' &&
              offlineUsers
                .filter(user => user.status === 'active')
                .sort(sortFuncInactive)
                .map(user => <User key={user._id} user={user} activeStatus />)}
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
            {blockedUsers.map(user => (
              <User key={user._id} user={user} />
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
            <User user={item} setSearchModal={setSearchModal} />
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
  backModal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
    paddingLeft: 4 + '%',
  },
  headerText: {
    fontSize: 20,
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
  name: {
    flex: 1.5,
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
export default Users;

const User = ({ user, activeStatus, setSearchModal }) => {
  const [status, setStatus] = useState();
  const { adminData } = useAdminDataContext();
  const { navigate } = useNavigation();

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
        userSession = userSession.updatedAt;
        checkSameDateAndTime(userSession) && setStatus(true);
      });
  }, [adminData.lastActiveSessions, user.email]);

  return (
    <View style={styles.userExpanded}>
      <Pressable
        style={styles.user}
        onPress={() => {
          setSearchModal && setSearchModal(false);
          navigate('UserDetails', { email: user.email });
        }}>
        {user.status === 'blocked' ? (
          <View style={styles.blocked} />
        ) : status ? (
          <View style={styles.active} />
        ) : (
          <View style={styles.inActive} />
        )}

        <View style={styles.name}>
          <RegularText style={styles.fullName}>
            {user.userProfile.fullName}
          </RegularText>
          <RegularText style={styles.email}>{user.email}</RegularText>
        </View>
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
          <View
            style={{
              transform: [{ rotateZ: '-90deg' }],
            }}>
            <ChevronDown />
          </View>
        </View>
      </Pressable>
    </View>
  );
};
