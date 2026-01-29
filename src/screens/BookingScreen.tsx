import React, { useMemo, useCallback, useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { Button, Card, Modal, Portal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";

import { createBooking } from "../mock/api";
import { colors, shadows } from "../theme";
import { useAuthStore } from "../store/useAuthStore";
import { useBookingStore } from "../store/useBookingStore";
import type { Service } from "../types";

export default function BookingScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const selectedServices = useBookingStore((state) => state.selectedServices);
  const removeService = useBookingStore((state) => state.removeService);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const total = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.price, 0),
    [selectedServices],
  );

  const slots = useMemo(
    () =>
      selectedDate
        ? Array.from({ length: 6 }, (_, i) =>
            dayjs(selectedDate)
              .hour(11 + i)
              .minute(0)
              .second(0)
              .toISOString(),
          )
        : [],
    [selectedDate],
  );

  const confirm = useCallback(async () => {
    if (!user || !selectedSlot) return;

    await createBooking({
      serviceIds: selectedServices.map((s: any) => s.id),
      userId: user.id,
      startTime: selectedSlot,
    });

    Alert.alert("Success", "Booking confirmed!");
  }, [selectedServices, selectedSlot, user]);

  const handleAddMore = useCallback(
    () => navigation.navigate("Services"),
    [navigation],
  );

  const handleRemove = useCallback(
    (id: string) => removeService(id),
    [removeService],
  );

  if (!selectedServices.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Select services first</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Services")}
        >
          Go to Services
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Selected Services</Text>
            <Button
              mode="contained"
              icon="plus"
              style={styles.addMore}
              contentStyle={styles.addMoreContent}
              labelStyle={styles.addMoreLabel}
              buttonColor={colors.primaryLight}
              textColor={colors.primary}
              onPress={handleAddMore}
            >
              Add more
            </Button>
          </View>

          {selectedServices.map((s: Service) => (
            <View key={s.id} style={styles.serviceRowCard}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{s.title}</Text>
                <Text style={styles.serviceMeta}>₹{s.price}</Text>
              </View>
              <Button
                mode="outlined"
                compact
                onPress={() => handleRemove(s.id)}
                style={styles.removeBtn}
                contentStyle={styles.removeBtnContent}
                textColor={colors.primary}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={colors.primary}
                />
              </Button>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>

          <Button
            mode="outlined"
            style={styles.customDateBtn}
            icon="calendar"
            onPress={() => setShowDatePicker(true)}
          >
            {selectedDate
              ? dayjs(selectedDate).format("DD MMM, YYYY")
              : "Select date"}
          </Button>
        </View>

        <Portal>
          <Modal
            visible={showDatePicker}
            onDismiss={() => setShowDatePicker(false)}
            contentContainerStyle={styles.calendarModal}
          >
            <Text style={styles.calendarTitle}>Pick a date</Text>
            <Calendar
              minDate={dayjs().format("YYYY-MM-DD")}
              onDayPress={(day) => {
                const picked = new Date(day.timestamp);
                setSelectedDate(picked);
                setSelectedSlot(null);
              }}
              markedDates={
                selectedDate
                  ? {
                      [dayjs(selectedDate).format("YYYY-MM-DD")]: {
                        selected: true,
                        selectedColor: colors.primary,
                      },
                    }
                  : {}
              }
              theme={{
                backgroundColor: colors.white,
                calendarBackground: colors.white,
                textSectionTitleColor: colors.subdued,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.white,
                todayTextColor: colors.primary,
                dayTextColor: colors.text,
                monthTextColor: colors.text,
                arrowColor: colors.primary,
              }}
            />
            <Button
              mode="contained"
              style={styles.datePickerDone}
              onPress={() => setShowDatePicker(false)}
            >
              Done
            </Button>
          </Modal>
        </Portal>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Time</Text>
          </View>

          <View style={styles.slotWrap}>
            {selectedDate ? (
              slots.map((iso) => {
                const isActive = selectedSlot === iso;
                return (
                  <Button
                    key={iso}
                    mode={isActive ? "contained" : "outlined"}
                    style={[styles.slot, isActive && styles.slotActive]}
                    onPress={() => setSelectedSlot(iso)}
                    labelStyle={[
                      styles.slotText,
                      isActive && styles.slotTextActive,
                    ]}
                  >
                    {dayjs(iso).format("h:mm A")}
                  </Button>
                );
              })
            ) : (
              <Text style={styles.timeHint}>
                Pick a date to see time slots.
              </Text>
            )}
          </View>
        </View>

        <Card style={styles.summaryCard}>
          <Card.Content style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>₹{total}</Text>
            </View>
            <Button
              mode="contained"
              style={styles.confirm}
              disabled={!selectedSlot}
              onPress={confirm}
            >
              Confirm Booking
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  content: {
    padding: 16,
    paddingBottom: 24,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    ...shadows.floating,
  },

  serviceRowCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundSoft,
  },

  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },

  serviceName: {
    fontWeight: "600",
    color: colors.text,
  },

  serviceMeta: {
    color: colors.primary,
    fontWeight: "700",
    marginTop: 4,
  },

  addMore: {
    borderRadius: 18,
  },

  addMoreContent: {
    paddingVertical: 2,
  },

  addMoreLabel: {
    fontWeight: "700",
    fontSize: 14,
  },

  removeBtn: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryLight,
    borderRadius: 18,
  },

  removeBtnContent: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  slotWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  customDateBtn: {
    borderColor: colors.primary,
    borderRadius: 14,
  },

  timeHint: {
    color: colors.subdued,
    fontSize: 13,
  },

  calendarModal: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 12,
  },

  calendarTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },

  datePickerDone: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },

  slot: {
    borderColor: colors.primary,
    borderRadius: 18,
  },

  slotActive: {
    backgroundColor: colors.primary,
  },

  slotText: {
    fontSize: 13,
    fontWeight: "600",
  },

  slotTextActive: {
    color: colors.text,
  },

  confirm: {
    backgroundColor: colors.primary,
    borderRadius: 16,
  },

  summaryCard: {
    borderRadius: 16,
    marginTop: 8,
    backgroundColor: colors.primaryLight,
    ...shadows.floating,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  summaryLabel: {
    color: colors.subdued,
    fontWeight: "600",
  },

  summaryValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
  },
});
