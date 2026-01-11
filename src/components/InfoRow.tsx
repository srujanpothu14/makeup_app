import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default React.memo(function InfoRow({ icon, text }: any) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color="#E91E63" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  text: { fontSize: 14, color: "#333" },
});