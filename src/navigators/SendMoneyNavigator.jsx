import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SendMoney from '../pages/SendMenuPages/SendMoney';
import SendLoopay from '../pages/SendMenuPages/SendMoney/SendLoopay';
import TransferFunds from '../pages/SendMenuPages/SendMoney/TransferFunds';
import SendBeneficiary from '../pages/SendMenuPages/SendMoney/SendBeneficiary';
import SendNew from '../pages/SendMenuPages/SendMoney/SendNew';
import SendMenuHeader from '../pages/SendMenuPages/Header';
const SendMoneyNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        header: () => (
          <SendMenuHeader goBack={navigation.goBack} route={route} />
        ),
      })}>
      <Stack.Screen name="SendMoney" component={SendMoney} />
      <Stack.Screen name="SendLoopay" component={SendLoopay} />
      <Stack.Screen name="SendBeneficiary" component={SendBeneficiary} />
      <Stack.Screen name="SendNew" component={SendNew} />
      <Stack.Screen
        name="TransferFunds"
        component={TransferFunds}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SendMoneyNavigator;
