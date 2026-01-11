import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import ServiceDetailScreen from "../screens/ServiceDetailScreen";
import OfferDetailsScreen from "../screens/OfferDetailsScreen";

import { useAuthStore } from "../store/useAuthStore";

const RootStack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {user ? (
          <>
            <RootStack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="ServiceDetail"
              component={ServiceDetailScreen}
              options={{
                title: "Service Details", // or "" if you want no title
                headerBackTitleVisible: false, // removes "MainTabs"
              }}
            />
            <RootStack.Screen
              name="OfferDetails"
              component={OfferDetailsScreen}
              options={{
                title: "Offer Details",
                headerBackTitleVisible: false,
              }}
            />
          </>
        ) : (
          <RootStack.Screen
            name="Auth"
            component={AuthStack}
            options={{ headerShown: false }}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
