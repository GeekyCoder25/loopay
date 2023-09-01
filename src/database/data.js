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
  },
  {
    name: 'password',
    placeholder: 'Password',
    type: 'password',
    inputMode: 'text',
    eye: true,
  },
  {
    name: 'confirmPassword',
    placeholder: 'Retype Password',
    type: 'password',
    inputMode: 'text',
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
    inputMode: 'text',
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
    currency: 'Dollar',
    fullName: 'United State Dollar',
    acronym: 'USD',
    amount: 0.0,
    symbol: '$',
    minimumAmountToAdd: 1,
    fee: 1,
  },
  {
    currency: 'Euro',
    fullName: 'European dollar',
    acronym: 'EUR',
    amount: 0.0,
    symbol: '€',
    minimumAmountToAdd: 1,
    fee: 1,
  },
  {
    currency: 'Naira',
    fullName: 'Nigerian Naira',
    acronym: 'NGN',
    amount: 0.0,
    symbol: '₦',
    minimumAmountToAdd: 100,
    fee: 5,
  },
  {
    currency: 'Pound',
    fullName: 'Great British Pound',
    acronym: 'GBP',
    amount: 0.0,
    symbol: '£',
    minimumAmountToAdd: 2,
    fee: 1,
  },
];

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
    routeName: 'Airtime Top up',
    routeDetails: 'Buy airtime via VTU',
    routeIcon: 'airtime',
    routeNavigate: 'AirtimeTopup',
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
    routeDetails: 'Generate account statement for USD  account',
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
  minimun: 6,
  maximum: 15,
};
