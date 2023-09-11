/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import PageContainer from '../../components/PageContainer';
import { Image, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppContext } from '../../components/AppContext';
import UserIconSVG from '../../../assets/images/userMenu.svg';
import { useNotificationsContext } from '../../context/NotificationContext';

const Notification = () => {
  const { vh } = useContext(AppContext);
  const [focused, setFocused] = useState(false);
  const { notifications } = useNotificationsContext();

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

  return (
    <PageContainer justify={true} flex>
      {notifications.length ? (
        <ScrollView>
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
                  textAlign: focused ? 'left' : 'center',
                  paddingLeft: focused ? 10 : 0,
                }}
                placeholder={focused ? '' : 'Search, e.g By date'}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </View>
            <View style={styles.body}>
              {groupNotificationsByDate(notifications).map(dayNotifiactions => (
                <View key={dayNotifiactions.date} style={styles.dateHistory}>
                  <RegularText style={styles.date}>
                    {dayNotifiactions.date}
                  </RegularText>
                  {dayNotifiactions.notifications.map(notification => (
                    <Message
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.historyEmpty}>
          <BoldText style={styles.historyEmptyText}>
            Your notifications will appear here
          </BoldText>
        </View>
      )}
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

export default Notification;

const Message = ({ notification }) => {
  const {
    header,
    message,
    senderPhoto,
    receiverPhoto,
    amount,
    transactionType,
    createdAt,
  } = notification;
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
  return (
    <View style={styles.history}>
      {transactionType?.toLowerCase() === 'credit' ? (
        <>
          {senderPhoto ? (
            <Image source={{ uri: senderPhoto }} style={styles.image} />
          ) : (
            <View style={styles.image}>
              <UserIconSVG width={25} height={25} />
            </View>
          )}
          <View style={styles.historyContent}>
            <BoldText>{header}</BoldText>
            <RegularText>{message}</RegularText>
            <RegularText>{historyTime}</RegularText>
          </View>
          <View style={styles.amount}>
            <BoldText style={styles.creditAmount}>+{amount}</BoldText>
          </View>
        </>
      ) : (
        <>
          {receiverPhoto ? (
            <Image source={{ uri: receiverPhoto }} style={styles.image} />
          ) : (
            <View style={styles.image}>
              <UserIconSVG width={25} height={25} />
            </View>
          )}
          <View style={styles.historyContent}>
            <BoldText>{header}</BoldText>
            <BoldText>{message}</BoldText>
            <RegularText>{historyTime}</RegularText>
          </View>
          <View style={styles.amount}>
            <BoldText style={styles.debitAmount}>-{amount}</BoldText>
          </View>
        </>
      )}
    </View>
  );
};
