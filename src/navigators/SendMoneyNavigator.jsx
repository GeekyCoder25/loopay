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
import SendOthers from '../pages/SendMenuPages/SendMoney/SendOthers';
import TransactionPin from '../pages/MenuPages/TransactionPin';

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
      <Stack.Screen
        name="SendOthers"
        component={SendOthers}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SendProfile" component={Profile} />
      <Stack.Screen name="LoopayTag" component={LoopayTag} />
      <Stack.Screen
        name="TransferFunds"
        component={TransferFunds}
        options={{
          headerShown: false,
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="Success"
        component={Success}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TransactionPin"
        component={TransactionPin}
        options={{
          animation: 'none',
        }}
      />
    </Stack.Navigator>
  );
};

export default SendMoneyNavigator;
