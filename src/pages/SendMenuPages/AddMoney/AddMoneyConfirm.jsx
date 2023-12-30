/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import RegularText from '../../../components/fonts/RegularText';
import Button from '../../../components/Button';
import { AppContext } from '../../../components/AppContext';
import IonIcon from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import ToastMessage from '../../../components/ToastMessage';
import { getToken } from '../../../../utils/storage';
import { apiUrl } from '../../../../utils/fetchAPI';
import { addingDecimal } from '../../../../utils/AddingZero';
import { useWalletContext } from '../../../context/WalletContext';

const AddMoneyConfirm = ({ navigation }) => {
  const { appData, selectedCurrency, vh, setIsLoading } =
    useContext(AppContext);
  const { wallet } = useWalletContext();
  const { acronym, symbol } = selectedCurrency;
  const [errorKey, setErrorKey] = useState();
  const [formDataState, setFormDataState] = useState({
    currency: selectedCurrency.acronym,
    accNo: wallet.loopayAccNo,
    tagName: appData.tagName,
  });
  const [preview, setPreview] = useState('');

  const transactionDetails = [
    {
      title: 'Amount sent',
      symbol,
      type: 'text',
      placeholder: 'Amount Deposited',
      inputMode: 'decimal',
      id: 'amount',
    },
    {
      title: 'Message',
      type: 'text',
      placeholder: 'Optional message',
      inputMode: 'text',
      id: 'message',
    },
    {
      title: 'Payment Proof',
      type: 'image',
      placeholder: 'Upload payment receipt/proof',
      id: 'image',
    },
  ];

  const handleConfirm = async () => {
    if (!formDataState.amount) {
      ToastMessage('Input amount sent');
      return setErrorKey('amount');
    } else if (isNaN(formDataState.amount)) {
      ToastMessage('Invalid amount provided');
      return setErrorKey('amount');
    } else if (!formDataState.image) {
      ToastMessage('No image selected yet');
      return setErrorKey('image');
    }
    try {
      setIsLoading(true);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const fileName = preview.split('/').pop();
      const fileType = fileName.split('.').pop();
      const formData = new FormData();
      formData.append('file', {
        uri: preview,
        name: fileName,
        type: `image/${fileType}`,
      });

      formData.append('data', JSON.stringify(formDataState));
      const token = await getToken();

      const options = {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      };
      const response = await fetch(`${apiUrl}/user/payment-proof`, options);
      clearTimeout(timeout);
      const result = await response.json();

      if (response.ok) {
        navigation.popToTop();
        navigation.navigate('HomeNavigator');
        ToastMessage(
          'Uploaded successfully, your account will be credited soon',
        );
      } else {
        const errormessage = result.status !== 500 ? result : 'Upload failed';
        ToastMessage(errormessage);
      }
    } catch (error) {
      ToastMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return ToastMessage('Permission was denied by user');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setPreview(result.assets[0].uri);
      setFormDataState(prev => {
        return { ...prev, image: result.assets[0].uri };
      });
    }
  };

  const handleAutoFill = () => {
    formDataState.amount &&
      setFormDataState(prev => {
        return { ...prev, amount: addingDecimal(formDataState.amount) };
      });
  };

  return (
    <PageContainer paddingTop={10} scroll>
      <View style={{ ...styles.body, minHeight: vh * 0.7 }}>
        <BoldText style={styles.headerText}>Review</BoldText>
        <View style={styles.card}>
          <BoldText style={styles.cardText}>{acronym} Deposit</BoldText>
          <BoldText style={styles.cardAmount}>
            {symbol}
            {formDataState.amount &&
              addingDecimal(Number(formDataState.amount).toLocaleString())}
          </BoldText>
        </View>
        <View style={styles.modalBorder} />
        {transactionDetails.map(detail => (
          <View key={detail.title} style={styles.details}>
            <View key={detail.title} style={styles.detail}>
              <RegularText>{detail.title}</RegularText>
            </View>
            <View style={styles.textInputContainer}>
              {detail.symbol && (
                <BoldText style={styles.symbol}>{symbol}</BoldText>
              )}
              {detail.type === 'text' ? (
                <TextInput
                  style={{
                    ...styles.textInput,
                    paddingLeft: detail.symbol
                      ? symbol.length * 20 > 50
                        ? symbol.length * 20
                        : 40
                      : 15,
                    borderColor: errorKey === detail.id ? 'red' : '#ccc',
                  }}
                  inputMode={detail.inputMode}
                  onChangeText={text => {
                    setErrorKey('');
                    setFormDataState(prev => {
                      return {
                        ...prev,
                        [detail.id]: text,
                      };
                    });
                  }}
                  onBlur={detail.symbol && handleAutoFill}
                  value={formDataState[detail.id]}
                  placeholder={detail.placeholder}
                  placeholderTextColor={'#525252'}
                />
              ) : preview ? (
                <Pressable onPress={handleImageSelect}>
                  <Image source={{ uri: preview }} style={styles.imageInput} />
                </Pressable>
              ) : (
                <Pressable
                  style={{
                    ...styles.imageInput,
                    borderColor: errorKey === detail.id ? 'red' : '#ccc',
                  }}
                  onPress={handleImageSelect}>
                  <IonIcon name="image-sharp" size={30} />
                  <BoldText>{detail.placeholder}</BoldText>
                </Pressable>
              )}
            </View>
          </View>
        ))}
        <View style={styles.button}>
          <Button text="Share Payment Receipt" onPress={handleConfirm} />
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
  imageInput: {
    borderRadius: 15,
    backgroundColor: '#eee',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    minHeight: 30 + '%',
    height: 300,
    justifyContent: 'center',
    gap: 15,
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
