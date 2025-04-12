import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Image, Text } from 'react-native';
import useFonts from '../hooks/useFonts';

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const fontsLoaded = useFonts();

  if (!fontsLoaded){
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/loading_image.png')} // 이미지 경로 확인
          style={styles.image}
          resizeMode="contain"
        />

        <Text
          style={styles.KoreanFont}
        >
          안부를 전해요,
        </Text>
        <Text
          style={styles.EnglishFont}
        >
          Say Hello
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '25%',
    height: '25%',
  },
  KoreanFont: {
    fontFamily: 'NanumSquareRoundEB',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'gray',
    marginTop: -50,
    marginBottom: 5,
  },
  EnglishFont: { 
    fontFamily: 'NanumSquareRoundEB',
    fontSize: 40,
    fontWeight: 'bold',
  }
});
