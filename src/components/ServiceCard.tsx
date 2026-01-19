import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { colors } from "../theme";

/* -------------------- TYPES -------------------- */

type Service = {
  id: string;
  title: string;
  category: string;
  durationMin: number;
  price: number;
  thumbnailUrl?: string;
};

type Props = {
  service: Service;
  selected?: boolean;   // ✅ NEW
  onPress: () => void;  // Toggle select / open details
  onBook: () => void;   // Go to booking
};

/* -------------------- COMPONENT -------------------- */

const ServiceCard: React.FC<Props> = ({
  service,
  selected = false,
  onPress,
  onBook,
}) => {
  return (
    <Card
      style={[
        styles.card,
        selected && styles.selectedCard, // ✅ Highlight when selected
      ]}
      onPress={onPress}
    >
      {/* CLIPPING CONTAINER */}
      <View style={styles.inner}>
        {/* IMAGE */}
        <Card.Cover
          source={{
            uri: service.thumbnailUrl ?? "https://picsum.photos/300",
          }}
          style={styles.image}
        />

        {/* CONTENT */}
        <Card.Content style={styles.content}>
          <Text numberOfLines={1} style={styles.title}>
            {service.title}
          </Text>

          <Text numberOfLines={1} style={styles.subtitle}>
            {service.category} • {service.durationMin} mins
          </Text>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.price}>₹{service.price}</Text>

            <Button
              mode="contained"
              compact
              onPress={onBook}
              style={styles.button}
            >
              <Text style={styles.buttonLabel}>Book</Text>
            </Button>
          </View>
        </Card.Content>
      </View>
    </Card>
  );
};

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    width: 55,
  },

  buttonLabel: {
    color: colors.mutedLight,
    fontSize: 12,
    fontWeight: "700",
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    flex: 1,
    margin: 8,
  },

  /* ✅ Selected highlight */
  selectedCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  content: {
    backgroundColor: colors.white,
    paddingBottom: 14,
    paddingTop: 10,
  },

  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  image: {
    height: 180,
    backgroundColor: colors.white,
    borderWidth: 5.5,
    borderRadius: 14,
    borderColor: colors.white,
  },

  inner: {
    borderRadius: 20,
    overflow: "hidden",
  },

  price: {
    color: colors.shadow,
    fontSize: 17,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 10,
  },

  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
});

export default ServiceCard;
