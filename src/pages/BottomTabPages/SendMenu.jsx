import React, { useContext } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import AddIcon from '../../../assets/images/addBeneficiary.svg';
import SwapIcon from '../../../assets/images/swapBeneficiary.svg';
import CardIcon from '../../../assets/images/cardBeneficiary.svg';
import BillIcon from '../../../assets/images/bill.svg';
import InfoIcon from '../../../assets/images/infoBeneficiary.svg';
import StatementIcon from '../../../assets/images/statementBeneficiary.svg';
import WalletIcon from '../../../assets/images/walletBeneficiary.svg';
import Phone from '../../../assets/images/airtime.svg';
import User from '../../../assets/images/beneficiary.svg';
import Recipient from '../../../assets/images/recipient.svg';
import Send from '../../../assets/images/sendMoney.svg';
import PageContainer from '../../components/PageContainer';
import RegularText from '../../components/fonts/RegularText';
import BoldText from '../../components/fonts/BoldText';
import { sendMenuRoutes } from '../../database/data';
import { AppContext } from '../../components/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import UserIcon from '../../components/UserIcon';
import { useBeneficiaryContext } from '../../context/BeneficiariesContext';

const SendMenu = ({ navigation }) => {
  const { setShowTabBar } = useContext(AppContext);
  const { beneficiaryState } = useBeneficiaryContext();
  useFocusEffect(
    React.useCallback(() => {
      setShowTabBar(true);
    }, [setShowTabBar]),
  );

  const handleBeneficiaryPress = beneficiary => {
    navigation.navigate('TransferFunds', beneficiary);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RegularText>Beneficiaries</RegularText>
        {beneficiaryState.length > 3 && <RegularText>View all</RegularText>}
      </View>
      {beneficiaryState.length ? (
        <ScrollView horizontal={true} style={styles.beneficiaries}>
          {beneficiaryState.map(beneficiary => (
            <Pressable
              key={beneficiary.tagName}
              style={styles.beneficiary}
              onPress={() => handleBeneficiaryPress(beneficiary)}>
              <UserIcon uri={beneficiary.photo} />
              <RegularText>{beneficiary.fullName}</RegularText>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <RegularText style={styles.beneficiaryEmpty}>
          Your recent beneficiaries will appear here
        </RegularText>
      )}
      <View style={styles.modalBorder} />
      <ImageBackground
        source={require('../../../assets/images/pageBg.png')}
        style={styles.bg}>
        <PageContainer style={styles.routesContainer} scroll>
          {sendMenuRoutes.map(route => (
            <RouteLink
              key={route.routeIcon}
              route={route}
              navigation={navigation}
            />
          ))}
        </PageContainer>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
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
    paddingBottom: 20,
    minHeight: 100,
    maxHeight: 100,
  },
  beneficiary: {
    alignItems: 'center',
    gap: 5,
    marginRight: 15,
  },
  userIconStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#868585',
  },
  nonUserIconStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  beneficiaryEmpty: {
    width: 100 + '%',
    textAlign: 'center',
    textAlignVertical: 'center',
    minHeight: 50,
    maxHeight: 50,
  },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
    marginBottom: 40,
    alignSelf: 'center',
  },
  bg: {
    flex: 1,
  },
  routesContainer: {
    paddingHorizontal: 5 + '%',
    paddingTop: 0,
  },
  route: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  routeIcon: {
    borderColor: '#1e1e1e',
    borderWidth: 0.5,
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

export const RouteLink = ({ route, navigation }) => {
  const routeIcon = () => {
    switch (route.routeIcon) {
      case 'add':
        return <AddIcon />;
      case 'swap':
        return <SwapIcon />;
      case 'card':
        return <CardIcon />;
      case 'bill':
        return <BillIcon />;
      case 'info':
        return <InfoIcon />;
      case 'statement':
        return <StatementIcon />;
      case 'send':
        return <Send />;
      case 'airtime':
        return <Phone />;
      case 'beneficiary':
        return <User />;
      case 'recipient':
        return <Recipient />;
      case 'wallet':
        return <WalletIcon />;
      default:
        break;
    }
  };
  const handleNavigate = () => {
    navigation.navigate(route.routeNavigate);
  };

  return (
    <Pressable onPress={handleNavigate} style={styles.route}>
      <View style={styles.routeIcon}>{routeIcon()}</View>
      <View style={styles.routeTexts}>
        <BoldText>{route.routeName}</BoldText>
        <RegularText>{route.routeDetails}</RegularText>
      </View>
    </Pressable>
  );
};
