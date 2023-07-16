/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import UserIconSVG from '../../../../assets/images/userMenu.svg';
import RegularText from '../../../components/fonts/RegularText';
import FlagSelect from '../../../components/FlagSelect';
import FaIcon from '@expo/vector-icons/FontAwesome';
import Button from '../../../components/Button';
import SelectCurrencyModal from '../../../components/SelectCurrencyModal';
import { AppContext } from '../../../components/AppContext';
import { addingDecimal } from '../../../../utils/AddingZero';
import ErrorMessage from '../../../components/ErrorMessage';
import { PINInput } from '../../MenuPages/TransactionPin';
import { postFetchData } from '../../../../utils/fetchAPI';
import { OTPInput } from '../../../components/LoggedInForgetPassword';

const TransaferFunds = ({ route }) => {
  const { selectedCurrency, appData, setIsLoading } = useContext(AppContext);
  const [userToSendTo] = useState(route.params);
  const [amountInput, setAmountInput] = useState(null);
  const [desc, setDesc] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [canContinue, setCanContinue] = useState(false);
  const [focusIndex, setFocusIndex] = useState(1);
  const [pinCode, setPinCode] = useState('');
  const [haveSetPin] = useState(appData.pin);
  const [otpCode, setOtpCode] = useState('');
  const [reload, setReload] = useState(false);
  const [isPinOkay, setIsPinOkay] = useState(false);
  const [formData] = useState({
    email: appData.email,
    otpCodeLength: 6,
  });

  const codeLengths = [1, 2, 3, 4];
  //   console.log(route.params);

  const editInput = () => {
    setErrorMessage('');
    setErrorKey('');
  };

  const handleChange = async text => {
    setAmountInput(text);
    editInput();
  };

  const handleBlur = () => {
    amountInput && setAmountInput(addingDecimal(amountInput));
    if (amountInput < 100) {
      setErrorMessage(
        `Minimum transfer amount is ${selectedCurrency.symbol}${selectedCurrency.minimumAmountToAdd}`,
      );
      setErrorKey('amountInput');
    }
  };

  const handleContinue = async () => {
    if (!amountInput) {
      setErrorMessage('Please provide the anount to be transferred');
      setErrorKey('amountInput');
    } else if (!Number(amountInput)) {
      setErrorMessage('Please provide a valid amount');
      setErrorKey('amountInput');
    } else if (amountInput < 100) {
      setErrorMessage(
        `Minimum transfer amount is ${selectedCurrency.symbol}${selectedCurrency.minimumAmountToAdd}`,
      );
      setErrorKey('amountInput');
    } else if (!desc) {
      setErrorMessage('Please provide transaction description');
      setErrorKey('desc');
    } else {
      setCanContinue(true);
      if (!haveSetPin) {
        await postFetchData('auth/forget-password', formData);
      }
    }
  };

  const handlePay = async () => {
    try {
      setIsLoading(true);
      if (haveSetPin) {
        const result = await postFetchData('user/check-pin', { pin: pinCode });
        if (result === "Couldn't connect to server") {
          return setErrorMessage(result);
        }
        if (result.status === 200) {
          return payStackIntegrate();
        }
        setErrorMessage(result.data);
        setErrorKey('pinCode');
      } else {
        const result = await postFetchData(
          `auth/confirm-otp/${otpCode || 'fake'}`,
          formData,
        );
        if (result === "Couldn't connect to server") {
          return setErrorMessage(result);
        }
        if (result.status === 200) {
          return payStackIntegrate();
        }
        setErrorMessage('Incorrect OTP Code');
        setErrorKey('otpCode');
      }
      setTimeout(() => {
        setPinCode('');
        setReload(prev => !prev);
      }, 1500);
    } finally {
      setIsLoading(false);
      setTimeout(() => {}, 1000);
    }
  };

  const payStackIntegrate = () => {
    ToastAndroid.show(
      'Paystack integration in development',
      ToastAndroid.SHORT,
    );
    console.log('paysatck ');
  };
  const fee = 2.75;
  return (
    <>
      <PageContainer paddingTop={0}>
        <ScrollView style={styles.body}>
          <BoldText style={styles.header}>Transfer Funds</BoldText>

          <View style={styles.userIconContainer}>
            {userToSendTo.photo ? (
              <Image
                source={{ uri: userToSendTo.photo }}
                style={styles.userIconStyle}
              />
            ) : (
              <View style={styles.nonUserIconStyle}>
                <UserIconSVG width={50} height={50} />
              </View>
            )}
            <View>
              <BoldText>{userToSendTo.fullName}</BoldText>
              <RegularText style={styles.tagName}>
                {userToSendTo.tagName}
              </RegularText>
            </View>
            <View style={styles.modalBorder} />
          </View>
          {!canContinue ? (
            <>
              <View style={styles.form}>
                <View>
                  <BoldText>Amount</BoldText>
                  <View style={styles.textInputContainer}>
                    <Pressable
                      onPress={() => setModalOpen(true)}
                      style={styles.symbolContainer}>
                      <FlagSelect
                        country={selectedCurrency.currency}
                        style={styles.flag}
                      />
                      <BoldText style={styles.symbol}>
                        {selectedCurrency.acronym}
                      </BoldText>
                      <FaIcon name="chevron-down" color={'#868585'} />
                    </Pressable>
                    <TextInput
                      style={{
                        ...styles.textInput,
                        borderColor:
                          errorKey === 'amountInput' ? 'red' : '#ccc',
                      }}
                      inputMode="numeric"
                      value={amountInput}
                      onChangeText={text => handleChange(text)}
                      onBlur={handleBlur}
                    />
                  </View>
                </View>
                <View>
                  <BoldText>Description</BoldText>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      style={{
                        ...styles.textInput,
                        ...styles.descTextInput,
                        borderColor: errorKey === 'desc' ? 'red' : '#ccc',
                      }}
                      inputMode="text"
                      onChangeText={text => {
                        setDesc(text);
                        editInput();
                      }}
                      value={desc}
                      maxLength={16}
                    />
                  </View>
                </View>
                <ErrorMessage errorMessage={errorMessage} />
                <View style={styles.feeTextInputContainer}>
                  <BoldText style={styles.feeSymbol}>
                    {selectedCurrency.symbol}
                  </BoldText>
                  <View
                    style={{ ...styles.feeTextInput, ...styles.feeToReceive }}>
                    <RegularText>
                      {amountInput > 0 && amountInput - fee} to be received
                    </RegularText>
                  </View>
                  <View style={styles.fee}>
                    <RegularText style={styles.feeText}>
                      Service Charged
                    </RegularText>
                    <RegularText style={styles.feeText}>
                      {selectedCurrency.symbol}:{fee}
                    </RegularText>
                  </View>
                </View>
              </View>
              <Button
                text={'Continue'}
                style={styles.button}
                onPress={handleContinue}
              />
            </>
          ) : (
            <View>
              <View style={styles.pinContainer} key={reload}>
                {haveSetPin ? (
                  <>
                    <RegularText>Enter your transaction pin</RegularText>
                    <View style={styles.changePinCodeLengthsContainer}>
                      {codeLengths.map(input => (
                        <PINInput
                          key={input}
                          codeLength={input}
                          focusIndex={focusIndex}
                          setFocusIndex={setFocusIndex}
                          pinCode={pinCode}
                          setPinCode={setPinCode}
                          setErrorMessage={setErrorMessage}
                          errorKey={errorKey}
                          setErrorKey={setErrorKey}
                          codeLengths={codeLengths.length}
                        />
                      ))}
                    </View>
                  </>
                ) : (
                  <NoPInSet
                    otpCode={otpCode}
                    setOtpCode={setOtpCode}
                    setErrorMessage={setErrorMessage}
                    errorKey={errorKey}
                    setErrorKey={setErrorKey}
                  />
                )}
              </View>
              <ErrorMessage errorMessage={errorMessage} />
              <View style={styles.footer}>
                <View style={styles.footerCard}>
                  <BoldText style={styles.cardAmount}>
                    {selectedCurrency.symbol}
                    {amountInput}
                  </BoldText>
                  <View style={styles.footerCardDetails}>
                    <View style={styles.cardLine}>
                      <RegularText style={styles.cardKey}>
                        Account Number
                      </RegularText>
                      <BoldText style={styles.cardValue}>
                        {userToSendTo.tagName}
                      </BoldText>
                    </View>
                    <View style={styles.cardLine}>
                      <RegularText style={styles.cardKey}>
                        Account Name
                      </RegularText>
                      <BoldText style={styles.cardValue}>
                        {userToSendTo.fullName}
                      </BoldText>
                    </View>
                    <View style={styles.cardLine}>
                      <RegularText style={styles.cardKey}>Amount</RegularText>
                      <BoldText style={styles.cardValue}>
                        {selectedCurrency.symbol}
                        {amountInput}
                      </BoldText>
                    </View>
                    <View style={styles.cardLine}>
                      <RegularText style={styles.cardKey}>
                        Payment Method
                      </RegularText>
                      <BoldText
                        style={{ ...styles.cardValue, color: '#006E53' }}>
                        Balance
                      </BoldText>
                    </View>
                    <View style={styles.cardLine}>
                      <RegularText style={styles.cardKey}>
                        Transaction Fees
                      </RegularText>
                      <BoldText style={styles.cardValue}>{fee}</BoldText>
                    </View>
                  </View>
                </View>
                <Button
                  text={'Pay now'}
                  onPress={handlePay}
                  style={styles.button}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </PageContainer>
      <SelectCurrencyModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 5 + '%',
  },
  header: {
    fontSize: 18,
    marginTop: 10,
  },
  userIconContainer: {
    marginVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  userIconStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#979797',
  },
  nonUserIconStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(160, 160, 160, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagName: {
    textAlign: 'center',
    marginTop: 5,
  },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
  },
  form: {
    gap: 30,
  },
  textInputContainer: {
    position: 'relative',
    marginTop: 10,
  },
  flag: { width: 20, height: 20 },
  textInput: {
    borderRadius: 10,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-700',
    fontSize: 20,
    paddingLeft: 100,
    paddingRight: 15,
    paddingVertical: 10,
    borderWidth: 1,
  },
  descTextInput: {
    paddingLeft: 15,
    fontFamily: 'OpenSans-500',
    fontSize: 14,
  },
  symbolContainer: {
    position: 'absolute',
    zIndex: 9,
    left: 5,
    borderRightWidth: 1,
    borderRightColor: '#868585',
    paddingRight: 5,
    height: 100 + '%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  symbol: {
    color: '#000',
    fontSize: 12,
  },
  feeTextInputContainer: {
    position: 'relative',
    marginBottom: 40,
    marginTop: 10,
  },
  feeTextInput: {
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
  toReceive: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  feeSymbol: {
    position: 'absolute',
    fontSize: 18,
    zIndex: 9,
    top: 15,
    left: 15,
    color: '#525252',
  },
  fee: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
    backgroundColor: '#1E1E1E',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  feeText: {
    color: '#f9f9f9',
    fontSize: 13,
  },
  button: {
    marginBottom: 50,
  },
  pinContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  changePinCodeLengthsContainer: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    marginTop: 10,
  },
  footer: {
    marginTop: 50,
  },
  footerCard: {
    backgroundColor: '#efe2e2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 30,
    borderRadius: 5,
    marginBottom: 30,
  },
  footerCardDetails: {
    gap: 10,
  },
  cardAmount: {
    fontSize: 24,
    marginBottom: 30,
  },
  cardLine: {
    flexDirection: 'row',
    width: 100 + '%',
  },
  cardKey: {
    flex: 1,
    color: '#525252',
    fontFamily: 'OpenSans-600',
  },
  cardValue: {
    flex: 1,
    textAlign: 'right',
    color: '#525252',
  },
});
export default TransaferFunds;

const NoPInSet = ({
  otpCode,
  setOtpCode,
  setErrorMessage,
  errorKey,
  setErrorKey,
}) => {
  const [focusIndex, setFocusIndex] = useState(1);
  const codeLengths = [1, 2, 3, 4, 5, 6];

  return (
    <>
      <RegularText>Enter six digit Pin sent to your mail</RegularText>
      <View style={styles.changePinCodeLengthsContainer}>
        {codeLengths.map(codeLength => (
          <OTPInput
            key={codeLength}
            codeLength={codeLength}
            focusIndex={focusIndex}
            setFocusIndex={setFocusIndex}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            setErrorMessage={setErrorMessage}
            errorKey={errorKey}
            setErrorKey={setErrorKey}
            codeLengths={codeLengths.length}
          />
        ))}
      </View>
    </>
  );
};
