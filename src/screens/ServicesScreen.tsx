import React, { useMemo, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";

import { fetchServices } from "../mock/api";
import ServiceCard from "../components/ServiceCard";

export default function ServicesScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (item: any) =>
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }, [data, search]);

  const renderItem = ({ item }: { item: any }) => (
    <ServiceCard
      service={item}
      onPress={() => navigation.push("ServiceDetail", { id: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" />

        <TextInput
          style={styles.searchInput}
          placeholder="Search services"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#888"
          clearButtonMode="while-editing"
        />

        {!!search && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Services Grid */}
      {!isLoading && (
        <FlashList
          data={filteredData}
          numColumns={2}
          keyExtractor={(item: any) => item.id}
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
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 12,
  },

  list: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },

  /* Search Bar */
  searchBar: {
    marginHorizontal: "5%",
    maxWidth: 320,
    alignSelf: "center",
    marginBottom: 12,

    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    paddingHorizontal: 12,
    paddingVertical: 10,

    borderRadius: 16,
    backgroundColor: "#f9f9f9",

    // Android shadow
    elevation: 4,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#222",
  },
});
