import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import BackIcon from '../../../../assets/images/backArrow.svg';
import RegularText from '../../../components/fonts/RegularText';
import Button from '../../../components/Button';
import UserIcon from '../../../components/UserIcon';
import ToastMessage from '../../../components/ToastMessage';
import { TextInput } from 'react-native-gesture-handler';
import ErrorMessage from '../../../components/ErrorMessage';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarIcon from '../../../../assets/images/calendar.svg';
import { AppContext } from '../../../components/AppContext';
import useFetchData from '../../../../utils/fetchAPI';

const UserDetails = ({ navigation, route }) => {
  const { getFetchData } = useFetchData();
  const { walletRefresh } = useContext(AppContext);
  const { email } = route.params;
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blockModal, setBlockModal] = useState(false);
  const [blockTitle, setBlockTitle] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getFetchData(`admin/user/${email}`);
        if (response.status === 200) {
          setUser(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, walletRefresh]);

  const handleShowBlockModal = async blockType => {
    setBlockTitle(blockType);
    setBlockModal(true);
    setSelectedUser(user);
  };

  return (
    <>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <BackIcon />
          <BoldText style={styles.headerText}>User Details</BoldText>
        </Pressable>
      </View>
      <PageContainer style={styles.body} padding scroll>
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size={'large'} color={'#1e1e1e'} />
          </View>
        ) : user ? (
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
              <BoldText style={styles.rowKey}>Account Number</BoldText>
              <RegularText style={styles.rowValue}>
                {user.wallet.loopayAccNo}
              </RegularText>
            </View>
            <View style={styles.row}>
              <BoldText style={styles.rowKey}>Public Acc No</BoldText>
              <RegularText style={styles.rowValue}>
                {user.wallet.accNo}
              </RegularText>
            </View>
            <View style={styles.row}>
              <BoldText style={styles.rowKey}>BVN</BoldText>
              <RegularText style={styles.rowValue}>{user.bvn}</RegularText>
            </View>
            <View style={styles.row}>
              <BoldText style={styles.rowKey}>Address</BoldText>
              <RegularText style={styles.rowValue}>
                {user.userProfile.address}
              </RegularText>
            </View>
            <View style={styles.row}>
              <BoldText style={styles.rowKey}>Local Currency</BoldText>
              <RegularText style={styles.rowValue}>
                {user.localCurrencyCode}
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
              <BoldText style={styles.rowKey}>Limit level</BoldText>
              <RegularText style={styles.rowValue}>{user.level}</RegularText>
            </View>
            <View style={styles.row}>
              <BoldText style={styles.rowKey}>Pin trial remaining</BoldText>
              <RegularText style={styles.rowValue}>
                {5 - (user.invalidPinTried || 0)}
              </RegularText>
            </View>
            <View style={styles.row}>
              <BoldText style={styles.rowKey}>Referral Code</BoldText>
              <RegularText style={styles.rowValue}>
                {user.referralCode}
              </RegularText>
            </View>
            <View style={styles.row}>
              <BoldText style={styles.rowKey}>Account Status</BoldText>
              <RegularText style={styles.rowValue}>{user.status}</RegularText>
            </View>
            <View style={styles.row}>
              <BoldText style={styles.rowKey}>Joined on</BoldText>
              <RegularText style={styles.rowValue}>
                {user.createdAt}
              </RegularText>
            </View>
            <View style={styles.row}>
              <BoldText style={styles.rowKey}>User Photo</BoldText>
              <View style={styles.rowValue}>
                <UserIcon uri={user.photoURL} />
              </View>
            </View>

            <View style={styles.buttons}>
              <Button
                text={'View user transactions'}
                onPress={() =>
                  navigation.navigate('UserTransaction', route.params)
                }
              />
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
        ) : (
          <View>
            <BoldText>Can&apos;t fetch user</BoldText>
          </View>
        )}
      </PageContainer>
      <MessageModal
        showModal={blockModal}
        setShowModal={setBlockModal}
        blockTitle={blockTitle}
        setBlockTitle={setBlockTitle}
        user={selectedUser}
      />
    </>
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -100,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
  },
  rowKey: {
    flex: 1,
  },
  rowValue: {
    flex: 1,
  },

  buttons: {
    marginVertical: 50,
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

export default UserDetails;

const MessageModal = ({ showModal, setShowModal, user, blockTitle }) => {
  const { postFetchData } = useFetchData();
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
