import { StyleSheet, View } from 'react-native';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import { useState } from 'react';
import Button from '../../../components/Button';
import SelectInputField from './PayABillFields';

const BillInternet = ({ route }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [stateFields, setStateFields] = useState({
    provider: '',
    cardNumber: '',
  });

  const fields = route.params.data;
  const handleVerify = () => {
    console.log(stateFields);
  };

  const fetchModal = () => {
    return [{ title: 'DSTV' }, { title: 'Gotv' }, { title: 'startimes' }];
  };

  const { buttonText } = route.params;

  return (
    <PageContainer paddingTop={0} padding={true}>
      <View style={styles.body}>
        <BoldText style={styles.headerText}>{route.params.headerText}</BoldText>
        {fields.map(field => (
          <SelectInputField
            key={field.title}
            selectInput={field}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            setStateFields={setStateFields}
            customFunc={fetchModal}
          />
        ))}
        <View style={styles.button}>
          <Button text={buttonText} onPress={handleVerify} />
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  headerText: {
    marginVertical: 5 + '%',
    fontSize: 25,
  },
  button: {
    marginTop: 30,
  },
});

export default BillInternet;
