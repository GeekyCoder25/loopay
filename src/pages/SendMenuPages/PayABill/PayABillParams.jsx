import { ScrollView, StyleSheet, View } from 'react-native';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import SelectInputField from './PayABillFields';
import ErrorMessage from '../../../components/ErrorMessage';
import { useWalletContext } from '../../../context/WalletContext';

const PayABillParams = ({ route, navigation }) => {
  const { wallet } = useWalletContext();
  const [stateFields, setStateFields] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorKey, setErrorKey] = useState(null);

  const { buttonText, data: fields } = route.params;

  useEffect(() => {
    fields.forEach(element => {
      setStateFields(prev => {
        return {
          ...prev,
          [element.id]: '',
        };
      });
    });
  }, [fields]);

  // const handleVerify = () => {
  //   console.log(stateFields);
  // };

  const fetchModal = () => {
    return [{ title: 'DSTV' }, { title: 'Gotv' }, { title: 'startimes' }];
  };

  const VerifyCardNumber = () => {
    if (Object.values(stateFields).includes('')) {
      return setErrorMessage('Please provide all required fields');
    }
    navigation.push('PayABillParams', {
      headerText: 'Cable TV',
      data: [
        {
          title: 'User Info',
          type: 'select',
          placeholder: 'User Info',
          id: 'userInfo',
        },
        {
          title: 'Package',
          type: 'select',
          placeholder: 'Select Package',
          id: 'package',
        },
        {
          title: 'Duration',
          type: 'select',
          placeholder: 'Duration',
          id: 'duration',
        },
      ],
      buttonText: 'Pay',
      buttonFunc: PayCableTv,
    });
  };

  const PayCableTv = () => {
    console.log('shit');
  };

  const payElectricity = () => {
    if (Object.values(stateFields).includes('')) {
      return setErrorMessage('Please provide all required fields');
    } else if (stateFields.amount > wallet.localBalance) {
      setErrorMessage('Insufficient balance');
      return setErrorKey('amount');
    } else if (
      stateFields.amount < stateFields.provider.minLocalTransactionAmount
    ) {
      setErrorMessage(
        'Amount is less than the minimum accepted by this biller',
      );
      return setErrorKey('amount');
    } else if (
      stateFields.amount > stateFields.provider.maxLocalTransactionAmount
    ) {
      setErrorMessage(
        'Amount is greater than the maximum accepted by this biller',
      );
      return setErrorKey('amount');
    }

    navigation.navigate('TransferBill', {
      ...stateFields,
      routeId: route.params.title,
    });
  };

  const buttonFunc = () => {
    switch (route.params.title) {
      case 'electricity':
        payElectricity();
        break;
      case 'TV':
        VerifyCardNumber();
        break;

      default:
        break;
    }
  };
  return (
    <PageContainer paddingTop={0} padding>
      <ScrollView style={styles.body}>
        <BoldText style={styles.headerText}>{route.params.headerText}</BoldText>
        {fields.map(field => (
          <SelectInputField
            key={field.title}
            selectInput={field}
            setStateFields={setStateFields}
            customFunc={fetchModal}
            showBalance={field.balance}
            errorKey={errorKey}
            setErrorMessage={setErrorMessage}
            setErrorKey={setErrorKey}
          />
        ))}
        {errorMessage && (
          <View>
            <ErrorMessage errorMessage={errorMessage} />
          </View>
        )}
        <View style={styles.button}>
          <Button text={buttonText} onPress={buttonFunc} />
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  headerText: {
    marginVertical: 5 + '%',
    fontSize: 25,
  },
  button: {
    marginVertical: 30,
  },
});
export default PayABillParams;
