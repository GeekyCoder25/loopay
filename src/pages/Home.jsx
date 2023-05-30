import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Bell from '../../assets/images/bell.svg';
import BellActive from '../../assets/images/bellActive.svg';
import Dollar from '../../assets/images/dollar.svg';
import ChevronDown from '../../assets/images/chevron-down.svg';
import Wallet from '../../assets/images/wallet.svg';
import UpAndDownArrow from '../../assets/images/up-down-arrow.svg';
import Bg from '../../assets/images/bg1.svg';
import { AppContext } from '../components/AppContext';
import { historyData } from '../database/data';
import SelectCurrencyModal from '../components/SelectCurrencyModal';
import PageContainer from '../components/PageContainer';
import RegularText from '../components/fonts/RegularText';
import BoldText from '../components/fonts/BoldText';

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { selectedCurrency } = useContext(AppContext);

  const fullName = 'James Sussy';
  const walletAmount = 124.67;

  return (
    <>
      <PageContainer>
        <View style={styles.headerContainer}>
          <View style={styles.bgContainer}>
            <Bg />
          </View>
          <View style={styles.header}>
            <View style={styles.userImageContainer}>
              <Image source={require('../../assets/images/userImage.jpg')} />
              <RegularText>{fullName}</RegularText>
            </View>
            {<Bell /> || <BellActive />}
          </View>
          <ImageBackground
            source={require('../../assets/images/cardBg.png')}
            resizeMode="contain"
            style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.amountContainer}>
                <Dollar />
                <View>
                  <BoldText style={styles.amount}>{walletAmount}</BoldText>
                  <RegularText style={styles.currrencyType}>
                    {selectedCurrency.currency}
                  </RegularText>
                </View>
              </View>
              <Pressable
                onPress={() => setModalOpen(true)}
                style={styles.chevronDown}>
                <ChevronDown />
              </Pressable>
            </View>

            <View style={styles.cardHeader}>
              <View style={styles.cardDetails}>
                <Wallet />
                <RegularText style={styles.currrencyType}>
                  Account Details
                </RegularText>
              </View>
              <View style={styles.cardDetails}>
                <UpAndDownArrow />
                <RegularText style={styles.currrencyType}>
                  Send Money
                </RegularText>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.body}>
          <RegularText style={styles.historyText}>History</RegularText>
          <ScrollView style={styles.histories}>
            {historyData.map(history => (
              <History
                key={history.id}
                history={history}
                currencySymbol={selectedCurrency.symbol}
              />
            ))}
          </ScrollView>
        </View>
      </PageContainer>
      <SelectCurrencyModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 300,
    paddingHorizontal: 3 + '%',
  },
  bgContainer: {
    flex: 1,
    transform: [
      { rotateZ: '-60deg' },
      { scale: 0.9 },
      { translateX: -220 },
      { translateY: -180 },
    ],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  userImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  card: {
    backgroundColor: '#000',
    height: 200,
    marginVertical: 30,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  amount: {
    color: '#ccc',
    fontSize: 50,
  },
  currrencyType: {
    color: '#fff',
    paddingLeft: 10,
    fontSize: 15,
  },
  chevronDown: {},
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    paddingLeft: 3 + '%',
    fontSize: 18,
  },
  body: {
    flex: 1,
  },
  histories: {
    flex: 1,
    backgroundColor: '#eee',
    borderColor: '#0e153a',
    borderWidth: 0.5,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  history: {
    paddingHorizontal: 2.5 + '%',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#0e153a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyIconText: {
    backgroundColor: '#ccc',
    fontSize: 18,
    fontFamily: 'OpenSans-800',
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 20,
  },
  historyTitle: {
    flex: 1,
  },
  transactionAmountText: {
    fontSize: 20,
  },
});
export default Home;

const History = ({ history, currencySymbol }) => {
  const [transactionTypeIcon, setTransactionTypeIcon] = useState('');
  const [transactionTypeTitle, setTransactionTypeTitle] = useState('');
  const [transactionDate, setTransactionDate] = useState('');

  useEffect(() => {
    const date = new Date();
    setTransactionDate(
      `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`,
    );
    switch (history.transactionType) {
      case 'received':
        setTransactionTypeIcon('RE');
        setTransactionTypeTitle('Received');
        break;
      case 'sent':
        setTransactionTypeIcon('SO');
        setTransactionTypeTitle('Sent Out');
        break;
      default:
        setTransactionTypeIcon('$');
        break;
    }
  }, [history.transactionType]);
  return (
    <View style={styles.history}>
      <View style={styles.historyIcon}>
        <Text style={styles.historyIconText}>{transactionTypeIcon}</Text>
      </View>
      <View style={styles.historyTitle}>
        <BoldText>{transactionTypeTitle}</BoldText>
        <RegularText>{transactionDate}</RegularText>
      </View>
      <View>
        <BoldText style={styles.transactionAmountText}>{`${currencySymbol} ${
          history.transactionType === 'sent' ? '-' : '+'
        }${history.transactionAmount}`}</BoldText>
      </View>
    </View>
  );
};
