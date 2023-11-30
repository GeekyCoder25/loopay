/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
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
import { AppContext } from '../../components/AppContext';
import { billIcon } from './TransactionHistory';

const TransactionHistoryParams = ({ route }) => {
  const { vh } = useContext(AppContext);
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
    debitAccount,
    billName,
    billType,
  } = history;

  const currencySymbol = allCurrencies.find(
    id => currency === id.currency || currency === id.acronym,
  )?.symbol;

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
    const shareReceiptData = () => {
      if (transactionType === 'airtime' || transactionType === 'data') {
        return [
          {
            key: 'Transaction type',
            value: `Debit - ${transactionType} `,
          },
          { key: 'Network', value: networkProvider },
          { key: 'Phone Number', value: phoneNo },
          { key: 'Reference Id', value: reference },
          { key: 'Status', value: status },
        ];
      } else if (transactionType === 'bill') {
        return [
          {
            key: 'Transaction type',
            value: `${transactionType} Payment - Debit`,
          },
          { key: 'Bill Type', value: billType },
          { key: 'Bill Service', value: billName },
          { key: 'Reference Id', value: reference },
          { key: 'Status', value: status },
        ];
      } else if (transactionType === 'swap') {
        return [
          { key: 'Transaction type', value: 'Swap' },
          { key: 'Account', value: accNo },
          { key: 'Swap from currency', value: swapFrom },
          { key: 'Swap to currency', value: swapTo },
          {
            key: 'Swap from amount',
            value: `${swapFromSymbol}${addingDecimal(
              Number(swapFromAmount).toLocaleString(),
            )}`,
          },
          {
            key: 'Swap to amount',
            value: `${swapToSymbol}${addingDecimal(
              Number(swapToAmount).toLocaleString(),
            )}`,
          },
          { key: 'Reference Id', value: reference },
          { key: 'Status', value: status },
        ];
      }
      return [
        { key: 'Receiver Account', value: receiverAccount },
        { key: 'Sender Account', value: senderAccount },
        { key: 'Receiver Name', value: receiverName },
        { key: 'Transaction type', value: transactionType },
        {
          key: [transactionType === 'credit' ? 'Sender Bank' : 'Receiver Bank'],
          value: transactionType === 'credit' ? sourceBank : destinationBank,
        },
        { key: 'Reference Id', value: reference },
        { key: 'Narration', value: description, noTransform: true },
        { key: 'Status', value: status },
      ];
    };
    const html = String.raw` <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <title>Loopay Statement</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
          * {
            padding: 0;
            margin: 0;
          }
          body {
            padding: 20px;
            margin: auto;
            max-height: 842px;
            max-width: 800px;
            font-family: 'Inter', sans-serif;
          }
          .container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .logo {
            width: 150px;
            height: 100px;
            object-fit: contain;
          }
          header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            width: 100%;
            margin-bottom: 50px;
          }
          header span {
            display: inline-block;
            padding-top: 6px;
          }
          .title {
            font-size: 2rem;
          }
          .amount {
            display: flex;
            align-items: flex-end;
          }
          .amount h4 {
            margin-right: 5px;
            margin-bottom: 2px;
            font-size: 1.3rem;
          }
          .amount h5 {
            margin-right: 10px;
            margin-bottom: 2px;
            font-size: 1.5rem;
          }
          .statusHeader {
            font-weight: 600;
            margin-top: 20px;
            display: inline-block;
            text-transform: capitalize;
          }
          .success {
            color: #0fb52d;
          }
          .pending {
            color: #ffa500;
          }
          .blocked,
          .declined,
          .abandoned {
            color: #ed4c5c;
          }
          section {
            margin-top: 30px;
          }
          section div {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #000;
            padding: 10px 2px;
          }
          section .value {
            text-transform: capitalize;
          }
          footer {
            padding: 50px 20px 10px;
            text-align: justify;
            margin-top: auto;
            line-height: 25px;
          }
          footer h3 {
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div>
              <h2 class="title">Receipt</h2>
              <span>${new Date(createdAt).toString()}</span>
            </div>
            <img
              src="https://res.cloudinary.com/geekycoder/image/upload/v1688782340/loopay/appIcon.png"
              alt=""
              class="logo" />
          </header>
          <div class="amount">
            <h4>${currencySymbol}</h4>
            <h1>
              ${
                Number(amount || swapToAmount)
                  .toLocaleString()
                  .split('.')[0]
              }
            </h1>
            <h5>.${Number(amount).toLocaleString().split('.')[1] || '00'}</h5>
          </div>
          <span class="statusHeader ${status}">${status}</span>
          <section>
            ${shareReceiptData()
              .map(
                index =>
                  String.raw`
      <div>
        <h3>${index.key}</h3>
        <p class="status" style="${
          !index.noTransform && 'text-transform: capitalize;'
        }">${index.value}</p>
      </div>
    `,
              )
              .join('')}
          </section>

          <footer>
            <div>
              <h3>DISCLAIMER:</h3>
              Your transaction has been successfully processed. Note. however,
              that completion of any transfer may be affected by other factors
              including but not limited to transmission errors, incomplete
              information, fluctuations on the network/internet, interruptions,
              glitch, delayed information or other matters beyond the Bank's
              control which may impact on the transaction and for which the Bank
              will not be liable. All transactions are subject to Loopay
              confirmation and fraud proof verification.
            </div>
          </footer>
        </div>
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
      <View style={{ ...styles.body, minHeight: vh * 0.8 }}>
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
                  <BoldText style={styles.cardValue}>{dataPlan.value}</BoldText>
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
                  <RegularText style={styles.cardKey}>Bill Plan</RegularText>
                  <BoldText style={styles.cardValue}>{billName}</BoldText>
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
        <View style={styles.button}>
          <Button text={'Share Receipt'} onPress={handleShare} />
        </View>
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
  button: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
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
