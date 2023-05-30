import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import Button from '../../components/Button';
import CardIcon from '../../../assets/images/cardBeneficiary.svg';
import AtmScratch from '../../../assets/images/atmScratch.svg';
import AtmChevron from '../../../assets/images/atmArrow.svg';
import RegularText from '../../components/fonts/RegularText';
const VirtualCard = () => {
  return (
    <PageContainer paddingTop={10}>
      <View style={styles.body}>
        <BoldText style={styles.headerText}>Cards</BoldText>
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
                Instantly create a USD virtual Debit card to spend online
                anytime, anywhere
              </RegularText>
            </View>
          </View>
          <View style={styles.cardRight}>
            <ImageBackground
              source={require('../../../assets/images/cardBg.png')}
              style={styles.atmCard}>
              <Image
                source={require('../../../assets/icon.png')}
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
              <BoldText style={styles.atmName}>userName</BoldText>
            </ImageBackground>
          </View>
        </ImageBackground>
        <View style={styles.button}>
          <Button text={'Create New Card'} />
        </View>
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
    marginBottom: 50,
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
  },
  button: {
    marginTop: 50,
  },
});
export default VirtualCard;
