module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env', // .env 파일을 @env로 import 가능하도록 설정
          path: '.env', // .env 파일 경로
          safe: false, // true로 설정하면 .env.example 파일과 비교하여 누락된 변수를 경고
          allowUndefined: true, // true로 설정하면 정의되지 않은 변수를 허용
        },
      ],
    ],
  };
};
