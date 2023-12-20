/* eslint-disable react-native/no-inline-styles */
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import UserIcon from '../../components/UserIcon';
import { AppContext } from '../../components/AppContext';
import RegularText from '../../components/fonts/RegularText';
import FlagSelect from '../../components/FlagSelect';
import ChevronDown from '../../../assets/images/chevron-down-fill.svg';
import { useAdminDataContext } from '../../context/AdminContext';
import { addingDecimal } from '../../../utils/AddingZero';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import { allCurrencies } from '../../database/data';
import { getFetchData, postFetchData } from '../../../utils/fetchAPI';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { randomUUID } from 'expo-crypto';
import InputPin from '../../components/InputPin';
import { setShowBalance } from '../../../utils/storage';

const AdminTransfer = ({ navigation }) => {
  const {
    selectedCurrency,
    vw,
    setIsLoading,
    walletRefresh,
    setWalletRefresh,
    showAmount,
    setShowAmount,
  } = useContext(AppContext);
  const { adminData } = useAdminDataContext();
  const { allBalances } = adminData;
  const [recent, setRecent] = useState([]);
  const [transferCurrency, setTransferCurrency] = useState(selectedCurrency);
  const [balance, setBalance] = useState(
    allBalances[
      `${
        ['dollar', 'euro', 'pound'].includes(selectedCurrency.currency)
          ? selectedCurrency.currency
          : 'local'
      }Balance`
    ],
  );
  const [errorKey, setErrorKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userFound, setUserFound] = useState(null);
  const [userInput, setUserInput] = useState(null);
  const [askPin, setAskPin] = useState(false);

  useEffect(() => {
    const getRecent = async () => {
      const response = await getFetchData('admin/recent');
      if (response.status === 200) {
        setRecent(response.data);
      }
    };
    getRecent();
  }, [walletRefresh]);

  const handlePriceInput = text => {
    setAmountInput(text);
    if (text > balance) {
      setErrorKey(true);
      return setErrorMessage('Insufficient funds');
    }
    setErrorKey(false);
    setErrorMessage(false);
  };

  const handleAutoFill = () => {
    amountInput && setAmountInput(addingDecimal(amountInput));
  };

  const handleSend = async () => {
    try {
      if (!userFound) {
        return setErrorMessage("You haven't provide an account to send to");
      } else if (!amountInput) {
        setErrorKey(true);
        return setErrorMessage('Input amount');
      } else if (amountInput > balance) {
        setErrorKey(true);
        return setErrorMessage('Insufficient funds');
      } else if (!askPin) {
        return setAskPin(true);
      }
      setIsLoading(true);
      const response = await postFetchData('admin/loopay/transfer', {
        email: userFound.email,
        fullName: userFound.userProfile?.fullName || userFound.fullName,
        phoneNumber:
          userFound.userProfile?.phoneNumber || userFound.phoneNumber,
        tagName: userFound.tagName,
        photo: userFound.photoURL,
        amount: amountInput,
        currency: transferCurrency.currency,
        id: randomUUID(),
      });
      if (response.status === 200) {
        const { ...userToSendTo } = response.data.data;
        navigation.navigate('Success', {
          userToSendTo,
          amountInput,
        });
        setWalletRefresh(prev => !prev);
        setAmountInput('');
        setUserFound('');
        setAskPin(false);
        setUserInput('');
        return response.status;
      }
      return response.data;
    } catch (err) {
      console.log(err.message);
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  // setAskPin(false);

  const handleCurrencyChange = newSelect => {
    setTransferCurrency(newSelect);
    setErrorMessage(false);
    setBalance(
      adminData.allBalances[
        `${
          ['dollar', 'euro', 'pound'].includes(newSelect.currency)
            ? newSelect.currency
            : 'local'
        }Balance`
      ],
    );
  };

  const handleModal = () => {
    setModalOpen(false);
  };

  const handleCheckAccount = async () => {
    if (userInput) {
      setIsSearching(true);
      try {
        const result = await getFetchData(`admin/user/${userInput}`);
        if (result.status === 200) {
          return setUserFound(result.data);
        }
      } finally {
        setIsSearching(false);
      }
      return setUserFound(null);
    } else {
      return setUserFound(null);
    }
  };

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };
  return !askPin ? (
    <PageContainer style={styles.body} scroll>
      <BoldText style={styles.headerText}>Transfer</BoldText>
      <View style={styles.recentContainer}>
        <BoldText style={styles.recentHeader}>Recents</BoldText>
        <View style={styles.recents}>
          <FlatList
            data={recent}
            renderItem={({ item, index }) => (
              <Pressable
                style={{
                  ...styles.recent,
                  marginLeft: index === 0 ? vw * 0.05 : 0,
                }}
                onPress={() => {
                  setUserFound(item);
                  setUserInput(item.tagName);
                }}>
                <UserIcon uri={item.photo} />
                {item.verificationStatus === 'verified' && (
                  <Image
                    source={require('../../../assets/images/verify.png')}
                    style={styles.verify}
                    resizeMode="contain"
                  />
                )}
                <BoldText style={styles.recentName}>
                  {item.userProfile?.fullName}
                </BoldText>
              </Pressable>
            )}
            keyExtractor={({ tagName }) => tagName}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      <View style={styles.select}>
        <RegularText style={styles.selectHeader}>From</RegularText>
        <Pressable
          onPress={() => setModalOpen(true)}
          style={styles.selectInputContainer}>
          <View style={styles.selectInput}>
            <View style={styles.flagContainer}>
              <FlagSelect country={transferCurrency.currency} />
              <View>
                <BoldText style={styles.currencyName}>
                  {transferCurrency.currency} Balance
                </BoldText>
                <Pressable onPress={handleShow}>
                  <RegularText style={styles.selectAmount}>
                    {showAmount
                      ? `${transferCurrency.symbol} ${addingDecimal(
                          balance?.toLocaleString(),
                        )}`
                      : '***'}
                  </RegularText>
                </Pressable>
              </View>
            </View>
            <ChevronDown />
          </View>
        </Pressable>
      </View>
      <View style={styles.transfer}>
        <RegularText style={styles.label}>User to send to</RegularText>
        <View style={styles.textInputContainer}>
          <TextInput
            style={{
              ...styles.textInput,
              paddingLeft: 15,
            }}
            onChangeText={text => {
              setUserInput(text);
              setUserFound(null);
            }}
            value={userInput}
            placeholder="Input tag name or account number"
            placeholderTextColor={'#525252'}
            onBlur={handleCheckAccount}
          />
          <Pressable onPress={handleCheckAccount} style={styles.paste}>
            <RegularText style={styles.pasteText}>Check</RegularText>
            <FaIcon name="check-circle" color="#fff" />
          </Pressable>
        </View>
        {isSearching && (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color="#1E1E1E" />
          </View>
        )}
        {!isSearching && userFound && (
          <View style={styles.userFoundContainer}>
            <RegularText style={styles.top}>Result</RegularText>
            <View style={styles.userFound}>
              <UserIcon uri={userFound.photoURL || userFound.photo} />
              <View style={styles.userFoundDetails}>
                <BoldText>
                  {userFound.userProfile?.fullName || userFound.fullName}{' '}
                  {userFound.verificationStatus === 'verified' && (
                    <Image
                      source={require('../../../assets/images/verify.png')}
                      style={styles.verify}
                      resizeMode="contain"
                    />
                  )}
                </BoldText>
                <BoldText>{userFound.tagName}</BoldText>
              </View>
            </View>
          </View>
        )}
        <RegularText style={styles.label}>Amount to send</RegularText>
        <View style={styles.textInputContainer}>
          <BoldText style={styles.symbol}>{transferCurrency.symbol}</BoldText>
          <TextInput
            style={{
              ...styles.textInput,
              borderColor: errorKey ? 'red' : '#ccc',
            }}
            inputMode="decimal"
            onChangeText={text => handlePriceInput(text)}
            onBlur={handleAutoFill}
            value={amountInput}
            placeholder="Enter amount"
            placeholderTextColor={'#525252'}
          />
          {errorMessage && (
            <ErrorMessage
              errorMessage={errorMessage}
              style={styles.errorMessage}
            />
          )}
        </View>

        <Button text={'Send'} onPress={handleSend} />
      </View>
      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent
        onRequestClose={handleModal}>
        <Pressable style={styles.overlay} onPress={handleModal} />
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <BoldText style={styles.modalHeader}>
              Select account to transfer
            </BoldText>
            <View style={styles.modalBorder} />
            <View style={styles.modalContent}>
              {allCurrencies
                .filter(i => i.currency !== transferCurrency.currency)
                .map(currency => (
                  <Pressable
                    key={currency.currency}
                    style={styles.currency}
                    onPress={() => {
                      handleCurrencyChange(currency);
                      setModalOpen(false);
                    }}>
                    <View style={styles.currencyIcon}>
                      <FlagSelect country={currency.currency} />
                      <View>
                        <BoldText>{currency.acronym}</BoldText>
                        <RegularText style={styles.currencyName}>
                          {currency.currency}
                        </RegularText>
                      </View>
                    </View>
                    <BoldText>
                      {showAmount
                        ? currency.isLocal
                          ? addingDecimal(
                              allBalances.localBalance?.toLocaleString(),
                            )
                          : addingDecimal(
                              allBalances[
                                `${currency.currency}Balance`
                              ]?.toLocaleString(),
                            )
                        : '***'}
                    </BoldText>
                  </Pressable>
                ))}
            </View>
          </View>
        </View>
      </Modal>
    </PageContainer>
  ) : (
    <InputPin customFunc={handleSend} handleCancel={() => setAskPin(false)} />
  );
};

const styles = StyleSheet.create({
  body: {},
  headerText: {
    fontSize: 20,
    color: '#525252',
    paddingHorizontal: 5 + '%',
  },
  recentContainer: {
    marginTop: 30,
  },
  recentHeader: {
    paddingHorizontal: 5 + '%',
  },
  recents: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 5,
  },
  recent: {
    gap: 10,
    alignItems: 'center',
    maxWidth: 70,
    marginRight: 15,
    position: 'relative',
  },
  recentName: {
    textAlign: 'center',
  },
  verify: {
    width: 15,
    height: 15,
    position: 'absolute',
    right: 0,
  },
  select: {
    paddingTop: 50,
  },
  selectHeader: {
    paddingHorizontal: 5 + '%',
    marginBottom: 5,
  },
  selectInputContainer: {
    position: 'relative',
    marginTop: 5,
    marginBottom: 40,
  },
  selectInput: {
    backgroundColor: '#eee',
    height: 80,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
  },
  textInputStyles: {
    paddingLeft: 50,
    fontSize: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  currencyName: {
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  selectAmount: {
    color: '#525252',
  },
  transfer: {
    paddingBottom: 50,
    paddingHorizontal: 5 + '%',
  },
  label: {
    color: '#525252',
  },
  textInputContainer: {
    position: 'relative',
    marginBottom: 20,
    marginTop: 10,
  },
  textInput: {
    borderRadius: 15,
    backgroundColor: '#eee',
    height: 55,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    paddingLeft: 50,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  symbol: {
    position: 'absolute',
    fontSize: 18,
    zIndex: 9,
    top: 15,
    left: 15,
    color: '#525252',
  },
  paste: {
    position: 'absolute',
    top: 12,
    right: 15,
    backgroundColor: '#006E53',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 5,
  },
  pasteText: {
    color: '#fff',
    fontSize: 14,
  },
  userFound: {
    marginVertical: 20,
    backgroundColor: '#EEEEEE',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    width: 110 + '%',
    alignSelf: 'center',
  },
  errorMessage: {
    marginTop: 20,
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.7,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    height: 70 + '%',
    width: 100 + '%',
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: 100 + '%',
    height: 100 + '%',
    paddingVertical: 30,
    paddingHorizontal: 5 + '%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
    alignItems: 'center',
    gap: 20,
  },
  modalHeader: { fontSize: 16 },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
  },
  modalTextHeader: {
    fontSize: 18,
  },
  modalContent: {
    alignItems: 'center',
    flex: 1,
  },
  currencies: {
    flex: 1,
  },
  currency: {
    width: 100 + '%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  currencyIcon: {
    gap: 20,
    flexDirection: 'row',
    flex: 1,
  },
});
export default AdminTransfer;
