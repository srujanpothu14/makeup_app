import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { useNavigation, useRoute } from "@react-navigation/native";
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

/* -------------------- SCREEN -------------------- */

export default function ServicesScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const listRef = useRef<any>(null);

  const preSelected: Service[] = route.params?.selectedServices || [];

  const [selectedServices, setSelectedServices] =
    useState<Service[]>(preSelected);

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", () => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });

    return unsubscribe;
  }, [navigation]);

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
        item.description?.toLowerCase().includes(q),
    );
  }, [data, search]);

  const selectedIds = useMemo(
    () => new Set(selectedServices.map((s) => s.id)),
    [selectedServices],
  );

  const toggleService = useCallback((service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      return exists
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service];
    });
  }, []);

  const goToBooking = useCallback(() => {
    navigation.navigate("Booking", {
      services: selectedServices,
    });
  }, [navigation, selectedServices]);

  const renderItem = useCallback(
    ({ item }: { item: Service }) => {
      const isSelected = selectedIds.has(item.id);

      return (
        <ServiceCard
          service={item}
          selected={isSelected}
          onPress={() => toggleService(item)}
          onBook={goToBooking}
        />
      );
    },
    [goToBooking, selectedIds, toggleService],
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
        />
      </View>

      {/* Services Grid */}
      {!isLoading && (
        <FlashList
          ref={listRef}
          data={filteredData}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          removeClippedSubviews
          keyboardShouldPersistTaps="handled"
        />
      )}

      {/* Bottom CTA */}
      {selectedServices.length > 0 && (
        <TouchableOpacity style={styles.cta} onPress={goToBooking}>
          <Ionicons name="checkmark-circle" size={22} color={colors.white} />
        </TouchableOpacity>
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
    paddingBottom: 80,
    paddingHorizontal: 8,
  },

  searchBar: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.backgroundSoft,
    borderRadius: 16,
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    marginHorizontal: "5%",
    maxWidth: 320,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
  },

  cta: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 30,
  },
});
