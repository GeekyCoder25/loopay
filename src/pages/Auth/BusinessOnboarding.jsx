import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import createNativeStackNavigator from '@react-navigation/native-stack/src/navigators/createNativeStackNavigator';
import BackArrow from '../../../assets/images/backArrow.svg';
import RegularText from '../../components/fonts/RegularText';
import BoldText from '../../components/fonts/BoldText';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import useFetchData from '../../../utils/fetchAPI';
import { AppContext } from '../../components/AppContext';
import ToastMessage from '../../components/ToastMessage';
import ErrorMessage from '../../components/ErrorMessage';
import { CountryPicker } from 'react-native-country-codes-picker';

const BusinessOnboarding = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ header: Back }}>
      <Stack.Screen name="1" component={Page1} />
      <Stack.Screen name="2" component={Page2} />
      <Stack.Screen name="3" component={Page3} />
    </Stack.Navigator>
  );
};

export default BusinessOnboarding;

const Back = props => {
  const pageIndex = props.route.name;

  const handleBackPress = () => {
    props.navigation.pop();
  };

  return (
    <SafeAreaView>
      <View style={styles.backContainer}>
        <Pressable onPress={handleBackPress} style={styles.backContainer}>
          <BackArrow />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <RegularText>{pageIndex} of 3</RegularText>
      </View>
    </SafeAreaView>
  );
};

const Header = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 50}>
      <ScrollView style={styles.container}>
        <BoldText style={styles.headerText}>
          Merchant service agreement
        </BoldText>
        <RegularText style={styles.subText}>
          Kindly read through and accept the merchant service agreement.
        </RegularText>

        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={24} />
          <View style={styles.noticeTexts}>
            <BoldText>Important</BoldText>
            <RegularText>
              Please ensure that the information you provide is correct.{' '}
              <BoldText>
                DO NOT ACCEPT THIS AGREEMENT IF YOUR DETAILS ARE INCORRECT.
              </BoldText>
            </RegularText>
            <RegularText>
              {'\n'}
              If you have already signed a Merchant Service Agreement, you can
              ignore this screen.
            </RegularText>
          </View>
        </View>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Page1 = ({ navigation }) => {
  return (
    <Header>
      <View style={styles.service}>
        <BoldText style={styles.page1Header}>Service Agreement</BoldText>
        <RegularText style={styles.page1Text}>
          The Loopay&apos;s Merchant Services Agreement is an agreement between
          you and Loopay. It details Loopay&apos;s obligations to you and your
          obligations to Loopay. It also highlights certain risks and
          requirements on using the Services and you must consider them
          carefully as you will be bound by the provision of this Agreement
          through your use of this website or any of our Services. By accepting
          this Agreement electronically, you will be deemed to have acknowledged
          and agreed that you are bound by the terms of the Agreement and it
          shall be deemed to have been accepted by the Company.
        </RegularText>
      </View>
      <View style={styles.service}>
        <BoldText style={styles.page1Header}>Accept Agreement</BoldText>
        <RegularText style={styles.page1Text}>
          If you are accepting this Agreement on behalf of your employer or
          another entity, you represent and warrant that you have full legal
          authority to bind your employer or such entity to these terms and
          conditions. If you don&apos;t have the legal authority to bind, please
          do not sign the agreement below.
        </RegularText>
      </View>
      <Button
        text={'Next'}
        onPress={() => navigation.navigate('2')}
        style={styles.button}
      />
    </Header>
  );
};

const Page2 = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    website: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleNext = () => {
    if (Object.values(formData).includes('')) {
      return setErrorMessage('Please provide all fields');
    }
    navigation.navigate('3', formData);
  };

  useEffect(() => {
    setErrorMessage('');
  }, [formData]);
  return (
    <Header>
      <View style={styles.page2Card}>
        <RegularText>
          By signing this agreement, l am accepting this agreement on behalf of
          <BoldText> LOOPAY</BoldText>. I represent and warrant that {'\n \n'}
          (a) I have the full authority to bind the entity to this Agreement,
          {'\n \n'} (b) I have read and understand this Agreement, and
          {'\n \n'} (c) I agree to all the terms and conditions of this
          Agreement on behalf of the entity that I represent.
        </RegularText>
      </View>

      <View>
        <View>
          <BoldText>Contracting entity</BoldText>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setFormData(prev => {
                return {
                  ...prev,
                  name: text,
                };
              })
            }
          />
        </View>
        <View>
          <BoldText>Business address</BoldText>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setFormData(prev => {
                return {
                  ...prev,
                  address: text,
                };
              })
            }
          />
        </View>
        <View>
          <BoldText>Business Website</BoldText>
          <TextInput
            style={styles.input}
            inputMode="url"
            onChangeText={text =>
              setFormData(prev => {
                return {
                  ...prev,
                  website: text,
                };
              })
            }
          />
        </View>
      </View>
      <ErrorMessage errorMessage={errorMessage} isOnlyToast />
      <Button text={'Next'} onPress={handleNext} style={styles.button} />
    </Header>
  );
};

const Page3 = ({ navigation }) => {
  const { putFetchData } = useFetchData();
  const { appData, setAppData, setIsLoading } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    job: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [hasAccept, setHasAccept] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [countryCodeData, setCountryCodeData] = useState('');
  const [canAccept, setCanAccept] = useState(false);

  const handleAccept = async () => {
    if (Object.values(formData).includes('')) {
      return setErrorMessage('Please provide all fields');
    }
    setIsLoading(true);
    try {
      const response = await putFetchData('user', {
        accountType: 'Business',
      });
      const data = response.data?.updateData?.accountType;
      if (data) {
        setAppData(prev => {
          return {
            ...prev,
            accountType: data,
            pin: !!appData.pin,
          };
        });
        navigation.navigate('FirstPage');
      }
    } catch (error) {
      ToastMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountrySelect = data => {
    setCountryCodeData(data);
    setShowPicker(false);
  };

  useEffect(() => {
    if (!Object.values(formData).includes('') && hasAccept) {
      setCanAccept(true);
    } else {
      setCanAccept(false);
    }
  }, [formData, hasAccept]);

  useEffect(() => {
    setErrorMessage('');
  }, [formData]);

  return (
    <Header>
      <View>
        <View>
          <BoldText>Full name</BoldText>
          <TextInput
            style={styles.input}
            placeholder="Full name"
            onChangeText={text =>
              setFormData(prev => {
                return {
                  ...prev,
                  name: text,
                };
              })
            }
          />
        </View>
        <View>
          <BoldText>Phone Number</BoldText>
          <Pressable onPress={setShowPicker} style={styles.phoneInput}>
            <View style={styles.codePicker}>
              <RegularText>{countryCodeData.dial_code}</RegularText>
              <Ionicons name="chevron-down" />
            </View>
            <CountryPicker
              show={showPicker}
              pickerButtonOnPress={handleCountrySelect}
              searchMessage={'Search here'}
              onRequestClose={() => setShowPicker(false)}
              onBackdropPress={() => setShowPicker(false)}
              style={{
                modal: {
                  marginTop: SafeAreaView.length
                    ? SafeAreaView.length * 8
                    : 100,
                  flex: 1,
                },
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              inputMode="tel"
              onChangeText={text => {
                !countryCodeData
                  ? setShowPicker(true)
                  : setFormData(prev => {
                      return {
                        ...prev,
                        phoneNumber: text,
                      };
                    });
              }}
              value={formData.phoneNumber}
            />
          </Pressable>
        </View>
        <View>
          <BoldText>Email address</BoldText>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            inputMode="email"
            onChangeText={text =>
              setFormData(prev => {
                return {
                  ...prev,
                  email: text,
                };
              })
            }
          />
        </View>
        <View>
          <BoldText>Job Title</BoldText>
          <TextInput
            style={styles.input}
            placeholder="Job title"
            inputMode="url"
            onChangeText={text =>
              setFormData(prev => {
                return {
                  ...prev,
                  job: text,
                };
              })
            }
          />
        </View>
        <Pressable
          onPress={() => setHasAccept(prev => !prev)}
          style={styles.accept}>
          {hasAccept ? (
            <Ionicons name="checkbox" size={20} />
          ) : (
            <Ionicons name="square-outline" size={20} />
          )}
          <RegularText>I accept the Merchant Service Agreement</RegularText>
        </Pressable>
      </View>
      <ErrorMessage errorMessage={errorMessage} isOnlyToast />
      <Button
        text={'Accept'}
        onPress={handleAccept}
        style={styles.button}
        disabled={!canAccept}
      />
    </Header>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    padding: 8,
  },
  backText: {
    fontFamily: 'OpenSans-600',
    fontSize: 18,
  },
  container: {
    paddingHorizontal: '4%',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 22,
  },
  subText: {
    color: '#494949',
    fontSize: 12,
    marginTop: 5,
  },
  notice: {
    backgroundColor: '#FFF9E7',
    padding: 15,
    marginVertical: 30,
    borderRadius: 5,
    flexDirection: 'row',
    columnGap: 10,
    overflow: 'hidden',
  },
  noticeTexts: {
    flex: 1,
  },
  service: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 15,
    borderRadius: 5,
    rowGap: 10,
    marginBottom: 20,
  },
  page1Header: {
    fontSize: 16,
  },
  page1Text: {
    color: '#363636',
    lineHeight: 20,
  },
  page2Card: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#EEEEEEEE',
    marginBottom: 20,
  },
  input: {
    borderWidth: 0.5,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
    height: 50,
    borderColor: '#CCCCCC',
    paddingHorizontal: 15,
    flex: 1,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 15,
  },
  codePicker: {
    height: 50,
    borderColor: '#CCCCCC',
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 50,
    marginTop: 10,
    marginBottom: 20,
    columnGap: 8,
  },
  accept: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    marginBottom: 20,
  },
  button: {
    marginBottom: 30,
  },
});
