import React from 'react';
import PageContainer from '../../components/PageContainer';
import { Pressable, StyleSheet, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import Mail from '../../../assets/images/supportMail.svg';
import Whatsapp from '../../../assets/images/supportWhatsapp.svg';

const Support = () => {
  const supportContacts = [
    {
      support: 'mail',
      placeholder: 'Email Loopay Support',
      contact: 'support@loopay.app',
    },
    {
      support: 'whatsapp',
      placeholder: 'Chat Loopay Support on Whatsapp',
      contact: '+234 ',
    },
  ];
  return (
    <PageContainer justify={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BoldText style={styles.boldHeader}>Loopay Support</BoldText>
          <RegularText>Chat with Loopay Customer care support</RegularText>
        </View>
        <View>
          {supportContacts.map(contact => (
            <Contact key={contact.support} contact={contact} />
          ))}
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 5,
    marginBottom: 20,
    paddingHorizontal: 3 + '%',
  },
  boldHeader: {
    fontSize: 18,
    color: '#525252',
  },
  support: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#BBBBBB',
    paddingVertical: 20,
    paddingHorizontal: 3 + '%',
  },
  details: {
    gap: 5,
  },
  contact: {
    color: '#006E53',
  },
});
export default Support;

export const Contact = ({ contact }) => {
  // eslint-disable-next-line react/no-unstable-nested-components
  const SVG = () => {
    switch (contact.support) {
      case 'mail':
        return <Mail />;
      case 'whatsapp':
        return <Whatsapp />;
      default:
        <Mail />;
    }
  };

  const handlePress = () => {
    console.log(contact.support);
  };

  return (
    <Pressable onPress={handlePress} style={styles.support}>
      {SVG()}
      <View style={styles.details}>
        <BoldText>{contact.placeholder}</BoldText>
        <BoldText style={styles.contact}>{contact.contact}</BoldText>
      </View>
    </Pressable>
  );
};
