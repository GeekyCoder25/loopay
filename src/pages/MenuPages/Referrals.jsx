import React, { useContext, useEffect, useState } from 'react';
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
import ToastMessage from '../../components/ToastMessage';
import UserIcon from '../../components/UserIcon';
import useFetchData from '../../../utils/fetchAPI';

const Referrals = ({ navigation }) => {
  const { getFetchData } = useFetchData();
  const { appData, walletRefresh, setWalletRefresh, setIsLoading } =
    useContext(AppContext);
  const { referralCode } = appData;
  const [referralTeam, setReferralTeam] = useState([]);
  const [reward, setReward] = useState('');

  useEffect(() => {
    const getReferrals = async () => {
      const response = await getFetchData('user/referral');
      if (response.status === 200) {
        setReferralTeam(response.data.referrals.reverse());
        setReward(response.data.balance);
      }
    };
    getReferrals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletRefresh]);
  const handleShare = () => {
    Clipboard.setString(referralLink);
    ToastMessage('Copied to clipboard');
  };

  const handleClaim = async () => {
    try {
      if (reward < 5) {
        return ToastMessage('Minimum withdrawal is $5');
      }

      setIsLoading(true);
      const response = await getFetchData('user/withdraw-referral');
      if (response.status === 200) {
        setWalletRefresh(prev => !prev);
        ToastMessage('Withdrawn to dollar account successfully');
        setIsLoading(false);
        navigation.popToTop();
        return navigation.navigate('Home');
      }
      throw new Error(response.data);
    } catch (error) {
      return ToastMessage(error.message);
    }
  };

  const referralLink = `https://play.google.com/store/apps/details?id=com.loopay&referrer=${referralCode}`;

  return (
    <PageContainer padding justify={true}>
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
              <BoldText style={styles.cardValue}>$ {reward}</BoldText>
            </View>
            <Pressable style={styles.claim} onPress={handleClaim}>
              <RegularText style={styles.claimText}>Claim</RegularText>
            </Pressable>
          </View>
          <View>
            <BoldText style={styles.referralTeamHeader}>Referral Team</BoldText>
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
                  <View key={referral.tagName} style={styles.referral}>
                    <UserIcon uri={referral.photo} />
                    <View style={styles.referralContent}>
                      <BoldText style={styles.referralName}>
                        {referral.fullName}
                      </BoldText>
                      {referral.verified ? (
                        <BoldText style={styles.verified}>Verified</BoldText>
                      ) : (
                        <BoldText style={styles.notVerified}>
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
  referralTeamHeader: {
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
  referral: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#BBBBBB',
  },
  referralName: {
    color: '#525252',
  },
  verified: {
    marginTop: 3,
    color: '#006E53',
  },
  notVerified: {
    marginTop: 3,
    color: '#525252',
  },
});
export default Referrals;
