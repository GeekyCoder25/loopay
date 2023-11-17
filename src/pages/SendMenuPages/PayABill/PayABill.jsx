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
import { postFetchData } from '../../../../utils/fetchAPI';

const PayABill = ({ navigation }) => {
  function VerifyCardNumber(stateFields, setErrorMessage) {
    if (Object.values(stateFields).includes('')) {
      return setErrorMessage('Please provide all required fields');
    }
    navigation.push('PayABillParams', {
      headerText: 'Cable TV',
      data: [
        {
          title: 'User Info',
          type: 'select',
          placeholder: 'User Info',
          id: 'userInfo',
        },
        {
          title: 'Package',
          type: 'select',
          placeholder: 'Select Package',
          id: 'package',
        },
        {
          title: 'Duration',
          type: 'select',
          placeholder: 'Duration',
          id: 'duration',
        },
      ],
      buttonText: 'Pay',
      buttonFunc: PayCableTv,
    });
  }
  const PayCableTv = () => {
    console.log('shit');
  };

  const payElectricity = async (stateFields, setErrorMessage) => {
    if (Object.values(stateFields).includes('')) {
      return setErrorMessage('Please provide all required fields');
    }
    const response = await postFetchData('user/bill?electricity', stateFields);
    console.log(response);
  };
  const bills = [
    {
      title: 'TV',
      desc: 'TV Cable',
      headerText: 'Cable TV',
      buttonText: 'Verify Card Number',
      buttonFunc: VerifyCardNumber,
      data: [
        {
          title: 'Select a Provider',
          type: 'select',
          placeholder: 'Select a Provider',
          id: 'provider',
          apiUrl: 'https://jsonplaceholder.typicode.com/todos',
        },
        {
          title: 'Enter Card Number',
          type: 'input',
          id: 'cardNumber',
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
      buttonText: 'Verify Matric Number',
      data: [
        {
          title: 'Select School',
          type: 'select',
          placeholder: 'Select School',
          id: 'school',
          apiUrl: '',
        },
        {
          title: 'Select Locality',
          type: 'select',
          placeholder: 'Select Locality',
          id: 'locality',
          apiUrl: 'user/bill?electricity',
        },
        {
          title: 'Enter Matric Number',
          type: 'input',
          placeholder: 'Matric Number',
          id: 'matricNo',
        },
      ],
    },
    {
      title: 'electricity',
      desc: 'Electricity',
      headerText: 'Electricity',
      buttonText: 'Make Payment',
      buttonFunc: payElectricity,
      data: [
        {
          title: 'Select Provider',
          type: 'select',
          placeholder: 'Select Provider',
          id: 'provider',
          apiUrl: 'user/bill?electricity',
        },
        // {
        //   title: 'Package',
        //   type: 'select',
        //   placeholder: 'Select Package',
        //   id: 'package',
        // },
        {
          title: 'Meter number',
          type: 'input',
          placeholder: 'Enter Meter number',
          id: 'meterNo',
        },
        // {
        //   title: 'User',
        //   type: 'select',
        //   placeholder: 'Select User',
        //   id: 'user',
        // },
        {
          title: 'Amount',
          type: 'input',
          id: 'amount',
          balance: true,
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
      default:
        break;
    }
  };
  const { headerText, data, buttonText, buttonFunc } = bill;

  const handleNavigate = () => {
    navigation.navigate('PayABillParams', {
      headerText,
      data,
      buttonText,
      buttonFunc,
    });
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
