export const otherUsers = [
        {
                id: 1,
                name: "할아버지",
                latitudeOffset: 0.001,
                longitudeOffset: -0.001,
        },
        {
                id: 2,
                name: "부모님",
                latitudeOffset: -0.001,
                longitudeOffset: 0.001,
        },
        {
                id: 3,
                name: "형",
                latitudeOffset: 0.002,
                longitudeOffset: -0.002,
        },
        {
                id: 4,
                name: "제인",
                latitudeOffset: -0.002,
                longitudeOffset: 0.002,
        },
];

export const newsData = [
        {
                id: "1",
                title: "지진 7.1",
                sender: "할아버지",
                image: require("../../assets/earthquake.jpg"),
        },
        {
                id: "2",
                title: "홍수",
                sender: "제인",
                image: require("../../assets/flood.jpg"),
        },
];

export const messages = {
        '재해': `할아버지와 할머니께 😊
지진 이후에 두 분 다 잘 계시죠? 많이 놀라셨을 텐데, 별일 없으셨길 정말 바라요!!
오늘은 날씨가 좀 쌀쌀해요🥶 기온은 4도고, 비 올 확률은 2%밖에 안 되지만 습도가 68%라서 조금 습하게 느껴질 수도 있을 것 같아요.
바람은 시속 2m로 살랑살랑 불고 있어요🍃 두 분 꼭 따뜻하게 입고 건강 잘 챙기세요🧣🧤
항상 많이 사랑하고 곧 소식 들을 수 있으면 좋겠어요!💕
몸 조심하시고 또 연락드릴게요! 😊💌`,

        '날씨 보고': `할머니, 할아버지께 😊
오늘의 날씨를 알려드립니다. 현재 기온은 18°C로 선선하며, 구름이 약간 낀 흐린 날씨입니다.☁
강수 확률은 20%이며 미세먼지 수치는 '보통' 단계입니다. 산책하시기에 좋은 날씨지만, 가벼운 외투를 준비하시면 좋을 것 같습니다. 🥹
항상 건강에 유의하시고, 다음에 뵐 때까지 행복한 일들만 가득하시길 바랍니다. 😊💌`,

        '미세먼지': `사랑하는 할머니와 할아버지! 😊
오늘 미세먼지 수치가 '나쁨' 수준으로 올라갔습니다. 외출 시 마스크를 꼭 착용하시고, 😷
가능한 실내에서 보내시는 것이 좋을 것 같습니다. 공기청정기를 가동해두시고 창문은 닫아두세요. 🪟
건강 관리에 특히 신경 써주시길 부탁드립니다. 항상 건강하세요! 😊💌`,

        '없음': `사랑하는 할아버지, 😊
항상 건강하신지요? 오늘은 특별한 소식 없이 안부를 전하고 싶어 편지를 씁니다. 
요즘 날씨가 추워지고 있으니 감기 조심하시고, 건강 관리에 유의하세요.
곧 찾아뵐 수 있기를 바라며, 그때까지 행복한 일들만 가득하시길 바랍니다.
항상 건강하세요! 😊💌`
};

export const markers = [
        {
                id: "1",
                title: "할아버지",
                date: "2025-03-01",
                description: "지진 7.1",
                latitudeOffset: 0.001,
                longitudeOffset: -0.001,
        },
        {
                id: "2",
                title: "부모님",
                date: "2025-02-20",
                description: "홍수",
                latitudeOffset: -0.001,
                longitudeOffset: 0.001,
        },
        {
                id: "3",
                title: "형",
                date: "2025-01-10",
                description: "천둥",
                latitudeOffset: 0.002,
                longitudeOffset: -0.002,
        },
        {
                id: "4",
                title: "제인",
                date: "2025-01-05",
                description: "폭염",
                latitudeOffset: -0.002,
                longitudeOffset: 0.002,
        },
];

export const info = {
        "재해": [
                {
                        id: 1,
                        image: require("../../assets/earthquake.jpg"),
                        sender: "할아버지",
                        title: "지진 7.1도",
                        date: "2025-03-01",
                        desc: "강한 지진이 감지되었습니다. 즉시 안전한 장소로 대피하시고 뉴스를 확인하세요.",
                },
                {
                        id: 2,
                        image: require("../../assets/flood.jpg"),
                        sender: "제인",
                        title: "홍수",
                        date: "2025-02-28",
                        desc: "폭우로 인해 심각한 홍수가 발생했습니다. 저지대를 피해 높은 지대로 이동하세요.",
                },
        ],
        "날씨": [
                {
                        id: 3,
                        image: require("../../assets/snow.jpg"),
                        sender: "아빠",
                        title: "폭설 경보",
                        date: "2025-03-02",
                        desc: "(100mm 이상의 강수량 예상)",
                },
        ],
        "미세먼지": [
                {
                        id: 4,
                        image: require("../../assets/dust.jpg"),
                        sender: "보건소",
                        title: "미세먼지 경보",
                        date: "2025-03-03",
                        desc: "(야외 활동을 최소화하세요)",
                },
        ],
};

export const icons = {
        "Thunderstorm": "lightning",
        "Drizzle": "rains",
        "Rain": "rain",
        "Snow": "snowflake",
        "Atmosphere": "cloudy-gusts",
        "Clear": "day-sunny",
        "Clouds": "cloudy",
}

export const weatherDescriptions = {
        "clear sky": "맑은 하늘",
        "few clouds": "구름 조금",
        "scattered clouds": "흩어진 구름",
        "broken clouds": "조각 구름",
        "overcast clouds": "흐린 구름",
        "light rain": "약한 비",
        "moderate rain": "보통 비",
        "heavy intensity rain": "강한 비",
        "very heavy rain": "매우 강한 비",
        "extreme rain": "극심한 비",
        "freezing rain": "얼어붙는 비",
        "light intensity shower rain": "약한 소나기성 비",
        "shower rain": "소나기성 비",
        "heavy intensity shower rain": "강한 소나기성 비",
        "ragged shower rain": "불규칙적인 소나기성 비",
        "thunderstorm with light rain": "약한 비를 동반한 뇌우",
        "thunderstorm with rain": "비를 동반한 뇌우",
        "thunderstorm with heavy rain": "강한 비를 동반한 뇌우",
        "light thunderstorm": "약한 뇌우",
        "thunderstorm": "뇌우",
        "heavy thunderstorm": "강한 뇌우",
        "ragged thunderstorm": "불규칙한 뇌우",
        "thunderstorm with light drizzle": "약한 이슬비를 동반한 뇌우",
        "thunderstorm with drizzle": "이슬비를 동반한 뇌우",
        "thunderstorm with heavy drizzle": "강한 이슬비를 동반한 뇌우",
        "light snow": "약한 눈",
        "snow": "눈",
        "heavy snow": "많은 눈",
        "sleet": "진눈깨비",
        "light shower sleet": "약한 소나기성 진눈깨비",
        "shower sleet": "소나기성 진눈깨비",
        "light rain and snow": "약한 비와 눈",
        "rain and snow": "비와 눈",
        "light shower snow": "약한 소나기성 눈",
        "shower snow": "소나기성 눈",
        "heavy shower snow": "많은 소나기성 눈",
}