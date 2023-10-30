/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import PageContainer from '../../components/PageContainer';
import { StyleSheet, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { allCurrencies } from '../../database/data';
import { addingDecimal } from '../../../utils/AddingZero';
import UserIcon from '../../components/UserIcon';
import SwapIcon from '../../../assets/images/swap.svg';
import { networkProvidersIcon } from '../SendMenuPages/AirtimeTopUp/BuyAirtime';
import Button from '../../components/Button';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

const TransactionHistoryParams = ({ route }) => {
  const history = route.params;
  const {
    status,
    senderName,
    receiverName,
    senderPhoto,
    receiverPhoto,
    amount,
    transactionType,
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
    networkProvider,
    phoneNo,
    dataPlan,
  } = history;

  const currencySymbol = allCurrencies.find(
    id => currency === id.currency,
  )?.symbol;

  const transactionDate = `${new Date(
    createdAt,
  ).toLocaleDateString()} ${new Date(createdAt).toLocaleTimeString()}
  `;

  const swapFromSymbol = allCurrencies.find(
    id => swapFrom === id.currency,
  )?.symbol;

  const swapToSymbol = allCurrencies.find(id => swapTo === id.currency)?.symbol;

  const statusColor = () => {
    switch (status) {
      case 'success':
        return (
          <View style={styles.status}>
            <FaIcon
              name="check-circle-o"
              style={{ ...styles.faIcon, color: '#38b34a' }}
            />
            <BoldText style={{ color: '#38b34a', ...styles.statusText }}>
              {status}
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
              {status}
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
              {status}
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
              {status}
            </BoldText>
          </View>
        );
    }
  };

  const handleShare = async () => {
    const html = String.raw` <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <title>Loopay Statement</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
      </head>
      <body>
        <h1>Transaction receipt to be created with html and css</h1>
      </body>
    </html>`;
    createPDF(html);
  };

  const createPDF = async html => {
    const { uri } = await printToFileAsync({ html });
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  return (
    <PageContainer justify={true} scroll>
      <BoldText style={styles.historyHeader}>Transaction history</BoldText>
      <View style={styles.body}>
        {transactionType?.toLowerCase() === 'credit' && (
          <>
            <View style={styles.headerContainer}>
              <UserIcon uri={senderPhoto} />
              <View>
                <BoldText style={styles.name}>{senderName}</BoldText>
                <RegularText style={styles.accNo}>{senderAccount}</RegularText>
              </View>
            </View>

            <View style={styles.modalBorder} />

            <View style={styles.footerCard}>
              <BoldText style={styles.cardAmount}>
                +
                {currencySymbol +
                  addingDecimal(Number(amount).toLocaleString())}
              </BoldText>

              <View style={styles.footerCardDetails}>
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
                    {currencySymbol +
                      addingDecimal(Number(amount).toLocaleString())}
                  </BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>Sender Name</RegularText>
                  <BoldText style={styles.cardValue}>{senderName}</BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>Sender Bank</RegularText>
                  <BoldText style={styles.cardValue}>{sourceBank}</BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>
                    Sender Account
                  </RegularText>
                  <BoldText style={styles.cardValue}>{senderAccount}</BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>Description</RegularText>
                  <BoldText style={styles.cardValue}>{description}</BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>Reference</RegularText>
                  <BoldText style={styles.cardValue}>{reference}</BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>
                    Payment Method
                  </RegularText>
                  <BoldText style={{ ...styles.cardValue, color: '#38b34a' }}>
                    Balance
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
              <UserIcon uri={receiverPhoto} />
              <View>
                <BoldText style={styles.name}>{receiverName}</BoldText>
                <RegularText style={styles.accNo}>
                  {receiverAccount}
                </RegularText>
              </View>
            </View>

            <View style={styles.modalBorder} />

            <View style={styles.footerCard}>
              <BoldText style={styles.cardAmount}>
                -{' '}
                {currencySymbol +
                  addingDecimal(Number(amount).toLocaleString())}
              </BoldText>

              <View style={styles.footerCardDetails}>
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
                    {currencySymbol +
                      addingDecimal(Number(amount).toLocaleString())}
                  </BoldText>
                </View>
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
                  <RegularText style={styles.cardKey}>Description</RegularText>
                  <BoldText style={styles.cardValue}>{description}</BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>Reference</RegularText>
                  <BoldText style={styles.cardValue}>{reference}</BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>
                    Payment Method
                  </RegularText>
                  <BoldText style={{ ...styles.cardValue, color: '#38b34a' }}>
                    Balance
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
                <BoldText style={styles.name}>{phoneNo}</BoldText>
                <RegularText style={styles.accNo}>Airtime purchase</RegularText>
              </View>
            </View>

            <View style={styles.modalBorder} />

            <View style={styles.footerCard}>
              <BoldText style={styles.cardAmount}>
                -{' '}
                {currencySymbol +
                  addingDecimal(Number(amount).toLocaleString())}
              </BoldText>

              <View style={styles.footerCardDetails}>
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
                    {currencySymbol +
                      addingDecimal(Number(amount).toLocaleString())}
                  </BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>Phone Number</RegularText>
                  <BoldText style={styles.cardValue}>{phoneNo}</BoldText>
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
                    Payment Method
                  </RegularText>
                  <BoldText style={{ ...styles.cardValue, color: '#38b34a' }}>
                    Balance
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
        {transactionType?.toLowerCase() === 'data' && (
          <>
            <View style={styles.headerContainer}>
              {networkProvidersIcon(networkProvider)}
              <View>
                <BoldText style={styles.name}>{phoneNo}</BoldText>
                <RegularText style={styles.accNo}>Data purchase</RegularText>
              </View>
            </View>

            <View style={styles.modalBorder} />

            <View style={styles.footerCard}>
              <BoldText style={styles.cardAmount}>
                -{' '}
                {currencySymbol +
                  addingDecimal(Number(amount).toLocaleString())}
              </BoldText>

              <View style={styles.footerCardDetails}>
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
                    {currencySymbol +
                      addingDecimal(Number(amount).toLocaleString())}
                  </BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>Phone Number</RegularText>
                  <BoldText style={styles.cardValue}>{phoneNo}</BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>Network</RegularText>
                  <BoldText style={styles.cardValue}>
                    {networkProvider}
                  </BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>Data Plan</RegularText>
                  <BoldText style={styles.cardValue}>{dataPlan}</BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>Reference</RegularText>
                  <BoldText style={styles.cardValue}>{reference}</BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>
                    Payment Method
                  </RegularText>
                  <BoldText style={{ ...styles.cardValue, color: '#38b34a' }}>
                    Balance
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
                <BoldText style={{ ...styles.cardAmount }}>
                  {`${swapFromSymbol}${addingDecimal(
                    Number(swapFromAmount).toLocaleString(),
                  )}`}
                </BoldText>
                <SwapIcon width={24} height={24} style={styles.swapIcon} />
                <BoldText style={{ ...styles.cardAmount }}>
                  {`${swapToSymbol}${addingDecimal(
                    Number(swapToAmount).toLocaleString(),
                  )}`}
                </BoldText>
              </View>

              <View style={styles.footerCardDetails}>
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
                  <RegularText style={styles.cardKey}>Swap-from</RegularText>
                  <BoldText
                    style={{ ...styles.cardValue, ...styles.statusText }}>
                    {swapFrom}
                  </BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>Swap-to</RegularText>
                  <BoldText
                    style={{ ...styles.cardValue, ...styles.statusText }}>
                    {swapTo}
                  </BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>
                    Swap-from amount
                  </RegularText>
                  <BoldText style={styles.cardValue}>
                    {swapFromSymbol +
                      addingDecimal(Number(swapFromAmount).toLocaleString())}
                  </BoldText>
                </View>
                <View style={styles.cardLine}>
                  <RegularText style={styles.cardKey}>
                    Swap-to amount
                  </RegularText>
                  <BoldText style={styles.cardValue}>
                    {swapToSymbol +
                      addingDecimal(Number(swapToAmount).toLocaleString())}
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

        <Button text={'Share Receipt'} onPress={handleShare} />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  body: {
    // alignItems: 'center',
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
    marginTop: 6,
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
