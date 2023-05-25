import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Menu from '../pages/Menu';

const MenuNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerTitle: 'Back' }}>
      <Stack.Screen
        name="SendMenu"
        component={Menu}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen name="AddMoney" component={AddMoney} />
      <Stack.Screen name="SwapFunds" component={SwapFunds} />
      <Stack.Screen name="VirtualCard" component={VirtualCard} />
      <Stack.Screen name="SendGift" component={SendGift} />
      <Stack.Screen name="AccInfo" component={AccInfo} />
      <Stack.Screen name="AccStatement" component={AccStatement} /> */}
    </Stack.Navigator>
  );
};

export default MenuNavigator;
