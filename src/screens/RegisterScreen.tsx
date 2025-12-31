import React from "react";
import { View, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";

export default function RegisterScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
        Create account
      </Text>
      <TextInput label="Name" mode="outlined" />
      <TextInput
        label="Mobile Number"
        mode="outlined"
        keyboardType="phone-pad"
        style={{ marginTop: 12 }}
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        style={{ marginTop: 12 }}
      />
      <Button mode="contained" style={{ marginTop: 16 }}>
        Register
      </Button>
    </View>
  );
}
