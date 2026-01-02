import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";

import ServiceCard from "../components/ServiceCard";

const featuredServices = [
  {
    id: "1",
    title: "Bridal Makeup",
    category: "Makeup",
    durationMin: 120,
    price: 8000,
  },
  {
    id: "2",
    title: "Hair Styling",
    category: "Hair",
    durationMin: 60,
    price: 2500,
  },
    {
    id: "3",
    title: "Hair Styling",
    category: "Hair",
    durationMin: 60,
    price: 2500,
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const renderItem = ({ item }: { item: any }) => (
    <ServiceCard
      service={item}
      onPress={() =>
        navigation.navigate("ServiceDetail", { id: item.id })
      }
    />
  );

  return (
    <View style={styles.container}>
      {/* HERO SECTION */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Welcome to Manasa Beauty
        </Text>
        <Text style={styles.heroSubtitle}>
          Professional makeup & beauty services crafted just for you
        </Text>
      </View>

      {/* QUICK ACTIONS */}
      <View style={styles.actions}>
        <ActionButton
          icon="brush-outline"
          label="Makeup"
        />
        <ActionButton
          icon="cut-outline"
          label="Hair"
        />
        <ActionButton
          icon="sparkles-outline"
          label="Skincare"
        />
      </View>

      {/* FEATURED */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Featured Services
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Services")}
        >
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlashList
        data={featuredServices}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

/* -------------------- SMALL COMPONENT -------------------- */

function ActionButton({
  icon,
  label,
}: {
  icon: any;
  label: string;
}) {
  return (
    <View style={styles.actionButton}>
      <Ionicons name={icon} size={24} color="#E91E63" />
      <Text style={styles.actionText}>{label}</Text>
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 12,
  },

  /* Hero */
  hero: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: "RalewayBold",
    marginBottom: 6,
  },
  heroSubtitle: {
    color: "#777",
    fontSize: 15,
  },

  /* Actions */
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  actionButton: {
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: "#444",
  },

  /* Section */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "RalewayBold",
  },
  seeAll: {
    color: "#E91E63",
    fontSize: 14,
  },

  list: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
});
