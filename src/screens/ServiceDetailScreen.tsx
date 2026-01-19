import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Button, ActivityIndicator } from "react-native-paper";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { fetchService } from "../mock/api";
import { colors } from "../theme";

/* -------------------- TYPES -------------------- */

type RootStackParamList = {
  ServiceDetail: { id: string };
  Booking: {
    id: string;
    name: string;
    price: number;
  };
};

type ServiceDetailRouteProp = RouteProp<RootStackParamList, "ServiceDetail">;

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ServiceDetail"
>;

/* -------------------- SCREEN -------------------- */

export default function ServiceDetailScreen() {
  const route = useRoute<ServiceDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const { id } = route.params;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["service", id],
    queryFn: () => fetchService(id),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
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
          onPress={() =>
            navigation.navigate("Booking", {
              id: data.id,
              name: data.title,
              price: data.price,
            })
          }
        >
          <Text style={styles.buttonText}>Choose Time</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "600",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    elevation: 4,
    marginHorizontal: 16,
    marginTop: -30,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  category: {
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 12,
  },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  chip: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    color: colors.subdued,
    fontWeight: "600",
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  description: {
    color: colors.subdued,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  errorText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    height: 260,
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  loadingText: {
    color: colors.subdued,
    marginTop: 12,
  },
  title: {
    color: colors.text,
    fontFamily: "RalewayBold",
    fontSize: 24,
    marginBottom: 4,
  },
});
