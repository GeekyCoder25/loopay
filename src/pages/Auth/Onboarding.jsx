import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Image1 from '../../../assets/images/onboarding1.svg';
import Image2 from '../../../assets/images/onboarding2.svg';
import Image3 from '../../../assets/images/onboarding3.svg';
import Image4 from '../../../assets/images/onboarding4.svg';
import Image5 from '../../../assets/images/onboarding5.svg';
import Image6 from '../../../assets/images/onboarding6.svg';
import Image7 from '../../../assets/images/onboarding7.svg';
import Image8 from '../../../assets/images/onboarding8.svg';
import Image9 from '../../../assets/images/onboarding9.svg';
import SelectIcon from '../../../assets/images/select.svg';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import Button from '../../components/Button';
import Logo from '../../components/Logo';

const onboardings = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Onboarding = () => {
  const Stack = createNativeStackNavigator();

  return (
    <View style={styles.container}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {onboardings.map(onboarding => (
          <Stack.Screen
            name={`onboarding${onboarding}`}
            component={OnboardingMaps}
            key={onboarding}
          />
        ))}
      </Stack.Navigator>
    </View>
  );
};

export default Onboarding;

const OnboardingMaps = ({ route, navigation }) => {
  const onboardingPages = [
    {
      image: <Image1 />,
      title: 'Explore the Loopay features for both Business and Personal Usage',
      content: '',
      uri: 1,
    },
    {
      image: <Image2 />,
      title: 'Security',
      content: 'Your security is our priority. Your data are safe with us',
      uri: 2,
    },
    {
      image: <Image3 />,
      title: 'Verification',
      content: 'Easily verify your identity to enjoy using Loopay',
      uri: 3,
    },
    {
      image: <Image4 />,
      title: 'Referral',
      content:
        'Refer friends, family and clients to Loopay and enjoy amazing rewards',
      uri: 4,
    },
    {
      image: <Image5 />,
      title: 'Feedback',
      content: 'Help us improve! Share your feedback',
      uri: 5,
    },
    {
      image: <Image6 />,
      title: 'Finance',
      content:
        'Unlock the potential of your finances with Loopay Mobile Banking',
      uri: 6,
    },
    {
      image: <Image7 />,
      title: 'Payment',
      content:
        'Making payments has never been easier with Loopay Mobile Banking!',
      uri: 7,
    },
    {
      image: <Image8 />,
      title: 'Transfer',
      content:
        'Effortlessly send funds to family, friends, or your own accounts, anytime, anywhere',
      uri: 8,
    },
    {
      image: <Image9 />,
      title: 'Virtual Card',
      content:
        'Discover the power of financial flexibility right in the palm of your hand',
      uri: 9,
    },
  ];

  const currentPage = onboardingPages.find(
    page => `onboarding${page.uri}` === route.name,
  );
  return (
    <View style={styles.body}>
      <Pressable
        style={styles.skip}
        onPress={() => navigation.replace('SignUp')}>
        <BoldText>Skip</BoldText>
      </Pressable>
      <Logo />
      {currentPage.image}
      <BoldText style={styles.title}>{currentPage.title}</BoldText>
      {currentPage.uri !== 1 ? (
        <>
          <RegularText style={styles.content}>
            {currentPage.content}
          </RegularText>
          <Button
            text={'Next'}
            onPress={() =>
              route.name === `onboarding${onboardingPages.length}`
                ? navigation.navigate('SignUp')
                : navigation.navigate(`onboarding${currentPage.uri + 1}`)
            }
          />
        </>
      ) : (
        <View style={styles.page1}>
          <BoldText>Get started and manage your finances easily!</BoldText>
          <View style={styles.selectContainer}>
            <View style={styles.select}>
              <SelectIcon />
              <RegularText>Keep track of your balances</RegularText>
            </View>
            <View style={styles.select}>
              <SelectIcon />
              <RegularText>Easily make fund transfers</RegularText>
            </View>
            <View style={styles.select}>
              <SelectIcon />
              <RegularText>Easily make Bill payment</RegularText>
            </View>
          </View>
          <View>
            <Button
              text="Get Started"
              onPress={() => navigation.navigate('onboarding2')}
            />
          </View>
          <View style={styles.already}>
            <RegularText style={styles.alreadyText}>
              Already have an account?
            </RegularText>
            <Pressable onPress={() => navigation.navigate('SignIn')}>
              <BoldText style={styles.SignIn}>Sign in</BoldText>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5 + '%',
    paddingTop: 5 + '%',
    paddingBottom: 10 + '%',
  },
  skip: {
    width: '100%',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 5 + '%',
  },
  page1: {
    width: 100 + '%',
    marginVertical: 20,
  },
  selectContainer: {
    gap: 20,
    marginVertical: 30,
  },
  select: {
    flexDirection: 'row',
    gap: 5,
  },
  content: {
    textAlign: 'center',
    color: '#525252',
    fontSize: 16,
  },
  already: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 10,
  },
  alreadyText: {
    color: '#868585',
  },
  SignIn: {
    fontWeight: '600',
  },
});
