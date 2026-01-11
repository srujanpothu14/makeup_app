import React from "react";
import { Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ServicesScreen from "../screens/ServicesScreen";
import GalleryScreen from "../screens/GalleryScreen";
import BookingScreen from "../screens/BookingScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";

const Tabs = createBottomTabNavigator();

/* -------------------- BOOKING WRAPPER -------------------- */

function BookingWrapper() {
  return <BookingScreen route={{ params: { id: "default-service-id" } }} />;
}

/* -------------------- MAIN TABS -------------------- */

export default function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerStyle: styles.header,
        headerTitleContainerStyle: styles.headerTitleContainer,
        headerShadowVisible: false,

        tabBarShowLabel: true,

        // 🌸 Pink colors
        tabBarActiveTintColor: "#E91E63",
        tabBarInactiveTintColor: "#ff73a2",

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "400",
        },

        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, { filled: string; outline: string }> = {
            Home: { filled: "home", outline: "home-outline" },
            Services: { filled: "list", outline: "list-outline" },
            Gallery: { filled: "images", outline: "images-outline" },
            Booking: { filled: "calendar", outline: "calendar-outline" },
            Profile: { filled: "person", outline: "person-outline" },
          };

          const iconName = focused
            ? icons[route.name].filled
            : icons[route.name].outline;

          // ✅ TypeScript-safe cast
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={tabOptions("Home")}
      />
      <Tabs.Screen
        name="Services"
        component={ServicesScreen}
        options={tabOptions("Services")}
      />
      <Tabs.Screen
        name="Gallery"
        component={GalleryScreen}
        options={tabOptions("Gallery")}
      />
      <Tabs.Screen
        name="Booking"
        component={BookingWrapper}
        options={tabOptions("Booking")}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={tabOptions("Profile")}
      />
    </Tabs.Navigator>
  );
}

/* -------------------- SHARED OPTIONS -------------------- */

const tabOptions = (title: string) => ({
  title,
  headerTitleStyle: {
    fontFamily: "RalewayBold",
    fontSize: 22,
  },
  headerLeft: () => (
    <Image
      source={require("../assets/manasa_logo.png")}
      style={styles.logo}
    />
  ),
});

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  header: {
    height: 110,
    backgroundColor: "#fff",
  },
  headerTitleContainer: {
    paddingTop: 0,
  },
  logo: {
    width: 48,
    height: 48,
    marginLeft: 15,
    marginRight: 10,
    backgroundColor: "#FFE3EA",
    borderRadius: 25,
    padding: 4,
  },
});
