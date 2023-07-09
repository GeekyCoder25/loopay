import React from 'react';
import AccInfoCard from '../../components/AccInfoCard';
import PageContainer from '../../components/PageContainer';
import { StyleSheet, View } from 'react-native';
import RegularText from '../../components/fonts/RegularText';
import { RoutePage } from '../BottomTabPages/SendMenu';
import { SendMoneyRoutes } from '../../database/data';

const SendMoney = ({ navigation }) => {
  return (
    <PageContainer padding={true} paddingTop={0}>
      <View style={styles.body}>
        <AccInfoCard />
        <RegularText style={styles.headerText}>Send Money</RegularText>
        <View>
          {SendMoneyRoutes.map(routePage => (
            <RoutePage
              key={routePage.routeIcon}
              routePage={routePage}
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
