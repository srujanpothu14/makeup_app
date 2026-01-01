import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button, Avatar, Divider } from "react-native-paper";
import { useAuthStore } from "../store/useAuthStore";

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.card}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Avatar.Text
              size={72}
              label={initials}
              style={styles.avatar}
            />

            <View style={styles.headerText}>
              <Text style={styles.name}>{user?.name}</Text>
              <Text style={styles.subText}>
                {user?.mobile_number}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Account Section */}
      <Card style={styles.card}>
        <View style={styles.inner}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Divider />

          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>
              {user?.mobile_number}
            </Text>
          </View>

          {/* Future ready */}
          <View style={styles.row}>
            <Text style={styles.label}>Member</Text>
            <Text style={styles.value}>Standard</Text>
          </View>
        </View>
      </Card>

      {/* Sign Out */}
      <Button
        mode="outlined"
        onPress={signOut}
        style={styles.logOut}
        textColor="#E91E63"
      >
        Log Out
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  card: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    backgroundColor: "#fff",
  },

  inner: {
    borderRadius: 16,
    overflow: "hidden",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    backgroundColor: "#E91E63",
  },

  headerText: {
    marginLeft: 16,
    flex: 1,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
  },

  subText: {
    marginTop: 4,
    color: "#777",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  label: {
    color: "#777",
  },

  value: {
    fontWeight: "600",
  },

  logOut: {
    marginTop: 8,
    borderRadius: 24,
    borderColor: "#E91E63",
  },
});
