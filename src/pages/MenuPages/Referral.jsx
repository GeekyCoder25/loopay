import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import RegularText from '../../components/fonts/RegularText';
import ShareIcon from '../../../assets/images/share.svg';
import AddIcon from '../../../assets/images/add.svg';
import BagIcon from '../../../assets/images/money-bag.svg';
import ArrowIcon from '../../../assets/images/referralArrow.svg';
import Button from '../../components/Button';
import { AppContext } from '../../components/AppContext';
import UserIcon from '../../components/UserIcon';
import ToastMessage from '../../components/ToastMessage';
import { addingDecimal } from '../../../utils/AddingZero';
import IonIcon from '@expo/vector-icons/FontAwesome';
import useFetchData from '../../../utils/fetchAPI';

const Referral = ({ navigation }) => {
  const { getFetchData } = useFetchData();
  const { appData, walletRefresh, setWalletRefresh, setIsLoading, vw } =
    useContext(AppContext);
  const { referralCode } = appData;
  const [referralTeam, setReferralTeam] = useState([]);
  const [reward, setReward] = useState(0);

  const total = 10;

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

  const handleShare = () => {
    Clipboard.setStringAsync(referralLink);
    ToastMessage('Copied to clipboard');
  };

  const photosLength = Math.round(vw / 100);

  const referralLink = 'https://loopay.app';

  return (
    <PageContainer padding scroll style={styles.container}>
      <BoldText style={styles.headerText}>Referral</BoldText>
      <View style={{ ...styles.cardHeader }}>
        <Pressable style={styles.cardHeaderBalance} onPress={handleClaim}>
          <BoldText>Claim</BoldText>
        </Pressable>
        <BoldText style={styles.cardHeaderAmount}>
          ${addingDecimal(reward.toLocaleString())}
        </BoldText>
      </View>
      <View>
        <RegularText style={styles.itemText}>How to Earn</RegularText>
        <View style={styles.arrows}>
          <View style={styles.item}>
            <View style={styles.itemIcon}>
              <ShareIcon />
            </View>
            <RegularText style={styles.itemText}>Share Link</RegularText>
          </View>
          <View style={styles.arrow}>
            <ArrowIcon />
          </View>
          <View style={styles.item}>
            <View style={styles.itemIcon}>
              <AddIcon />
            </View>
            <RegularText style={styles.itemText}>
              Friends accept invite
            </RegularText>
          </View>
          <View style={styles.arrow}>
            <ArrowIcon />
          </View>
          <View style={styles.item}>
            <View style={styles.itemIcon}>
              <BagIcon />
            </View>
            <RegularText style={styles.itemText}>Friends add money</RegularText>
          </View>
        </View>
      </View>
      <View style={styles.referrals}>
        <View style={styles.picturesContainer}>
          <View style={styles.pictures}>
            {referralTeam.slice(0, photosLength).map((referral, index) => (
              <UserIcon
                key={referral.tagName}
                uri={referral.photo}
                style={
                  index === 0 ? { ...styles.photo } : { ...styles.photoLeft }
                }
              />
            ))}
          </View>
          <Pressable
            style={styles.downline}
            onPress={() => navigation.navigate('Referrals')}>
            <RegularText style={styles.text}>View Downline</RegularText>
            <IonIcon name="chevron-right" />
          </Pressable>
        </View>
        <View style={styles.total}>
          <RegularText style={styles.text}>Total Referred</RegularText>
          <RegularText style={styles.text}>{total} Referrals</RegularText>
        </View>
        <View style={styles.sessionGraph}>
          <View
            style={{
              ...styles.sessionActive,
              width: (referralTeam.length / total) * 100 + '%',
            }}
          />
        </View>
        <RegularText style={styles.text}>
          {referralTeam.length} out of 10 referrals completed
        </RegularText>
      </View>
      <View style={styles.code}>
        <RegularText style={styles.text}>Your Referral code</RegularText>
        <Pressable onPress={handleShare}>
          <BoldText style={styles.referralCode}>{referralCode}</BoldText>
        </Pressable>
      </View>
      <Button text={'Share Link'} onPress={handleShare} />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
    paddingTop: 20,
    paddingBottom: 50,
  },
  headerText: {
    fontSize: 20,
  },
  cardHeader: {
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 5,
    marginVertical: 30,
  },
  cardHeaderBalance: {
    backgroundColor: '#e4e2e2',
    padding: 5,
    paddingHorizontal: 30,
    borderRadius: 4,
  },
  cardHeaderAmount: {
    color: '#fff',
    fontSize: 28,
    marginTop: 25,
  },
  arrows: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 30,
    marginHorizontal: 3 + '%',
  },
  item: {
    maxWidth: 30 + '%',
    gap: 10,
    alignItems: 'center',
    height: 85,
  },
  itemIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d9d9d9',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  itemText: {
    textAlign: 'center',
  },
  arrow: {
    marginTop: -30,
  },
  referrals: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 30,
    backgroundColor: '#cccccc',
    height: 200,
    borderRadius: 10,
    padding: 20,
  },
  picturesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    alignItems: 'center',
  },
  pictures: {
    flexDirection: 'row',
    flex: 1,
  },
  photo: {
    borderWidth: 5,
    borderColor: '#fff',
  },
  photoLeft: {
    borderWidth: 5,
    borderColor: '#fff',
    marginLeft: -15,
  },
  downline: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100 + '%',
    marginTop: 20,
  },
  sessionGraph: {
    width: 100 + '%',
    height: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  sessionActive: {
    backgroundColor: '#525252',
    height: 100 + '%',
    borderRadius: 10,
  },
  code: {
    marginVertical: 30,
    alignItems: 'center',
  },
  referralCode: {
    fontSize: 28,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
  },
});
export default Referral;
