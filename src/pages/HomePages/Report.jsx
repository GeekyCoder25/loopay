import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import BoldText from '../../components/fonts/BoldText';
import PageContainer from '../../components/PageContainer';
import RegularText from '../../components/fonts/RegularText';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';

const Report = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const handleReport = () => {};
  return (
    <PageContainer padding>
      <BoldText style={styles.headerText}>Report a Transaction</BoldText>

      <View style={styles.form}>
        <View>
          <RegularText style={styles.label}>Title</RegularText>
          <TextInput
            style={styles.textInput}
            maxLength={36}
            onChangeText={text => {
              setErrorMessage('');
              setFormData(prev => {
                return {
                  ...prev,
                  title: text,
                };
              });
            }}
            value={formData.title}
          />
        </View>
        <View style={styles.message}>
          <RegularText style={styles.label}>Message</RegularText>
          <TextInput
            style={{ ...styles.textInput, ...styles.textInputMessage }}
            maxLength={1000}
            onChangeText={text => {
              setErrorMessage('');
              setFormData(prev => {
                return {
                  ...prev,
                  message: text,
                };
              });
            }}
            multiline
            textAlignVertical="top"
            value={formData.message}
          />
        </View>

        <ErrorMessage errorMessage={errorMessage} style={styles.errorMessage} />
      </View>

      <Button text={'Submit'} style={styles.button} onPress={handleReport} />
    </PageContainer>
  );
};

export default Report;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
  },
  form: {
    marginTop: 30,
    gap: 20,
    flex: 1,
  },
  label: {
    fontFamily: 'OpenSans-600',
    color: '#868585',
    fontSize: 18,
  },
  textInput: {
    borderRadius: 6,
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
    marginVertical: 10,
  },
  textInputMessage: {
    minHeight: 200,
  },
  message: {
    minHeight: 240,
  },
  errorMessage: {
    marginVertical: 30,
  },
  button: {
    marginBottom: 30,
  },
});
