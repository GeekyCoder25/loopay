import AccInfoCard from '../../components/AccInfoCard';
import PageContainer from '../../components/PageContainer';
import { StyleSheet, View } from 'react-native';
import { RouteLink } from '../BottomTabPages/SendMenu';
import { AppContext } from '../../components/AppContext';
import { useContext } from 'react';

const AirtimeTopUp = ({ navigation }) => {
  const { selectedCurrency } = useContext(AppContext);

  const AirtimeTopUpRoutes = [
    {
      routeName: 'Buy Airtime',
      routeDetails: 'Recharge any phone easily',
      routeIcon: 'airtime',
      routeNavigate: 'BuyAirtime',
    },
    {
      routeName: 'Buy Data',
      routeDetails: 'Recharge your mobile data for seamless internet access',
      routeIcon: 'add',
      routeNavigate: 'BuyData',
    },
    {
      routeName: 'Buy International Airtime',
      routeDetails: 'Recharge any network worldwide easily',
      routeIcon: 'globe',
      routeNavigate: 'BuyAirtimeInternational',
    },
    {
      routeName: 'Airtime History',
      routeDetails: `Generate account statement for ${selectedCurrency.acronym} account`,
      routeIcon: 'statement',
      routeNavigate: 'AirtimeHistory',
    },
  ];
  return (
    <PageContainer padding paddingTop={0}>
      <View style={styles.body}>
        <AccInfoCard />
        <View>
          {AirtimeTopUpRoutes.map(route => (
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
export default AirtimeTopUp;
