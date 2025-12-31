import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useAuthStore } from "../store/useAuthStore";

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Profile</Text>
      <Text style={{ marginTop: 8 }}>{user?.name}</Text>
      <Text style={{ marginTop: 4, color: "#555" }}>{user?.mobile_number}</Text>
      <Button mode="outlined" style={{ marginTop: 16 }} onPress={signOut}>
        Sign out
      </Button>
    </View>
  );
}
