import React from "react";
import { View } from "react-native";
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

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {isLoading ? null : (
        <FlashList
          data={data ?? []}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              onPress={() => nav.navigate("ServiceDetail", { id: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false} // Disable the scroll bar
        />
      )}
    </View>
  );
}
