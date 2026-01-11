import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

type Offer = {
  id: string;
  title: string;
  description?: string;
  discountPercent?: number;
  serviceId?: string;
};

export default function OfferCard({
  offer,
  onPress,
}: {
  offer: Offer;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.title}>{offer.title}</Text>
      {offer.description ? (
        <Text style={styles.desc}>{offer.description}</Text>
      ) : null}
      {typeof offer.discountPercent === "number" && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{offer.discountPercent}% OFF</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    padding: 14,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  title: { fontSize: 16, fontFamily: "RalewayBold", marginBottom: 6 },
  desc: { fontSize: 13, color: "#555" },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#E91E63",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
});
