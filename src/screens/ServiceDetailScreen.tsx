import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { fetchService } from "../mock/api";
import { Button, ActivityIndicator } from "react-native-paper";

export default function ServiceDetailScreen() {
  const { params } = useRoute<any>();
  const nav = useNavigation<any>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["service", params.id],
    queryFn: () => fetchService(params.id),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading service...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load service details.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image */}
      <Image source={{ uri: data.thumbnailUrl }} style={styles.image} />

      {/* Content Card */}
      <View style={styles.card}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.category}>{data.category}</Text>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>⏱ {data.durationMin} mins</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>₹ {data.price}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{data.description}</Text>

        {/* CTA */}
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={() => nav.navigate("Booking", { id: data.id })}
        >
          Choose Time
        </Button>
      </View>
    </ScrollView>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: 260,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  card: {
    marginTop: -30,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },

  category: {
    color: "#E91E63",
    fontWeight: "600",
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  chip: {
    backgroundColor: "#FFF0F5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  chipText: {
    fontWeight: "600",
    color: "#333",
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
    marginBottom: 24,
  },

  button: {
    borderRadius: 12,
    backgroundColor: "#E91E63",
  },

  buttonContent: {
    paddingVertical: 8,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#555",
  },

  errorText: {
    color: "red",
    fontSize: 16,
  },
});
