/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import PageContainer from '../../components/PageContainer';
import { Image, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppContext } from '../../components/AppContext';
import { getFetchData } from '../../../utils/fetchAPI';
import UserIconSVG from '../../../assets/images/userMenu.svg';

const Notification = () => {
  const { vh } = useContext(AppContext);
  const [focused, setFocused] = useState(false);
  const [transactionHisiory, setTransactionHisiory] = useState([]);
  useEffect(() => {
    const getTransactions = async () => {
      const response = await getFetchData('user/transaction?date=true');
      if (response.status === 200) {
        setTransactionHisiory(response.data);
      }
    };
    getTransactions();
  }, []);

  return (
    <PageContainer justify={true}>
      {transactionHisiory.length ? (
        <ScrollView>
          <View
            style={{
              ...styles.container,
              minHeight: vh * 0.65,
            }}>
            <BoldText style={styles.header}>Notification</BoldText>
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
              {transactionHisiory.map(dayHistory => (
                <View key={dayHistory.date} style={styles.dateHistory}>
                  <RegularText style={styles.date}>
                    {dayHistory.date}
                  </RegularText>
                  {dayHistory.histories.map(history => (
                    <History key={history.id} history={history} />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.historyEmpty}>
          <BoldText style={styles.historyEmptyText}>
            Your transaction histories will appear here
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

const History = ({ history }) => {
  const {
    senderName,
    receiverName,
    senderPhoto,
    receiverPhoto,
    amount,
    transactionType,
    createdAt,
  } = history;
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
            <BoldText>{senderName}</BoldText>
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
            <BoldText>{receiverName}</BoldText>
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
