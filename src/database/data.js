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
  {
    name: 'referralCode',
    placeholder: 'Referral code (optional)',
    type: 'referral',
    inputMode: 'text',
    optional: true,
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
    routeName: 'Settings',
    routeNavigate: 'Settings',
    routeIcon: 'gear',
  },
  {
    routeName: 'Referral',
    routeNavigate: 'Referral',
    routeIcon: 'dualUser',
  },
  {
    routeName: 'Support',
    routeNavigate: 'Support',
    routeIcon: 'support',
  },
];

export const settingsRoutes = [
  {
    routeName: 'Manage Beneficiaries',
    routeNavigate: 'Beneficiaries',
    routeIcon: 'dualUser',
  },
  {
    routeName: 'Change Password',
    routeNavigate: 'ChangePassword',
    routeIcon: 'lock',
  },

  {
    routeName: 'Change Pin',
    routeNavigate: 'TransactionPin',
    routeIcon: 'key',
  },
  {
    routeName: 'Devices and Session',
    routeNavigate: 'DevicesAndSessions',
    routeIcon: 'devices',
  },
  {
    routeName: 'Biometric Authentication',
    routeNavigate: 'Biometric',
    routeIcon: 'biometric',
    routeDetails: 'Enable/Disable biometric authentication method',
  },
  {
    routeName: 'Support',
    routeNavigate: 'Support',
    routeIcon: 'support',
  },
  {
    routeName: 'Delete Account',
    routeNavigate: 'DeleteAccount',
    routeIcon: 'trash',
  },
  {
    routeName: 'Rate the app',
    routeNavigate: 'Rate',
    routeIcon: 'star',
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
