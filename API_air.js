import fetch from 'node-fetch';
import xml2js from 'xml2js';
import fs from 'fs';

const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth';
const queryParams = new URLSearchParams({
    serviceKey: '',
    returnType: 'xml',
    // numOfRows: '100',
    // pageNo: '1',
    searchDate: '2025-03-20',
    InformCode: 'PM10'
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
            const regionData = items[0]?.informGrade?.[0] || 'No Data';

            const regionGrade = {};
            regionData.split(',').forEach(entry => {
                const [region, grade] = entry.split(' : ').map(str => str.trim());
                regionGrade[region] = grade;
            });

            fs.writeFileSync('API_air_result.json', JSON.stringify(regionGrade, null, 2), 'utf8');
            console.log('Saved as API_air_result.json');
        });
    })
    .catch(error => {
        console.error('Fetch Error:', error);
    });
