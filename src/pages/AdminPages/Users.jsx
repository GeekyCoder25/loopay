/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useAdminDataContext } from '../../context/AdminContext';
import RegularText from '../../components/fonts/RegularText';
import ChevronDown from '../../../assets/images/drop-down.svg';
import { ScrollView } from 'react-native-gesture-handler';
import UserIcon from '../../components/UserIcon';
import { allCurrencies } from '../../database/data';
import { useNavigation } from '@react-navigation/native';
import { addingDecimal } from '../../../utils/AddingZero';

const Users = () => {
  const { adminData } = useAdminDataContext();
  const { users, userDatas, transactions } = adminData;
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <PageContainer style={styles.body}>
      <View style={styles.header}>
        <BoldText style={styles.headerText}>All Users</BoldText>
        <BoldText style={styles.headerText}>{users.length}</BoldText>
      </View>
      <View style={styles.bodySelectors}>
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
            Date
          </BoldText>
        </Pressable>
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
            Transactions
          </BoldText>
        </Pressable>
      </View>

      {!selectedTab ? (
        <>
          <View style={styles.headerSub}>
            <BoldText style={styles.headerSubText}>User</BoldText>
            <BoldText style={styles.headerSubText}>Date</BoldText>
          </View>
          <ScrollView style={styles.users}>
            {users.map(user => (
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
      ) : (
        <ScrollView>
          {transactions.map(transaction => (
            <Transaction
              key={transaction.id + transaction.transactionType}
              transaction={transaction}
            />
          ))}
        </ScrollView>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  body: {},
  header: {
    paddingHorizontal: 7 + '%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
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
    paddingLeft: 10 + '%',
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
  },
  fullName: {
    flex: 1,
    fontSize: 16,
    color: '#525252',
  },
  date: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15 + '%',
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

const User = ({ user, userData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.userExpanded}>
      <View style={styles.user}>
        <RegularText
          style={
            styles.fullName
          }>{`${user.firstName} ${user.lastName}`}</RegularText>
        <View style={styles.date}>
          <BoldText>{new Date(user.createdAt).toLocaleDateString()}</BoldText>
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
    id => currency.toLowerCase() === id.acronym.toLowerCase(),
  ).symbol;

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
