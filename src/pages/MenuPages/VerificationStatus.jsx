import React from 'react';
import PageContainer from '../../components/PageContainer';
import { View, StyleSheet } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import Button from '../../components/Button';
import RegularText from '../../components/fonts/RegularText';

const VerificationStatus = ({ navigation }) => {
  return (
    <PageContainer padding justify={true}>
      <View style={styles.container}>
        <View>
          <BoldText style={styles.headerText}>Identity Verification</BoldText>
          <View style={styles.card}>
            <View style={styles.rowContainer}>
              <BoldText style={styles.cardHeaderText}>Benefits</BoldText>
              <View style={styles.row}>
                <RegularText>Deposit</RegularText>
                <RegularText>Unlimited</RegularText>
              </View>
              <View style={styles.row}>
                <RegularText>Withdrawal</RegularText>
                <RegularText>Unlimited</RegularText>
              </View>
            </View>
            <View style={{ ...styles.rowContainer, ...styles.border }}>
              <BoldText style={styles.cardHeaderText}>Requirements</BoldText>
              <View style={styles.row}>
                <RegularText>Personal Info</RegularText>
              </View>
              <View style={styles.row}>
                <RegularText>Residential address</RegularText>
              </View>
            </View>
          </View>
        </View>
        <Button
          text={'Verify now'}
          style={styles.button}
          onPress={() => navigation.navigate('IdentityVerification')}
        />
      </View>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    color: '#525252',
  },
  card: {
    backgroundColor: '#eee',
    minHeight: 250,
    marginVertical: 30,
    borderRadius: 30,
    marginHorizontal: 2 + '%',
  },
  border: {
    borderTopWidth: 1,
    borderColor: '#868585',
  },
  cardHeaderText: {
    fontSize: 18,
    color: '#525252',
    marginBottom: 5,
    paddingHorizontal: 5 + '%',
  },
  row: {
    paddingHorizontal: 5 + '%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rowContainer: {
    paddingVertical: 20,
  },
  button: {
    marginBottom: 15 + '%',
  },
});
export default VerificationStatus;
