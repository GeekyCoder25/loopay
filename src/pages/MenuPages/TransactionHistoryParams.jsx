/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { allCurrencies } from '../../database/data';
import { addingDecimal } from '../../../utils/AddingZero';
import UserIcon from '../../components/UserIcon';
import SwapIcon from '../../../assets/images/swap.svg';
import { networkProvidersIcon } from '../SendMenuPages/AirtimeTopUp/BuyAirtime';
import Button from '../../components/Button';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { AppContext } from '../../components/AppContext';
import { billIcon } from './TransactionHistory';
import { setShowBalance } from '../../../utils/storage';
import ToastMessage from '../../components/ToastMessage';
import useFetchData from '../../../utils/fetchAPI';
import { printToFileAsync } from 'expo-print';
import LoadingModal from '../../components/LoadingModal';
import { useNavigation } from '@react-navigation/native';

const TransactionHistoryParams = ({ route }) => {
  const navigation = useNavigation();
  const { postFetchData } = useFetchData();
  const { vh, setRefetchTransactions, showAmount, setShowAmount, isAdmin } =
    useContext(AppContext);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const history = route.params;
  const {
    status,
    senderName,
    receiverName,
    senderPhoto,
    receiverPhoto,
    amount,
    fromBalance,
    toBalance,
    transactionType,
    method,
    createdAt,
    sourceBank,
    destinationBank,
    senderAccount,
    receiverAccount,
    currency,
    description,
    reference,
    userPhoto,
    fullName,
    accNo,
    swapFrom,
    swapTo,
    swapFromAmount,
    swapToAmount,
    swapRate,
    networkProvider,
    rechargePhoneNo,
    dataPlan,
    billName,
    billType,
    token,
    email,
    rate,
  } = history;

  const [statusState, setStatusState] = useState(status);
  const currencySymbol = allCurrencies.find(
    id => currency === id.currency || currency === id.acronym,
  )?.symbol;
  const currencyAcronym = allCurrencies.find(
    id => currency === id.currency || currency === id.acronym,
  )?.acronym;

  const transactionDate = `${new Date(
    createdAt || history.transactionDate,
  ).toLocaleDateString()} ${new Date(
    createdAt || history.transactionDate,
  ).toLocaleTimeString()}
  `;

  const swapFromSymbol = allCurrencies.find(
    id => swapFrom === id.currency,
  )?.symbol;

  const swapToSymbol = allCurrencies.find(id => swapTo === id.currency)?.symbol;

  const statusColor = () => {
    switch (statusState) {
      case 'success':
        return (
          <View style={styles.status}>
            <FaIcon
              name="check-circle-o"
              style={{ ...styles.faIcon, color: '#38b34a' }}
            />
            <BoldText style={{ color: '#38b34a', ...styles.statusText }}>
              {statusState}
            </BoldText>
          </View>
        );
      case 'pending':
        return (
          <View style={styles.status}>
            <FaIcon
              name="clock-o"
              style={{ ...styles.faIcon, color: '#ffa500' }}
            />
            <BoldText style={{ color: '#ffa500', ...styles.statusText }}>
              {statusState}
            </BoldText>
          </View>
        );
      case 'reversed':
        return (
          <View style={styles.status}>
            <FaIcon
              name="undo"
              style={{ ...styles.faIcon, color: '#ffa500' }}
            />
            <BoldText style={{ color: '#ffa500', ...styles.statusText }}>
              {statusState}
            </BoldText>
          </View>
        );
      case 'refunded':
        return (
          <View style={styles.status}>
            <FaIcon
              name="undo"
              style={{ ...styles.faIcon, color: '#ffa500' }}
            />
            <BoldText style={{ color: '#ffa500', ...styles.statusText }}>
              {statusState}
            </BoldText>
          </View>
        );
      case 'declined':
        return (
          <View style={styles.status}>
            <FaIcon
              name="close"
              style={{ ...styles.faIcon, color: 'rgb(255, 0, 0)' }}
            />
            <BoldText style={{ color: 'rgb(255, 0, 0)', ...styles.statusText }}>
              {statusState}
            </BoldText>
          </View>
        );
      case 'abandoned':
        return (
          <View style={styles.status}>
            <FaIcon
              name="close"
              style={{ ...styles.faIcon, color: '#ff0000' }}
            />
            <BoldText style={{ color: '#ff0000', ...styles.statusText }}>
              {statusState}
            </BoldText>
          </View>
        );
    }
  };

  useEffect(() => {
    if (statusState === 'reversed') {
      if (transactionType === 'credit') setStatusState('reversed');
      else if (transactionType === 'debit') setStatusState('refunded');
    }
  }, [statusState, transactionType]);

  const handleReverse = async () => {
    try {
      setIsLocalLoading(true);
      const response = await postFetchData('admin/transfer/reverse', {
        reference,
      });

      if (response.status === 200) {
        setRefetchTransactions(prev => !prev);
        if (response.data.message === 'Transaction reversed') {
          if (transactionType === 'credit') setStatusState('reversed');
          else if (transactionType === 'debit') setStatusState('refunded');
          return ToastMessage(response.data.message);
        } else if (response.data.message === 'Transaction unreversed') {
          setStatusState('success');
          return ToastMessage(response.data.message);
        }
      }
      ToastMessage(response.data.message);
    } catch (error) {
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleReport = () => {
    navigation.navigate('Report', history);
  };

  const handleShare = async () => {
    try {
      setIsLocalLoading(true);
      const response = await postFetchData('user/receipt', {
        id: reference,
        type: transactionType,
        allCurrencies,
      });

      if (response.status === 200) {
        const sharePDF = async uri => {
          try {
            setIsLocalLoading(true);
            const directory = FileSystem.documentDirectory;

            const newUri = `${directory}Loopay_Receipt_${reference}.pdf`;

            await FileSystem.moveAsync({
              from: uri,
              to: newUri,
            });
            await shareAsync(newUri, {
              UTI: '.pdf',
              mimeType: 'application/pdf',
              dialogTitle: 'Share Receipt',
            });
          } catch (error) {
            ToastMessage(error.message);
          } finally {
            setIsLocalLoading(false);
          }
        };

        const { uri } = await printToFileAsync({
          html: response.data.html,
          height: 892,
        });

        await sharePDF(uri);
      } else {
        throw new Error(response.data.error || 'Server Error');
      }
    } catch (error) {
      ToastMessage("Can't generate receipt");
      setIsLocalLoading(false);
    }
  };

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };

  const transactionMethod = (() => {
    switch (method) {
      case 'intra':
        return 'Loopay to Loopay transfer';
      case 'card':
        return 'Card Self';
      case 'deposit':
        return 'Transfer Self';
      default:
        return 'Local bank transfer';
    }
  })();

  const transactionRate = () =>
    ['euro', 'dollar', 'pound'].includes(currency) && (
      <View style={styles.cardLine}>
        <RegularText style={styles.cardKey}>Rate</RegularText>
        <BoldText style={styles.cardValue}>{rate}</BoldText>
      </View>
    );

  const emailFieldRow = isAdmin && (
    <View style={styles.cardLine}>
      <RegularText style={styles.cardKey}>Email</RegularText>
      <Pressable
        style={styles.cardValue}
        onPress={() => navigation.navigate('UserDetails', { email })}>
        <BoldText style={styles.cardValue}>{email}</BoldText>
      </Pressable>
    </View>
  );

  return (
    <>
      <Modal visible={isLocalLoading} transparent>
        <LoadingModal isLoading={isLocalLoading} />
      </Modal>
      <PageContainer justify={true} scroll avoidBounce>
        <BoldText style={styles.historyHeader}>Transaction history</BoldText>
        <View style={{ ...styles.body, minHeight: vh * 0.5 }}>
          {transactionType?.toLowerCase() === 'credit' && (
            <>
              <View style={styles.headerContainer}>
                <Pressable
                  onPress={() =>
                    navigation.navigate('UserDetails', {
                      email,
                      previousScreen: 'History',
                    })
                  }>
                  <UserIcon uri={senderPhoto} />
                </Pressable>
                <View>
                  {method ? (
                    <BoldText>{receiverName}</BoldText>
                  ) : (
                    <BoldText>{senderName}</BoldText>
                  )}
                  <RegularText style={styles.accNo}>
                    {senderAccount}
                  </RegularText>
                </View>
              </View>

              <View style={styles.modalBorder} />

              <View style={styles.footerCard}>
                <Pressable onPress={handleShow}>
                  <BoldText style={styles.cardAmount}>
                    {!showAmount
                      ? '***'
                      : '+ ' +
                        currencySymbol +
                        addingDecimal(Number(amount).toLocaleString())}
                  </BoldText>
                </Pressable>
                <View style={styles.footerCardDetails}>
                  {emailFieldRow}
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Status</RegularText>
                    {statusColor()}
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction type
                    </RegularText>
                    <BoldText style={{ ...styles.cardValue, color: '#38b34a' }}>
                      Credit
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Amount</RegularText>
                    <BoldText style={styles.cardValue}>
                      {showAmount
                        ? currencySymbol +
                          addingDecimal(Number(amount).toLocaleString())
                        : '***'}
                    </BoldText>
                  </View>
                  {isAdmin && (
                    <View style={styles.cardLine}>
                      <RegularText style={styles.cardKey}>
                        From Balance
                      </RegularText>
                      <BoldText style={styles.cardValue}>
                        {currencySymbol +
                          addingDecimal(
                            Number(fromBalance / 100).toLocaleString(),
                          )}
                      </BoldText>
                    </View>
                  )}
                  {isAdmin && (
                    <View style={styles.cardLine}>
                      <RegularText style={styles.cardKey}>
                        To Balance
                      </RegularText>
                      <BoldText style={styles.cardValue}>
                        {currencySymbol +
                          addingDecimal(
                            Number(toBalance / 100).toLocaleString(),
                          )}
                      </BoldText>
                    </View>
                  )}
                  {method === 'card' ? (
                    <>
                      <View style={styles.cardLine}>
                        <RegularText style={styles.cardKey}>Card</RegularText>
                        <BoldText style={styles.cardValue}>
                          {senderName}
                        </BoldText>
                      </View>
                      <View style={styles.cardLine}>
                        <RegularText style={styles.cardKey}>
                          Source Bank
                        </RegularText>
                        <BoldText style={styles.cardValue}>
                          {sourceBank}
                        </BoldText>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.cardLine}>
                        <RegularText style={styles.cardKey}>
                          Sender Name
                        </RegularText>
                        <BoldText style={styles.cardValue}>
                          {senderName}
                        </BoldText>
                      </View>
                      <View style={styles.cardLine}>
                        <RegularText style={styles.cardKey}>
                          Sender Bank
                        </RegularText>
                        <BoldText style={styles.cardValue}>
                          {sourceBank}
                        </BoldText>
                      </View>
                      <View style={styles.cardLine}>
                        <RegularText style={styles.cardKey}>
                          Sender Account
                        </RegularText>
                        <BoldText style={styles.cardValue}>
                          {senderAccount}
                        </BoldText>
                      </View>
                    </>
                  )}

                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Description
                    </RegularText>
                    <BoldText style={styles.cardValue}>{description}</BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Reference</RegularText>
                    <BoldText style={styles.cardValue}>{reference}</BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction Method
                    </RegularText>
                    <BoldText style={styles.cardValue}>
                      {transactionMethod}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction Date
                    </RegularText>
                    <BoldText
                      style={{
                        ...styles.cardValue,
                        textTransform: 'uppercase',
                      }}>
                      {transactionDate}
                    </BoldText>
                  </View>
                </View>
              </View>
            </>
          )}
          {transactionType?.toLowerCase() === 'debit' && (
            <>
              <View style={styles.headerContainer}>
                <Pressable
                  onPress={() => navigation.navigate('UserDetails', { email })}>
                  <UserIcon uri={receiverPhoto} />
                </Pressable>
                <View>
                  <BoldText style={styles.name}>{receiverName}</BoldText>
                  <RegularText style={styles.accNo}>
                    {receiverAccount}
                  </RegularText>
                </View>
              </View>

              <View style={styles.modalBorder} />

              <View style={styles.footerCard}>
                <Pressable onPress={handleShow}>
                  <BoldText style={styles.cardAmount}>
                    {!showAmount
                      ? '***'
                      : '- ' +
                        currencySymbol +
                        addingDecimal(Number(amount).toLocaleString())}
                  </BoldText>
                </Pressable>
                <View style={styles.footerCardDetails}>
                  {emailFieldRow}
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Status</RegularText>
                    {statusColor()}
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction type
                    </RegularText>
                    <BoldText style={{ ...styles.cardValue, color: '#ff0000' }}>
                      Debit
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Amount</RegularText>
                    <BoldText style={styles.cardValue}>
                      {showAmount
                        ? currencySymbol +
                          addingDecimal(Number(amount).toLocaleString())
                        : '***'}
                    </BoldText>
                  </View>
                  {isAdmin && (
                    <View style={styles.cardLine}>
                      <RegularText style={styles.cardKey}>
                        From Balance
                      </RegularText>
                      <BoldText style={styles.cardValue}>
                        {currencySymbol +
                          addingDecimal(
                            Number(fromBalance / 100).toLocaleString(),
                          )}
                      </BoldText>
                    </View>
                  )}
                  {isAdmin && (
                    <View style={styles.cardLine}>
                      <RegularText style={styles.cardKey}>
                        To Balance
                      </RegularText>
                      <BoldText style={styles.cardValue}>
                        {currencySymbol +
                          addingDecimal(
                            Number(toBalance / 100).toLocaleString(),
                          )}
                      </BoldText>
                    </View>
                  )}
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Receiver Name
                    </RegularText>
                    <BoldText style={styles.cardValue}>{receiverName}</BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Receiver Bank
                    </RegularText>
                    <BoldText style={styles.cardValue}>
                      {destinationBank}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Receiver Account
                    </RegularText>
                    <BoldText style={styles.cardValue}>
                      {receiverAccount}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Description
                    </RegularText>
                    <BoldText style={styles.cardValue}>{description}</BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Reference</RegularText>
                    <BoldText style={styles.cardValue}>{reference}</BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Payment Wallet
                    </RegularText>
                    <BoldText style={{ ...styles.cardValue, color: '#38b34a' }}>
                      {currencyAcronym} Balance
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction Method
                    </RegularText>
                    <BoldText style={styles.cardValue}>
                      {transactionMethod}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction Date
                    </RegularText>
                    <BoldText
                      style={{
                        ...styles.cardValue,
                        textTransform: 'uppercase',
                      }}>
                      {transactionDate}
                    </BoldText>
                  </View>
                </View>
              </View>
            </>
          )}
          {transactionType?.toLowerCase() === 'airtime' && (
            <>
              <View style={styles.headerContainer}>
                {networkProvidersIcon(networkProvider)}
                <View>
                  <BoldText style={styles.name}>{rechargePhoneNo}</BoldText>
                  <RegularText style={styles.accNo}>Airtime</RegularText>
                </View>
              </View>

              <View style={styles.modalBorder} />

              <View style={styles.footerCard}>
                <Pressable onPress={handleShow}>
                  <BoldText style={styles.cardAmount}>
                    {!showAmount
                      ? '***'
                      : '- ' +
                        currencySymbol +
                        addingDecimal(Number(amount).toLocaleString())}
                  </BoldText>
                </Pressable>
                <View style={styles.footerCardDetails}>
                  {emailFieldRow}
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Status</RegularText>
                    {statusColor()}
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction type
                    </RegularText>
                    <BoldText style={{ ...styles.cardValue, color: '#ff0000' }}>
                      Debit
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Amount</RegularText>
                    <BoldText style={styles.cardValue}>
                      {showAmount
                        ? currencySymbol +
                          addingDecimal(Number(amount).toLocaleString())
                        : '***'}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Phone Number
                    </RegularText>
                    <BoldText style={styles.cardValue}>
                      {rechargePhoneNo}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Network</RegularText>
                    <BoldText style={styles.cardValue}>
                      {networkProvider}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Reference</RegularText>
                    <BoldText style={styles.cardValue}>{reference}</BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Payment Wallet
                    </RegularText>
                    <BoldText style={{ ...styles.cardValue, color: '#38b34a' }}>
                      {currencyAcronym} Balance
                    </BoldText>
                  </View>
                  {transactionRate()}
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction Date
                    </RegularText>
                    <BoldText
                      style={{
                        ...styles.cardValue,
                        textTransform: 'uppercase',
                      }}>
                      {transactionDate}
                    </BoldText>
                  </View>
                </View>
              </View>
            </>
          )}
          {transactionType?.toLowerCase() === 'data' && (
            <>
              <View style={styles.headerContainer}>
                {networkProvidersIcon(networkProvider)}
                <View>
                  <BoldText style={styles.name}>{rechargePhoneNo}</BoldText>
                  <RegularText style={styles.accNo}>Data</RegularText>
                </View>
              </View>

              <View style={styles.modalBorder} />

              <View style={styles.footerCard}>
                <Pressable onPress={handleShow}>
                  <BoldText style={styles.cardAmount}>
                    {!showAmount
                      ? '***'
                      : '- ' +
                        currencySymbol +
                        addingDecimal(Number(amount).toLocaleString())}
                  </BoldText>
                </Pressable>
                <View style={styles.footerCardDetails}>
                  {emailFieldRow}
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Status</RegularText>
                    {statusColor()}
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction type
                    </RegularText>
                    <BoldText style={{ ...styles.cardValue, color: '#ff0000' }}>
                      Debit
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Amount</RegularText>
                    <BoldText style={styles.cardValue}>
                      {showAmount
                        ? currencySymbol +
                          addingDecimal(Number(amount).toLocaleString())
                        : '***'}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Phone Number
                    </RegularText>
                    <BoldText style={styles.cardValue}>
                      {rechargePhoneNo}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Network</RegularText>
                    <BoldText style={styles.cardValue}>
                      {networkProvider}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Data Plan</RegularText>
                    <BoldText style={styles.cardValue}>
                      {dataPlan.value}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Reference</RegularText>
                    <BoldText style={styles.cardValue}>{reference}</BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Payment Wallet
                    </RegularText>
                    <BoldText style={{ ...styles.cardValue, color: '#38b34a' }}>
                      {currencyAcronym} Balance
                    </BoldText>
                  </View>
                  {transactionRate()}
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction Date
                    </RegularText>
                    <BoldText
                      style={{
                        ...styles.cardValue,
                        textTransform: 'uppercase',
                      }}>
                      {transactionDate}
                    </BoldText>
                  </View>
                </View>
              </View>
            </>
          )}
          {transactionType?.toLowerCase() === 'bill' && (
            <>
              <View style={styles.headerContainer}>
                <View style={styles.historyIconText}>{billIcon(billType)}</View>
                <View>
                  <BoldText style={styles.name}>{billName}</BoldText>
                  <RegularText style={styles.accNo}>Bill Payment</RegularText>
                </View>
              </View>

              <View style={styles.modalBorder} />

              <View style={styles.footerCard}>
                <Pressable onPress={handleShow}>
                  <BoldText style={styles.cardAmount}>
                    {!showAmount
                      ? '***'
                      : '- ' +
                        currencySymbol +
                        addingDecimal(Number(amount).toLocaleString())}
                  </BoldText>
                </Pressable>
                <View style={styles.footerCardDetails}>
                  {emailFieldRow}
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Status</RegularText>
                    {statusColor()}
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction type
                    </RegularText>
                    <BoldText style={{ ...styles.cardValue, color: '#ff0000' }}>
                      Debit
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Amount</RegularText>
                    <BoldText style={styles.cardValue}>
                      {showAmount
                        ? currencySymbol +
                          addingDecimal(Number(amount).toLocaleString())
                        : '***'}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Bill Plan</RegularText>
                    <BoldText style={styles.cardValue}>{billName}</BoldText>
                  </View>
                  {token && (
                    <View style={styles.cardLine}>
                      <RegularText style={styles.cardKey}>Token</RegularText>
                      <BoldText
                        style={{ ...styles.cardValue, color: '#38b34a' }}>
                        {token}
                      </BoldText>
                    </View>
                  )}
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Reference</RegularText>
                    <BoldText style={styles.cardValue}>{reference}</BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Payment Wallet
                    </RegularText>
                    <BoldText style={{ ...styles.cardValue, color: '#38b34a' }}>
                      {currencyAcronym} Balance
                    </BoldText>
                  </View>
                  {transactionRate()}
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction Date
                    </RegularText>
                    <BoldText
                      style={{
                        ...styles.cardValue,
                        textTransform: 'uppercase',
                      }}>
                      {transactionDate}
                    </BoldText>
                  </View>
                </View>
              </View>
            </>
          )}

          {transactionType?.toLowerCase() === 'swap' && (
            <>
              <View style={styles.headerContainer}>
                <UserIcon uri={userPhoto} />
                <View>
                  <BoldText style={styles.name}>{fullName}</BoldText>
                  <RegularText style={styles.accNo}>{accNo}</RegularText>
                </View>
              </View>

              <View style={styles.modalBorder} />

              <View style={styles.footerCard}>
                <View style={styles.cardAmountContainer}>
                  {showAmount ? (
                    <>
                      <BoldText style={{ ...styles.cardAmount }}>
                        {`${swapFromSymbol}${addingDecimal(
                          Number(swapFromAmount).toLocaleString(),
                        )}`}
                      </BoldText>
                      <SwapIcon
                        width={24}
                        height={24}
                        style={styles.swapIcon}
                      />
                      <BoldText style={{ ...styles.cardAmount }}>
                        {`${swapToSymbol}${addingDecimal(
                          Number(swapToAmount).toLocaleString(),
                        )}`}
                      </BoldText>
                    </>
                  ) : (
                    <BoldText style={{ ...styles.cardAmount }}>***</BoldText>
                  )}
                </View>

                <View style={styles.footerCardDetails}>
                  {emailFieldRow}
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Status</RegularText>
                    {statusColor()}
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction type
                    </RegularText>
                    <BoldText style={styles.cardValue}>Swap</BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Swap from</RegularText>
                    <BoldText
                      style={{ ...styles.cardValue, ...styles.statusText }}>
                      {swapFrom}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Swap to</RegularText>
                    <BoldText
                      style={{ ...styles.cardValue, ...styles.statusText }}>
                      {swapTo}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Swap from amount
                    </RegularText>
                    <BoldText style={styles.cardValue}>
                      {swapFromSymbol +
                        addingDecimal(Number(swapFromAmount).toLocaleString())}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Swap to amount
                    </RegularText>
                    <BoldText style={styles.cardValue}>
                      {swapToSymbol +
                        addingDecimal(Number(swapToAmount).toLocaleString())}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Swap rate</RegularText>
                    <BoldText style={styles.cardValue}>
                      {swapRate < 1 ? (
                        <>
                          {swapToSymbol}1 = {swapFromSymbol}
                          {addingDecimal(
                            Number(1 / swapRate || 0).toLocaleString(),
                          )}
                        </>
                      ) : (
                        <>
                          {swapFromSymbol}1 = {swapToSymbol}
                          {addingDecimal(
                            Number(swapRate || 0).toLocaleString(),
                          )}
                        </>
                      )}
                    </BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>Reference</RegularText>
                    <BoldText style={styles.cardValue}>{reference}</BoldText>
                  </View>
                  <View style={styles.cardLine}>
                    <RegularText style={styles.cardKey}>
                      Transaction Date
                    </RegularText>
                    <BoldText
                      style={{
                        ...styles.cardValue,
                        textTransform: 'uppercase',
                      }}>
                      {transactionDate}
                    </BoldText>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </PageContainer>

      <View style={styles.buttons}>
        {isAdmin ? (
          <View style={styles.button}>
            <Button
              text={`${statusState === 'reversed' || statusState === 'refunded' ? 'Undo Reverse' : 'Reverse'} Transaction`}
              onPress={handleReverse}
            />
          </View>
        ) : (
          <View style={styles.button}>
            <Button text={'Report Transaction'} onPress={handleReport} />
          </View>
        )}
        <View style={styles.button}>
          <Button text={'Share Receipt'} onPress={handleShare} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: 15,
    flex: 1,
    marginVertical: 30,
    paddingHorizontal: 3 + '%',
  },
  historyHeader: {
    marginTop: 10,
    fontSize: 17,
    fontFamily: 'OpenSans-600',
    paddingHorizontal: 3 + '%',
  },
  userIconStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  headerContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  historyIconText: {
    backgroundColor: '#ccc',
    fontSize: 18,
    fontFamily: 'OpenSans-800',
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  accNo: {
    marginTop: 3,
  },
  modalBorder: {
    alignSelf: 'center',
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
    marginBottom: 30,
  },
  footerCard: {
    backgroundColor: '#efe2e2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    paddingVertical: 30,
    borderRadius: 5,
    marginBottom: 30,
    marginHorizontal: 2 + '%',
  },
  footerCardDetails: {
    gap: 10,
  },
  cardAmountContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  cardAmount: {
    fontSize: 24,
    marginBottom: 30,
  },
  swapIcon: {
    marginTop: 2,
  },
  cardLine: {
    flexDirection: 'row',
    width: 100 + '%',
  },
  cardKey: {
    flex: 0.5,
    minWidth: 30,
    color: '#525252',
    fontFamily: 'OpenSans-600',
  },
  cardValue: {
    flex: 1,
    textAlign: 'right',
    color: '#525252',
  },

  buttons: {
    marginBottom: 30,
    flexDirection:
      Dimensions.get('screen').width < 450 ? 'column-reverse' : 'row',
  },
  button: {
    flex: Dimensions.get('screen').width < 450 ? undefined : 1,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
    flex: 1,
  },
  faIcon: {
    marginBottom: -1,
  },
  statusText: {
    textTransform: 'capitalize',
  },
});

export default TransactionHistoryParams;
