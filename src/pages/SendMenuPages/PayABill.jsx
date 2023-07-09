import { Pressable, StyleSheet, View } from 'react-native';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import TVIcon from '../../../assets/images/billTv.svg';
import InternetIcon from '../../../assets/images/billInternet.svg';
import SchoolIcon from '../../../assets/images/billSchool.svg';
import Electricitycon from '../../../assets/images/billElectricity.svg';
import RegularText from '../../components/fonts/RegularText';
import { useContext } from 'react';
import { AppContext } from '../../components/AppContext';

const PayABill = ({ navigation }) => {
  const bills = [
    {
      title: 'TV',
      desc: 'TV Cable',
    },
    {
      title: 'internet',
      desc: 'Internet',
    },
    {
      title: 'school',
      desc: 'School payment',
    },
    {
      title: 'electricity',
      desc: 'Electricity',
    },
  ];

  return (
    <PageContainer paddingTop={0}>
      <View style={styles.body}>
        <View style={styles.header}>
          <BoldText style={styles.headerText}>Pay a bill</BoldText>
        </View>
        <View style={styles.billContainer}>
          {bills.map(bill => (
            <Bill bill={bill} key={bill.title} navigation={navigation} />
          ))}
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: 15,
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    marginTop: 20,
    marginLeft: 10,
    padding: 2 + '%',
  },
  billContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#EEEEEE',
  },
  bill: {
    width: 150,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    padding: 30,
  },
});

export default PayABill;

const Bill = ({ bill, navigation }) => {
  const { vw } = useContext(AppContext);
  const svgIcon = (width, height) => {
    switch (bill.title) {
      case 'TV':
        return <TVIcon width={width} height={height} />;
      case 'internet':
        return <InternetIcon width={width} height={height} />;
      case 'school':
        return <SchoolIcon width={width} height={height} />;
      case 'electricity':
        return <Electricitycon width={width} height={height} />;
      default:
        break;
    }
  };

  const handleNavigate = () => {
    navigation.navigate(`bill${bill.title}`);
  };
  return (
    <Pressable
      onPress={handleNavigate}
      style={{ ...styles.bill, minWidth: vw < 450 ? vw / 2 : vw / 3 }}>
      <View>{svgIcon(40, 40)}</View>
      <RegularText>{bill.desc}</RegularText>
    </Pressable>
  );
};
