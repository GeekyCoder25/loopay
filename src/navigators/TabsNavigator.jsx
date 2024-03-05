/* eslint-disable react/no-unstable-nested-components */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useEffect } from 'react';
import { AppContext } from '../components/AppContext';
import LoopayTag from '../pages/HomePages/LoopayTag';
import SendMoneyNavigator from './SendMoneyNavigator';
import Notification from '../pages/HomePages/Notification';
import Success from '../pages/SendMenuPages/Success';
import TransactionHistoryParams from '../pages/MenuPages/TransactionHistoryParams';
import PendingRequest from '../pages/SendMenuPages/RequestFunds/PendingRequest';
import PendingRequestConfirm from '../pages/SendMenuPages/RequestFunds/PendingRequestConfirm';
import RequestStatus from '../pages/SendMenuPages/RequestFunds/RequestStatus';
import AccountDetails from '../pages/HomePages/AccountDetails';
import SwapFunds from '../pages/SendMenuPages/SwapFunds';
import RequestFund from '../pages/SendMenuPages/RequestFund';
import BuyData from '../pages/SendMenuPages/AirtimeTopUp/BuyData';
import BuyAirtime from '../pages/SendMenuPages/AirtimeTopUp/BuyAirtime';
import TransferAirtime from '../pages/SendMenuPages/AirtimeTopUp/TransferAirtime';
import TransactionHistory from '../pages/MenuPages/TransactionHistory';
import RequestConfirm from '../pages/SendMenuPages/RequestFunds/RequestConfirm';
import RequestSuccess from '../pages/SendMenuPages/RequestFunds/RequestSuccess';
import AddMoney from '../pages/SendMenuPages/AddMoney';
import AddMoneyConfirm from '../pages/SendMenuPages/AddMoney/AddMoneyConfirm';
import AddNewCard from '../pages/SendMenuPages/AddMoney/AddNewCard';
import Biometric from '../pages/HomePages/Biometric';
import TransactionPin from '../pages/MenuPages/TransactionPin';
import AddMoneyDetails from '../pages/SendMenuPages/AddMoney/AddMoneyDetails';
import SendLoopay from '../pages/SendMenuPages/SendMoney/SendLoopay';
import PayABill from '../pages/SendMenuPages/PayABill/PayABill';
import Withdraw from '../pages/HomePages/Withdraw';
import AirtimeTopUpNavigator from './AirtimeTopUpNavigator';
import PayABillParams from '../pages/SendMenuPages/PayABill/PayABillParams';
import TransferBill from '../pages/SendMenuPages/PayABill/TransferBill';
import TransferFunds from '../pages/SendMenuPages/SendMoney/TransferFunds';
import SendOthers from '../pages/SendMenuPages/SendMoney/SendOthers';
import VirtualCard from '../pages/SendMenuPages/VirtualCard';
import AccStatement from '../pages/SendMenuPages/AccStatement';
import Back from '../components/Back';
import VirtualCardDetails from '../pages/SendMenuPages/VirtualCardDetails';
import SchedulePayment from '../pages/SendMenuPages/SchedulePayments/SchedulePayment';
import SchedulePayments from '../pages/SendMenuPages/SchedulePayments/SchedulePayments';
import WalletContextComponent from '../context/WalletContext';
import BeneficiaryContextComponent from '../context/BeneficiariesContext';
import RequestFundsContextComponent from '../context/RequestContext';
import Popup from '../components/Popup';
import useShakeEvent from '../components/Shake';
import ShakeModal from '../components/ShakeModal';
import ProfileNavigator from './ProfileNavigator';
import MyInfo from '../pages/MenuPages/MyInfo';
import VerificationStatus from '../pages/MenuPages/VerificationStatus';
import DevicesAndSessions from '../pages/MenuPages/DevicesAndSessions';
import Referrals from '../pages/MenuPages/Referrals';
import Support from '../pages/MenuPages/Support';
import IdentityVerification from '../pages/MenuPages/VerificationStatus/IdentityVerification';
import VerificationInformation from '../pages/MenuPages/VerificationStatus/VerificationInformation';
import VerifyImage from '../pages/MenuPages/VerificationStatus/VerifyImage';
import VerifyInputNumber from '../pages/MenuPages/VerificationStatus/VerifyInputNumber';
import Settings from '../pages/MenuPages/Settings';
import Beneficiaries from '../pages/MenuPages/Settings/Beneficiaries';
import DeleteAccount from '../pages/MenuPages/DeleteAccount';
import Referral from '../pages/MenuPages/Referral';
import ChangePassword from '../pages/MenuPages/ChangePassword';
import BottomTabs from './BottomTabs';

const TabsNavigator = () => {
  const {
    appData,
    setAppData,
    showPopUp,
    isSessionTimedOut,
    setIsShaking,
    setOpenShake,
  } = useContext(AppContext);
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    setAppData(prev => {
      return {
        ...prev,
        pin: JSON.parse(appData.pin),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShake = () => {
    setIsShaking(false);
    setOpenShake(true);
  };
  useShakeEvent(handleShake);

  const screenHeader = (navigation, route) => {
    return {
      headerShown: true,
      header: () => <Back goBack={navigation.goBack} route={route} />,
    };
  };

  return (
    <WalletContextComponent>
      <BeneficiaryContextComponent>
        <RequestFundsContextComponent>
          <Stack.Navigator
            screenOptions={({ navigation, route }) =>
              screenHeader(navigation, route)
            }
            backBehavior="initialRoute">
            <Stack.Screen
              name="BottomTabs"
              component={BottomTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="LoopayTag" component={LoopayTag} />
            <Stack.Screen name="AccountDetails" component={AccountDetails} />
            <Stack.Screen name="AddMoneyFromHome" component={AddMoney} />
            <Stack.Screen
              name="SwapFunds"
              component={SwapFunds}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="AddMoneyConfirm" component={AddMoneyConfirm} />
            <Stack.Screen name="AddMoneyDetails" component={AddMoneyDetails} />
            <Stack.Screen name="AddNewCard" component={AddNewCard} />
            <Stack.Screen
              name="SendMoneyNavigatorFromHome"
              component={SendMoneyNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="SwapFundsFromHome" component={SwapFunds} />
            <Stack.Screen
              name="AirtimeTopUpNavigator"
              component={AirtimeTopUpNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="BuyAirtime" component={BuyAirtime} />
            <Stack.Screen name="BuyData" component={BuyData} />
            <Stack.Screen
              name="RequestFund"
              component={RequestFund}
              options={({ navigation, route }) => ({
                ...screenHeader(navigation, route),
                animation: 'none',
              })}
            />
            <Stack.Screen
              name="RequestConfirm"
              component={RequestConfirm}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="RequestSuccess" component={RequestSuccess} />
            <Stack.Screen
              name="TransferAirtime"
              component={TransferAirtime}
              options={{ animation: 'none', headerShown: false }}
            />
            <Stack.Screen
              name="Success"
              component={Success}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TransactionHistory"
              component={TransactionHistory}
            />
            <Stack.Screen
              name="TransactionHistoryDetails"
              component={TransactionHistoryParams}
            />
            <Stack.Screen name="PendingRequest" component={PendingRequest} />
            <Stack.Screen
              name="PendingRequestConfirm"
              component={PendingRequestConfirm}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RequestStatus"
              component={RequestStatus}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Biometric" component={Biometric} />
            <Stack.Screen name="SendLoopay" component={SendLoopay} />
            <Stack.Screen
              name="SendOthers"
              component={SendOthers}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Withdraw" component={Withdraw} />
            <Stack.Screen name="PayABill" component={PayABill} />
            <Stack.Screen
              name="TransactionPin"
              component={TransactionPin}
              options={{
                animation: 'none',
                headerShown: false,
              }}
            />
            <Stack.Screen name="PayABillParams" component={PayABillParams} />
            <Stack.Screen
              name="TransferFunds"
              component={TransferFunds}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TransferBill"
              component={TransferBill}
              options={{
                headerShown: false,
                animation: 'none',
              }}
            />
            <Stack.Screen
              name="ProfileNavigator"
              component={ProfileNavigator}
              options={{ headerShown: false }}
            />

            <Stack.Screen name="AddMoney" component={AddMoney} />
            <Stack.Screen
              name="SendMoneyNavigator"
              component={SendMoneyNavigator}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen name="VirtualCard" component={VirtualCard} />
            <Stack.Screen
              name="VirtualCardDetails"
              component={VirtualCardDetails}
            />
            <Stack.Screen name="AccStatement" component={AccStatement} />
            <Stack.Screen
              name="SchedulePayment"
              component={SchedulePayment}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SchedulePayments"
              component={SchedulePayments}
            />
            <Stack.Screen name="MyInfo" component={MyInfo} />
            <Stack.Screen
              name="VerificationStatus"
              component={VerificationStatus}
            />
            <Stack.Screen
              name="IdentityVerification"
              component={IdentityVerification}
            />
            <Stack.Screen
              name="VerificationInformation"
              component={VerificationInformation}
            />
            <Stack.Screen name="VerifyInput" component={VerifyInputNumber} />
            <Stack.Screen name="VerifyImage" component={VerifyImage} />

            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen
              name="DevicesAndSessions"
              component={DevicesAndSessions}
            />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Referral" component={Referral} />
            <Stack.Screen name="Referrals" component={Referrals} />
            <Stack.Screen name="Support" component={Support} />
            <Stack.Screen name="Beneficiaries" component={Beneficiaries} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
          </Stack.Navigator>
          {showPopUp && !isSessionTimedOut && <Popup />}
          {<ShakeModal />}
        </RequestFundsContextComponent>
      </BeneficiaryContextComponent>
    </WalletContextComponent>
  );
};

export default TabsNavigator;
