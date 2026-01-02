import React from "react";
import { View, ActivityIndicator, StatusBar } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";

import AppNavigator from "./src/app/AppNavigator";

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    RalewayBold: Raleway_700Bold, // ⭐ load font once
  });

  // Wait until font is loaded
  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar hidden={false} barStyle="dark-content" />
      <AppNavigator />
    </QueryClientProvider>
  );
}