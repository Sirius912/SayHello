import * as Font from 'expo-font';

export async function loadFonts() {
  await Font.loadAsync({
    NanumSquareRoundEB: require('../../assets/fonts/NanumSquareRoundOTFEB.otf'),
    NanumSquareRoundB: require('../../assets/fonts/NanumSquareRoundOTFB.otf'),
    NanumSquareRoundR: require('../../assets/fonts/NanumSquareRoundOTFR.otf'),
    NanumSquareRoundL: require('../../assets/fonts/NanumSquareRoundOTFL.otf'),
    GeumUnBohwa: require('../../assets/fonts/GeumUnBohwa.ttf'),
    Mugunghwa: require('../../assets/fonts/radioFont.ttf'),
  });
}
