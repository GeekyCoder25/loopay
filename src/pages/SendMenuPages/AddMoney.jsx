import { StyleSheet, Text, View } from 'react-native';
import PageContainer from '../../components/PageContainer';
const AddMoney = () => {
  return (
    <PageContainer paddingTop={10} padding={true}>
      <View>
        <Text style={styles.headerText}>Add Balance</Text>
      </View>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  headerText: {
    fontWeight: '700',
  },
});
export default AddMoney;
