import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Menu from '../pages/BottomTabPages/Menu';
import ChangePassword from '../pages/MenuPages/ChangePassword';
import Back from '../components/Back';
import MyInfo from '../pages/MenuPages/MyInfo';
import VerificationStatus from '../pages/MenuPages/VerificationStatus';
import TransactionHistory from '../pages/MenuPages/TransactionHistory';
import DevicesAndSessions from '../pages/MenuPages/DevicesAndSessions';
import TransactionPin from '../pages/MenuPages/TransactionPin';
import Referrals from '../pages/MenuPages/Referrals';
import Support from '../pages/MenuPages/Support';
import VirtualCard from '../pages/SendMenuPages/VirtualCard';
import VirtualCardDetails from '../pages/SendMenuPages/VirtualCardDetails';
import TransactionHistoryParams from '../pages/MenuPages/TransactionHistoryParams';
import IdentitiyVerification from '../pages/MenuPages/VerificationStatus/IdentitiyVerification';
import VerificationInformation from '../pages/MenuPages/VerificationStatus/VerificationInformation';
import VerifyImage from '../pages/MenuPages/VerificationStatus/VerifyImage';

const MenuNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation, route }) => (
          <Back goBack={navigation.goBack} route={route} />
        ),
      }}>
      <Stack.Screen
        name="SendMenu"
        component={Menu}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="MyInfo" component={MyInfo} />
      <Stack.Screen name="VerificationStatus" component={VerificationStatus} />
      <Stack.Screen
        name="IdentityVerification"
        component={IdentitiyVerification}
      />
      <Stack.Screen
        name="VerificationInformation"
        component={VerificationInformation}
      />
      <Stack.Screen name="VerifyImage" component={VerifyImage} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
      <Stack.Screen
        name="TransactionHistoryDetails"
        component={TransactionHistoryParams}
      />
      <Stack.Screen name="VirtualCard" component={VirtualCard} />
      <Stack.Screen name="VirtualCardDetails" component={VirtualCardDetails} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="DevicesAndSessions" component={DevicesAndSessions} />
      <Stack.Screen name="TransactionPin" component={TransactionPin} />
      <Stack.Screen name="Referrals" component={Referrals} />
      <Stack.Screen name="Support" component={Support} />
    </Stack.Navigator>
  );
};

export default MenuNavigator;
