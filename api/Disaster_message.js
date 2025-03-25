import fetch from 'node-fetch';
import fs from 'fs';

const serviceKey = encodeURIComponent('0O5MOTN9I911DTS5');  // api 신청해서 ip 입력 후 키 발급 받아야함!ㄴㄴ
const baseDate = '20250320';

const url = `https://apis.data.go.kr/1741000/DisasterMsg3/getDisasterMsg1List?serviceKey=${serviceKey}&pageNo=1&numOfRows=10&returnType=json&crtDt=${baseDate}`;

fetch(url)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(json => {
    const body = json.body;
    if (!Array.isArray(body)) {
      console.error('body가 배열이 아닙니다:', body);
      return;
    }

    const extracted = body.map(item => ({
      생성일시: item.CRT_DT,
      수신지역명: item.RCPTN_RGN_NM,
      긴급단계: item.EMRG_STEP_NM,
      재해유형: item.DST_SE_NM,
      메시지: item.MSG_CN,
      수정일자: item.MDFCN_YMD
    }));

    console.log('재난 문자 데이터:', extracted);
    fs.writeFileSync('disaster_message.json', JSON.stringify(extracted, null, 2), 'utf8');
    console.log('저장 완료: disaster_message.json');
  })
  .catch(err => {
    console.error('API 호출 실패:', err);
  });