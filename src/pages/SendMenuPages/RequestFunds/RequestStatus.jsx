import React, { useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { StyleSheet, View } from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import Button from '../../../components/Button';
import RegularText from '../../../components/fonts/RegularText';
import Check from '../../../../assets/images/check.svg';
import Xmark from '../../../../assets/images/cancel.svg';
import Block from '../../../../assets/images/block.svg';
import Back from '../../../components/Back';
import { postFetchData } from '../../../../utils/fetchAPI';
import ToastMessage from '../../../components/ToastMessage';

const RequestStatus = ({ navigation, route }) => {
  const { amount, symbol, status, requesterAccount: tagName } = route.params;
  const [isCancelled, setIsCancelled] = useState(false);
  const [isBlocking, setisBlocking] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleHome = () => {
    navigation.popToTop();
    navigation.navigate('HomeNavigator');
  };

  const handleCancel = async () => {
    try {
      const response = await postFetchData(
        'user/request-confirm',
        route.params,
      );

      if (response.status === 200) {
        setIsCancelled(true);
      }
      throw new Error(response.data);
    } catch (err) {
      ToastMessage(err.message);
    }
  };

  const handleBlock = async () => {
    console.log(route.params);
    setIsCancelled(false);
    try {
      const response = await postFetchData('user/request-confirm', {
        ...route.params,
        status: 'block',
      });

      if (response.status === 200) {
        setisBlocking(false);
        setIsBlocked(true);
        return ToastMessage(response.data);
      }
      throw new Error(response.data);
    } catch (err) {
      ToastMessage(err.message);
    }
  };

  return status === 'accept' ? (
    <PageContainer style={styles.container}>
      <View style={styles.header}>
        <Check />
        <BoldText style={styles.headerText}>Successful</BoldText>
      </View>
      <View style={styles.body}>
        <RegularText style={styles.topText}>
          You’ve successfully accepted the request of{' '}
          {symbol + amount.toLocaleString()} from
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
                {symbol + amount.toLocaleString()} from
                <BoldText> #{tagName}</BoldText>
              </RegularText>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                text={'Cancel and Block'}
                style={styles.button}
                color={'#000'}
                onPress={() => setisBlocking(true)}
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
    flex: 1,
  },
  headerText: {
    fontSize: 18,
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
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#fff',
    color: '#000',
    borderWidth: 1,
  },
  button2: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default RequestStatus;
