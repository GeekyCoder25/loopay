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
import RegularText from '../../components/fonts/RegularText';
import ToastMessage from '../../components/ToastMessage';
import * as FileSystem from 'expo-file-system';
import useFetchData from '../../../utils/fetchAPI';

const Success = ({ navigation, route }) => {
  const { postFetchData } = useFetchData();
  const { isAdmin, vh, setIsLoading } = useContext(AppContext);
  const {
    userToSendTo,
    amountInput,
    fee,
    airtime,
    dataPlan,
    billPlan,
    transaction,
    headerTitle,
    isCredit,
    message,
    type,
    rate,
    token,
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
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/success.mp3'),
      );
      await sound.playAsync();
    };
    playSound();
  }, []);

  const handleShare = async () => {
    try {
      const { reference, transactionType } = transaction;
      setIsLoading(true);

      const response = await postFetchData('user/receipt', {
        id: reference,
        type: transactionType,
        allCurrencies,
      });

      if (response.status === 200) {
        const { uri } = await printToFileAsync({
          html: response.data.html,
          height: 892,
        });

        const sharePDF = async () => {
          try {
            setIsLoading(true);
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
            setIsLoading(false);
          }
        };

        await sharePDF();
      } else {
        throw new Error(response.data.error || 'Server Error');
      }
    } catch (error) {
      ToastMessage("Can't generate receipt");
      setIsLoading(false);
    }
  };

  const handleHome = () => {
    if (isAdmin) {
      return navigation.navigate('Dashboard');
    }
    navigation.popToTop();
    navigation.navigate('Home');
  };

  return (
    <PageContainer scroll>
      <View style={{ ...styles.container, minHeight: vh * 0.8 }}>
        <View style={styles.header}>
          <Check />
          <BoldText style={styles.headerText}>
            {headerTitle || 'Transaction'} Successful
          </BoldText>
        </View>
        <RegularText style={styles.message}>{message}</RegularText>
        <View style={styles.footer}>
          <FooterCard
            userToSendTo={userToSendTo}
            amountInput={amountInput}
            fee={fee || null}
            airtime={airtime}
            dataPlan={dataPlan}
            billPlan={billPlan}
            isCredit={isCredit}
            type={type}
            token={token}
            rate={rate}
            date={transaction?.createdAt || Date.now()}
          />
        </View>
        <View style={styles.buttons}>
          {!isAdmin && transaction && (
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
    fontSize: 20,
  },
  message: {
    marginHorizontal: 5 + '%',
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 17,
    color: '#868585',
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
