import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const [cartOpen, setCartOpen] = useState(false);

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

  const total = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.price, 0),
    [selectedServices],
  );

  const renderItem = useCallback(
    ({ item }: { item: Service }) => {
      const isSelected = selectedIds.has(item.id);

      return (
        <ServiceCard
          service={item}
          selected={isSelected}
          onPress={() => navigation.navigate("ServiceDetail", { id: item.id })}
          onBook={() => toggleService(item)}
        />
      );
    },
    [navigation, selectedIds, toggleService],
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
        <TouchableOpacity
          style={styles.cartFab}
          onPress={() => setCartOpen(true)}
        >
          <Ionicons name="cart" size={22} color={colors.white} />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{selectedServices.length}</Text>
          </View>
        </TouchableOpacity>
      )}

      <Modal
        visible={cartOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCartOpen(false)}
      >
        <SafeAreaView style={styles.modalOverlay} edges={["top", "bottom"]}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setCartOpen(false)}
          />
          <Pressable style={styles.modalCard} onPress={() => null}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selected Services</Text>
              <TouchableOpacity onPress={() => setCartOpen(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalList}>
              {selectedServices.length === 0 ? (
                <View style={styles.modalEmpty}>
                  <Ionicons
                    name="cart-outline"
                    size={36}
                    color={colors.subdued}
                  />
                  <Text style={styles.modalEmptyText}>
                    No services selected
                  </Text>
                </View>
              ) : (
                selectedServices.map((service) => (
                  <View key={service.id} style={styles.modalRow}>
                    <View style={styles.modalRowText}>
                      <Text style={styles.modalServiceTitle}>
                        {service.title}
                      </Text>
                      <Text style={styles.modalServiceSub}>
                        {service.category}
                      </Text>
                    </View>
                    <Text style={styles.modalPrice}>₹{service.price}</Text>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Text style={styles.modalTotal}>Total: ₹{total}</Text>
              <TouchableOpacity style={styles.modalCta} onPress={goToBooking}>
                <Text style={styles.modalCtaText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </SafeAreaView>
      </Modal>
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

  cartFab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderColor: colors.accent,
    borderWidth: 2,
  },

  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: colors.white,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderColor: colors.accent,
    borderWidth: 1,
  },

  cartBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 8,
    paddingTop: 6,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },

  modalHandle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.mutedLight,
    marginBottom: 8,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  modalList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  modalEmpty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 8,
  },

  modalEmptyText: {
    color: colors.subdued,
    fontSize: 14,
  },

  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSoft,
  },

  modalRowText: {
    flex: 1,
    marginRight: 12,
  },

  modalServiceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  modalServiceSub: {
    fontSize: 12,
    color: colors.subdued,
  },

  modalPrice: {
    fontWeight: "700",
    color: colors.primary,
  },

  modalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundSoft,
  },

  modalTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },

  modalCta: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },

  modalCtaText: {
    color: colors.white,
    fontWeight: "700",
  },
});
