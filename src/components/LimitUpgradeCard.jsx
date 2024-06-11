import { StyleSheet, View } from 'react-native';
import React from 'react';
import RegularText from './fonts/RegularText';
import BoldText from './fonts/BoldText';
import PageContainer from './PageContainer';
import { useNavigation } from '@react-navigation/native';
import Button from './Button';
import Tier2Camera from '../../assets/images/tier2-camera.svg';
import Tier2Utility from '../../assets/images/tier2-utility.svg';
import Tier3Identify from '../../assets/images/tier3-identify.svg';
import Tier4Kin from '../../assets/images/tier4-kin.svg';
import Tier1Address from '../../assets/images/tier1-address.svg';

const LimitUpgradeCard = ({ buttonText, limit }) => {
  const navigation = useNavigation();
  return (
    <PageContainer padding justify={true}>
      <View style={styles.container}>
        <View>
          <View style={styles.tier} />
          <View style={styles.card}>
            <View style={styles.icon}>
              <BoldText style={styles.iconText}>Tier {limit.level}</BoldText>
            </View>
            <View style={styles.rowContainer}>
              <BoldText style={styles.cardHeaderText}>Benefit</BoldText>
              <View style={styles.row}>
                <RegularText>Single Withdrawal Limit</RegularText>
                <RegularText>{limit.singleDebit.toLocaleString()}</RegularText>
              </View>
              <View style={styles.row}>
                <RegularText>Daily Withdrawal Limit</RegularText>
                <RegularText>{limit.dailyDebit.toLocaleString()}</RegularText>
              </View>
              <View style={styles.row}>
                <RegularText>Deposit</RegularText>
                <RegularText>Unlimited</RegularText>
              </View>
            </View>
            <View style={{ ...styles.rowContainer, ...styles.border }}>
              <BoldText style={styles.cardHeaderText}>Requirement</BoldText>
              {limit.level === 2 && (
                <>
                  <View style={styles.row}>
                    <View style={styles.rowIcon}>
                      <Tier2Camera />
                      <RegularText>Upload a selfie</RegularText>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.rowIcon}>
                      <Tier2Utility />
                      <RegularText>Utility Bills</RegularText>
                    </View>
                  </View>
                </>
              )}
              {limit.level === 3 && (
                <View style={styles.row}>
                  <View style={styles.rowIcon}>
                    <Tier3Identify />
                    <RegularText>Means of Identification</RegularText>
                  </View>
                </View>
              )}
              {limit.level === 4 && (
                <View style={styles.row}>
                  <View style={styles.rowIcon}>
                    <Tier4Kin />
                    <RegularText>Next of Kin details</RegularText>
                  </View>
                </View>
              )}
              {limit.level === 5 && (
                <View style={styles.row}>
                  <View style={styles.rowIcon}>
                    <Tier1Address />
                    <RegularText>Verify address</RegularText>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
        <Button
          text={buttonText || 'Upgrade'}
          style={styles.button}
          onPress={() => navigation.navigate('IdentityVerification')}
        />
      </View>
    </PageContainer>
  );
};

export default LimitUpgradeCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
  },
  tier: {
    marginVertical: 40,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#eee',
    minHeight: 250,
    marginVertical: 30,
    borderRadius: 30,
    marginHorizontal: 2 + '%',
    paddingBottom: 40,
  },
  icon: {
    backgroundColor: '#1e1e1e',
    marginTop: 20,
    marginLeft: 20,
    width: 100,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
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
