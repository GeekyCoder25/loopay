import { ScrollView, StyleSheet, View } from 'react-native';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import SelectInputField from './PayABillFields';
import ErrorMessage from '../../../components/ErrorMessage';

const PayABillParams = ({ route }) => {
  const [stateFields, setStateFields] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const fields = route.params.data;

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

  const { buttonText, buttonFunc } = route.params;

  return (
    <PageContainer paddingTop={0} padding={true}>
      <ScrollView style={styles.body}>
        <BoldText style={styles.headerText}>{route.params.headerText}</BoldText>
        {fields.map(field => (
          <SelectInputField
            key={field.title}
            selectInput={field}
            setStateFields={setStateFields}
            customFunc={fetchModal}
            showBalance={field.balance}
            setErrorMessage={setErrorMessage}
          />
        ))}
        {errorMessage && (
          <View>
            <ErrorMessage errorMessage={errorMessage} />
          </View>
        )}
        <View style={styles.button}>
          <Button
            text={buttonText}
            onPress={() => buttonFunc(stateFields, setErrorMessage)}
          />
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
