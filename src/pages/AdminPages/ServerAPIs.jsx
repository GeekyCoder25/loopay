/* eslint-disable react-native/no-inline-styles */
import { Pressable, StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import BoldText from '../../components/fonts/BoldText';
import IonIcon from '@expo/vector-icons/Ionicons';
import ToastMessage from '../../components/ToastMessage';
import Button from '../../components/Button';
import { AppContext } from '../../components/AppContext';
import useFetchData from '../../../utils/fetchAPI';

const ServerAPIs = () => {
  const { getFetchData, putFetchData } = useFetchData();
  const { setIsLoading } = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState('airtime');
  const [apiSelected, setApiSelected] = useState({});
  const [hasChange, setHasChange] = useState(false);

  useEffect(() => {
    getFetchData('admin/apis')
      .then(response => {
        if (response.status === 200) {
          setApiSelected(response.data);
        }
      })
      .catch(err => ToastMessage(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = () => {
    setIsLoading(true);
    putFetchData('admin/apis', apiSelected)
      .then(response => {
        if (response.status === 200) {
          ToastMessage('API updated successfully');
          setHasChange(false);
        }
      })
      .catch(err => ToastMessage(err.message))
      .finally(() => setIsLoading(false));
  };
  const tabs = [
    {
      id: 'airtime',
      label: 'Airtime',
      apis: [
        {
          name: 'Reloadly',
          id: 'reloadly',
        },
        {
          name: 'Paga',
          id: 'paga',
        },
      ],
    },
    {
      id: 'data',
      label: 'Data',
      apis: [
        {
          name: 'Reloadly',
          id: 'reloadly',
        },
        {
          name: 'Paga',
          id: 'paga',
        },
      ],
    },
    {
      id: 'bill',
      label: 'Bill',
      apis: [
        {
          name: 'Reloadly',
          id: 'reloadly',
        },
        {
          name: 'Paga',
          id: 'paga',
        },
        {
          name: 'Buy Power',
          id: 'buyPower',
        },
      ],
    },
  ];
  return (
    <View>
      <View style={styles.bodySelectors}>
        {tabs.map(tab => (
          <Pressable
            key={tab.id}
            style={{
              ...styles.bodySelector,
              backgroundColor: selectedTab === tab.id ? '#525252' : '#d0d1d2',
            }}
            onPress={() => setSelectedTab(tab.id)}>
            <BoldText
              style={{
                color: selectedTab === tab.id ? '#fff' : '#1E1E1E',
              }}>
              {tab.label}
            </BoldText>
          </Pressable>
        ))}
      </View>
      <View>
        {tabs
          .find(tab => tab.id === selectedTab)
          .apis.map(api => (
            <SelectAPI
              key={api.id}
              api={api}
              apiSelected={apiSelected}
              setApiSelected={setApiSelected}
              selectedTab={selectedTab}
              setHasChange={setHasChange}
            />
          ))}
      </View>

      <Button
        text={'Update API'}
        disabled={!hasChange}
        style={!hasChange ? styles.disabledButton : undefined}
        onPress={handleUpdate}
      />
    </View>
  );
};

export default ServerAPIs;

const SelectAPI = ({
  api,
  apiSelected,
  setApiSelected,
  selectedTab,
  setHasChange,
}) => {
  return (
    <View style={styles.api}>
      <BoldText>{api.name}</BoldText>
      <Pressable
        style={styles.selected}
        onPress={() =>
          setApiSelected(prev => {
            setHasChange(true);
            return { ...prev, [selectedTab]: api.id };
          })
        }>
        {apiSelected[selectedTab] === api.id ? (
          <IonIcon name="radio-button-on-outline" size={24} />
        ) : (
          <IonIcon name="radio-button-off-outline" size={24} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  bodySelectors: {
    flexDirection: 'row',
    alignItems: 'space-between',
    marginBottom: 20,
  },
  bodySelector: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  selectedTab: {
    backgroundColor: 'red',
  },
  api: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingVertical: 20,
    backgroundColor: '#eee',
    marginHorizontal: '3%',
    marginVertical: 20,
    borderRadius: 15,
    elevation: 5,
  },
  disabledButton: { backgroundColor: 'rgba(28, 28, 28, 0.5)' },
});
