import React, { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import RegularText from '../../components/fonts/RegularText';
import BoldText from '../../components/fonts/BoldText';
import GLOIcon from '../../../assets/images/glo.svg';
import MTNIcon from '../../../assets/images/mtn.svg';
import AirtelIcon from '../../../assets/images/airtel.svg';
import NineMobileIcon from '../../../assets/images/9mobile.svg';
import ChevronDown from '../../../assets/images/chevron-down-fill.svg';
import Button from '../../components/Button';

const BuyAirtime = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [networkToBuy, setNetworkToBuy] = useState('');
  const airtimeBeneficiaries = [
    {
      phoneNo: '09073002599',
      network: 'airtel',
    },
    {
      phoneNo: '+2349054343663',
      network: '9mobile',
    },
    {
      phoneNo: '09066487855',
      network: 'mtn',
    },
    {
      phoneNo: '09063555855',
      network: 'glo',
    },
  ];

  const networkProviders = [
    { network: 'mtn', locale: 'ng' },
    { network: 'airtel', locale: 'ng' },
    { network: 'glo', locale: 'ng' },
    { network: '9mobile', locale: 'ng' },
  ];

  const handleModal = () => {
    setModalOpen(prev => !prev);
  };
  const handleNetworkSelect = provider => {
    handleModal();
    setNetworkToBuy(`${provider.network}-${provider.locale}`);
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
    <PageContainer padding={true} paddingTop={0}>
      <ScrollView style={styles.body}>
        <View style={styles.header}>
          <RegularText>Beneficiaries</RegularText>
          <RegularText>View all</RegularText>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.beneficiaries}>
          {airtimeBeneficiaries.map(beneficiary => (
            <Beneficiary
              beneficiary={beneficiary}
              key={beneficiary.phoneNo}
              networkProvidersIcon={networkProvidersIcon}
            />
          ))}
        </ScrollView>
        <BoldText style={styles.headerText}>Buy Airtime</BoldText>
        <RegularText style={styles.headerSubText}>Network</RegularText>
        <Pressable
          onPress={() => setModalOpen(true)}
          style={styles.textInputContainer}>
          <View style={styles.textInput}>
            {networkToBuy ? (
              <BoldText style={styles.networkToBuySelected}>
                {networkToBuy}
              </BoldText>
            ) : (
              <RegularText style={styles.networkToBuy}>
                Choose Network
              </RegularText>
            )}
            <ChevronDown />
          </View>
        </Pressable>
        <Modal
          visible={modalOpen}
          animationType="slide"
          transparent
          onRequestClose={handleModal}>
          <Pressable style={styles.overlay} onPress={handleModal} />
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <View style={styles.modalBorder} />
              <ScrollView style={{ width: 100 + '%' }}>
                <View style={styles.currencies}>
                  {networkProviders.map(provider => (
                    <Pressable
                      key={provider.network}
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        ...styles.currency,
                        backgroundColor:
                          networkToBuy ===
                          `${provider.network}-${provider.locale}`
                            ? '#e4e2e2'
                            : 'transparent',
                      }}
                      onPress={() => handleNetworkSelect(provider)}>
                      <View style={styles.networkIcon}>
                        {networkProvidersIcon(provider.network)}
                      </View>
                      <BoldText style={styles.networkToBuySelected}>
                        {`${provider.network}-${provider.locale}`}
                      </BoldText>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <View style={styles.topUpContainer}>
          <Text style={styles.topUp}>Amount to be credited</Text>
          <Text style={styles.topUp}>Balance: </Text>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={{ ...styles.textInput, ...styles.textInputStyles }}
            inputMode="numeric"
            // onChangeText={text => handlePriceInput(text)}
            // value={value}
          />
        </View>
        <Text style={styles.topUp}>Phone Number</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={{ ...styles.textInput, ...styles.textInputStyles }}
            inputMode="tel"
            // onChangeText={text => handlePriceInput(text)}
            // value={value}
          />
        </View>

        <Button text={'Buy Airtime'} />
      </ScrollView>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  body: {
    gap: 15,
    flex: 1,
    paddingHorizontal: 2 + '%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  beneficiaries: {
    flexDirection: 'row',
    marginTop: 20,
  },
  beneficiary: {
    alignItems: 'center',
    gap: 15,
    marginRight: 15,
  },
  phoneNo: {
    fontSize: 10,
  },
  headerText: {
    marginVertical: 30,
    fontSize: 20,
  },
  headerSubText: { color: '#868585' },
  topUpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topUp: {
    fontFamily: 'OpenSans-600',
    color: '#868585',
  },
  textInputContainer: {
    position: 'relative',
    marginTop: 5,
    marginBottom: 40,
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    height: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
  },
  textInputStyles: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  networkToBuySelected: {
    textTransform: 'uppercase',
  },
  networkToBuy: {
    color: '#525252',
    fontFamily: 'OpenSans-600',
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.5,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    height: 70 + '%',
    width: 100 + '%',
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: 100 + '%',
    height: 100 + '%',
    paddingTop: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
    alignItems: 'center',
    gap: 30,
  },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
  },
  textHeader: {
    fontSize: 24,
  },
  bg: {
    position: 'absolute',
    width: 100 + '%',
    height: 100 + '%',
  },
  currencies: {
    flex: 1,
    gap: 20,
  },
  currency: {
    width: 100 + '%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 5 + '%',
    gap: 20,
  },
  networkIcon: {
    gap: 20,
    flexDirection: 'row',
  },
  currencyAmount: {
    fontSize: 22,
    paddingRight: 10,
  },
});
export default BuyAirtime;

const Beneficiary = ({ beneficiary, networkProvidersIcon }) => {
  return (
    <Pressable style={styles.beneficiary}>
      {networkProvidersIcon(beneficiary.network)}
      <RegularText style={styles.phoneNo}>{beneficiary.phoneNo}</RegularText>
    </Pressable>
  );
};
