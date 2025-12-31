import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "react-native";
import AppNavigator from "./src/app/AppNavigator";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar hidden={false} />
      {/* Ensures the status bar is visible globally */}
      <AppNavigator />
    </QueryClientProvider>
  );
}
