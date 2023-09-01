import { useContext, useState } from 'react';
import Logo from '../../components/Logo';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';
import Button from '../../components/Button';
import { accountType } from '../../database/data';
import EmptyCheckbox from '../../../assets/images/emptyCheckbox.svg';
import FilledCheckbox from '../../../assets/images/filledCheckbox.svg';
import Header from '../../components/Header';
import RegularText from '../../components/fonts/RegularText';
import BoldText from '../../components/fonts/BoldText';
import { AppContext } from '../../components/AppContext';
import { putFetchData } from '../../../utils/fetchAPI';
import FaIcon from '@expo/vector-icons/FontAwesome';

const AccountType = () => {
  const { setIsLoggedIn, setAppData, setIsLoading } = useContext(AppContext);
  const [accountTypeState, setAccountTypeState] = useState('');
  const [isError, setIsError] = useState(false);

  const handlePress = async () => {
    if (accountTypeState === '') {
      setIsError(true);
    } else {
      setIsLoading(true);
      putFetchData('user', { accountType: accountTypeState })
        .then(updateResult => {
          if (updateResult.data?.updateData?.accountType) {
            setIsLoggedIn(true);
            setAppData(prev => {
              return { ...prev, accountType: accountTypeState };
            });
          }
        })
        .finally(() => setIsLoading(false));
    }
  };
  return (
    <View
      style={{ ...styles.container, paddingTop: StatusBar.currentHeight + 10 }}>
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
              <Form
                item={item}
                key={item.title}
                accountTypeState={accountTypeState}
                setAccountTypeState={setAccountTypeState}
                setIsError={setIsError}
              />
            ))}
          </View>
          {isError && (
            <RegularText style={styles.errorMessage}>
              <FaIcon name="warning" size={20} color="red" /> Please select an
              account type
            </RegularText>
          )}
          <View style={styles.button}>
            <Button text={'Continue'} onPress={handlePress} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 5 + '%',
    paddingHorizontal: 3 + '%',
    backgroundColor: '#fff',
  },
  logo: {
    flex: 0.5,
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
  errorMessage: {
    marginTop: 2,
    paddingHorizontal: 5,
    color: 'red',
    textAlign: 'center',
  },
  button: { paddingBottom: 50 + '%' },
});

export default AccountType;

const Form = ({ item, accountTypeState, setAccountTypeState, setIsError }) => {
  const handlePress = () => {
    setAccountTypeState(item.title);
    setIsError(false);
  };
  return (
    <View style={styles.checkbox}>
      <Pressable onPress={handlePress} style={styles.checkContainer}>
        {accountTypeState === item.title ? (
          <FilledCheckbox width={20} height={20} />
        ) : (
          <EmptyCheckbox width={20} height={20} />
        )}
        <BoldText style={styles.checkTitle}>{item.title}</BoldText>
      </Pressable>
      <RegularText>{item.details}</RegularText>
    </View>
  );
};
