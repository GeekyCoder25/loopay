/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import BoldText from '../../components/fonts/BoldText';
import PageContainer from '../../components/PageContainer';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppContext } from '../../components/AppContext';

const TransactionHistory = () => {
  const { vh } = useContext(AppContext);
  const [focused, setFocused] = useState(false);
  const transactionHisioryList = [
    {
      date: new Date().toDateString(),
    },
  ];
  return (
    <PageContainer padding={true} justify={true}>
      <ScrollView>
        <View
          style={{
            ...styles.container,
            minHeight: vh * 0.65,
          }}>
          <BoldText style={styles.historyHeader}>Transaction history</BoldText>
          <View
            style={{
              ...styles.textInputContainer,
            }}>
            <TextInput
              style={{
                ...styles.textInput,
                textAlign: focused ? 'left' : 'center',
                paddingLeft: focused ? 10 : 0,
              }}
              placeholder={focused ? '' : 'Search, e.g Beneficiary'}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </View>
        </View>
      </ScrollView>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2 + '%',
  },
  historyHeader: {
    marginTop: 10,
    fontSize: 17,
    fontFamily: 'OpenSans-600',
  },
  textInputContainer: {},
  textInput: {
    borderWidth: 1,
    borderColor: '#E2F3F5',
    marginTop: 20,
    borderRadius: 5,
    height: 35,
  },
});
export default TransactionHistory;
