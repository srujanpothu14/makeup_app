import React, { useState } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import dayjs from "dayjs";
import { createBooking } from "../mock/api";
import { useAuthStore } from "../store/useAuthStore";

export default function BookingScreen({ route }: any) {
  const { id: serviceId } = route.params;
  const { user } = useAuthStore();
  const [selected, setSelected] = useState<string | null>(null);

  const slots = Array.from({ length: 6 }, (_, i) =>
    dayjs()
      .add(i + 1, "day")
      .hour(11)
      .minute(0)
      .second(0)
      .toISOString()
  );

  const confirm = async () => {
    if (!user || !selected) return;
    await createBooking({ serviceId, userId: user.id, startTime: selected });
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "red" }}>
          You must be logged in to make a booking.
        </Text>
      </View>
    );
  }

  if (!route?.params?.id) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "red" }}>
          Service ID is missing. Please navigate to this screen properly.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        Select a time
      </Text>
      {slots.map((iso) => (
        <Button
          key={iso}
          mode={selected === iso ? "contained" : "outlined"}
          style={{ marginBottom: 8 }}
          onPress={() => setSelected(iso)}
        >
          {dayjs(iso).format("ddd, D MMM • h:mm A")}
        </Button>
      ))}
      <Button
        mode="contained"
        disabled={!selected}
        onPress={confirm}
        style={{ marginTop: 12 }}
      >
        Confirm Booking
      </Button>
    </View>
  );
}
