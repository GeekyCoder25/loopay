import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import { useContext } from 'react';
import { AppContext } from '../../components/AppContext';
import WalletAmount from '../../components/WalletAmount';
import RegularText from '../../components/fonts/RegularText';
import FlagSelect from '../../components/FlagSelect';
import ChevronDown from '../../../assets/images/chevron-down.svg';
import AtmScratch from '../../../assets/images/atmScratch.svg';
import AtmChevron from '../../../assets/images/atmChevronRight.svg';

const VirtualCardDetails = ({ route }) => {
  const { fullName, exp_month, exp_year, cvc } = route.params;
  const { selectedCurrency, vh } = useContext(AppContext);

  return (
    <PageContainer paddingTop={10} padding={true}>
      <BoldText style={styles.header}>My Virtual Card</BoldText>
      <View style={styles.body}>
        <View style={styles.pageBottom}>
          <ImageBackground
            source={require('../../../assets/images/cardBg.png')}
            resizeMode="cover"
            style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.amountContainer}>
                <View style={styles.symbolContainer}>
                  <Text style={styles.symbol}>{selectedCurrency.symbol}</Text>
                </View>
                <View>
                  <WalletAmount />
                  <View style={styles.flagContainer}>
                    <RegularText style={styles.currrencyType}>
                      {selectedCurrency.currency}
                    </RegularText>
                    <FlagSelect country={selectedCurrency.currency} />
                  </View>
                </View>
              </View>
              <Pressable
                // onPress={() => setModalOpen(true)}
                style={styles.chevronDown}>
                <ChevronDown />
              </Pressable>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.atm}>
          <ImageBackground
            source={require('../../../assets/images/atmBg.png')}
            style={{ ...styles.atmBg, height: vh * 0.305 }}>
            <Image
              source={require('../../../assets/images/atmBgLeft.png')}
              style={styles.bg}
            />
            <Image
              source={require('../../../assets/images/atmBgLeft.png')}
              style={styles.bgRight}
            />
            <View style={styles.atmInner}>
              <View style={styles.atmTop}>
                <Image
                  source={require('../../../assets/icon2.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <BoldText style={styles.loopay}>LOOPAY</BoldText>
              </View>
              <View style={styles.atmBottom}>
                <View style={styles.atmDetails}>
                  <BoldText style={styles.fullName}>{fullName}</BoldText>
                  <View>
                    <RegularText style={styles.expiry}>Expiry Date</RegularText>
                    <BoldText style={styles.expiryDate}>
                      {exp_month}/{exp_year}
                    </BoldText>
                  </View>
                  <View>
                    <RegularText style={styles.expiry}>CVV</RegularText>
                    <BoldText style={styles.expiryDate}>{cvc}</BoldText>
                  </View>
                </View>
                <View style={styles.atmScratchContainer}>
                  <View style={styles.atmScratch}>
                    <AtmScratch width={50} height={50} />
                  </View>
                  <View style={styles.atmChevron}>
                    <AtmChevron width={50} height={60} />
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.pageBottom} />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    color: '#525252',
    fontSize: 18,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#000',
    height: 120,
    width: 100 + '%',
    marginVertical: 30,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  symbolContainer: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 28,
    fontFamily: 'AlfaSlabOne-Regular',
    transform: [{ translateY: -4 }],
  },
  amount: {
    color: '#ccc',
    fontSize: 40,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currrencyType: {
    color: '#fff',
    paddingLeft: 10,
    fontSize: 15,
  },
  atm: { flex: 1 },
  atmBg: {
    width: 100 + '%',
    borderRadius: 15,
    position: 'relative',
  },
  bg: {
    position: 'absolute',
    left: -50,
    bottom: -30,
  },
  bgRight: {
    position: 'absolute',
    right: -55,
    bottom: -50,
  },
  atmInner: {
    flex: 1,
    paddingVertical: 20,
    paddingLeft: 10,
    paddingRight: 20,
    justifyContent: 'space-between',
    gap: 20,
  },
  atmTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  loopay: {
    color: '#cdcdcd',
    fontSize: 24,
    fontFamily: 'OpenSans-800',
  },
  atmBottom: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginLeft: 20,
  },
  atmDetails: {
    gap: 10,
  },
  fullName: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'OpenSans-600',
  },
  atmScratchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  atmChevron: {
    marginRight: -20,
  },
  atmScratch: {
    backgroundColor: '#ff9800',
    width: 50,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiry: {
    color: '#868585',
  },
  expiryDate: {
    color: '#fff',
  },
  pageBottom: {
    flex: 1,
  },
});

export default VirtualCardDetails;
