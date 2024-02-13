/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import Button from '../../../components/Button';
import RegularText from '../../../components/fonts/RegularText';
import Check from '../../../../assets/images/check.svg';
import Xmark from '../../../../assets/images/cancel.svg';
import Block from '../../../../assets/images/block.svg';
import Back from '../../../components/Back';
import { postFetchData } from '../../../../utils/fetchAPI';
import ToastMessage from '../../../components/ToastMessage';
import { AppContext } from '../../../components/AppContext';
import { Audio } from 'expo-av';
import UserIcon from '../../../components/UserIcon';
import { randomUUID } from 'expo-crypto';
import ErrorMessage from '../../../components/ErrorMessage';
import FlagSelect from '../../../components/FlagSelect';
import { useWalletContext } from '../../../context/WalletContext';
import { addingDecimal } from '../../../../utils/AddingZero';
import { allCurrencies } from '../../../database/data';

const RequestStatus = ({ navigation, route }) => {
  const { selectedCurrency, setWalletRefresh, setIsLoading, vh } =
    useContext(AppContext);
  const {
    amount,
    symbol,
    requesterAccount: tagName,
    requesterPhoto,
  } = route.params;
  const [isCancelled, setIsCancelled] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(route.params.status);
  const [errorKey, setErrorKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [amountInput, setAmountInput] = useState(null);
  const { wallet } = useWalletContext();
  const currency = allCurrencies.find(
    index => index.currency === route.params?.currency,
  );

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../../assets/success.mp3'),
      );
      await sound.playAsync();
    };
    status === 'accept' && playSound();
  }, [status]);

  const handleChange = async text => {
    setAmountInput(text);
    setErrorMessage('');
    setErrorKey('');
    if (text > wallet[`${currency?.currency}Balance`]) {
      setErrorKey('amountInput');
      setErrorMessage('Insufficient funds');
    }
  };

  const handleBlur = () => {
    amountInput && setAmountInput(addingDecimal(amountInput));
  };

  const handleConfirm = async selectedStatus => {
    try {
      if (selectedStatus === 'accept') {
        return navigation.replace('PendingRequestConfirm', {
          status: selectedStatus,
          ...route.params,
        });
      } else if (selectedStatus === 'edit') {
        setIsEditing(true);
        if (isEditing) {
          if (!amountInput) {
            setErrorMessage('Please provide the amount to be transferred');
            setErrorKey('amountInput');
          } else if (!Number(amountInput)) {
            setErrorMessage('Please provide a valid amount');
            setErrorKey('amountInput');
          } else if (amountInput < currency?.minimumAmountToAdd) {
            setErrorMessage(
              `Minimum transfer amount is ${selectedCurrency.symbol}${currency?.minimumAmountToAdd}`,
            );
            setErrorKey('amountInput');
          } else if (amountInput > wallet.balance) {
            setErrorKey('amountInput');
            setErrorMessage('Insufficient funds');
          } else {
            navigation.replace('PendingRequestConfirm', {
              status: 'accept',
              ...route.params,
              amount: amountInput,
            });
          }
        }
      } else {
        setStatus(selectedStatus);
      }
    } catch (err) {
      ToastMessage(err.message);
    }
  };

  const handleHome = () => {
    navigation.popToTop();
    navigation.navigate('HomeNavigator');
  };

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      const response = await postFetchData('user/request-confirm', {
        id: randomUUID(),
        ...route.params,
        status: 'decline',
      });

      if (response.status === 200) {
        setIsCancelled(true);
        setWalletRefresh(prev => !prev);
      }
      throw new Error(response.data);
    } catch (err) {
      ToastMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async () => {
    setIsCancelled(false);
    try {
      setIsLoading(true);
      const response = await postFetchData('user/request-confirm', {
        id: randomUUID(),
        ...route.params,
        status: 'block',
      });

      if (response.status === 200) {
        setWalletRefresh(prev => !prev);
        setIsBlocking(false);
        setIsBlocked(true);
        return ToastMessage(response.data);
      }
      throw new Error(response.data);
    } catch (err) {
      ToastMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return !status ? (
    <>
      <Back goBack={navigation.goBack} route={route} />
      <PageContainer
        style={{ ...styles.container, minHeight: vh * 0.8 }}
        scroll>
        <View style={styles.icon}>
          <UserIcon
            uri={requesterPhoto}
            style={{ width: 70, height: 70, borderRadius: 40 }}
          />
          <RegularText style={styles.headerText}>
            <BoldText>#{tagName} </BoldText> has requested the sum of{' '}
            {symbol + addingDecimal(Number(amount).toLocaleString())} and will
            be debited from you account, you can accept, decline or edit
            original amount to
            <BoldText> #{tagName}</BoldText>.
          </RegularText>
        </View>
        {isEditing ? (
          <>
            <View>
              <View>
                <BoldText>New amount</BoldText>
                <View style={styles.textInputContainer}>
                  <Pressable style={styles.symbolContainer}>
                    <FlagSelect
                      country={currency?.currency}
                      style={styles.flag}
                    />
                    <BoldText style={styles.symbol}>
                      {currency?.acronym}
                    </BoldText>
                  </Pressable>
                  <TextInput
                    style={{
                      ...styles.textInput,
                      borderColor: errorKey === 'amountInput' ? 'red' : '#ccc',
                    }}
                    inputMode="decimal"
                    value={amountInput}
                    onChangeText={text => handleChange(text)}
                    onBlur={handleBlur}
                  />
                </View>
              </View>
              <ErrorMessage
                errorMessage={errorMessage}
                style={styles.errorMessage}
              />
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
                    onChangeText={text => {}}
                    maxLength={40}
                    placeholder="optional"
                  />
                </View>
              </View>
            </View>
            <Button
              text="Update and Pay"
              onPress={() => handleConfirm('edit')}
            />
          </>
        ) : (
          <View>
            <Button text={'Accept'} onPress={() => handleConfirm('accept')} />
            <Button
              text={'Edit Amount'}
              style={styles.button}
              color={'#000'}
              onPress={() => handleConfirm('edit')}
            />
            <Button
              text={'Decline'}
              style={styles.decline}
              onPress={() => handleConfirm('decline')}
            />
          </View>
        )}
      </PageContainer>
    </>
  ) : status === 'accept' ? (
    <PageContainer style={styles.container}>
      <View style={styles.header}>
        <Check />
        <BoldText style={styles.headerText}>Successful</BoldText>
      </View>
      <View style={styles.body}>
        <RegularText style={styles.topText}>
          You’ve successfully accepted the request of{' '}
          {symbol + addingDecimal(Number(amount).toLocaleString())} from
          <BoldText> #{tagName}</BoldText>
        </RegularText>
      </View>
      <View style={styles.buttonContainer}>
        <Button text={'Back Home'} onPress={handleHome} />
      </View>
    </PageContainer>
  ) : (
    <>
      {!isCancelled && !isBlocking && !isBlocked && (
        <>
          <Back goBack={navigation.goBack} route={route} />
          <PageContainer style={styles.container}>
            <View style={styles.header}>
              <Xmark />
              <BoldText style={styles.headerText}>Cancel Request</BoldText>
            </View>
            <View style={styles.body}>
              <RegularText style={styles.topText}>
                You’re about cancelling the request of{' '}
                {symbol + addingDecimal(Number(amount).toLocaleString())} from
                <BoldText> #{tagName}</BoldText>
              </RegularText>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                text={'Cancel and Block'}
                style={styles.button}
                color={'#000'}
                onPress={() => setIsBlocking(true)}
              />
              <Button text={'Cancel Transaction'} onPress={handleCancel} />
            </View>
          </PageContainer>
        </>
      )}
      {isBlocking && (
        <>
          <Back goBack={navigation.goBack} route={route} />
          <PageContainer style={styles.container}>
            <View style={styles.header}>
              <Block />
              <BoldText style={styles.headerText}>
                Report and Block User
              </BoldText>
            </View>
            <View style={styles.body}>
              <RegularText style={styles.topText}>
                You’re about to block<BoldText> #{tagName}</BoldText>.
                <BoldText> #{tagName}</BoldText> won’t be able to request money
                from you again.
              </RegularText>
            </View>
            <View style={styles.button2}>
              <Button text={'Cancel and Block'} onPress={handleBlock} />
            </View>
          </PageContainer>
        </>
      )}
      {isBlocked && (
        <PageContainer style={styles.container}>
          <View style={styles.header}>
            <Block />
            <BoldText style={styles.headerText}>
              #{tagName} has been blocked
            </BoldText>
          </View>
          <View style={styles.body}>
            <RegularText style={styles.topText}>
              You’ve successfully blocked
              <BoldText> #{tagName} </BoldText>
              from requesting money.
            </RegularText>
          </View>
          <View style={styles.button2}>
            <Button text={'Back Home'} onPress={handleHome} />
          </View>
        </PageContainer>
      )}
      {isCancelled && (
        <PageContainer style={styles.container}>
          <View style={styles.header}>
            <Xmark />
            <BoldText style={styles.headerText}>
              Request Cancelled Successfully
            </BoldText>
          </View>
          <View style={styles.body}>
            <RegularText style={styles.topText}>
              You’ve successfully cancelled the request of{' '}
              {symbol + amount.toLocaleString()} from
              <BoldText> #{tagName} </BoldText>
            </RegularText>
          </View>
          <View style={styles.button2}>
            <Button text={'Back Home'} onPress={handleHome} />
          </View>
        </PageContainer>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    gap: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    justifyContent: 'center',
    gap: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
  },
  topText: {
    marginVertical: 5 + '%',
    fontSize: 20,
    textAlign: 'center',
  },
  bottomText: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#fff',
    color: '#000',
    borderWidth: 1,
  },
  decline: {
    backgroundColor: 'red',
    justifyContent: 'center',
  },
  textInputContainer: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 30,
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
    paddingLeft: 80,
    paddingRight: 15,
    paddingVertical: 10,
    borderWidth: 1,
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
  descTextInput: {
    paddingLeft: 15,
    fontFamily: 'OpenSans-500',
    fontSize: 14,
  },
  errorMessage: {
    marginTop: -15,
  },
});
export default RequestStatus;
