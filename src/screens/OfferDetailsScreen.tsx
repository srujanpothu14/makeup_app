import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { offers, seedServices } from "../mock/data";

export default function OfferDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params || {};

  const offer = offers.find((o: any) => o.id === id);

  if (!offer) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Offer not found</Text>
      </View>
    );
  }

  const service = seedServices.find((s) => s.id === offer.serviceId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{offer.title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{offer.discountPercent}% OFF</Text>
        </View>
      </View>

      <Text style={styles.description}>{offer.description}</Text>

      {service && (
        <View style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <Text style={styles.servicePrice}>₹{service.price}</Text>
          <TouchableOpacity
            style={styles.serviceBtn}
            onPress={() => navigation.push("ServiceDetail", { id: service.id })}
          >
            <Text style={styles.serviceBtnText}>View Service</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() => navigation.navigate("Booking")}
      >
        <Text style={styles.bookBtnText}>Book with Offer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFF0F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontFamily: "RalewayBold" },
  badge: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: { color: "#fff", fontWeight: "700" },
  description: { color: "#444", fontSize: 14, marginBottom: 16 },
  serviceCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  serviceTitle: { fontSize: 16, fontFamily: "RalewayBold" },
  servicePrice: { color: "#E91E63", fontWeight: "700", marginTop: 6 },
  serviceBtn: {
    marginTop: 12,
    backgroundColor: "#E91E63",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  serviceBtnText: { color: "#fff", fontWeight: "700" },
  bookBtn: {
    marginTop: 20,
    backgroundColor: "#E91E63",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  bookBtnText: { color: "#fff", fontWeight: "700" },
});
