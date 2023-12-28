import { useContext, useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { randomUUID } from 'expo-crypto';
import Button from '../../components/Button';
import { AppContext } from '../../components/AppContext';
import ErrorMessage from '../../components/ErrorMessage';
import {
  deleteFetchData,
  getFetchData,
  postFetchData,
  putFetchData,
} from '../../../utils/fetchAPI';
import ToastMessage from '../../components/ToastMessage';
import IonIcon from '@expo/vector-icons/Ionicons';
import FaIcon from '@expo/vector-icons/FontAwesome';
import Back from '../../components/Back';
import { FlatList } from 'react-native-gesture-handler';

const Announcements = () => {
  const { setWalletRefresh } = useContext(AppContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [editFormData, setEditFormData] = useState(null);
  const [reload, setReload] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    const getAnnouncements = async () => {
      const response = await getFetchData('admin/popup');
      if (response.status === 200) {
        setAnnouncements(response.data);
      }
    };
    getAnnouncements();
  }, [reload]);

  const handleEdit = announcement => {
    setEditFormData(announcement);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditFormData(null);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteFetchData(`admin/popup/${toDelete.popUpID}`);
      if (response.status === 200) {
        setReload(prev => !prev);
        ToastMessage('Announcement Deleted successfully');
        setToDelete(null);
      }
    } catch (error) {
      ToastMessage(error.message);
    } finally {
      setWalletRefresh(prev => !prev);
    }
  };

  const handleCancelDelete = () => {
    setToDelete(null);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <BoldText style={styles.headerText}>Announcements</BoldText>
          <Pressable style={styles.add} onPress={() => setModalOpen(true)}>
            <IonIcon name="add-sharp" size={24} color={'#fff'} />
          </Pressable>
        </View>
        <View style={styles.announcements}>
          <FlatList
            data={announcements}
            renderItem={({ item }) => (
              <View style={styles.announcement}>
                <View style={styles.announcementHeader}>
                  <BoldText>{item.title}</BoldText>
                  <Pressable onPress={() => handleEdit(item)}>
                    <FaIcon name="edit" size={24} />
                  </Pressable>
                </View>
                <RegularText>
                  {item.message.slice(0, 100)}
                  {item.message.length > 100 && ' . . .'}
                </RegularText>
                {item.image && (
                  <View>
                    <BoldText style={styles.verticalAlign}>Image URL:</BoldText>
                    <Pressable onPress={() => Linking.openURL(item.image)}>
                      <RegularText style={styles.link}>
                        {item.image.slice(0, 100)}
                        {item.image.length > 100 && '...'}
                      </RegularText>
                    </Pressable>
                  </View>
                )}
                {item.video && (
                  <View>
                    <BoldText style={styles.verticalAlign}>Video URL:</BoldText>
                    <Pressable onPress={() => Linking.openURL(item.video)}>
                      <RegularText style={styles.link}>
                        {item.video.slice(0, 100)}
                        {item.video.length > 100 && '...'}
                      </RegularText>
                    </Pressable>
                  </View>
                )}
                <View style={styles.announcementHeader}>
                  <View />
                  <Pressable onPress={() => setToDelete(item)}>
                    <FaIcon name="trash" size={24} />
                  </Pressable>
                </View>
              </View>
            )}
            keyExtractor={({ popUpID }) => popUpID}
          />
        </View>
      </View>
      <Modal visible={modalOpen} onRequestClose={handleClose}>
        <AddNew
          setReload={setReload}
          setModalOpen={setModalOpen}
          editFormData={editFormData}
          handleClose={handleClose}
        />
      </Modal>
      <Modal
        visible={toDelete && true}
        onRequestClose={handleCancelDelete}
        transparent>
        <Pressable style={styles.overlay} onPress={handleCancelDelete} />
        <View style={styles.toDeleteModalContainer}>
          <View style={styles.toDeleteModal}>
            <BoldText style={styles.headerText}>Confirm Delete</BoldText>
            <View style={styles.choices}>
              <Pressable style={styles.yes} onPress={handleDelete}>
                <BoldText>Yes</BoldText>
              </Pressable>
              <Pressable style={styles.no} onPress={handleCancelDelete}>
                <BoldText style={styles.noText}>No</BoldText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
  },
  add: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  container: {
    paddingHorizontal: 3 + '%',
    paddingTop: 20,
  },
  announcements: {
    paddingBottom: 120,
  },
  announcement: {
    gap: 10,
    marginBottom: 30,
    elevation: 5,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verticalAlign: {
    textAlignVertical: 'center',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  form: {
    marginTop: 30,
    gap: 20,
  },
  label: {
    fontFamily: 'OpenSans-600',
    color: '#868585',
    fontSize: 18,
  },
  textInput: {
    borderRadius: 6,
    backgroundColor: '#eee',
    height: 55,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  textInputMessage: {
    minHeight: 200,
  },
  message: {
    minHeight: 240,
  },
  errorMessage: {
    marginVertical: 30,
  },
  button: {
    marginBottom: 30,
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.7,
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: 100 + '%',
    width: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toDeleteModalContainer: {
    width: 100 + '%',
    height: 100 + '%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toDeleteModal: {
    borderRadius: 20,
    zIndex: 9,
    backgroundColor: '#fff',
    maxWidth: 300,
    width: 100 + '%',
    paddingTop: 20,
    gap: 10,
    padding: 3 + '%',
    alignItems: 'center',
  },
  choices: {
    gap: 25,
    flexDirection: 'row',
    marginVertical: 15,
  },
  no: {
    borderColor: '#1e1e1e',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#1e1e1e',
  },
  noText: {
    color: '#fff',
  },
  yes: {
    borderColor: '#1e1e1e',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
});
export default Announcements;

const AddNew = ({ editFormData, handleClose, setReload, setModalOpen }) => {
  const { vh, setIsLoading, setWalletRefresh } = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    title: editFormData?.title || '',
    message: editFormData?.message || '',
    image: editFormData?.image || '',
    video: editFormData?.video || '',
    popUpID: editFormData?.popUpID || '',
  });

  useEffect(() => {}, []);

  const handleUpload = async () => {
    const { title, message, image, video } = formData;
    setErrorMessage('');
    if (!title) {
      setErrorMessage('No title');
    } else if (!message && !image && !video) {
      setErrorMessage('No content');
    } else if (title.length < 3) {
      setErrorMessage('Please provide a longer title');
    } else if (message && message.length < 24) {
      setErrorMessage('Please provide a longer message content');
    } else {
      try {
        setIsLoading(true);
        const body = formData.popUpID
          ? formData
          : { ...formData, popUpID: randomUUID() };

        const response = editFormData
          ? await putFetchData('admin/popup', body)
          : await postFetchData('admin/popup', body);

        if (response.status === 200) {
          setFormData({
            title: '',
            message: '',
            image: '',
            video: '',
            popUpID: '',
          });
          setReload(prev => !prev);
          setModalOpen(false);
          return editFormData
            ? ToastMessage('Announcement updated successfully')
            : ToastMessage('Announcement posted successfully');
        }
        if (typeof response.data === 'string') {
          throw new Error(response.data);
        } else {
          throw new Error(Object.values(response.data)[0]);
        }
      } catch (error) {
        setErrorMessage(
          error.message
            .replace('popUpID', 'ID')
            .replace('account', 'announcement'),
        );
      } finally {
        setIsLoading(false);
        setWalletRefresh(prev => !prev);
      }
    }
  };

  return (
    <>
      <Back onPress={handleClose} />
      <PageContainer style={styles.container} padding scroll>
        <BoldText style={styles.headerText}>Post an announcement</BoldText>
        <View style={{ ...styles.form, minHeight: vh * 0.6 }}>
          <View>
            <RegularText style={styles.label}>Title</RegularText>
            <TextInput
              style={styles.textInput}
              maxLength={36}
              onChangeText={text => {
                setErrorMessage('');
                setFormData(prev => {
                  return {
                    ...prev,
                    title: text,
                  };
                });
              }}
              value={formData.title}
            />
          </View>
          <View style={styles.message}>
            <RegularText style={styles.label}>Message</RegularText>
            <TextInput
              style={{ ...styles.textInput, ...styles.textInputMessage }}
              maxLength={1000}
              onChangeText={text => {
                setErrorMessage('');
                setFormData(prev => {
                  return {
                    ...prev,
                    message: text,
                  };
                });
              }}
              multiline
              textAlignVertical="top"
              value={formData.message}
            />
          </View>
          <View>
            <RegularText style={styles.label}>Image URL</RegularText>
            <TextInput
              style={styles.textInput}
              onChangeText={text => {
                setErrorMessage('');
                setFormData(prev => {
                  return {
                    ...prev,
                    image: text,
                  };
                });
              }}
              placeholder="(optional)"
              value={formData.image}
            />
          </View>
          <View>
            <RegularText style={styles.label}>Video URL</RegularText>
            <TextInput
              style={styles.textInput}
              onChangeText={text => {
                setErrorMessage('');
                setFormData(prev => {
                  return {
                    ...prev,
                    video: text,
                  };
                });
              }}
              placeholder="(optional)"
              value={formData.video}
            />
          </View>
          <View>
            <RegularText style={styles.label}>Unique ID</RegularText>
            <TextInput
              style={styles.textInput}
              maxLength={36}
              onChangeText={text => {
                setErrorMessage('');
                setFormData(prev => {
                  return {
                    ...prev,
                    popUpID: text,
                  };
                });
              }}
              placeholder="(optional)"
              value={formData.popUpID}
              editable={!editFormData}
            />
          </View>
          <ErrorMessage
            errorMessage={errorMessage}
            style={styles.errorMessage}
          />
        </View>
        <Button
          text={editFormData ? 'Update' : 'Upload'}
          style={styles.button}
          onPress={handleUpload}
        />
      </PageContainer>
    </>
  );
};
