/* eslint-disable react-native/no-inline-styles */
import React, { memo, useContext, useEffect, useState } from 'react';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Modal,
  FlatList,
} from 'react-native';
import { AppContext } from '../../components/AppContext';
import UserIcon from '../../components/UserIcon';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { networkProvidersIcon } from '../SendMenuPages/AirtimeTopUp/BuyAirtime';
import Back from '../../components/Back';
import TransactionHistoryParams from '../MenuPages/TransactionHistoryParams';
import useFetchData from '../../../utils/fetchAPI';
import ToastMessage from '../../components/ToastMessage';

const Notifications = () => {
  const { getFetchData } = useFetchData();
  const { vh } = useContext(AppContext);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const limit = Math.round(vh / 50);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const getNotifications = async () => {
        try {
          setIsLoading(true);
          const response = await getFetchData(
            `admin/notifications?limit=${limit}&page=${1}`,
          );
          if (response.status === 200) {
            setNotifications(response.data.data);
            setTotalPages(response.data.totalPages);
          }
        } finally {
          setIsLoading(false);
        }
      };
      getNotifications();
      return () => setPage(1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, reload]),
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

  const handleScrollMore = async () => {
    try {
      setFetchingMore(true);
      const response = await getFetchData(
        `admin/notifications?limit=${limit}&page=${page + 1}`,
      );
      if (response.status === 200 && response.data.pageSize) {
        setTotalPages(response.data.totalPages);
        setPage(page + 1);
        const uniqueIds = new Set();
        setNotifications(
          [...notifications, ...response.data.data].filter(obj => {
            if (!uniqueIds.has(obj.id)) {
              uniqueIds.add(obj.id);
              return true;
            }
            return false;
          }),
        );
      }
    } finally {
      setFetchingMore(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <View
          style={{
            ...styles.container,
            minHeight: vh * 0.65,
          }}>
          <View style={styles.body}>
            {/* Render loading indicator */}
            <Header
              isSearching={isSearching}
              setIsSearching={setIsSearching}
              setSearchHistory={setSearchHistory}
            />
            <ActivityIndicator
              size={'large'}
              color={'#1e1e1e'}
              style={styles.loading}
            />
          </View>
        </View>
      ) : notifications.length ? (
        <View style={styles.body}>
          <FlatList
            data={groupNotificationsByDate(notifications)}
            keyExtractor={({ date }) => date}
            renderItem={({ item: dayNotifications }) => (
              <View key={dayNotifications.date} style={styles.dateNotification}>
                <RegularText style={styles.date}>
                  {dayNotifications.date}
                </RegularText>
                <FlatList
                  data={
                    isSearching ? searchHistory : dayNotifications.notifications
                  }
                  keyExtractor={({ _id }) => _id}
                  renderItem={({ item }) => (
                    <Message
                      notification={item}
                      setShowModal={setShowModal}
                      setModalData={setModalData}
                      setReload={setReload}
                    />
                  )}
                />
              </View>
            )}
            ListHeaderComponent={
              <Header
                notifications={notifications}
                setIsSearching={setIsSearching}
                setSearchHistory={setSearchHistory}
              />
            }
            ListFooterComponent={
              page >= totalPages ? (
                <View style={styles.complete}>
                  <BoldText>That&apos;s all for now</BoldText>
                </View>
              ) : (
                fetchingMore && <ActivityIndicator color={'#1e1e1e'} />
              )
            }
            ListEmptyComponent={
              <View style={{ ...styles.empty, minHeight: vh * 0.9 }}>
                <BoldText style={styles.emptyText}>
                  Your notifications will appear here
                </BoldText>
              </View>
            }
            onEndReachedThreshold={0.5}
            onEndReached={
              !fetchingMore && notifications.length && page < totalPages
                ? handleScrollMore
                : undefined
            }
            bounces={false}
            removeClippedSubviews
          />
        </View>
      ) : (
        <View style={{ ...styles.empty, minHeight: vh * 0.9 }}>
          <BoldText style={styles.emptyText}>
            Your notifications will appear here
          </BoldText>
        </View>
      )}
      {showModal && (
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
      )}
    </>
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
  dateNotification: {
    borderBottomColor: '#868585',
    borderBottomWidth: 0.2,
  },
  date: {
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 3 + '%',
    color: '#979797',
  },
  notification: {
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
  content: {
    flex: 1,
    gap: 3,
  },
  title: {
    textTransform: 'capitalize',
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
  loading: {
    marginTop: 15 + '%',
  },
  complete: {
    alignItems: 'center',
    marginVertical: 10,
  },
  empty: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 100 + '%',
    paddingHorizontal: 15 + '%',
  },
  emptyText: {
    textAlign: 'center',
  },
});

export default Notifications;

const Message = ({ notification, setModalData, setShowModal, setReload }) => {
  const { putFetchData } = useFetchData();
  const { showAmount } = useContext(AppContext);
  const [transactionTypeIcon, setTransactionTypeIcon] = useState(
    <Image
      source={require('../../../assets/images/icon.png')}
      style={styles.image}
    />,
  );
  const { _id, header, adminMessage, photo, createdAt, adminStatus, type } =
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
    } else if (
      type === 'transfer' ||
      type === 'airtime' ||
      type === 'data' ||
      type === 'bill'
    ) {
      setModalData(notification.metadata);
      setShowModal(true);
    } else {
      ToastMessage('Read');
    }
    if (adminStatus === 'unread') {
      const response = await putFetchData(`admin/notification/${_id}`);
      response.status === 200 && setReload(prev => !prev);
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
              source={require('../../../assets/images/icon.png')}
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
              source={require('../../../assets/images/icon.png')}
              style={styles.image}
            />
          ),
        );
        break;
    }
  }, [photo, type]);

  const hideAmountInMessage = () => {
    if (!showAmount) {
      const amountPattern = /[₦$€£]\d+(\.\d+)?/g;
      const amountMatch = adminMessage.match(amountPattern);

      if (amountMatch) {
        const hiddenAmount = `${amountMatch[0][0]}***`;
        const hiddenMessage = adminMessage.replace(amountPattern, hiddenAmount);
        return hiddenMessage;
      }
    }
    return adminMessage;
  };

  const finalMessage = hideAmountInMessage();

  return (
    <Pressable style={styles.notification} onPress={handleNavigate}>
      {transactionTypeIcon}
      <View style={styles.content}>
        <BoldText style={styles.title}>{header}</BoldText>
        <RegularText>{finalMessage}</RegularText>
        <RegularText>{historyTime}</RegularText>
      </View>
      {adminStatus === 'unread' && <View style={styles.unread} />}
    </Pressable>
  );
};

const Header = memo(({ notifications, setIsSearching, setSearchHistory }) => {
  const [focused, setFocused] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = async text => {
    setSearchInput(text);
    const foundHistories = notifications.filter(history =>
      Object.values(history)
        .toString()
        .toLowerCase()
        .includes(text.toLowerCase()),
    );

    foundHistories.length && setSearchHistory(foundHistories);
    text && foundHistories.length
      ? setIsSearching(true)
      : setIsSearching(false);
  };

  return (
    <View>
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
          placeholder={searchInput || focused ? '' : 'Search'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChangeText={text => handleSearch(text)}
          value={searchInput}
        />
      </View>
    </View>
  );
});
