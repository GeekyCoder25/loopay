import React, { useContext } from 'react';
import { View, Pressable, StyleSheet, ScrollView, Text } from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import InputPin from '../../../components/InputPin';
import FooterCard from '../../../components/FooterCard';
import { postFetchData } from '../../../../utils/fetchAPI';
import PageContainer from '../../../components/PageContainer';
import BackArrow from '../../../../assets/images/backArrowWhite.svg';
import { AppContext } from '../../../components/AppContext';
import FaIcon from '@expo/vector-icons/FontAwesome';
import ToastMessage from '../../../components/ToastMessage';

const TransferBill = ({ navigation, route }) => {
  const formData = route.params;
  const { setIsLoading, setWalletRefresh } = useContext(AppContext);

  const handlePay = async setErrorMessage => {
    try {
      setIsLoading(true);
      const response = await postFetchData(
        `user/bill?${formData.routeId}`,
        formData,
      );
      if (response.status === 200) {
        setWalletRefresh(prev => !prev);
        return navigation.navigate('Success', {
          amountInput: formData.amount,
          billPlan: formData.provider.name,
          reference: response.data.referenceId,
          transaction: response.data.transaction,
        });
      }
      setErrorMessage(response.data);
    } catch (error) {
      ToastMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer paddingTop={0} scroll>
      {/* <View style={styles.backContainer}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backContainer}>
          <BackArrow />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.headerContainer}>
          <BoldText style={styles.pinHeader}>Bill Recharge</BoldText>
          <View style={styles.userIconContainer}>
            {billIcon(formData.routeId)}
            <View>
              <BoldText style={styles.pinPhone}>{formData.routeId}</BoldText>
            </View>
            <View style={styles.modalBorder} />
          </View>
        </View> */}
      <View style={styles.content}>
        <InputPin customFunc={handlePay} buttonText={'Buy Now'}>
          <View style={styles.footer}>
            <FooterCard
              amountInput={formData.amount}
              billPlan={formData.provider.name}
            />
          </View>
        </InputPin>
      </View>
      {/* </ScrollView> */}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    backgroundColor: '#1e1e1e',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingLeft: 2 + '%',
    width: 100 + '%',
    paddingVertical: 5,
    paddingTop: 10,
  },
  backText: {
    fontFamily: 'OpenSans-600',
    color: '#fff',
    fontSize: 18,
  },
  headerContainer: {
    width: 100 + '%',
    paddingHorizontal: 5 + '%',
    backgroundColor: '#1e1e1e',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 30,
  },
  pinHeader: {
    fontSize: 18,
    marginTop: 10,
    color: '#fff',
    textTransform: 'capitalize',
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
  pinPhone: {
    textTransform: 'capitalize',
    color: '#fff',
  },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
  },
  content: {
    paddingHorizontal: 5 + '%',
    paddingBottom: 40,
  },
  footer: {
    marginTop: 50,
  },
});
export default TransferBill;

const billIcon = key => {
  switch (key) {
    case 'electricity':
      return <FaIcon name="bolt" size={24} color={'#fff'} />;
    case 'school':
      return <FaIcon name="graduation-cap" size={24} color={'#fff'} />;
    case 'tv':
      return <FaIcon name="tv" size={24} color={'#fff'} />;
    default:
      return <FaIcon name="send" size={24} color={'#fff'} />;
  }
};
