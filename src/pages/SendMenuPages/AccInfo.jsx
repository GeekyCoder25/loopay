import { ScrollView, StyleSheet, View } from 'react-native';
import PageContainer from '../../components/PageContainer';

import { accInfoRoutes } from '../../database/data';
import { RouteLink } from '../BottomTabPages/SendMenu';
import AccInfoCard from '../../components/AccInfoCard';
const AccInfo = ({ navigation }) => {
  return (
    <PageContainer padding paddingTop={0}>
      <View style={styles.body}>
        <AccInfoCard />
        <ScrollView>
          {accInfoRoutes.map(route => (
            <RouteLink
              key={route.routeIcon}
              route={route}
              navigation={navigation}
            />
          ))}
        </ScrollView>
      </View>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  body: {
    gap: 15,
    flex: 1,
  },
});
export default AccInfo;
