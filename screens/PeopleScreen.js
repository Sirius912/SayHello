import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

const PeopleScreen = ({ navigation }) => {
    const [selectedButton, setSelectedButton] = useState();

    const handlePress = (buttonName) => {
        setSelectedButton(selectedButton === buttonName ? null : buttonName);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}></View>
            <View style={styles.box}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <Text style={styles.title}>People</Text>
                    </View>
                </View>
                <View>
                    <ScrollView style={{ marginVertical: 7 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row' }}>
                            {['Friend', 'Family', 'Company', 'ETC'].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.option,
                                        selectedButton === item && styles.selectedButton
                                    ]}
                                    onPress={() => handlePress(item)}
                                >
                                    <Text style={[styles.buttonText, selectedButton === item && styles.selectedText]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <ScrollView showsHorizontalScrollIndicator={false}>
                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Image source={require('../assets/mom.png')} style={styles.photo}></Image>
                        <View style={{ flex: 1, marginLeft: 10, flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Mom</Text>
                                <Text style={{ fontSize: 16 }}>010-xxxx-xxxx</Text>
                            </View>
                            <View style={styles.edit_button_view}>
                                <TouchableOpacity style={styles.edit_button} onPress={() => { navigation.navigate('EditPersonScreen') }}>
                                    <Text style={{ color: '#ffffff', fontSize: 18 }}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Image source={require('../assets/dad.png')} style={styles.photo}></Image>
                        <View style={{ flex: 1, marginLeft: 10, flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Dad</Text>
                                <Text style={{ fontSize: 16 }}>010-xxxx-xxxx</Text>
                            </View>
                            <View style={styles.edit_button_view}>
                                <TouchableOpacity style={styles.edit_button} onPress={() => { navigation.navigate('EditPersonScreen') }}>
                                    <Text style={{ color: '#ffffff', fontSize: 18 }}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Image source={require('../assets/jane.png')} style={styles.photo}></Image>
                        <View style={{ flex: 1, marginLeft: 10, flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Jane</Text>
                                    <Text>1d</Text>
                                </View>
                                <Text style={{ fontSize: 16 }}>010-xxxx-xxxx</Text>
                            </View>
                            <View style={styles.edit_button_view}>
                                <TouchableOpacity style={styles.edit_button} onPress={() => { navigation.navigate('EditPersonScreen') }}>
                                    <Text style={{ color: '#ffffff', fontSize: 18 }}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Image source={require('../assets/brother1.png')} style={styles.photo}></Image>
                        <View style={{ flex: 1, marginLeft: 10, flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Brother</Text>
                                <Text style={{ fontSize: 16 }}>010-xxxx-xxxx</Text>
                            </View>
                            <View style={styles.edit_button_view}>
                                <TouchableOpacity style={styles.edit_button} onPress={() => { navigation.navigate('EditPersonScreen') }}>
                                    <Text style={{ color: '#ffffff', fontSize: 18 }}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View>

                </View>
            </View>
            <View style={styles.add_person_view}>
                <TouchableOpacity
                    onPress={() => { navigation.navigate('AddPersonScreen') }}
                    style={styles.add_person_button}>
                    <Text style={{ color: '#ffffff', fontSize: 16 }}>Add new person</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
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
    header: {
        height: 30,
        backgroundColor: '#ffffff',
    },
    box: {
        flex: 11,
        backgroundColor: '#ffffff',
        padding: 20,
        paddingBottom: -20
    },
    buttonText1: {
        color: 'black',
        fontSize: 15,
    },
    edit_button: {
        backgroundColor: '#000000',
        padding: 4,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    edit_button_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 10
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        alignItems: 'center',
        marginBottom: 10
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
    photo: {
        width: 60,
        height: 60,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: '#000000',
    },
    selectedButton: {
        backgroundColor: 'black',
    },
    selectedText: {
        color: 'white',
    },
});

export default PeopleScreen;
