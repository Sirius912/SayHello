// LocationPicker.js
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { View } from "react-native";

const LocationPicker = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Busan", value: "Busan" },
    { label: "Chungbuk", value: "Chungbuk" },
    { label: "Chungnam", value: "Chungnam" },
    { label: "Daegu", value: "Daegu" },
    { label: "Daejeon", value: "Daejeon" },
    { label: "Gangwon", value: "Gangwon" },
    { label: "Gwangju", value: "Gwangju" },
    { label: "Gyeongbuk", value: "Gyeongbuk" },
    { label: "Gyeonggi", value: "Gyeonggi" },
    { label: "Gyeongnam", value: "Gyeongnam" },
    { label: "Incheon", value: "Incheon" },
    { label: "Jeju", value: "Jeju" },
    { label: "Jeonbuk", value: "Jeonbuk" },
    { label: "Jeonnam", value: "Jeonnam" },
    { label: "Sejong", value: "Sejong" },
    { label: "Seoul", value: "Seoul" },
    { label: "Ulsan", value: "Ulsan" },
  ]);

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
        placeholder="Choose location"
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