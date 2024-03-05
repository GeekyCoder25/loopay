import React, { useContext, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppContext } from './AppContext';
import ChevronDown from '../../assets/images/chevron-down.svg';
import BoldText from './fonts/BoldText';
import RegularText from './fonts/RegularText';
import FlagSelect from './FlagSelect';
import WalletAmount from './WalletAmount';
import SelectCurrencyModal from './SelectCurrencyModal';
import { useWalletContext } from '../context/WalletContext';
import { addingDecimal } from '../../utils/AddingZero';
import { setShowBalance } from '../../utils/storage';
import FaIcon from '@expo/vector-icons/FontAwesome';

const AccInfoCard = ({ disableSwitchCurrency }) => {
  const { selectedCurrency, showAmount, setShowAmount, isAndroid } =
    useContext(AppContext);
  const [modalOpen, setModalOpen] = useState(false);
  const { wallet } = useWalletContext();

  const pendingBalance = addingDecimal(
    (wallet.bookBalance || wallet.balance).toLocaleString(),
  );

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };

  return (
    <>
      <ImageBackground
        source={require('../../assets/images/cardBg.png')}
        resizeMode="cover"
        style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.amountContainer}>
            <View style={styles.symbolContainer}>
              <Text
                style={
                  isAndroid
                    ? {
                        ...styles.symbol,
                        transform: [{ translateY: -3.5 }, { translateX: -0.5 }],
                      }
                    : styles.symbol
                }>
                {selectedCurrency.symbol}
              </Text>
            </View>
            <View>
              <WalletAmount
                showAmount={showAmount}
                setShowAmount={setShowAmount}
              />
              <View style={styles.flagContainer}>
                <RegularText style={styles.currencyType}>
                  {selectedCurrency.currency}
                </RegularText>
                <FlagSelect country={selectedCurrency.currency} />
              </View>
            </View>
          </View>
          <View style={styles.eyeContainer}>
            {wallet && (
              <Pressable style={styles.eye} onPress={handleShow}>
                <FaIcon
                  name={showAmount ? 'eye-slash' : 'eye'}
                  size={25}
                  color={'#fff'}
                />
              </Pressable>
            )}

            {!disableSwitchCurrency && (
              <Pressable
                onPress={() => setModalOpen(true)}
                style={styles.chevronDown}>
                <ChevronDown />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.cardHeader}>
          <View style={styles.cardDetails}>
            <RegularText style={styles.currencyType}>
              Book Balance:{' '}
              <BoldText>
                {showAmount ? selectedCurrency.symbol + pendingBalance : '***'}
              </BoldText>
            </RegularText>
          </View>
        </View>
      </ImageBackground>
      <SelectCurrencyModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#000',
    height: 180,
    width: 100 + '%',
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
  symbolContainer: {
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  symbol: {
    fontSize: 22,
    fontFamily: 'AlfaSlabOne-Regular',
  },
  amount: {
    color: '#ccc',
    fontSize: 40,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: -5,
  },
  currencyType: {
    color: '#fff',
    paddingLeft: 10,
    fontSize: 15,
    textTransform: 'capitalize',
  },
  eyeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 10,
  },
  eye: {
    marginLeft: 20,
  },
  chevronDown: {},
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default AccInfoCard;
