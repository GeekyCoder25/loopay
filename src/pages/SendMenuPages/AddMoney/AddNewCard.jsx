import React, { useContext, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import PageContainer from '../../../components/PageContainer';
import Card from '../../../../assets/images/atmCard.svg';
import { AppContext } from '../../../components/AppContext';
import RegularText from '../../../components/fonts/RegularText';
import Button from '../../../components/Button';
import ErrorMessage from '../../../components/ErrorMessage';
import useFetchData from '../../../../utils/fetchAPI';

const AddNewCard = ({ navigation }) => {
  const { postFetchData } = useFetchData();
  const { vw, vh, selectedCurrency, setIsLoading, setWalletRefresh } =
    useContext(AppContext);
  const [expiry, setExpiry] = useState('MM/YY');
  const [errorMessage, setErrorMessage] = useState('');

  const [card, setCard] = useState({
    currency: selectedCurrency.currency,
    cardNo: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  function addSpaceEvery4Characters(inputString) {
    let result = '';
    for (let i = 0; i < inputString.length; i++) {
      if (i > 0 && i % 4 === 0) {
        result += ' ';
      }
      result += inputString[i];
    }
    return result;
  }

  const handleExpiry = text => {
    const numericText = text.replace(/[^0-9]/g, '');

    if (text.charAt(2) === '/' && text.substring(0, 2) > 12) {
      text = 12 + text.substring(2, 5);
    }
    if (text.length === 2 && expiry.charAt(2) === '/') {
      setExpiry(text);
    } else if (numericText.length === 2) {
      setExpiry(numericText.substring(0, 2) + '/');
    } else if (text.length === 3 && !text.includes('/')) {
      setExpiry(text.substring(0, 2) + '/' + text.substring(2, 3));
    } else {
      setExpiry(text || 'MM/YY');
    }

    setErrorMessage('');
  };

  const handleContinue = async () => {
    if (Object.values(card).includes('')) {
      setErrorMessage('Please provide all required field');
    } else if (card.cardNo.length < 16) {
      setErrorMessage('Invalid card number');
    } else if (card.expiryMonth.length < 1) {
      setErrorMessage('Invalid expiry month');
    } else if (card.expiryYear.length < 2) {
      setErrorMessage('Invalid expiry year');
    } else if (card.cvv.length < 3) {
      setErrorMessage('Invalid CVV');
    } else {
      setIsLoading(true);
      const response = await postFetchData('user/debit-card', card);
      if (response.status === 200) {
        setWalletRefresh(prev => !prev);
        navigation.goBack();
      }
      setIsLoading(false);
    }
  };

  return (
    <PageContainer scroll>
      <View style={{ ...styles.container, minHeight: vh * 0.9 }}>
        <BoldText style={styles.headerText}>Add New Card</BoldText>
        <View style={styles.body}>
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              {/* <Image
                source={require('../../../../assets/images/atmCard.jpg')}
                resizeMode="contain"
                style={{ width: 100 + '%', height: vw * 0.7 }}
              /> */}
              <Card width={vw} height={vw * 0.7} />
              <BoldText style={styles.cardNo}>
                {addSpaceEvery4Characters(card.cardNo || '****************')}
              </BoldText>
              <BoldText style={styles.cardDate}>{expiry}</BoldText>
              <BoldText style={styles.cardCVV}>{card.cvv || 'CVV'}</BoldText>
            </View>
          </View>

          <View style={styles.form}>
            <View>
              <TextInput
                style={styles.input}
                inputMode="numeric"
                onChangeText={text => {
                  setErrorMessage('');
                  setCard(prev => {
                    return {
                      ...prev,
                      cardNo: text.split(' ').join(''),
                    };
                  });
                }}
                value={addSpaceEvery4Characters(card.cardNo)}
                maxLength={19}
              />
              <RegularText style={styles.label}>Card Number</RegularText>
            </View>
            <View style={styles.row}>
              <View>
                <TextInput
                  style={styles.input}
                  inputMode="numeric"
                  onChangeText={text => handleExpiry(text)}
                  value={expiry === 'MM/YY' ? '' : expiry}
                  maxLength={5}
                  onBlur={() => {
                    expiry === 'MM/YY'
                      ? setCard(prev => {
                          return {
                            ...prev,
                            expiryMonth: '',
                            expiryYear: '',
                          };
                        })
                      : setCard(prev => {
                          return {
                            ...prev,
                            expiryMonth: expiry.split('/')[0],
                            expiryYear: expiry.split('/')[1],
                          };
                        });
                  }}
                />
                <RegularText style={styles.label}>Expiry Date</RegularText>
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  inputMode="numeric"
                  onChangeText={text => {
                    setErrorMessage('');
                    setCard(prev => {
                      return {
                        ...prev,
                        cvv: text,
                      };
                    });
                  }}
                />
                <RegularText style={styles.label}>CVV</RegularText>
              </View>
            </View>
            <View style={styles.errorMessage}>
              <ErrorMessage errorMessage={errorMessage} />
            </View>
          </View>
          <View style={styles.button}>
            <Button text={'Continue'} onPress={handleContinue} />
          </View>
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4 + '%',
  },
  headerText: {
    fontSize: 20,
  },
  body: {
    flex: 1,
  },
  cardContainer: {
    position: 'relative',
    // marginBottom: 30,
    flex: 1,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardNo: {
    position: 'absolute',
    color: '#fff',
    fontSize: 24,
    left: 20,
    bottom: 105,
  },
  cardDate: {
    position: 'absolute',
    color: '#fff',
    fontSize: 24,
    left: 20,
    bottom: 60,
  },
  cardCVV: {
    position: 'absolute',
    color: '#fff',
    fontSize: 20,
    right: 20,
    bottom: 60,
  },
  form: {
    // justifyContent: 'center',
    gap: 30,
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#BBBBBB',
    minWidth: 40 + '%',
    paddingLeft: 15,
    paddingBottom: 5,
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    marginTop: 10,
    marginLeft: 10,
    color: '#868585',
    fontFamily: 'OpenSans-600',
  },
  errorMessage: {
    height: 40,
  },
  button: {
    flex: 0.5,
  },
});

export default AddNewCard;
