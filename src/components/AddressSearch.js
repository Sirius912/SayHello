import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Postcode from '@actbase/react-daum-postcode';

const AddressSearch = ({ onSelectAddress }) => {
  const handleAddressSelect = (data) => {
    const fullAddress = data.address;
    onSelectAddress({ address: fullAddress });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>주소 검색</Text>
      </View>
      <Postcode
        style={styles.postcode}
        jsOptions={{ animation: true }}
        onSelected={handleAddressSelect}
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => onSelectAddress(null)}
      >
        <Text style={styles.closeButtonText}>닫기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddressSearch;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  postcode: {
    flex: 1,
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#000',
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
