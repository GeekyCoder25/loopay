/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import Button from '../../components/Button';
import CardIcon from '../../../assets/images/cardBeneficiary.svg';
import AtmScratch from '../../../assets/images/atmScratch.svg';
import AtmChevron from '../../../assets/images/atmArrow.svg';
import AtmChevronRight from '../../../assets/images/atmChevronRight.svg';
import RegularText from '../../components/fonts/RegularText';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../components/AppContext';
import { getFetchData } from '../../../utils/fetchAPI';

const VirtualCard = ({ navigation }) => {
  const { appData } = useContext(AppContext);
  const { fullName } = appData?.userProfile;
  const [activeCards, setActiveCards] = useState([
    {
      id: 1,
      fullName,
      exp_month: '08',
      exp_year: '2027',
      cvc: (Math.random() * 1000).toFixed(0),
    },
  ]);

  useEffect(() => {
    const getCards = async () => {
      const response = await getFetchData('user/wallet');
      if (response.status === 200) {
        setActiveCards(response.data);
      }
    };
  }, []);
  return (
    <PageContainer paddingTop={10} style={styles.body} scroll>
      <BoldText style={styles.headerText}>Cards</BoldText>
      {activeCards.length > 0 && (
        <View style={styles.activeCards}>
          <BoldText>Active card{activeCards.length > 1 ? 's' : ''}</BoldText>
          {activeCards.map(card => (
            <Pressable
              key={card.id}
              style={styles.activeCard}
              onPress={() => navigation.navigate('VirtualCardDetails', card)}>
              <View style={{ zIndex: 9 }}>
                <BoldText style={styles.activeCardName}>
                  {card.fullName}
                </BoldText>
                <BoldText
                  style={
                    styles.activeCardDate
                  }>{`${card.exp_month}/${card.exp_year}`}</BoldText>
              </View>
              <View style={styles.activeCardBgLeft}>
                <Image
                  source={require('../../../assets/images/activeCardBgLeft.png')}
                  style={{ width: 100, height: 100, marginBottom: -8 }}
                  resizeMode="contain"
                />
              </View>
              <AtmChevronRight />
              <View style={styles.activeCardBg}>
                <Image
                  source={require('../../../assets/images/activeCardBg.png')}
                  style={{ width: 73, marginBottom: -8 }}
                  resizeMode="contain"
                />
              </View>
            </Pressable>
          ))}
        </View>
      )}
      <ImageBackground
        source={require('../../../assets/images/cardBg.png')}
        style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={styles.cardLeftInner}>
            <View style={styles.atmIcon}>
              <CardIcon />
            </View>
            <Text style={styles.title}>Virtual Debit Card</Text>
            <RegularText style={styles.text}>
              Instantly create a virtual Debit card to spend online anytime,
              anywhere
            </RegularText>
          </View>
        </View>
        <View style={styles.cardRight}>
          <ImageBackground
            source={require('../../../assets/images/cardBg.png')}
            style={styles.atmCard}>
            <Image
              source={require('../../../assets/icon2.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.atmScratchContainer}>
              <View style={styles.atmChevron}>
                <AtmChevron width={10} height={10} />
              </View>
              <View style={styles.atmScratch}>
                <AtmScratch width={50} height={50} />
              </View>
            </View>
            <BoldText style={styles.atmName}>{fullName}</BoldText>
          </ImageBackground>
        </View>
      </ImageBackground>
      <View style={styles.button}>
        <Button text={'Create New Card'} />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 5 + '%',
  },
  headerText: {
    fontSize: 20,
    marginBottom: 20,
  },
  activeCards: {
    marginBottom: 50,
    gap: 25,
  },
  card: {
    width: 350,
    maxWidth: 100 + '%',
    minWidth: 100 + '%',
    height: 250,
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
  },
  activeCard: {
    backgroundColor: '#1E1E1E',
    width: 100 + '%',
    height: 85,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 5 + '%',
    paddingRight: 2 + '%',
  },
  activeCardBgLeft: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    overflow: 'hidden',
    maxHeight: 75,
    justifyContent: 'center',
  },
  activeCardBg: {
    position: 'absolute',
    right: 30,
    overflow: 'hidden',
    maxHeight: 75,
    justifyContent: 'center',
  },
  activeCardName: {
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
    fontFamily: 'OpenSans-600',
    letterSpacing: 1,
    marginBottom: 3,
  },
  activeCardDate: {
    color: '#BBBBBB',
    fontSize: 16,
  },
  cardLeft: {
    flex: 1,
    maxWidth: 250,
  },
  cardLeftInner: {
    padding: 20,
    paddingRight: 0,
    gap: 12,
  },
  atmIcon: {
    backgroundColor: '#f9f9f9',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { color: '#525252', fontFamily: 'OpenSans-600', fontSize: 18 },
  text: {
    color: '#868585',
  },
  cardRight: {
    flex: 1,
    height: 100 + '%',
    position: 'relative',
    overflow: 'hidden',
    borderBottomRightRadius: 15,
  },
  atmCard: {
    backgroundColor: '#434343',
    position: 'absolute',
    height: 180,
    width: 100 + '%',
    bottom: 0,
    right: 0,
    transform: [{ rotateZ: '45 deg' }, { translateX: 50 }, { translateY: -10 }],
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  logo: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  atmScratchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    transform: [{ translateY: -5 }],
  },
  atmChevron: {
    transform: [{ rotateZ: '-45 deg' }],
  },
  atmScratch: {
    backgroundColor: '#ff9800',
    width: 50,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  atmName: {
    color: '#fdfdfd',
    marginBottom: 10,
    fontSize: 12,
  },
  button: {
    marginTop: 50,
  },
});
export default VirtualCard;
