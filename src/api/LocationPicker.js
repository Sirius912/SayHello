// LocationPicker.js
import React, { useState, useEffect  } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { View } from "react-native";

const LocationPicker = ({ onSelect, initialValue }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue || null);
  const [items, setItems] = useState([
    { label: "서울특별시", value: "Seoul" },
    { label: "경기도", value: "Gyeonggi" },
    { label: "인천광역시", value: "Incheon" },
    { label: "부산광역시", value: "Busan" },
    { label: "강원도", value: "Gangwon" },
    { label: "충청북도", value: "Chungbuk" },
    { label: "충청남도", value: "Chungnam" },
    { label: "대전광역시", value: "Daejeon" },
    { label: "세종특별자치시시", value: "Sejong" },
    { label: "대구광역시", value: "Daegu" },
    { label: "광주광역시", value: "Gwangju" },
    { label: "전라북도", value: "Jeonbuk" },
    { label: "전라남도", value: "Jeonnam" },
    { label: "경상북도", value: "Gyeongbuk" },
    { label: "경상남도", value: "Gyeongnam" },
    { label: "울산광역시", value: "Ulsan" },
    { label: "제주도", value: "Jeju" },
  ]);

  useEffect(() => {
    if (initialValue) setValue(initialValue);
  }, [initialValue]);

  return (
    <View>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(val) => {
          setValue(val);
          onSelect(val); // 선택한 값 전달
        }}
        setItems={setItems}
        placeholder="지역 선택"
        style={{
            height: 40,         // 드롭다운의 높이 설정
            width: "100%",       // 드롭다운의 너비 설정
            borderColor: "#ccc", // 테두리 색상
            borderRadius: 10,    // 테두리 라운드 처리
          }}
          containerStyle={{
            width: "70%",        // 컨테이너 크기 설정
            marginBottom: 10,    // 아래쪽 여백 설정
            borderColor: "#ccc", // 테두리 색상
          }}
        zIndex={3000} // 낮은 값 설정 (첫 번째보다 아래)
        elevation={3} // Android용


      />
    </View>
  );
};

export default LocationPicker;