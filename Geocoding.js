const axios = require('axios');

// 구글 클라우드에서 발급받은 API Key
const apiKey = 'AIzaSyDndSid4QrkaRHynwnxOc8__7YpVtx6Uo4';  // 발급받은 Google API Key 입력

// 검색할 주소 (예: '서울특별시청')
const address = encodeURIComponent('서울특별시청');  // 주소 인코딩


axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`)
  .then(response => {
    // test1 : geocoding 주소 입력시 위도, 경도 출력 
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      console.log(`주소: 서울특별시청`);
      console.log(`위도: ${location.lat}`);
      console.log(`경도: ${location.lng}`);
      
      // test2 : reverse geocoding (얻은 좌표로 주소 검색)
      const latlng = `${location.lat},${location.lng}`;
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          latlng: latlng,
          key: apiKey
        }
      })
      .then(res2 => {
        if (res2.data.status === 'OK' && res2.data.results.length > 0) {
          console.log('Reverse Geocoding 결과:');
          console.log(`주소: ${res2.data.results[0].formatted_address}`);
        } else {
          console.error('Reverse Geocoding 결과가 없습니다. 상태:', res2.data.status);
        }
      })
      .catch(err2 => {
        console.error('Reverse Geocoding API 요청 실패:', err2.message);
      });
      
    } else {
      console.error('Geocoding 결과가 없습니다. 상태:', response.data.status);
    }
  })
  .catch(error => {
    console.error('Geocoding API 요청 실패:', error.message);
  });
