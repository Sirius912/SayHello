import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Clipboard } from 'react-native';

export default function MessageScreen() {
    const [selectedButtons, setSelectedButtons] = useState([]);

    const handlePress = (buttonName) => {
        if (selectedButtons.includes(buttonName)) {
            setSelectedButtons(selectedButtons.filter((item) => item !== buttonName));
        } else {
            setSelectedButtons([...selectedButtons, buttonName]);
        }
    };

    const message = `Dear Grandpa and Grandma,
I hope you are both doing well after the recent earthquake. I know it must have been a
tough time, and I hope you're safe and sound.
Today, the weather is a bit chilly with a temperature of 4°C. There's only a slight
chance of rain (2%), but the humidity is at 68%, and the wind is gentle at 2 m/s. Please
take care and stay warm.
Sending you lots of love and hoping to hear from you soon!
Take care`

    const copyToClipboard = () => {
        Clipboard.setString(message);
        Alert.alert('Copy Successful!', 'The text has been copied to the clipboard.');
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}></View>
            <View style={styles.box}>
                <Text style={styles.title}>Message</Text>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.text1}>Name</Text>
                            <Text style={styles.text1}>Last Contact</Text>
                            <Text style={styles.text1}>Term</Text>
                        </View>
                        <View style={{ flex: 2, marginLeft: 10 }}>
                            <Text style={styles.text2}>Kate</Text>
                            <Text style={styles.text2}>2025-02-10</Text>
                            <Text style={styles.text2}>1 month</Text>
                        </View>
                    </View>
                    <View style={styles.divider}></View>
                    <Text style={styles.text1}>Information</Text>
                    <View style={{ marginVertical: 7 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Image source={require('../assets/earthquake.jpg')} style={styles.photo}></Image>
                            </View>
                            <View style={{ flex: 2, marginLeft: 10 }}>
                                <Text style={{ color: '#777', fontSize: 17, marginVertical: 3 }}>Disaster</Text>
                                <Text style={styles.text3}>2025-03-01</Text>
                                <Text style={styles.text3}>Earthquake 7.1</Text>
                            </View>

                        </View>
                    </View>
                    <View style={styles.divider}></View>
                    <Text style={styles.text1}>Recommend Message</Text>
                    <Text style={styles.text1}>Select options:</Text>
                    <ScrollView style={{ marginVertical: 7 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row' }}>
                            {['Disaster', 'Weather Report', 'Fine Dust', 'None'].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.option,
                                        selectedButtons.includes(item) && styles.selectedButton,
                                    ]}
                                    onPress={() => handlePress(item)}
                                >
                                    <Text style={[styles.buttonText, selectedButtons.includes(item) && styles.selectedText]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    <View style={styles.divider}></View>
                    <Text style={styles.text1}>Output</Text>
                    <View style={styles.messageBox}>
                        <Text style={styles.messageText}>
                            Dear Grandpa and Grandma,{'\n'}
                            I hope you are both doing well after the recent earthquake. I know it must have been a
                            tough time, and I hope you're safe and sound.{'\n'}
                            Today, the weather is a bit chilly with a temperature of 4°C. There's only a slight
                            chance of rain (2%), but the humidity is at 68%, and the wind is gentle at 2 m/s. Please
                            take care and stay warm.{'\n'}
                            Sending you lots of love and hoping to hear from you soon!{'\n'}
                            Take care
                        </Text>
                    </View>
                    <View style={styles.copy_view}>
                        <TouchableOpacity
                            style={styles.copy_button} onPress={copyToClipboard}>
                            <Text style={{ color: '#ffffff', fontSize: 19 }}>Copy</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>


            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
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
    buttonText: {
        fontWeight: '600',
    },
    option: {
        padding: 5,
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        marginHorizontal: 4,
        paddingHorizontal: 12
    },
    copy_button: {
        backgroundColor: '#000000',
        padding: 8,
        borderRadius: 8,
        paddingHorizontal: 18,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 7,
    },
    selectedButton: {
        backgroundColor: 'black',
    },
    selectedText: {
        color: 'white',
    },
    messageBox: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        minHeight: 120,
        marginBottom: 16,
    },
    messageText: {
        fontSize: 13,
        lineHeight: 20,
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    text1: {
        fontSize: 17,
        marginVertical: 7,
        fontWeight: 'bold'
    },
    text2: {
        fontSize: 17,
        marginVertical: 7,
        color: '#777'
    },
    text3: {
        marginVertical: 3,
        fontSize: 17
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        alignItems: 'center',
        marginBottom: 10
    },

});