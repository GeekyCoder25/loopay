import React, { useContext } from 'react';
import AccInfoCard from '../../components/AccInfoCard';
import PageContainer from '../../components/PageContainer';
import { StyleSheet, View } from 'react-native';
import RegularText from '../../components/fonts/RegularText';
import { RouteLink } from '../BottomTabPages/SendMenu';
import { AppContext } from '../../components/AppContext';

const SendMoney = ({ navigation }) => {
  const { appData } = useContext(AppContext);

  const SendMoneyRoutes = [
    {
      routeName: 'Send Fund using Loopay Tag',
      routeDetails:
        'Send money instantly to friends and family using Loopay tag',
      routeIcon: 'add',
      routeNavigate: appData.tagName ? 'SendLoopay' : 'SendProfile',
    },
    {
      routeName: 'Send to a Beneficiary',
      routeDetails: 'Choose from one of your saved beneficiaries to send money',
      routeIcon: 'beneficiary',
      routeNavigate: appData.tagName ? 'SendBeneficiary' : 'SendProfile',
    },
    {
      routeName: 'Send to a new recipient',
      routeDetails:
        'Enter details of an account you haven’t previously saved to make a withdrawal',
      routeIcon: 'recipient',
      routeNavigate: 'SendNew',
    },
  ];
  return (
    <PageContainer padding={true} paddingTop={0}>
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
