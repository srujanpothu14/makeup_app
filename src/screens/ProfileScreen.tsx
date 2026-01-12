import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Avatar, Divider } from 'react-native-paper';

import { useAuthStore } from '../store/useAuthStore';
import { colors } from '../theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  const initials =
    user?.name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase() ?? 'U';

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.card}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Avatar.Text size={72} label={initials} style={styles.avatar} />

            <View style={styles.headerText}>
              <Text style={styles.name}>{user?.name}</Text>
              <Text style={styles.subText}>{user?.mobile_number}</Text>
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
            <Text style={styles.value}>{user?.mobile_number}</Text>
          </View>

          {/* Future ready */}
          <View style={styles.row}>
            <Text style={styles.label}>Member</Text>
            <Text style={styles.value}>Standard</Text>
          </View>
        </View>
      </Card>

      {/* Sign Out */}
      <Button mode="outlined" onPress={signOut} style={styles.logOut} textColor={colors.primary}>
        <Text>Log Out</Text>
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.primary,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
  },

  container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 16,
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  headerText: {
    flex: 1,
    marginLeft: 16,
  },

  inner: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
  },

  label: {
    color: colors.muted,
  },

  logOut: {
    borderColor: colors.primary,
    borderRadius: 24,
    marginTop: 8,
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },

  subText: {
    color: colors.muted,
    marginTop: 4,
  },

  value: {
    fontWeight: '600',
  },
});
