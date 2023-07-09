import { ScrollView, StyleSheet, View } from 'react-native';
import PageContainer from '../../components/PageContainer';

import { accInfoRoutes } from '../../database/data';
import { RoutePage } from '../BottomTabPages/SendMenu';
import AccInfoCard from '../../components/AccInfoCard';
const AccInfo = ({ navigation }) => {
  return (
    <PageContainer padding={true} paddingTop={0}>
      <View style={styles.body}>
        <AccInfoCard />
        <ScrollView>
          {accInfoRoutes.map(routePage => (
            <RoutePage
              key={routePage.routeIcon}
              routePage={routePage}
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
