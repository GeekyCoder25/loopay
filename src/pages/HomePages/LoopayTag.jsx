import React from 'react';
import PageContainer from '../../components/PageContainer';
import { StyleSheet, TextInput, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import Button from '../../components/Button';

const LoopayTag = () => {
  return (
    <PageContainer padding={true}>
      <View style={styles.body}>
        <BoldText style={styles.boldText}>Create your Unque LoopayTag</BoldText>
        <RegularText style={styles.text}>
          Your Loopay Tag is used for receiving money from other Loopay Users
          with Loopay Tag
        </RegularText>
        <View style={styles.textInputContainer}>
          <BoldText style={styles.symbol}>#</BoldText>
          <TextInput
            style={styles.textInput}
            inputMode="text"
            // onChangeText={text => handlePriceInput(text)}
            // onBlur={handleAutoFill}
            // value={value}
            placeholder="yourloopaytag"
            placeholderTextColor={'#525252'}
          />
        </View>
        <View>
          <Button text={'Help Suggest LoopayTag'} />
        </View>
      </View>
      <View style={styles.button}>
        <Button
          text={'Create Loopay Tag'}
          //   handlePress={() => navigation.navigate('LoopayTag')}
        />
      </View>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  body: {
    gap: 20,
    flex: 1,
  },
  boldText: {
    fontSize: 20,
  },
  text: {
    color: '#525252',
  },
  textInputContainer: {
    position: 'relative',
  },
  textInput: {
    borderRadius: 15,
    backgroundColor: '#f9f9f9',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    paddingLeft: 35,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  symbol: {
    position: 'absolute',
    fontSize: 18,
    zIndex: 9,
    top: 15,
    left: 15,
    color: '#525252',
  },
  button: {
    marginVertical: 50,
  },
});
export default LoopayTag;
