/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native';

const PageContainer = ({ children, padding, paddingTop, justify }) => {
  return (
    <View
      style={{
        ...styles.container,
        paddingTop: paddingTop !== undefined ? paddingTop : 10,
        paddingHorizontal: padding ? 3 + '%' : undefined,
        justifyContent: justify ? 'space-between' : 'flex-start',
      }}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
export default PageContainer;
