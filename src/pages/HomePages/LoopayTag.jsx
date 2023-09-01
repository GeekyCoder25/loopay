/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { StyleSheet, TextInput, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import Button from '../../components/Button';
import { AppContext } from '../../components/AppContext';
import { postFetchData } from '../../../utils/fetchAPI';
import ErrorMessage from '../../components/ErrorMessage';
import { tagNameRules } from '../../database/data';
import ToastMessage from '../../components/ToastMessage';

const LoopayTag = ({ navigation }) => {
  const { appData, setAppData, setIsLoading } = useContext(AppContext);
  const [inputValue, setInputValue] = useState('');
  const { userName } = appData.userProfile;
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { minimun, maximum } = tagNameRules;
  const handleChange = text => {
    setInputValue(text);
    setErrorMessage('');
    setIsError(false);
  };

  const handleCreate = async () => {
    try {
      setIsLoading(true);
      if (!inputValue) {
        setIsError(true);
        return setErrorMessage('Please input your loopay tag');
      } else if (inputValue.length < minimun || inputValue.length > maximum) {
        setIsError(true);
        return setErrorMessage(
          `Your tag name must be at least ${minimun}-${maximum} characters long`,
        );
      }
      const fetchedResult = await postFetchData('user/tag-name', {
        tagName: inputValue,
      });
      if (!fetchedResult.status) throw new Error(fetchedResult);
      if (
        fetchedResult.status === 400 &&
        fetchedResult.data.tagName.includes(
          'value has already been used with another account',
        )
      ) {
        throw new Error('This loopay tag has been used by another user');
      }
      setAppData(prev => {
        return { ...prev, tagName: inputValue };
      });
      ToastMessage('LoopayTag updated successfully');
      navigation.goBack();
    } catch (err) {
      ToastMessage(err.message);
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer padding={true}>
      <View style={styles.body}>
        <BoldText style={styles.boldText}>
          {appData.tagName ? 'Change' : 'Create'} your Unique LoopayTag
        </BoldText>
        <RegularText style={styles.text}>
          Your Loopay Tag is used for receiving money from other Loopay Users
          with Loopay Tag
        </RegularText>
        <View style={styles.textInputContainer}>
          <BoldText style={styles.symbol}>#</BoldText>
          <TextInput
            style={{
              ...styles.textInput,
              borderColor: isError ? 'red' : '#000',
            }}
            inputMode="text"
            onChangeText={text => handleChange(text)}
            value={inputValue}
            placeholder="yourloopaytag"
            placeholderTextColor={'#525252'}
          />
        </View>
        <ErrorMessage errorMessage={errorMessage} />
        <Button
          text={'Help Suggest LoopayTag'}
          onPress={() =>
            setInputValue(
              `iam${userName
                .split(' ')
                .join('')
                .toLowerCase()
                .replace('_', '')}`,
            )
          }
        />
      </View>
      <View style={styles.button}>
        <Button text={'Create Loopay Tag'} onPress={handleCreate} />
      </View>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  body: {
    gap: 20,
    flex: 1,
  },
  boldText: {
    fontSize: 20,
  },
  text: {
    color: '#525252',
  },
  textInputContainer: {
    position: 'relative',
  },
  textInput: {
    borderRadius: 15,
    backgroundColor: '#f9f9f9',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    paddingLeft: 35,
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
  button: {
    marginVertical: 50,
  },
});
export default LoopayTag;
