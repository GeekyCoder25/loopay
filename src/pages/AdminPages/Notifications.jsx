/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import PageContainer from '../../components/PageContainer';
import {
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Modal,
} from 'react-native';
import { AppContext } from '../../components/AppContext';
import UserIcon from '../../components/UserIcon';
import { putFetchData } from '../../../utils/fetchAPI';
import { useAdminDataContext } from '../../context/AdminContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { networkProvidersIcon } from '../SendMenuPages/AirtimeTopUp/BuyAirtime';
import Back from '../../components/Back';
import TransactionHistoryParams from '../MenuPages/TransactionHistoryParams';

const Notifications = () => {
  const { vh, setWalletRefresh } = useContext(AppContext);
  const [focused, setFocused] = useState(false);
  const { adminData } = useAdminDataContext();
  const { notifications } = adminData;
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      putFetchData('admin/notifications');

      return () => setWalletRefresh(prev => !prev);
    }, [setWalletRefresh]),
  );
  const groupNotificationsByDate = inputArray => {
    const groupedByDate = {};

    inputArray.forEach(notification => {
      const dateObject = new Date(notification.createdAt);
      const options = { month: 'short' };
      const date = `${dateObject.getDate()} ${dateObject.toLocaleString(
        'en-US',
        options,
      )} ${dateObject.getFullYear()}`;
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(notification);
    });

    const resultArray = Object.keys(groupedByDate).map(date => {
      return {
        date,
        notifications: groupedByDate[date],
      };
    });

    return resultArray;
  };

  const handleSearch = async text => {
    setSearchInput(text);
    const foundHistories = notifications.map(history =>
      Object.values(history)
        .toString()
        .toLowerCase()
        .includes(text.toLowerCase())
        ? history
        : null,
    );

    foundHistories.length && setSearchHistory(foundHistories);
    text && foundHistories.length
      ? setIsSearching(true)
      : setIsSearching(false);
  };

  return (
    <PageContainer justify={true} scroll>
      {notifications.length ? (
        <View
          style={{
            ...styles.container,
            minHeight: vh * 0.65,
          }}>
          <BoldText style={styles.header}>Notifications</BoldText>
          <View
            style={{
              ...styles.textInputContainer,
            }}>
            <TextInput
              style={{
                ...styles.textInput,
                textAlign: searchInput || focused ? 'left' : 'center',
                paddingLeft: searchInput || focused ? 10 : 0,
              }}
              placeholder={searchInput || focused ? '' : 'Search, e.g by date'}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChangeText={text => handleSearch(text)}
              value={searchInput}
            />
          </View>
          <View style={styles.body}>
            {groupNotificationsByDate(notifications).map(dayNotifications => (
              <View key={dayNotifications.date} style={styles.dateHistory}>
                <RegularText style={styles.date}>
                  {dayNotifications.date}
                </RegularText>
                {isSearching
                  ? searchHistory.map(
                      notification =>
                        notification && (
                          <Message
                            key={notification.id}
                            notification={notification}
                            setShowModal={setShowModal}
                            setModalData={setModalData}
                          />
                        ),
                    )
                  : dayNotifications.notifications.map(notification => (
                      <Message
                        key={notification.id}
                        notification={notification}
                        setShowModal={setShowModal}
                        setModalData={setModalData}
                      />
                    ))}
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={{ ...styles.historyEmpty, minHeight: vh * 0.9 }}>
          <BoldText style={styles.historyEmptyText}>
            Your notifications will appear here
          </BoldText>
        </View>
      )}
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => {
          setShowModal(false);
          setModalData(null);
        }}>
        <Back
          onPress={() => {
            setShowModal(false);
            setModalData(null);
          }}
        />
        <TransactionHistoryParams route={{ params: modalData }} />
      </Modal>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {},
  header: {
    paddingHorizontal: 3 + '%',
    marginTop: 10,
    fontSize: 17,
    fontFamily: 'OpenSans-600',
    color: '#000',
  },
  textInputContainer: {
    paddingHorizontal: 3 + '%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#BBBBBB',
    marginTop: 20,
    borderRadius: 5,
    height: 35,
    fontFamily: 'OpenSans-400',
  },
  dateHistory: {
    borderBottomColor: '#868585',
    borderBottomWidth: 0.2,
  },
  date: {
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 3 + '%',
    color: '#979797',
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
  unread: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1e1e1e',
    marginRight: 1 + '%',
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
  historyEmpty: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 100 + '%',
    paddingHorizontal: 15 + '%',
  },
  historyEmptyText: {
    textAlign: 'center',
  },
});

export default Notifications;

const Message = ({ notification, setModalData, setShowModal }) => {
  const [transactionTypeIcon, setTransactionTypeIcon] = useState(
    <Image source={require('../../../assets/icon.png')} style={styles.image} />,
  );
  const { header, adminMessage, photo, createdAt, adminStatus, type } =
    notification;
  const { navigate } = useNavigation();
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

  const handleNavigate = async () => {
    if (type === 'request') {
      navigate('PendingRequest');
    } else if (type === 'request_confirm') {
      navigate('Home');
    } else if (type === 'transfer' || type === 'airtime' || type === 'data') {
      setModalData(notification.metadata);
      setShowModal(true);
    }
  };

  useEffect(() => {
    switch (type) {
      case 'airtime':
        setTransactionTypeIcon(networkProvidersIcon(photo));
        break;
      case 'data':
        setTransactionTypeIcon(networkProvidersIcon(photo));
        break;
      case 'transfer':
        setTransactionTypeIcon(
          photo ? (
            <UserIcon uri={photo} />
          ) : (
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.image}
            />
          ),
        );
        break;
      default:
        setTransactionTypeIcon(
          photo ? (
            <UserIcon uri={photo} />
          ) : (
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.image}
            />
          ),
        );
        break;
    }
  }, [photo, type]);

  return (
    <Pressable style={styles.history} onPress={handleNavigate}>
      {transactionTypeIcon}
      <View style={styles.historyContent}>
        <BoldText>{header}</BoldText>
        <RegularText>{adminMessage}</RegularText>
        <RegularText>{historyTime}</RegularText>
      </View>
      {adminStatus === 'unread' && <View style={styles.unread} />}
    </Pressable>
  );
};
