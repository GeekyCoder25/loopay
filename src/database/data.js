export const signUpData = [
  {
    name: 'fullName',
    placeholder: 'Full name',
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

export const historyData = [
  {
    id: 1,
    transactionType: 'received',
    transactionAmount: 200,
  },
  {
    id: 2,
    transactionType: 'sent',
    transactionAmount: 40,
  },
  {
    id: 3,
    transactionType: 'sent',
    transactionAmount: 40,
  },
  {
    id: 4,
    transactionType: 'sent',
    transactionAmount: 40,
  },
  {
    id: 5,
    transactionType: 'sent',
    transactionAmount: 40,
  },
  {
    id: 6,
    transactionType: 'sent',
    transactionAmount: 40,
  },
  {
    id: 7,
    transactionType: 'sent',
    transactionAmount: 40,
  },
  {
    id: 8,
    transactionType: 'received',
    transactionAmount: 90,
  },
  {
    id: 9,
    transactionType: 'sent',
    transactionAmount: 40,
  },
];

export const allCurrencies = [
  {
    currency: 'Dollar',
    acronym: 'USD',
    amount: 0.0,
    symbol: '$',
    minimumAmountToAdd: 1,
    fee: 1,
  },
  {
    currency: 'Euro',
    acronym: 'EUR',
    amount: 0.0,
    symbol: '€',
    minimumAmountToAdd: 1,
    fee: 1,
  },
  {
    currency: 'Naira',
    acronym: 'NGN',
    amount: 0.0,
    symbol: '₦',
    minimumAmountToAdd: 100,
    fee: 1,
  },
  {
    currency: 'Pound',
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
    routeName: 'Swap Funds',
    routeDetails: 'Convert your USD to another currency',
    routeIcon: 'swap',
    routeNavigate: 'SwapFunds',
  },
  {
    routeName: 'Card',
    routeDetails: 'Virtual Debit Card',
    routeIcon: 'card',
    routeNavigate: 'VirtualCard',
  },
  {
    routeName: 'Send Gift',
    routeDetails: 'Send Gift to other LOOPAY users',
    routeIcon: 'gift',
    routeNavigate: 'SendGift',
  },
  {
    routeName: 'Account Information',
    routeDetails: 'See your virtual Account details ',
    routeIcon: 'info',
    routeNavigate: 'AccInfo',
  },
  {
    routeName: 'Account Statement',
    routeDetails: 'Generate account statement for USD  account',
    routeIcon: 'statement',
    routeNavigate: 'AccStatement',
  },
];
