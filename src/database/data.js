import { CurrencyFullDetails } from '../../utils/allCountries';
import { getCurrencyCode } from '../../utils/storage';

export const signUpData = [
  {
    name: 'firstName',
    placeholder: 'First name',
    type: 'name',
    inputMode: 'text',
  },
  {
    name: 'lastName',
    placeholder: 'Last name',
    type: 'name',
    inputMode: 'text',
  },
  {
    name: 'userName',
    placeholder: 'Username',
    type: 'username',
    inputMode: 'text',
  },
  {
    name: 'email',
    placeholder: 'E-mail address',
    type: 'email',
    inputMode: 'email',
  },
  {
    name: 'phoneNumber',
    placeholder: 'Phone number',
    type: 'tel',
    inputMode: 'tel',
    countryCode: true,
  },
  {
    name: 'password',
    placeholder: 'Password',
    type: 'password',
    inputMode: 'numeric',
    eye: true,
  },
  {
    name: 'confirmPassword',
    placeholder: 'Retype Password',
    type: 'password',
    inputMode: 'numeric',
    eye: true,
  },
];
export const signInData = [
  {
    name: 'email',
    placeholder: 'E-mail address',
    type: 'email',
    inputMode: 'email',
  },
  {
    name: 'password',
    placeholder: 'Password',
    type: 'password',
    inputMode: 'numeric',
    eye: true,
  },
];

export const accountType = [
  {
    title: 'Personal',
    details: 'To send and receive funds from friends and family',
  },
  {
    title: 'Business',
    details: 'To receive payment for clients',
  },
];

export const allCurrencies = [
  {
    currency: 'dollar',
    fullName: 'United State Dollar',
    acronym: 'USD',
    symbol: '$',
    minimumAmountToAdd: 1,
  },
  {
    currency: 'euro',
    fullName: 'European Dollar',
    acronym: 'EUR',
    symbol: '€',
    minimumAmountToAdd: 1,
  },
  {
    currency: 'pound',
    fullName: 'Great British Pound',
    acronym: 'GBP',
    symbol: '£',
    minimumAmountToAdd: 1,
  },
];
getCurrencyCode().then(currency => {
  if (currency) {
    const localCurrency = CurrencyFullDetails[currency];
    const checkCurrency = allCurrencies.filter(
      index => index.acronym === currency,
    );
    if (!checkCurrency.length) {
      allCurrencies.unshift({
        currency: localCurrency.name.split(' ').pop().toLowerCase(),
        fullName: localCurrency.name,
        acronym: localCurrency.code,
        symbol: localCurrency.symbol_native,
        minimumAmountToAdd: 100,
        isLocal: true,
      });
    }
  }
});
export const sendMenuRoutes = [
  {
    routeName: 'Add Money',
    routeDetails: 'Top your USD Account',
    routeIcon: 'add',
    routeNavigate: 'AddMoney',
  },
  {
    routeName: 'Send Money',
    routeDetails: 'Send Funds to Family and Friends',
    routeIcon: 'send',
    routeNavigate: 'SendMoneyNavigator',
  },
  {
    routeName: 'Swap Funds',
    routeDetails: 'Convert your USD to another currency',
    routeIcon: 'swap',
    routeNavigate: 'SwapFunds',
  },
  {
    routeName: 'Request Money',
    routeDetails: 'Request money using loopay tag',
    routeIcon: 'wallet',
    routeNavigate: 'RequestFund',
  },
  {
    routeName: 'Mobile/Virtual Top up',
    routeDetails: 'Buy airtime and data via VTU',
    routeIcon: 'airtime',
    routeNavigate: 'AirtimeTopUpNavigator',
  },
  {
    routeName: 'Pay a Bill',
    routeDetails: 'Cable, Electricity and School fees',
    routeIcon: 'bill',
    routeNavigate: 'PayABill',
  },
  {
    routeName: 'Card',
    routeDetails: 'Virtual Debit Card',
    routeIcon: 'card',
    routeNavigate: 'VirtualCard',
  },
  {
    routeName: 'Account Statement',
    routeDetails: 'Generate account statement for account',
    routeIcon: 'statement',
    routeNavigate: 'AccStatement',
  },
];

export const menuRoutes = [
  {
    routeName: 'My Info',
    routeNavigate: 'MyInfo',
    routeIcon: 'user',
  },
  {
    routeName: 'Verification Status',
    routeNavigate: 'VerificationStatus',
    routeIcon: 'user',
    routeEnd: true,
  },
  {
    routeName: 'Transaction History',
    routeNavigate: 'TransactionHistory',
    routeIcon: 'history',
  },
  {
    routeName: 'Virtual Card',
    routeNavigate: 'VirtualCard',
    routeIcon: 'card',
  },
  // {
  //   routeName: 'Two-Factor Authentication',
  //   routeNavigate: 'TwoAuth',
  //   routeIcon: 'shield',
  // },
  {
    routeName: 'Change Password',
    routeNavigate: 'ChangePassword',
    routeIcon: 'lock',
  },
  {
    routeName: 'Devices and Session',
    routeNavigate: 'DevicesAndSessions',
    routeIcon: 'devices',
  },
  {
    // routeName: `${appData.pin ? 'Change' : 'Create'} Transaction Pin`,
    routeNavigate: 'TransactionPin',
    routeIcon: 'key',
  },
  {
    routeName: 'Referrals',
    routeNavigate: 'Referrals',
    routeIcon: 'dualUser',
  },
  {
    routeName: 'Support',
    routeNavigate: 'Support',
    routeIcon: 'dualUser',
  },
];
export const swapFromObject = {
  currency: '',
  acronym: '',
  amount: 0,
  symbol: '',
  minimumAmountToAdd: 0,
  fee: 1,
  balance: 0,
};
export const swapToObject = {
  currency: '',
  acronym: '',
  amount: 0,
  symbol: '',
  minimumAmountToAdd: 0,
  fee: 1,
  balance: 0,
};

export const tagNameRules = {
  minimum: 6,
  maximum: 15,
};
