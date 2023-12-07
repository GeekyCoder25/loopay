import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SendMoney from '../pages/SendMenuPages/SendMoney';
import SendLoopay from '../pages/SendMenuPages/SendMoney/SendLoopay';
import TransferFunds from '../pages/SendMenuPages/SendMoney/TransferFunds';
import SendBeneficiary from '../pages/SendMenuPages/SendMoney/SendBeneficiary';
import SendNew from '../pages/SendMenuPages/SendMoney/SendNew';
import Back from '../components/Back';
import Success from '../pages/SendMenuPages/Success';
import Profile from '../pages/HomePages/Profile';
import LoopayTag from '../pages/HomePages/LoopayTag';
import Withdraw from '../pages/HomePages/Withdraw';

const SendMoneyNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation, route }) => (
          <Back goBack={navigation.goBack} route={route} />
        ),
      }}>
      <Stack.Screen name="SendMoney" component={SendMoney} />
      <Stack.Screen name="SendLoopay" component={SendLoopay} />
      <Stack.Screen name="SendBeneficiary" component={SendBeneficiary} />
      <Stack.Screen name="SendNew" component={SendNew} />
      <Stack.Screen name="SendBank" component={Withdraw} />
      <Stack.Screen name="SendProfile" component={Profile} />
      <Stack.Screen name="LoopayTag" component={LoopayTag} />
      <Stack.Screen
        name="TransferFunds"
        component={TransferFunds}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Success"
        component={Success}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SendMoneyNavigator;
