import { useContext } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import TVIcon from '../../../../assets/images/billTv.svg';
import InternetIcon from '../../../../assets/images/billInternet.svg';
import SchoolIcon from '../../../../assets/images/billSchool.svg';
import ElectricityIcon from '../../../../assets/images/billElectricity.svg';
import RegularText from '../../../components/fonts/RegularText';
import { AppContext } from '../../../components/AppContext';
import IonIcon from '@expo/vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

const PayABill = ({ navigation }) => {
  const { appData } = useContext(AppContext);
  const countryCode = appData.country.code;

  const bills = [
    {
      title: 'TV',
      desc: 'TV Cable',
      headerText: 'Cable TV',
      buttonText: 'Make Payment',
      data: [
        {
          title: 'Provider',
          type: 'select',
          placeholder: 'Select a Provider',
          id: 'provider',
          apiUrl: `user/bill-merchants?type=tv&country=${countryCode}`,
        },
        {
          title: 'Decoder type',
          type: 'select',
          placeholder: 'Select decoder type',
          id: 'meterType',
        },
        {
          title: 'Enter Card Number',
          type: 'input',
          id: 'meterNo',
        },
        {
          title: 'Amount',
          type: 'input',
          id: 'amount',
        },
        {
          title: 'Message',
          type: 'input',
          placeholder: '(optional)',
          id: 'description',
          optional: true,
          inputMode: 'text',
        },
      ],
    },
    // {
    //   title: 'internet',
    //   desc: 'Internet',
    //   headerText: 'Internet',
    //   buttonText: 'Make Payment',
    //   data: [
    //     {
    //       title: 'Select Provider',
    //       type: 'select',
    //       placeholder: 'Select Provider',
    //       id: 'provider',
    //       apiUrl: 'https://jsonplaceholder.typicode.com/todos',
    //     },
    //     {
    //       title: 'Package',
    //       type: 'select',
    //       placeholder: 'Select Package',
    //       id: 'package',
    //     },
    //     {
    //       title: 'Customer ID',
    //       type: 'input',
    //       id: 'customerID',
    //     },
    //     {
    //       title: 'Amount',
    //       type: 'input',
    //       id: 'amount',
    //       balance: true,
    //     },
    //   ],
    // },
    {
      title: 'school',
      desc: 'School payment',
      headerText: 'School Payment',
      buttonText: 'Make Payment',
      data: [
        {
          title: 'School',
          type: 'select',
          placeholder: 'Select School',
          id: 'school',
        },
        {
          title: 'Select Locality',
          type: 'select',
          placeholder: 'Select Locality',
          id: 'locality',
        },
        {
          title: 'Enter Matric Number',
          type: 'input',
          placeholder: 'Matric Number',
          id: 'matricNo',
        },
        {
          title: 'Amount',
          type: 'input',
          id: 'amount',
        },
      ],
    },
    {
      title: 'electricity',
      desc: 'Electricity',
      headerText: 'Electricity',
      buttonText: 'Make Payment',
      data: [
        {
          title: 'Provider',
          type: 'select',
          placeholder: 'Select Provider',
          id: 'provider',
          apiUrl: `user/bill-merchants?type=electricity&country=${countryCode}`,
        },
        // {
        //   title: 'Package',
        //   type: 'select',
        //   placeholder: 'Select Package',
        //   id: 'package',
        // },
        {
          title: 'Meter type',
          type: 'select',
          placeholder: 'Select meter type',
          id: 'meterType',
          apiUrl: 'user/bill-services',
        },
        {
          title: 'Meter number',
          type: 'input',
          placeholder: 'Enter Meter number',
          id: 'meterNo',
        },
        {
          title: 'Amount',
          type: 'input',
          id: 'amount',
          balance: true,
        },
        {
          title: 'Message',
          type: 'input',
          placeholder: '(optional)',
          id: 'message',
          optional: true,
          inputMode: 'text',
        },
      ],
    },
    {
      title: 'water',
      desc: 'Water',
      headerText: 'Water',
      buttonText: 'Make Payment',
      data: [
        {
          title: 'Select Provider',
          type: 'select',
          placeholder: 'Select Provider',
          id: 'provider',
          apiUrl: 'user/bill?water',
        },
        {
          title: 'Registration number',
          type: 'input',
          placeholder: 'Enter registration number',
          id: 'subscriberAccountNumber',
        },
        {
          title: 'Amount',
          type: 'input',
          id: 'amount',
          balance: true,
        },
        {
          title: 'Message',
          type: 'input',
          placeholder: '(optional)',
          id: 'message',
          inputMode: 'text',
        },
      ],
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
  const route = useRoute();
  const svgIcon = (width, height) => {
    switch (bill.title) {
      case 'TV':
        return <TVIcon width={width} height={height} />;
      case 'internet':
        return <InternetIcon width={width} height={height} />;
      case 'school':
        return <SchoolIcon width={width} height={height} />;
      case 'electricity':
        return <ElectricityIcon width={width} height={height} />;
      case 'water':
        return <IonIcon name="water" color={'#525252'} size={40} />;
      default:
        break;
    }
  };
  const { headerText, data, buttonText, title } = bill;

  const handleNavigate = () => {
    const params = {
      headerText,
      data,
      buttonText,
      title,
    };

    if (route.params?.schedule) {
      params.schedule = route.params.schedule;
    }
    navigation.navigate('PayABillParams', params);
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
