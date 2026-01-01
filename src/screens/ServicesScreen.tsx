import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "../mock/api";
import { FlashList } from "@shopify/flash-list";
import ServiceCard from "../components/ServiceCard";
import { useNavigation } from "@react-navigation/native";

export default function ServicesScreen() {
  const nav = useNavigation<any>();
  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });
  const [search, setSearch] = useState("");

  // Optionally filter data by search
  const filteredData = (data ?? []).filter(
    (item: any) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={{ marginLeft: 15 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#888"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color="#888"
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {isLoading ? null : (
        <FlashList
          data={filteredData}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              onPress={() => nav.navigate("ServiceDetail", { id: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // title style already defined above, remove duplicate
  searchBarWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    maxWidth: 320,
    width: "90%",
  },
  searchInput: {
    flex: 1,
    height: 28,
    paddingHorizontal: 8,
    color: "#222",
    fontSize: 15,
    backgroundColor: "transparent",
  },
});
