import React from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Card, Text, Button, Avatar, Divider, Chip } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import InfoRow from "../components/InfoRow";
import { useAuthStore } from "../store/useAuthStore";
import { listBookings } from "../mock/api";
import { colors, radii, shadows, spacing } from "../theme";

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  const {
    data: bookings = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: () => listBookings(user!.id),
    enabled: !!user?.id,
  });

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  const userId = user?.id ?? "—";
  const name = user?.name ?? "Guest";
  const mobile = user?.mobile_number ?? "—";

  const sortedBookings = Array.isArray(bookings)
    ? [...bookings].sort((a, b) => {
        const bt = dayjs((b as any)?.startTime ?? 0).valueOf();
        const at = dayjs((a as any)?.startTime ?? 0).valueOf();
        return bt - at;
      })
    : [];

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

      {/* Booking History */}
      <Card style={styles.card}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Booking History</Text>
            <Button
              mode="text"
              compact
              onPress={() => refetch()}
              loading={isFetching}
              textColor={colors.primary}
            >
              Refresh
            </Button>
          </View>
          <Divider />

          <View style={styles.rowsWrap}>
            {!user?.id ? (
              <Text style={styles.emptyText}>Sign in to see bookings.</Text>
            ) : isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
                <Text style={styles.loadingText}>Loading bookings…</Text>
              </View>
            ) : error ? (
              <Text style={styles.errorText}>
                {error instanceof Error ? error.message : "Failed to load"}
              </Text>
            ) : sortedBookings.length === 0 ? (
              <Text style={styles.emptyText}>No bookings yet.</Text>
            ) : (
              sortedBookings.map((b, index) => {
                const status = (b.status || "pending").toLowerCase();
                const serviceIds = Array.isArray((b as any)?.serviceIds)
                  ? (b as any).serviceIds
                  : [];
                const serviceCount = serviceIds.length;
                const bookingTime = (b as any)?.startTime
                  ? dayjs((b as any).startTime).format("DD MMM YYYY, h:mm A")
                  : "—";
                const statusChipStyle =
                  status === "confirmed"
                    ? styles.statusChipConfirmed
                    : status === "cancelled"
                      ? styles.statusChipCancelled
                      : styles.statusChipPending;
                const statusTextStyle =
                  status === "confirmed"
                    ? styles.statusTextConfirmed
                    : status === "cancelled"
                      ? styles.statusTextCancelled
                      : styles.statusTextPending;

                return (
                  <View
                    key={(b as any)?.id ?? `booking-${index}`}
                    style={styles.bookingRow}
                  >
                    <View style={styles.bookingLeft}>
                      <Text style={styles.bookingTitle}>{bookingTime}</Text>
                      <Text style={styles.bookingSub}>
                        {serviceCount} service{serviceCount === 1 ? "" : "s"} •
                        ID: {(b as any)?.id ?? "—"}
                      </Text>
                    </View>
                    <Chip
                      compact
                      style={statusChipStyle}
                      textStyle={statusTextStyle}
                    >
                      {status}
                    </Chip>
                  </View>
                );
              })
            )}
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
  sectionHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowsWrap: {
    marginTop: spacing.md,
  },
  loadingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  loadingText: {
    color: colors.muted,
  },
  emptyText: {
    color: colors.muted,
    paddingVertical: spacing.sm,
  },
  errorText: {
    color: colors.primary,
    paddingVertical: spacing.sm,
  },
  bookingRow: {
    alignItems: "center",
    backgroundColor: colors.backgroundSoft,
    borderRadius: radii.medium,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  bookingLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  bookingTitle: {
    color: colors.text,
    fontWeight: "800",
  },
  bookingSub: {
    color: colors.subdued,
    marginTop: spacing.xs,
  },
  statusChipPending: {
    backgroundColor: colors.primaryLight,
  },
  statusTextPending: {
    color: colors.primary,
  },
  statusChipConfirmed: {
    backgroundColor: colors.primary,
  },
  statusTextConfirmed: {
    color: colors.white,
  },
  statusChipCancelled: {
    backgroundColor: colors.mutedLight,
  },
  statusTextCancelled: {
    color: colors.subdued,
  },
  logOut: {
    borderRadius: radii.large,
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
  },
});
