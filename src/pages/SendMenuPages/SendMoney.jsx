import React, { useContext } from 'react';
import AccInfoCard from '../../components/AccInfoCard';
import PageContainer from '../../components/PageContainer';
import { StyleSheet, View } from 'react-native';
import RegularText from '../../components/fonts/RegularText';
import { RouteLink } from '../BottomTabPages/SendMenu';
import { AppContext } from '../../components/AppContext';

const SendMoney = ({ navigation }) => {
  const { selectedCurrency } = useContext(AppContext);

  const SendMoneyRoutes = [
    {
      routeName: 'Send Fund using Loopay Tag',
      routeDetails:
        'Send money instantly to friends and family using Loopay tag',
      routeIcon: 'add',
      routeNavigate: 'SendLoopay',
    },
    {
      routeName: 'Send to a Beneficiary',
      routeDetails: 'Choose from one of your saved beneficiaries to send money',
      routeIcon: 'beneficiary',
      routeNavigate: 'SendBeneficiary',
    },
    {
      routeName: 'Send to a new recipient',
      routeDetails:
        'Enter details of a loopay account not saved in your beneficiaries',
      routeIcon: 'recipient',
      routeNavigate: 'SendNew',
    },
    {
      routeName: 'Send to other banks',
      routeDetails: `Send money to other ${selectedCurrency.acronym} bank accounts`,
      routeIcon: 'bank',
      routeNavigate: 'SendOthers',
    },
    {
      routeName: 'Send International',
      routeDetails: `Send ${selectedCurrency.acronym} to any currency world wide`,
      routeIcon: 'sendGlobe',
      routeNavigate: 'SendInternational',
    },
  ];
  return (
    <PageContainer padding paddingTop={0} scroll>
      <View style={styles.body}>
        <AccInfoCard />
        <RegularText style={styles.headerText}>Send Money</RegularText>
        <View>
          {SendMoneyRoutes.map(route => (
            <RouteLink
              key={route.routeIcon}
              route={route}
              navigation={navigation}
            />
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
    fontSize: 24,
    color: '#525252',
  },
});

export default SendMoney;
