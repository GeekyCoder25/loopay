/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAdminDataContext } from '../../context/AdminContext';
import RegularText from '../../components/fonts/RegularText';
import ChevronDown from '../../../assets/images/drop-down.svg';
import { ScrollView } from 'react-native-gesture-handler';
import UserIcon from '../../components/UserIcon';
import BackIcon from '../../../assets/images/backArrow.svg';
import SortIcon from '../../../assets/images/sort.svg';
import Button from '../../components/Button';
import { getFetchData, postFetchData } from '../../../utils/fetchAPI';
import ErrorMessage from '../../components/ErrorMessage';
import ToastMessage from '../../components/ToastMessage';
import { AppContext } from '../../components/AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarIcon from '../../../assets/images/calendar.svg';

const Users = ({ navigation }) => {
  const { walletRefresh } = useContext(AppContext);
  const { adminData } = useAdminDataContext();
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState(1);
  const [sortStatus, setSortStatus] = useState('date');
  const [modalOpen, setModalOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [blockModal, setBlockModal] = useState(false);
  const [blockTitle, setBlockTitle] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const sortMethods = ['date', 'status'];

  useEffect(() => {
    const getUsers = async () => {
      const response = await getFetchData('admin/users?userData=true');
      if (response.status === 200) {
        setUsers(response.data.data);
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
                .map(user => (
                  <User
                    key={user._id}
                    user={user}
                    setBlockTitle={setBlockTitle}
                    setBlockModal={setBlockModal}
                    setSelectedUser={setSelectedUser}
                  />
                ))}
            {sortStatus === 'status' &&
              onlineUsers
                .filter(user => user.status === 'active')
                .sort(sortFunc)
                .map(user => (
                  <User
                    key={user._id}
                    user={user}
                    activeStatus
                    setBlockTitle={setBlockTitle}
                    setBlockModal={setBlockModal}
                    setSelectedUser={setSelectedUser}
                  />
                ))}
            {sortStatus === 'status' &&
              offlineUsers
                .filter(user => user.status === 'active')
                .sort(sortFuncInactive)
                .map(user => (
                  <User
                    key={user._id}
                    user={user}
                    activeStatus
                    setBlockTitle={setBlockTitle}
                    setBlockModal={setBlockModal}
                    setSelectedUser={setSelectedUser}
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
            {blockedUsers.map(user => (
              <User
                key={user._id}
                user={user}
                setBlockTitle={setBlockTitle}
                setBlockModal={setBlockModal}
                setSelectedUser={setSelectedUser}
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

      <MessageModal
        showModal={blockModal}
        setShowModal={setBlockModal}
        blockTitle={blockTitle}
        setBlockTitle={setBlockTitle}
        user={selectedUser}
      />
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
  blockModal: {
    padding: 3 + '%',
    paddingTop: 20,
  },
  blockHeaderText: {
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 10,
  },
  label: {
    fontFamily: 'OpenSans-600',
    color: '#868585',
  },
  textInputContainer: {
    position: 'relative',
    marginTop: 5,
    marginBottom: 40,
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    height: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textInputMessage: {
    minHeight: 200,
  },
  textInputMessageContainer: {
    minHeight: 220,
  },
  form: {
    flex: 1,
    height: 100 + '%',
    marginVertical: 30,
  },
  dateTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  calendarIcon: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
  newDate: {
    position: 'absolute',
    top: 23 + '%',
  },
  modalButton: {
    marginVertical: 20,
  },
  suspendHeaderText: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 20,
  },
});
export default Users;

const User = ({
  user,
  activeStatus,
  setBlockTitle,
  setBlockModal,
  setSelectedUser,
}) => {
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
        userSession = userSession.updatedAt;
        checkSameDateAndTime(userSession) && setStatus(true);
      });
  }, [adminData.lastActiveSessions, user.email]);

  const handleShowBlockModal = async blockType => {
    setBlockTitle(blockType);
    setBlockModal(true);
    setSelectedUser(user);
  };

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
          {user.userProfile.fullName}
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
            <RegularText style={styles.rowValue}>{user.email}</RegularText>
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

          <View>
            {user.status === 'active' ? (
              <>
                <Button
                  text={'Block Account'}
                  onPress={() => handleShowBlockModal('Block')}
                />
                <Button
                  text={'Suspend Account'}
                  onPress={() => handleShowBlockModal('Suspend')}
                />
              </>
            ) : user.blockEnd ? (
              <Button
                text={'Unsuspend Account'}
                onPress={() => handleShowBlockModal('Unsuspend')}
              />
            ) : (
              <Button
                text={'Unblock Account'}
                onPress={() => handleShowBlockModal('Unblock')}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const MessageModal = ({ showModal, setShowModal, user, blockTitle }) => {
  const { setIsLoading, setWalletRefresh } = useContext(AppContext);
  const [errorKey, setErrorKey] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [endDateLabel, setEndDateLabel] = useState('DD/MM/YYYY');
  const [mailData, setMailData] = useState({
    subject: '',
    message: '',
  });

  const handleCancel = () => {
    setShowModal(false);
    setErrorMessage('');
    setErrorKey('');
  };

  const handleDatePicker = (event, selectedDate) => {
    setShowPicker(false);
    if (event.type === 'set') {
      if (selectedDate < Date.now()) {
        selectedDate = new Date(Date.now());
      }
      selectedDate.setMilliseconds(0);
      selectedDate.setSeconds(0);
      selectedDate.setMinutes(0);
      selectedDate.setHours(0);
      setEndDateLabel(new Date(selectedDate).toLocaleDateString('en-GB'));
      setEndDate(selectedDate);
    }
  };

  const handleSendMessage = async blockType => {
    try {
      if (!mailData.message && blockType === 'send') {
        setErrorKey('message');
        return setErrorMessage('No message provided');
      } else if (blockTitle === 'Suspend' && !endDate) {
        return setErrorMessage(
          'Please select a suspend end date or rather block instead',
        );
      }
      setIsLoading(true);
      const response = await postFetchData(
        `admin/${blockTitle.toLowerCase()}${
          blockType === 'send' ? '?mail=true' : ''
        }`,
        {
          email: user.email,
          mailData,
          blockEnd: endDate,
        },
      );
      if (response.status === 200) {
        setMailData({});
        setWalletRefresh(prev => !prev);
        setEndDate(null);
        setEndDateLabel('DD/MM/YYYY');
        setErrorMessage('');
        setErrorKey('');
        ToastMessage(`User account ${blockTitle.toLowerCase()}ed`);
        return setShowModal(false);
      }
      throw new Error(response.data?.error || response.data);
    } catch (error) {
      ToastMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={showModal}
      animationType="fade"
      onRequestClose={handleCancel}>
      <PageContainer padding paddingTop={20} scroll>
        <Pressable style={styles.back} onPress={handleCancel}>
          <BackIcon />
          <BoldText style={styles.headerText}>Back</BoldText>
        </Pressable>
        <BoldText style={styles.blockHeaderText}>{blockTitle} User</BoldText>
        <BoldText style={styles.headerText}>Message Draft</BoldText>
        <View style={styles.form}>
          <Text style={styles.label}>Email Subject</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={{
                ...styles.textInput,
                borderColor: errorKey === 'subject' ? 'red' : '#ccc',
              }}
              onChangeText={text =>
                setMailData(prev => {
                  return {
                    ...prev,
                    subject: text,
                  };
                })
              }
              maxLength={24}
              placeholder={`Account ${
                blockTitle.toLowerCase().startsWith('un')
                  ? 'Activation'
                  : 'Deactivation'
              }`}
            />
          </View>
          <Text style={styles.label}>Message</Text>
          <View style={styles.textInputMessageContainer}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={{
                  ...styles.textInput,
                  ...styles.textInputMessage,
                  borderColor: errorKey === 'message' ? 'red' : '#ccc',
                }}
                onChangeText={text => {
                  setMailData(prev => {
                    return {
                      ...prev,
                      message: text,
                    };
                  });
                  setErrorMessage('');
                  setErrorKey('');
                }}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
          <ErrorMessage errorMessage={errorMessage} />
          {blockTitle === 'Suspend' && (
            <View style={styles.suspend}>
              <BoldText style={styles.suspendHeaderText}>
                Suspend End date
              </BoldText>
              {showPicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={endDate || new Date(Date.now())}
                  onChange={handleDatePicker}
                />
              )}
              <Pressable
                onPress={() => setShowPicker('start')}
                style={styles.textInputContainer}>
                <View
                  style={{ ...styles.textInput, ...styles.textInputStyles }}>
                  <View style={styles.dateTextContainer}>
                    <View style={styles.calendarIcon}>
                      <CalendarIcon width={30} height={30} />
                      <RegularText style={styles.newDate}>
                        {endDate ? endDate.getDate() : new Date().getDate()}
                      </RegularText>
                    </View>
                    <RegularText>{endDateLabel}</RegularText>
                  </View>
                </View>
              </Pressable>
            </View>
          )}

          <View style={styles.modalButton}>
            <Button
              text={`${blockTitle} and Send`}
              onPress={() => handleSendMessage('send')}
            />
            <Button
              text={`${blockTitle}`}
              onPress={() => handleSendMessage('block')}
            />
            <Button text={`Cancel ${blockTitle}`} onPress={handleCancel} />
          </View>
        </View>
      </PageContainer>
    </Modal>
  );
};
