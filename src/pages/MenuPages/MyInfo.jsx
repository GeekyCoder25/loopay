import React, { useContext, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { AppContext } from '../../components/AppContext';
import Button from '../../components/Button';
import ToastMessage from '../../components/ToastMessage';
import DateTimePicker from '@react-native-community/datetimepicker';
import FaIcon from '@expo/vector-icons/FontAwesome';
import useFetchData from '../../../utils/fetchAPI';

const MyInfo = () => {
  const { postFetchData } = useFetchData();

  const [isEditable, setIsEditable] = useState(false);
  const { appData, setAppData, setIsLoading } = useContext(AppContext);
  const [inputFocus, setInputFocus] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const {
    fullName,
    firstName,
    lastName,
    address,
    zipCode,
    city,
    state,
    dob,
    phoneNumber,
  } = appData.userProfile;
  const [userProfile, setUserProfile] = useState({
    firstName,
    lastName,
    address,
    zipCode,
    city,
    state,
    dob,
  });

  const handleChange = text => {
    setUserProfile(prev => {
      return { ...prev, [inputFocus]: text };
    });
  };
  const handleFocus = value => {
    setInputFocus(value);
  };

  const handleDOB = () => {
    setShowPicker(true);
    setInputFocus('dob');
  };

  const defaultPickerDate = () => {
    if (userProfile.dob) {
      return new Date(userProfile.dob);
    }
    return new Date(Date.now());
  };

  const handleDatePicker = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate > Date.now()) {
      selectedDate = new Date(Date.now());
    }
    const minimumDate = new Date(Date.now()).setFullYear(
      new Date(Date.now()).getFullYear() - 10,
    );
    switch (event.type) {
      case 'set':
        if (selectedDate > minimumDate) {
          return ToastMessage('Invalid date selected');
        }
        selectedDate.setMilliseconds(0);
        selectedDate.setSeconds(0);
        selectedDate.setMinutes(0);
        selectedDate.setHours(0);
        handleChange(selectedDate);
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const fetchedResult = await postFetchData('user/profile', userProfile);
      const { data: result } = fetchedResult;
      if (fetchedResult.status >= 400) {
        return ToastMessage('Error updating profile');
      }
      ToastMessage('Profile updated successfully');
      setAppData(prev => {
        return {
          ...prev,
          userProfile: result,
        };
      });
    } catch (err) {
      ToastMessage(err.message);
      console.log(err);
    } finally {
      setIsEditable(false);
      setIsLoading(false);
      setInputFocus('');
      setShowPicker(false);
    }
  };

  return (
    <PageContainer justify={true} style={styles.container} scroll>
      <BoldText style={styles.headerText}>Personal information</BoldText>
      {!isEditable && (
        <Pressable onPress={() => setIsEditable(true)} style={styles.edit}>
          <BoldText style={styles.editText}>
            <FaIcon name="edit" size={20} />
          </BoldText>
        </Pressable>
      )}
      <View style={styles.tagContainer}>
        <View>
          <RegularText style={styles.label}>Your unique Loopay tag</RegularText>
          <BoldText style={styles.tagName}>#{appData.tagName}</BoldText>
        </View>
        <Pressable
          style={styles.copy}
          onPress={() => {
            Clipboard.setStringAsync(`#${appData.tagName}`);
            ToastMessage('Copied to clipboard');
          }}>
          <BoldText style={styles.copyText}>Copy</BoldText>
        </Pressable>
      </View>
      <View style={styles.tagContainer}>
        <View>
          <RegularText style={styles.label}>Account Name</RegularText>
          <BoldText style={styles.tagName}>{fullName}</BoldText>
        </View>
        <Pressable
          style={styles.copy}
          onPress={() => {
            Clipboard.setStringAsync(fullName);
            ToastMessage('Copied to clipboard');
          }}>
          <BoldText style={styles.copyText}>Copy</BoldText>
        </Pressable>
      </View>
      <View style={styles.tagContainer}>
        <View>
          <RegularText style={styles.label}>Account No</RegularText>
          <BoldText style={styles.tagName}>{phoneNumber.slice(4)}</BoldText>
        </View>
        <Pressable
          style={styles.copy}
          onPress={() => {
            Clipboard.setStringAsync(phoneNumber.slice(4));
            ToastMessage('Copied to clipboard');
          }}>
          <BoldText style={styles.copyText}>Copy</BoldText>
        </Pressable>
      </View>
      <View style={styles.tagContainer}>
        <View>
          <RegularText style={styles.label}>Phone No</RegularText>
          <BoldText style={styles.tagName}>{phoneNumber}</BoldText>
        </View>
        <Pressable
          style={styles.copy}
          onPress={() => {
            Clipboard.setStringAsync(phoneNumber);
            ToastMessage('Copied to clipboard');
          }}>
          <BoldText style={styles.copyText}>Copy</BoldText>
        </Pressable>
      </View>
      {/* <View style={styles.tagContainer}>
        <View style={styles.field}>
          <RegularText style={styles.label}>Last name</RegularText>
          <TextInput
            name="lastName"
            value={userProfile.lastName}
            onChangeText={text => handleChange(text)}
            style={styles.tagName}
            editable={false}
            onFocus={() => handleFocus('lastName')}
          />
        </View>
      </View>
      <View style={styles.tagContainer}>
        <View style={styles.field}>
          <RegularText style={styles.label}>First name</RegularText>
          <TextInput
            name="firstName"
            value={userProfile.firstName}
            onChangeText={text => handleChange(text)}
            style={styles.tagName}
            editable={false}
            onFocus={() => handleFocus('firstName')}
          />
        </View>
      </View>
      <View style={styles.tagContainer}>
        <View style={styles.field}>
          <RegularText style={styles.label}>Address</RegularText>
          <TextInput
            name="address"
            value={userProfile.address}
            onChangeText={text => handleChange(text)}
            style={
              isEditable
                ? inputFocus === 'address'
                  ? styles.inputFocus
                  : styles.input
                : styles.tagName
            }
            editable={isEditable}
            onFocus={() => handleFocus('address')}
          />
        </View>
      </View>
      <View style={styles.tagContainer}>
        <View style={styles.field}>
          <RegularText style={styles.label}>Zip</RegularText>
          <TextInput
            name="zipCode"
            value={userProfile.zipCode?.toString()}
            onChangeText={text => handleChange(text)}
            style={
              isEditable
                ? inputFocus === 'zipCode'
                  ? styles.inputFocus
                  : styles.input
                : styles.tagName
            }
            editable={isEditable}
            onFocus={() => handleFocus('zipCode')}
            inputMode="numeric"
          />
        </View>
      </View>
      <View style={styles.tagContainer}>
        <View style={styles.field}>
          <RegularText style={styles.label}>City</RegularText>
          <TextInput
            name="city"
            value={userProfile.city}
            onChangeText={text => handleChange(text)}
            style={
              isEditable
                ? inputFocus === 'city'
                  ? styles.inputFocus
                  : styles.input
                : styles.tagName
            }
            editable={isEditable}
            onFocus={() => handleFocus('city')}
          />
        </View>
      </View>
      <View style={styles.tagContainer}>
        <View style={styles.field}>
          <RegularText style={styles.label}>State</RegularText>
          <TextInput
            name="state"
            value={userProfile.state}
            onChangeText={text => handleChange(text)}
            style={
              isEditable
                ? inputFocus === 'state'
                  ? styles.inputFocus
                  : styles.input
                : styles.tagName
            }
            editable={isEditable}
            onFocus={() => handleFocus('state')}
          />
        </View>
      </View>
      <View style={styles.tagContainer}>
        <View style={styles.field}>
          <RegularText style={styles.label}>Date of Birth</RegularText>
          <Pressable
            style={styles.tagName}
            onPress={() => isEditable && handleDOB()}>
            <RegularText style={styles.tagName}>
              {showPicker ? (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={defaultPickerDate()}
                  onChange={handleDatePicker}
                  style={styles.picker}
                />
              ) : userProfile.dob ? (
                new Date(userProfile.dob).toLocaleDateString()
              ) : (
                isEditable && <BoldText>Select Date</BoldText>
              )}
            </RegularText>
          </Pressable>
        </View>
      </View> */}
      {isEditable ? (
        <Button
          onPress={handleSave}
          text={'Save Changes'}
          style={styles.button}
        />
      ) : (
        <View style={styles.button} />
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: { padding: 5 + '%' },
  headerText: {
    fontSize: 25,
    marginBottom: 20,
  },
  tagContainer: {
    backgroundColor: '#EEEEEE',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copy: {
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  copyText: {
    color: '#fff',
  },

  label: {
    color: '#868585',
    marginBottom: 5,
  },
  tagName: {
    fontSize: 16,
    fontFamily: 'OpenSans-700',
    color: '#000',
  },
  picker: {
    transform: [{ translateX: -10 }, { translateY: 10 }],
  },
  edit: {
    alignSelf: 'flex-end',
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 20,
    marginBottom: 30,
  },
  editText: {
    color: '#fff',
  },
  form: { marginVertical: 50, gap: 50 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 30,
  },
  field: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#525252',
    color: '#525252',
    fontFamily: 'OpenSans-500',
    fontSize: 15,
    marginTop: 8,
    minHeight: 40,
    paddingLeft: 5,
    justifyContent: 'center',
    borderRadius: 3,
  },
  inputFocus: {
    borderWidth: 1,
    borderColor: '#000',
    color: '#000',
    fontFamily: 'OpenSans-700',
    fontSize: 15,
    marginTop: 8,
    minHeight: 40,
    paddingLeft: 5,
    justifyContent: 'center',
    borderRadius: 3,
  },
  button: {
    marginBottom: 50,
  },
});
export default MyInfo;
