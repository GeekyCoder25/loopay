/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Logo from '../../components/Logo';
import { AppContext } from '../../components/AppContext';
import Header from '../../components/Header';
import Button from '../../components/Button';
import BoldText from '../../components/fonts/BoldText';
import ToastMessage from '../../components/ToastMessage';
import { postFetchData } from '../../../utils/fetchAPI';

const Questions = ({ navigation }) => {
  const { vh, setIsLoading } = useContext(AppContext);
  const [formData, setFormData] = useState({
    sport: '',
    mother: '',
    meal: '',
  });
  const [errorKey, setErrorKey] = useState();
  const questions = [
    {
      question: 'What’s your favorite sport?',
      id: 'sport',
    },
    {
      question: 'What’s your mother Maiden name?',
      id: 'mother',
    },
    {
      question: 'What’s your favorite meal?',
      id: 'meal',
    },
  ];

  const handleSet = async () => {
    if (Object.values(formData).includes('')) {
      setErrorKey('global');
      return ToastMessage('Please provide all fields');
    }
    setIsLoading(true);
    const response = await postFetchData('user/questions', formData);
    ToastMessage('Secret questions set successfully');
    setIsLoading(false);
    navigation.goBack();
  };

  return (
    <PageContainer scroll>
      <View style={{ ...styles.container, minHeight: vh * 0.8 }}>
        <View style={styles.logo}>
          <Logo />
        </View>
        <Header
          title={'Secret Questions '}
          text={'Give answers to the below questions'}
        />
        <View style={styles.form}>
          {questions.map(question => (
            <Question
              question={question}
              key={question.id}
              errorKey={errorKey}
              setErrorKey={setErrorKey}
              formData={formData}
              setFormData={setFormData}
              showRedBorder={errorKey}
            />
          ))}
        </View>
        <View style={styles.button}>
          <Button text={'Set Security Questions'} onPress={handleSet} />
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 10 + '%',
  },
  form: {
    flex: 1.5,
    paddingVertical: 30,
    minHeight: 150,
  },
  textInputContainer: {
    marginTop: 5,
    marginBottom: 30,
  },
  textInput: {
    width: 100 + '%',
    height: 55,
    paddingHorizontal: 10,
    borderWidth: 1,
    alignItems: 'flex-start',
    borderRadius: 8,
    fontFamily: 'OpenSans-600',
  },
});
export default Questions;

const Question = ({
  question,
  errorKey,
  setErrorKey,
  formData,
  setFormData,
  showRedBorder,
}) => {
  const [inputFocus, setInputFocus] = useState(false);
  return (
    <View>
      <BoldText>{question.question}</BoldText>
      <View style={styles.textInputContainer}>
        <TextInput
          style={{
            ...styles.textInput,
            borderColor:
              errorKey === question.id ||
              (showRedBorder && formData[question.id] === '')
                ? 'red'
                : inputFocus
                ? '#000'
                : '#B1B1B1',
          }}
          onChangeText={text => {
            setErrorKey('');
            setFormData(prev => {
              return { ...prev, [question.id]: text };
            });
          }}
          name={question.question}
          inputMode={'text'}
          autoCapitalize="none"
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
        />
      </View>
    </View>
  );
};
