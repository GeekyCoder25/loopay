import React, { useContext } from 'react';
import PageContainer from '../../components/PageContainer';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Logo from '../../components/Logo';
import { AppContext } from '../../components/AppContext';
import Header from '../../components/Header';
import Button from '../../components/Button';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';

const Limit = () => {
  const { vh } = useContext(AppContext);
  return (
    <PageContainer>
      <ScrollView style={{ paddingHorizontal: 5 + '%' }}>
        <View style={{ ...styles.container, minHeight: vh * 0.5 }}>
          <View style={styles.header}>
            <View style={styles.logo}>
              <Logo />
            </View>
            <Header
              title={'Limit Settings'}
              text={'Manage your transaction limits'}
            />
          </View>
          <View style={styles.form}>
            <View>
              <RegularText>Enter new Transaction Limit</RegularText>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={{
                    ...styles.textInput,
                  }}
                  onChangeText={text => {}}
                  inputMode={'numeric'}
                />
              </View>
            </View>
            <View>
              <RegularText>Enter password to continue</RegularText>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={{
                    ...styles.textInput,
                  }}
                  onChangeText={text => {}}
                  inputMode={'numeric'}
                  // onFocus={() => setInputFocus(true)}
                  // onBlur={() => setInputFocus(false)}
                />
              </View>
            </View>
          </View>
          <View style={styles.button}>
            <Button text={'Update Limit'} />
          </View>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 4 + '%',
  },
  header: { gap: 15, marginBottom: 30 },
  form: {
    flex: 1,
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
export default Limit;
