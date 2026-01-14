import React, { useMemo, useState, useCallback } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { fetchServices } from "../mock/api";
import ServiceCard from "../components/ServiceCard";
import { colors } from "../theme";

/* -------------------- TYPES -------------------- */

type Service = {
  id: string;
  title: string;
  description?: string;
  category: string;
  durationMin: number;
  price: number;
};

type RootStackParamList = {
  ServiceDetail: { id: string };
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ServiceDetail"
>;

/* -------------------- SCREEN -------------------- */

export default function ServicesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState("");

  const { data = [], isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();

    return data.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }, [data, search]);

  const renderItem = useCallback(
    ({ item }: { item: Service }) => (
      <ServiceCard
        service={item}
        onPress={() => navigation.push("ServiceDetail", { id: item.id })}
      />
    ),
    [navigation]
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.subdued} />

        <TextInput
          style={styles.searchInput}
          placeholder="Search services"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colors.subdued}
          clearButtonMode="while-editing"
        />

        {!!search && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color={colors.subdued} />
          </TouchableOpacity>
        )}
      </View>

      {/* Services Grid */}
      {!isLoading && (
        <FlashList
          data={filteredData}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingTop: 12,
  },

  list: {
    paddingBottom: 16,
    paddingHorizontal: 8,
  },

  searchBar: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.backgroundSoft,
    borderRadius: 16,
    elevation: 4,
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    marginHorizontal: "5%",
    maxWidth: 320,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
  },
});
