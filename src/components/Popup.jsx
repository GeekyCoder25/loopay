import React, { useContext } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import BoldText from './fonts/BoldText';
import FaIcon from '@expo/vector-icons/Ionicons';
import { AppContext } from './AppContext';
import RegularText from './fonts/RegularText';
import { putFetchData } from '../../utils/fetchAPI';

const Popup = () => {
  const { popUp, setPopUp } = useContext(AppContext);
  const handleClose = async () => {
    const response = await putFetchData('user', { popUp: true });
    setPopUp(false);
    console.log(response);
  };
  return (
    <Modal visible={popUp} animationType="fade" transparent>
      <Pressable style={styles.overlay} />
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Pressable style={styles.close} onPress={handleClose}>
            <FaIcon name="close-circle" size={40} color={'#fff'} />
          </Pressable>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.body}>
              <BoldText>Popup Title</BoldText>
              <RegularText>
                Popup content goes here, thus Lorem ipsum dolor, sit tempore ea
                qui iure saepe libero nihil soluta! Animi possimus nesciunt,
                numquam illo doloribus eius harum voluptates ab magni,
                perferendis dolore a magnam, nostrum dolorem earum. Est hic
                corporis officia repudiandae suscipit voluptates inventore ullam
                doloribus facere esse neque nisi optio blanditiis eos rerum
                atque itaque voluptas ad voluptate repellat, enim corrupti porro
                quisquam. Quia, eveniet maxime quaerat voluptas ipsam soluta
                repellat non ducimus perspiciatis, qui, ullam doloremque
                delectus dolorum a officia dolores quam aspernatur nisi
                voluptatem voluptatibus saepe est animi. Deserunt ducimus,
                tempore itaque labore consequuntur cum quae sit dolorum totam,
                voluptate fugiat excepturi eveniet exercitationem modi magni
                natus amet distinctio praesentium voluptates quod. Deleniti,
                quae! Cupiditate porro sint labore dolores a iure accusamus
                fugiat repellendus ea, commodi numquam expedita soluta optio
                corrupti necessitatibus quis sunt dolorem. Corrupti a minus
                facere voluptatum veniam earum ullam incidunt totam, nobis vero
                veritatis, recusandae impedit hic labore ipsa nulla, dolorem
                ipsum. Tenetur vel delectus et culpa vero tempora quibusdam in
                quam qui ipsam, ad voluptatem non quos blanditiis unde impedit,
                adipisci necessitatibus labore temporibus at quo. Tempora illum
                aspernatur fuga atque rerum labore laudantium sequi consectetur,
                autem ullam blanditiis nihil, pariatur nam. Impedit tempore
                porro odio, nostrum odit totam dolor explicabo ducimus sit
                accusamus ab delectus quisquam nisi voluptas optio in quam
                reprehenderit molestiae atque quis enim pariatur eligendi
                obcaecati cumque. Odit exercitationem aspernatur id odio cum
                dignissimos enim debitis harum quaerat ut molestiae sapiente
                dolorem, totam sed minima doloremque nihil distinctio est saepe
                error animi corrupti aperiam, veritatis laborum. Quasi aperiam
                non praesentium ad expedita accusantium quam perspiciatis
                deserunt odio, dolores eaque modi deleniti rem saepe sed earum
                voluptate nostrum veritatis assumenda aut? Commodi omnis
                expedita impedit. Culpa ea, nulla voluptatum dolores repellendus
                aperiam laborum, similique cumque iste dolorem consequuntur?
                Iusto debitis beatae doloremque officiis provident omnis
                pariatur. Officiis id nisi dolorum velit, excepturi incidunt
                veritatis quia sint aliquam iste veniam nostrum cupiditate,
                laborum iusto doloribus! Dolorem modi illo qui ex quis totam
                corrupti doloribus tempore eligendi veniam, assumenda hic
                asperiores facilis nesciunt! Aspernatur et recusandae, doloribus
                blanditiis cupiditate atque incidunt sint saepe eum laborum fuga
                harum similique inventore eos, sed, exercitationem accusamus
                sequi. Magni odio ipsam nam consequatur animi.
              </RegularText>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: '#000',
    opacity: 0.7,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    height: 100 + '%',
    width: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: 80 + '%',
    height: 50 + '%',
    elevation: 10,
    alignItems: 'center',
    borderRadius: 8,
    gap: 30,
  },
  modalScroll: {},
  body: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 10,
  },
  close: {
    position: 'absolute',
    right: -35,
    top: -40,
    zIndex: 9,
  },
});
export default Popup;
