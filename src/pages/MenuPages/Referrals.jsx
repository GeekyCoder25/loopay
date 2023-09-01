import React, { useContext } from 'react';
import PageContainer from '../../components/PageContainer';
import {
  Clipboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { AppContext } from '../../components/AppContext';
import UserIconSVG from '../../../assets/images/referralUser.svg';
import ToastMessage from '../../components/ToastMessage';

const Referrals = () => {
  const { selectedCurrency, appData } = useContext(AppContext);
  const { referralCode } = appData;
  const reward = 0;

  const handleShare = () => {
    Clipboard.setString(referralCode);
    ToastMessage('Copied to clipboard');
  };

  const handleClaim = () => {
    if (reward < 1000) {
      ToastMessage(`Minimum withdrawal is ${selectedCurrency.symbol}1000`);
    }
  };

  const referralTeam = [
    // {
    //   referralCode: 'lekrj46',
    //   name: 'Creative Omotayo',
    //   verificationStatus: true,
    // },
    // {
    //   referralCode: 'lekj4d6',
    //   name: 'Creative Omotayo',
    //   verificationStatus: true,
    // },
    // {
    //   referralCode: 'lekrjg46',
    //   name: 'Creative Omotayo',
    //   verificationStatus: false,
    // },
  ];
  return (
    <PageContainer padding={true} justify={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BoldText style={styles.boldHeader}>
            Refer friends and family to Loopay
          </BoldText>
          <RegularText>
            Earn money when your friends and family join Loopay
          </RegularText>
        </View>
        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.cardMain}>
              <BoldText style={styles.cardTitle}>Your Referral code</BoldText>
              <BoldText style={styles.cardValue}>{referralCode}</BoldText>
            </View>
            <Pressable style={styles.share} onPress={handleShare}>
              <RegularText style={styles.shareText}>Share</RegularText>
            </Pressable>
          </View>
          <View style={styles.card}>
            <View style={styles.cardMain}>
              <BoldText style={styles.cardTitle}>Rewards</BoldText>
              <BoldText style={styles.cardValue}>
                {selectedCurrency.symbol} {reward}
              </BoldText>
            </View>
            <Pressable style={styles.claim} onPress={handleClaim}>
              <RegularText style={styles.claimText}>Claim</RegularText>
            </Pressable>
          </View>
          <View>
            <BoldText style={styles.referalTeamHeader}>Referral Team</BoldText>
            {referralTeam.length === 0 ? (
              <View style={styles.noReferral}>
                <BoldText>You have no referral team, refer a friend </BoldText>
                <Pressable onPress={handleShare}>
                  <BoldText style={styles.now}>now</BoldText>
                </Pressable>
              </View>
            ) : (
              <ScrollView>
                {referralTeam.map(referral => (
                  <View key={referral.referralCode} style={styles.referal}>
                    <UserIconSVG />
                    <View style={styles.referalContent}>
                      <BoldText style={styles.referalName}>
                        {referral.name}
                      </BoldText>
                      {referral.verificationStatus ? (
                        <BoldText style={styles.verfied}>Verified</BoldText>
                      ) : (
                        <BoldText style={styles.notVerfied}>
                          Not Verified
                        </BoldText>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1 },
  header: {
    gap: 5,
    marginBottom: 20,
  },
  boldHeader: {
    fontSize: 18,
    color: '#525252',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    padding: 15,
    marginBottom: 30,
    height: 90,
  },
  cardMain: {
    gap: 10,
  },
  cardTitle: {
    fontSize: 14,
  },
  cardValue: {
    fontSize: 20,
  },
  share: {
    backgroundColor: '#525252',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 5,
    elevation: 10,
  },
  shareText: {
    color: '#fff',
  },
  claim: {
    backgroundColor: '#006E53',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 5,
    elevation: 10,
  },
  claimText: {
    color: '#fff',
  },
  referalTeamHeader: {
    color: '#525252',
    fontSize: 18,
  },
  noReferral: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 50,
  },
  now: {
    color: '#006E53',
  },
  referal: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#BBBBBB',
  },
  referalName: {
    color: '#525252',
  },
  verfied: {
    marginTop: 3,
    color: '#006E53',
  },
  notVerfied: {
    marginTop: 3,
    color: '#525252',
  },
});
export default Referrals;
