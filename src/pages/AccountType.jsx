import { useState } from 'react';
import Logo from '../components/Logo';
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from '../components/Button';
import { accountType } from '../../utils/data';
import EmptyCheckbox from '../../assets/images/emptyCheckbox.svg';
import FilledCheckbox from '../../assets/images/filledCheckbox.svg';
import Header from '../components/Header';

const AccountType = ({ navigation }) => {
  return (
    // <KeyboardAvoidingView behavior="padding">
    <View style={styles.container}>
      <View style={styles.logo}>
        <Logo />
      </View>
      <View style={styles.formContainer}>
        <Header
          title={'Select Account Type'}
          text={'What do you want to use Loopay for?'}
        />
        <View style={styles.form}>
          <View>
            {accountType.map(item => (
              <Form item={item} key={item.title} />
            ))}
          </View>
          <View style={styles.button}>
            <Button
              text={'Continue'}
              handlePress={() => {
                navigation.navigate('Home');
              }}
            />
          </View>
        </View>
      </View>
    </View>
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 5 + '%',
    paddingHorizontal: 3 + '%',
    backgroundColor: '#fff',
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
  },
  headers: {
    gap: 10,
    marginBottom: 5 + '%',
  },
  heading: {
    fontSize: 25,
    fontWeight: '600',
  },
  formContainer: { gap: 25, flex: 2 },
  form: {
    flex: 1,
    justifyContent: 'space-between',
  },
  checkbox: { marginBottom: 30 },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  checkTitle: {
    fontWeight: '600',
  },
  button: { paddingBottom: 50 + '%' },
});

export default AccountType;

const Form = ({ item }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <View style={styles.checkbox}>
      <Pressable
        onPress={() => {
          setClicked(prev => !prev);
        }}
        style={styles.checkContainer}>
        {clicked ? (
          <FilledCheckbox width={20} height={20} />
        ) : (
          <EmptyCheckbox width={20} height={20} />
        )}
        <Text style={styles.checkTitle}>{item.title}</Text>
      </Pressable>
      <Text>{item.details}</Text>
    </View>
  );
};
