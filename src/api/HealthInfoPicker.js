import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { View } from "react-native";

const HealthInfoPicker = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "혈압", value: "blood_pressure" },
    { label: "체온", value: "body_temperature" },
    { label: "체중", value: "body_weight" },
    { label: "심박수", value: "heart_rate" },
    { label: "콜레스테롤", value: "cholesterol" },
    { label: "혈당", value: "blood_sugar" },
    { label: "BMI (체질량지수)", value: "bmi" },
    { label: "없음", value: "none" },
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
          onSelect(val); // 선택한 건강 정보를 상위 컴포넌트에 전달
        }}
        setItems={setItems}
        placeholder="건강 정보 선택"
        style={{
            height: 40,         // 드롭다운의 높이 설정
            width: "100%",       // 드롭다운의 너비 설정
            borderColor: "#ccc", // 테두리 색상
            borderRadius: 10,    // 테두리 라운드 처리
          }}
          containerStyle={{
            marginBottom: 10,    // 아래쪽 여백 설정
            borderColor: "#000", // 테두리 색상
          }}
        zIndex={2000} // 낮은 값 설정 (첫 번째보다 아래)
        elevation={2} // Android용

      />
    </View>
  );
};

export default HealthInfoPicker;