/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { StyleSheet, TextInput, View } from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import RegularText from '../../../components/fonts/RegularText';
import Button from '../../../components/Button';
import { AppContext } from '../../../components/AppContext';

const AddMoneyConfirm = ({ navigation, route }) => {
  const { selectedCurrency, vh } = useContext(AppContext);
  const { acronym, symbol } = selectedCurrency;
  const [errorKey, seterrorKey] = useState();
  const [formData, setFormData] = useState({});

  const transactionDetails = [
    {
      title: 'Amount sent',
      symbol,
      type: 'text',
      placeholder: 'Amount Deposited',
      id: 'amount',
    },
    {
      type: 'text',
      placeholder: 'Message',
      id: 'message',
    },
    {
      title: 'Payment Proof',
      type: 'image',
      id: 'proof',
    },
  ];

  const handlePay = () => {
    navigation.popToTop();
    navigation.navigate('HomeNavigator');
  };

  return (
    <PageContainer paddingTop={10} scroll>
      <View style={{ ...styles.body, minHeight: vh * 0.7 }}>
        <BoldText style={styles.headerText}>Review</BoldText>
        <View style={styles.card}>
          <BoldText style={styles.cardText}>{acronym} Deposit</BoldText>
          <BoldText style={styles.cardAmount}>{symbol}</BoldText>
        </View>
        <View style={styles.modalBorder} />
        {transactionDetails.map(detail => (
          <View key={detail.title} style={styles.details}>
            <View key={detail.title} style={styles.detail}>
              <RegularText>{detail.title}</RegularText>
              <BoldText>
                {detail?.symbol} {detail.value}
              </BoldText>
            </View>
            <View style={styles.textInputContainer}>
              {detail.symbol && (
                <BoldText style={styles.symbol}>{symbol}</BoldText>
              )}
              <TextInput
                style={{
                  ...styles.textInput,
                  paddingLeft: detail.symbol
                    ? symbol.length * 20 > 50
                      ? symbol.length * 20
                      : 40
                    : 15,
                  borderColor: errorKey ? 'red' : '#ccc',
                }}
                inputMode="decimal"
                onChangeText={text =>
                  setFormData(prev => {
                    return {
                      ...prev,
                      amount: text,
                    };
                  })
                }
                // onBlur={handleAutoFill}
                value={formData[detail.id]}
                placeholder={detail.placeholder}
                placeholderTextColor={'#525252'}
              />
            </View>
          </View>
        ))}
        <View style={styles.button}>
          <Button text="Confirm Deposit" onPress={handlePay} />
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 5 + '%',
  },
  headerText: {
    fontSize: 20,
    marginBottom: 50,
  },
  card: {
    backgroundColor: '#1e1e1e',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    borderRadius: 10,
  },
  cardText: {
    backgroundColor: '#e4e2e2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    color: '#1e1e1e',
    fontSize: 18,
  },
  cardAmount: {
    color: '#fff',
    fontSize: 24,
  },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
    alignSelf: 'center',
    marginTop: 30,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderBottomWidth: 1.5,
    // borderColor: '#bbb',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 2,
  },
  button: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 50,
  },
  textInputContainer: {
    position: 'relative',
    marginBottom: 10,
    marginTop: 10,
  },
  textInput: {
    borderRadius: 15,
    backgroundColor: '#eee',
    height: 55,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  symbol: {
    position: 'absolute',
    fontSize: 18,
    zIndex: 9,
    top: 15,
    left: 15,
    color: '#525252',
  },
});
export default AddMoneyConfirm;
