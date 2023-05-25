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

const SendMenu = ({ navigation }) => {
  const beneficiaries = [
    { phoneNo: 9073002599, accName: 'Toyyib Lawal' },
    { phoneNo: 802497515, accName: 'J. Maddison' },
    { phoneNo: 56625625115, accName: 'Milly James' },
  ];
  const sendMenuRoutes = [
    {
      routeName: 'Add Money',
      routeDetails: 'Top your USD Account',
      routeIcon: 'add',
      routeNavigate: 'AddMoney',
    },
    {
      routeName: 'Swap Funds',
      routeDetails: 'Convert your USD to another currency',
      routeIcon: 'swap',
      routeNavigate: 'SwapFunds',
    },
    {
      routeName: 'Card',
      routeDetails: 'Virtual Debit Card',
      routeIcon: 'card',
      routeNavigate: 'VirtualCard',
    },
    {
      routeName: 'Send Gift',
      routeDetails: 'Send Gift to other LOOPAY users',
      routeIcon: 'gift',
      routeNavigate: 'SendGift',
    },
    {
      routeName: 'Account Information',
      routeDetails: 'See your virtual Account details ',
      routeIcon: 'info',
      routeNavigate: 'AccInfo',
    },
    {
      routeName: 'Account Statement',
      routeDetails: 'Generate account statement for USD  account',
      routeIcon: 'statement',
      routeNavigate: 'AccStatement',
    },
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
    console.log('yo');
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
