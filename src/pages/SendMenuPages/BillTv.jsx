import { StyleSheet, View } from 'react-native';
import Header from '../../components/Header';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';

const BillTv = () => {
  return (
    <PageContainer paddingTop={0} padding={true}>
      <View style={styles.body}>
        <BoldText>Cable TV</BoldText>
        <View style={styles.textInputContainer}>
          <RegularText>Select a Provider</RegularText>
          <View style={{ ...styles.textInput, ...styles.toReceive }}></View>
          <View style={styles.fee}>
            <RegularText style={styles.feeText}>Service Charged</RegularText>
            <RegularText style={styles.feeText}></RegularText>
          </View>
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  headers: {
    gap: 10,
    marginBottom: 5 + '%',
  },
  heading: {
    fontSize: 25,
  },
});
export default BillTv;
