import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import useFetchData from '../../../../utils/fetchAPI';
import BoldText from '../../../components/fonts/BoldText';
import RegularText from '../../../components/fonts/RegularText';

const Reports = ({ navigation }) => {
  const { getFetchData } = useFetchData();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const getAnnouncements = async () => {
      const response = await getFetchData('admin/report');
      if (response.status === 200) {
        setReports(response.data);
      }
    };
    getAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer paddingTop={30} padding>
      <View style={styles.header}>
        <BoldText style={styles.headerText}>Reports and Issues</BoldText>
        <View style={styles.headerCount}>
          <BoldText style={styles.headerCountText}>
            {reports.length || ''}
          </BoldText>
        </View>
      </View>

      {reports.length ? (
        <View>
          {reports.map(report => (
            <Pressable
              key={report._id}
              style={styles.report}
              onPress={() =>
                navigation.navigate('ReportIndex', report.metadata)
              }>
              <View style={styles.row}>
                <BoldText>Title: </BoldText>
                <BoldText>{report.title}</BoldText>
              </View>
              <View style={styles.row}>
                <BoldText>Message: </BoldText>
                <BoldText>{report.message}</BoldText>
              </View>
              <View style={styles.row}>
                <BoldText>Transaction ID: </BoldText>
                <BoldText>{report.id}</BoldText>
              </View>
              <View style={styles.row}>
                <BoldText>Date: </BoldText>
                <BoldText>
                  {new Date(report.createdAt).toLocaleDateString() + ' '}
                  {new Date(report.createdAt).toLocaleTimeString()}
                </BoldText>
              </View>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.empty}>
          <RegularText>No new reports at the moment</RegularText>
        </View>
      )}
    </PageContainer>
  );
};

export default Reports;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 20,
  },
  headerCount: {
    backgroundColor: '#1e1e1e',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCountText: {
    fontSize: 18,
    color: '#fff',
  },
  report: {
    gap: 10,
    marginBottom: 30,
    elevation: 5,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    paddingRight: 50,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    width: 100 + '%',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Dimensions.get('screen').width,
  },
});
