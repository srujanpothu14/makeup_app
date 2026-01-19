import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, Card } from "react-native-paper";
import dayjs from "dayjs";
import { useRoute, useNavigation } from "@react-navigation/native";

import { createBooking } from "../mock/api";
import { colors } from "../theme";
import { useAuthStore } from "../store/useAuthStore";

export default function BookingScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();

  const selectedServices = route.params?.services || [];

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

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

  const total = selectedServices.reduce(
    (sum: number, s: any) => sum + s.price,
    0
  );

  const slots =
    selectedDate &&
    Array.from({ length: 6 }, (_, i) =>
      dayjs(selectedDate)
        .hour(11 + i)
        .minute(0)
        .second(0)
        .toISOString()
    );

  const confirm = async () => {
    if (!user || !selectedSlot) return;

    await createBooking({
      serviceIds: selectedServices.map((s: any) => s.id),
      userId: user.id,
      startTime: selectedSlot,
    });

    Alert.alert("Success", "Booking confirmed!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Services</Text>

      {selectedServices.map((s: any) => (
        <Card key={s.id} style={styles.serviceCard}>
          <Card.Content>
            <Text style={styles.serviceName}>{s.title}</Text>
            <Text style={styles.price}>₹{s.price}</Text>
          </Card.Content>
        </Card>
      ))}

      {/* Add more */}
      <Button
        mode="outlined"
        icon="plus"
        style={styles.addMore}
        onPress={() =>
          navigation.navigate("Services", {
            selectedServices,
          })
        }
      >
        Add more
      </Button>

      <Text style={styles.total}>Total: ₹{total}</Text>

      {/* Time slots */}
      <Text style={styles.title}>Select Time</Text>

      {slots?.map((iso) => (
        <Button
          key={iso}
          mode={selectedSlot === iso ? "contained" : "outlined"}
          style={styles.slot}
          onPress={() => setSelectedSlot(iso)}
        >
          {dayjs(iso).format("h:mm A")}
        </Button>
      ))}

      <Button
        mode="contained"
        style={styles.confirm}
        disabled={!selectedSlot}
        onPress={confirm}
      >
        Confirm Booking
      </Button>
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.backgroundSoft,
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

  serviceCard: {
    marginBottom: 10,
    borderRadius: 14,
  },

  serviceName: {
    fontWeight: "600",
    color: colors.text,
  },

  price: {
    color: colors.primary,
    fontWeight: "700",
  },

  addMore: {
    marginVertical: 12,
    borderColor: colors.primary,
  },

  total: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 16,
  },

  slot: {
    marginBottom: 8,
    borderColor: colors.primary,
  },

  confirm: {
    backgroundColor: colors.primary,
    marginTop: 16,
  },
});
