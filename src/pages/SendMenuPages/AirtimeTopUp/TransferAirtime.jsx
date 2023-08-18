import React from 'react';
import { View, Pressable, StyleSheet, ScrollView, Text } from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import InputPin from '../../../components/InputPin';
import FooterCard from '../../../components/FooterCard';
import GLOIcon from '../../../../assets/images/glo.svg';
import MTNIcon from '../../../../assets/images/mtn.svg';
import AirtelIcon from '../../../../assets/images/airtel.svg';
import NineMobileIcon from '../../../../assets/images/9mobile.svg';
import { postFetchData } from '../../../../utils/fetchAPI';
import PageContainer from '../../../components/PageContainer';
import BackArrow from '../../../../assets/images/backArrrowWhite.svg';

const TransferAirtime = ({ navigation, route }) => {
  const { formData } = route.params;

  const handlePay = () => {
    const fetchAirtime = async () => {
      const response = await postFetchData('user/airtime', formData);
      if (!response.status || response.status !== 200) {
        // return setErrorMessage2(response.data || response);
      }
      navigation.navigate('Success', {
        airtime: formData,
        amountInput: formData.amount,
        dataPlan: formData.plan,
      });
    };

    fetchAirtime();
  };

  const networkProvidersIcon = network => {
    switch (network) {
      case 'glo':
        return <GLOIcon />;
      case 'mtn':
        return <MTNIcon />;
      case 'airtel':
        return <AirtelIcon />;
      case '9mobile':
        return <NineMobileIcon />;
      default:
        break;
    }
  };

  return (
    <PageContainer paddingTop={0}>
      <View style={styles.backContainer}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backContainer}>
          <BackArrow />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.headerContainer}>
          <BoldText style={styles.pinHeader}>Airtime Recharge</BoldText>
          <View style={styles.userIconContainer}>
            {networkProvidersIcon(formData.network)}
            <View>
              <BoldText style={styles.pinPhone}>{formData.phoneNo}</BoldText>
            </View>
            <View style={styles.modalBorder} />
          </View>
        </View>
        <View style={styles.content}>
          <InputPin customFunc={handlePay}>
            <View style={styles.footer}>
              <FooterCard
                airtime={formData}
                amountInput={`${Number(formData.amount).toLocaleString()}${
                  Number(formData.amount).toLocaleString().includes('.')
                    ? ''
                    : '.00'
                }`}
                dataPlan={formData.plan}
              />
            </View>
          </InputPin>
        </View>
      </ScrollView>
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
export default TransferAirtime;
