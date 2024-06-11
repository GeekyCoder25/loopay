import React from 'react';
import PageContainer from '../../components/PageContainer';
import { View, StyleSheet } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import Button from '../../components/Button';
import RegularText from '../../components/fonts/RegularText';
import TierIcon from '../../../assets/images/tier1-icon.svg';
import Tier1 from '../../../assets/images/tier1.svg';
import Person from '../../../assets/images/tier1-person.svg';
import Address from '../../../assets/images/tier1-address.svg';

const VerificationStatus = ({ navigation }) => {
  return (
    <PageContainer padding justify={true}>
      <View style={styles.container}>
        <View>
          <BoldText style={styles.headerText}>Identity Verification</BoldText>
          <View style={styles.tier1}>{/* <TierIcon /> */}</View>
          <View style={styles.card}>
            <View style={styles.icon}>
              <BoldText style={styles.iconText}>Tier 1</BoldText>
              {/* <Tier1 /> */}
            </View>
            <View style={styles.rowContainer}>
              <BoldText style={styles.cardHeaderText}>Benefit</BoldText>
              <View style={styles.row}>
                <RegularText>Withdrawal Limit</RegularText>
                <RegularText>50,000</RegularText>
              </View>
              <View style={styles.row}>
                <RegularText>Deposit</RegularText>
                <RegularText>Unlimited</RegularText>
              </View>
            </View>
            <View style={{ ...styles.rowContainer, ...styles.border }}>
              <BoldText style={styles.cardHeaderText}>Requirement</BoldText>
              <View style={styles.row}>
                <View style={styles.rowIcon}>
                  <Person width={30} />
                  <RegularText>Personal Info</RegularText>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.rowIcon}>
                  <Address width={30} />
                  <RegularText>Residential address</RegularText>
                </View>
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
    marginTop: 20,
    color: '#525252',
  },
  tier1: {
    marginVertical: 40,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#eee',
    minHeight: 250,
    marginVertical: 30,
    borderRadius: 30,
    marginHorizontal: 2 + '%',
  },
  icon: {
    backgroundColor: '#1e1e1e',
    marginTop: 20,
    marginLeft: 20,
    width: 100,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    columnGap: 10,
  },
  iconText: {
    color: '#fff',
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
  rowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginBottom: 5,
  },
  rowContainer: {
    paddingVertical: 20,
  },
  button: {
    marginBottom: 15 + '%',
  },
});
export default VerificationStatus;
