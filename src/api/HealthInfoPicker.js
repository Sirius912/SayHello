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
<View style={{ zIndex: 1000 }}>
  <DropDownPicker
    open={open}
    value={value}
    items={items}
    setOpen={setOpen}
    setValue={(val) => {
      setValue(val);
      onSelect(val);
    }}
    setItems={setItems}
    placeholder="건강 정보 선택"
    style={{
      height: 40,
      borderColor: "#ccc",
      borderRadius: 10,
    }}
    containerStyle={{
      marginBottom: 10,
    }}
    nestedScrollEnabled={true}  // 핵심!
  />
</View>

  );
};

export default HealthInfoPicker;