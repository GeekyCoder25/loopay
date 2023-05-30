import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AddIcon from '../../assets/images/addBeneficiary.svg';
import SwapIcon from '../../assets/images/swapBeneficiary.svg';
import CardIcon from '../../assets/images/cardBeneficiary.svg';
import GiftIcon from '../../assets/images/giftBeneficiary.svg';
import InfoIcon from '../../assets/images/infoBeneficiary.svg';
import StatementIcon from '../../assets/images/statementBeneficiary.svg';
import PageContainer from '../components/PageContainer';
import RegularText from '../components/fonts/RegularText';
import BoldText from '../components/fonts/BoldText';
import { sendMenuRoutes } from '../database/data';
import { AppContext } from '../components/AppContext';
import React, { useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const SendMenu = ({ navigation }) => {
  const { setShowTabBar } = useContext(AppContext);
  useFocusEffect(
    React.useCallback(() => {
      setShowTabBar(true);
    }, [setShowTabBar]),
  );
  const beneficiaries = [
    { phoneNo: 9073002599, accName: 'Toyyib Lawal' },
    { phoneNo: 802497515, accName: 'J. Maddison' },
    { phoneNo: 56625625115, accName: 'Milly James' },
  ];
  return (
    <PageContainer>
      <View style={styles.header}>
        <RegularText>Beneficiaries</RegularText>
        <RegularText>View all</RegularText>
      </View>
      <View style={styles.beneficiaries}>
        {beneficiaries.map(beneficiary => (
          <Pressable key={beneficiary.phoneNo} style={styles.beneficiary}>
            <Image source={require('../../assets/images/userImage.jpg')} />
            <RegularText>{beneficiary.accName}</RegularText>
          </Pressable>
        ))}
      </View>
      <View style={styles.modalBorder} />
      <ImageBackground
        source={require('../../assets/images/pageBg.png')}
        style={styles.bg}>
        <View style={styles.routesContainer}>
          {sendMenuRoutes.map(routePage => (
            <RoutePage
              key={routePage.routeIcon}
              routePage={routePage}
              navigation={navigation}
            />
          ))}
        </View>
      </ImageBackground>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5 + '%',
  },
  beneficiaries: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
    paddingHorizontal: 5 + '%',
  },
  beneficiary: {
    alignItems: 'center',
    gap: 5,
  },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
    marginVertical: 40,
    alignSelf: 'center',
  },
  bg: {
    flex: 1,
  },
  routesContainer: {
    gap: 30,
    paddingHorizontal: 5 + '%',
  },
  route: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  routeIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  routeTexts: {
    flex: 1,
  },
});
export default SendMenu;

const RoutePage = ({ routePage, navigation }) => {
  const routeIcon = () => {
    switch (routePage.routeIcon) {
      case 'add':
        return <AddIcon />;
      case 'swap':
        return <SwapIcon />;
      case 'card':
        return <CardIcon />;
      case 'gift':
        return <GiftIcon />;
      case 'info':
        return <InfoIcon />;
      case 'statement':
        return <StatementIcon />;
      default:
        break;
    }
  };
  const handleNavigate = () => {
    navigation.navigate(routePage.routeNavigate);
  };

  return (
    <Pressable onPress={handleNavigate} style={styles.route}>
      <View style={styles.routeIcon}>{routeIcon()}</View>
      <View style={styles.routeTexts}>
        <BoldText>{routePage.routeName}</BoldText>
        <RegularText>{routePage.routeDetails}</RegularText>
      </View>
    </Pressable>
  );
};
