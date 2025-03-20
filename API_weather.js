import fetch from 'node-fetch';
import xml2js from 'xml2js';
import fs from 'fs';

const url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';
const queryParams = new URLSearchParams({
    serviceKey: '',
    pageNo: '1',
    numOfRows: '1000',
    dataType: 'XML',
    base_date: '20250320',
    base_time: '1200',
    nx: '55',
    ny: '127'
});

fetch(`${url}?${queryParams}`)
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
    })
    .then(xmlText => {
        xml2js.parseString(xmlText, (err, result) => {
            if (err) {
                console.error('XML parsing error:', err);
                return;
            }

            const items = result?.response?.body?.[0]?.items?.[0]?.item || [];

            const weather = {};
            items.forEach(item => {
                const time = item.fcstTime?.[0];
                const value = item.fcstValue?.[0];
                if (time && value) {
                    weather[time] = value;
                }
            });
            console.log('weather:', weather);

            fs.writeFileSync('API_weather_result.json', JSON.stringify(weather, null, 2), 'utf8');
            console.log('Saved as API_weather_result.json');
        });
    })
    .catch(error => {
        console.error('Fetch Error:', error);
    });

