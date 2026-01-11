import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default React.memo(function ActionButton({ icon, text, onPress }: any) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Ionicons name={icon} size={18} color="#fff" />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E91E63",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  text: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
