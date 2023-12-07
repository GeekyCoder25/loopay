import React, { useContext, useEffect } from 'react';
import PageContainer from '../../components/PageContainer';
import { BackHandler, StyleSheet, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import Check from '../../../assets/images/check.svg';
import Button from '../../components/Button';
import FooterCard from '../../components/FooterCard';
import { useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../../components/AppContext';
import { Audio } from 'expo-av';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { allCurrencies } from '../../database/data';

const Success = ({ navigation, route }) => {
  const { isAdmin, setShowTabBar, vh, setIsLoading } = useContext(AppContext);
  const {
    userToSendTo,
    amountInput,
    fee,
    airtime,
    dataPlan,
    billPlan,
    transaction,
  } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => navigation.popToTop();

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [navigation]),
  );
  useEffect(() => {
    setShowTabBar(false);
  }, [setShowTabBar]);
  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/success.mp3'),
      );
      await sound.playAsync();
    };
    playSound();
  }, []);
  const handleShare = async () => {
    const {
      status,
      receiverName,
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
      networkProvider,
      phoneNo,
      billType,
      billName,
    } = transaction;

    const currencySymbol = allCurrencies.find(
      id => currency === id.currency,
    )?.symbol;

    const shareReceiptData = () => {
      if (transactionType === 'airtime' || transactionType === 'data') {
        return [
          {
            key: 'Transaction type',
            value: `Debit - ${transactionType} `,
          },
          { key: 'Network', value: networkProvider },
          { key: 'Phone Number', value: phoneNo },
          { key: 'Reference ID', value: reference },
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
        { key: 'Reference ID', value: reference },
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
            <h1>${Number(amount).toLocaleString().split('.')[0]}</h1>
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
    setIsLoading(true);
    const { uri } = await printToFileAsync({ html });
    setIsLoading(false);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const handleHome = () => {
    if (isAdmin) {
      return navigation.navigate('Dashboard');
    }
    navigation.popToTop();
    navigation.navigate('HomeNavigator');
    navigation.navigate('Home');
  };

  return (
    <PageContainer scroll>
      <View style={{ ...styles.container, minHeight: vh * 0.8 }}>
        <View style={styles.header}>
          <Check />
          <BoldText style={styles.headerText}>Transaction Successful</BoldText>
        </View>
        <View style={styles.footer}>
          <FooterCard
            userToSendTo={userToSendTo}
            amountInput={amountInput}
            fee={fee || null}
            airtime={airtime}
            dataPlan={dataPlan}
            billPlan={billPlan}
          />
        </View>
        <View style={styles.buttons}>
          {!isAdmin && (
            <Button
              text={'Share Receipt'}
              onPress={handleShare}
              style={styles.button}
            />
          )}
          <Button
            text={'Back Home'}
            onPress={handleHome}
            style={styles.button}
          />
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10 + '%',
    justifyContent: 'center',
  },
  header: {
    gap: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
  },
  footer: {
    flex: 1,
    marginHorizontal: 5 + '%',
    marginTop: 50,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 3 + '%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 24,
  },
});
export default Success;
