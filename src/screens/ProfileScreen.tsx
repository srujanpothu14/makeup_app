import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Text, Button, Avatar, Divider, Chip } from "react-native-paper";

import InfoRow from "../components/InfoRow";
import { useAuthStore } from "../store/useAuthStore";
import { useBookingStore } from "../store/useBookingStore";
import { colors, radii, shadows, spacing } from "../theme";

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const selectedServices = useBookingStore((s) => s.selectedServices);

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  const userId = user?.id ?? "—";
  const name = user?.name ?? "Guest";
  const mobile = user?.mobile_number ?? "—";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Card style={[styles.card, styles.headerCard]}>
        <View style={styles.header}>
          <Avatar.Text size={76} label={initials} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.subText}>{mobile}</Text>
            <View style={styles.chipsRow}>
              <Chip compact style={styles.chip} textStyle={styles.chipText}>
                Customer
              </Chip>
              <Chip
                compact
                style={styles.chipSoft}
                textStyle={styles.chipTextSoft}
              >
                Standard
              </Chip>
            </View>
          </View>
        </View>
      </Card>

      {/* Customer Details */}
      <Card style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <Divider />

          <View style={styles.rowsWrap}>
            <InfoRow icon="person-outline" text={`Name: ${name}`} />
            <InfoRow icon="call-outline" text={`Mobile: ${mobile}`} />
            <InfoRow icon="card-outline" text={`Customer ID: ${userId}`} />
            <InfoRow icon="keypad-outline" text="Login: 4-digit PIN enabled" />
          </View>
        </View>
      </Card>

      {/* Current Selection */}
      <Card style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Selection</Text>
          <Divider />

          <View style={styles.rowsWrap}>
            <InfoRow
              icon="sparkles-outline"
              text={`Selected services: ${selectedServices.length}`}
            />
            {selectedServices.slice(0, 4).map((s) => (
              <InfoRow
                key={s.id}
                icon="checkmark-circle-outline"
                text={s.title}
              />
            ))}
            {selectedServices.length > 4 ? (
              <Text style={styles.moreText}>
                +{selectedServices.length - 4} more
              </Text>
            ) : null}
          </View>
        </View>
      </Card>

      {/* Actions */}
      <Button
        mode="contained"
        onPress={signOut}
        style={styles.logOut}
        buttonColor={colors.primary}
        textColor={colors.white}
      >
        Log Out
      </Button>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.large,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  headerCard: {
    backgroundColor: colors.backgroundSoft,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    padding: spacing.md,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  headerText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  subText: {
    color: colors.subdued,
    marginTop: spacing.xs,
  },
  chipsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.white,
  },
  chipSoft: {
    backgroundColor: colors.primaryLight,
  },
  chipTextSoft: {
    color: colors.primary,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  rowsWrap: {
    marginTop: spacing.md,
  },
  moreText: {
    color: colors.muted,
    marginTop: spacing.xs,
    marginLeft: 30,
  },
  logOut: {
    borderRadius: radii.large,
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
  },
});
