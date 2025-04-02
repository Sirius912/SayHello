import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import LocationPicker from "../api/LocationPicker";
import HealthInfoPicker from "../api/HealthInfoPicker";

export default function AddPersonScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedButton, setSelectedButton] = useState();
  const [selectedHealthInfo, setSelectedHealthInfo] = useState(null);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [selectedContactTerm, setSelectedContactTerm] = useState([]);

  const toggleContactTerm = (item) => {
    setSelectedContactTerm((prev) =>
      prev.includes(item) ? prev.filter(term => term !== item) : [...prev, item]
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.profile_image}>
      </View>
      <View style={styles.divider}></View>
      <View>
        <View style={styles.type_view}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.text1}>Name</Text>
          </View>
          <View style={{ flex: 2, justifyContent: 'center' }}>
            <TextInput style={styles.type_input} placeholder='Type Name' />
          </View>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.type_view}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.text1}>Phone Number</Text>
          </View>
          <View style={{ flex: 2, justifyContent: 'center' }}>
            <TextInput style={styles.type_input} placeholder='Type phone number' />
          </View>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.type_view}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.text1}>Location</Text>
          </View>
          <View style={{ flex: 2, justifyContent: 'center' }}>
            <LocationPicker onSelect={setSelectedLocation} />
          </View>
        </View>
      </View>
      <View style={styles.divider}></View>
      <View>
        <Text style={{ fontSize: 17, fontWeight: 'bold', marginVertical: 9 }}>Relationship</Text>
        <ScrollView style={{ marginVertical: 7 }} horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row' }}>
            {['Friend', 'Family', 'Company', 'ETC'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.option,
                  selectedRelationship === item && styles.selectedButton
                ]}
                onPress={() => setSelectedRelationship(selectedRelationship === item ? null : item)}
              >
                <Text style={[styles.buttonText, selectedRelationship === item && styles.selectedText]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.divider}></View>
      <View style={styles.type_view}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.text1}>Health Information</Text>
        </View>
        <View style={{ flex: 2, justifyContent: 'center' }}>
          <HealthInfoPicker onSelect={setSelectedHealthInfo} />
        </View>
      </View>
      <View style={styles.divider}></View>
      <View>
        <Text style={{ fontSize: 17, fontWeight: 'bold', marginVertical: 9 }}>Contact Term</Text>
        <ScrollView style={{ marginVertical: 7 }} horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row' }}>
            {['1 Day', '3 Day', '1 Week', '1 Month', '3 Month'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.option,
                  selectedContactTerm.includes(item) && styles.selectedButton
                ]}
                onPress={() => toggleContactTerm(item)}
              >
                <Text style={[
                  styles.buttonText,
                  selectedContactTerm.includes(item) && styles.selectedText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={styles.add_person_view}>
          <TouchableOpacity
            style={styles.add_person_button}>
            <Text style={{ color: '#ffffff', fontSize: 16 }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  add_person_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#ffffff'
  },
  add_person_button: {
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: 8,
    paddingHorizontal: 18,
    justifyContent: 'center'
  },
  buttonText: {
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 7,
  },
  option: {
    padding: 5,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginHorizontal: 4,        // space between butons
    paddingHorizontal: 12       // space between text and border
  },

  profile_image: {
    height: 100,
    backgroundColor: '#ccc'
  },
  selectedButton: {
    backgroundColor: 'black',
  },
  selectedText: {
    color: 'white',
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  text1: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 17,
    marginVertical: 7,
    color: '#777'
  },
  type_input: {
    marginVertical: 7,
    fontSize: 16
  },
  type_view: {
    flexDirection: 'row',
  },
});