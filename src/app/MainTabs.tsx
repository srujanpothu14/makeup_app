import React from "react";
import { Image, StyleSheet, View, Platform, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerStyle: styles.header,
        headerTitleContainerStyle: styles.headerTitleContainer,
        headerShadowVisible: false,

        tabBarShowLabel: false,

        tabBarActiveTintColor: "#E91E63",
        tabBarInactiveTintColor: "#F8A1C4",

        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60 + insets.bottom,
          paddingTop: 6,
          paddingBottom:
            Platform.OS === "ios" ? insets.bottom + 2 : insets.bottom + 2,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 6,
          zIndex: 10,
        },

        tabBarLabelStyle: {
          fontSize: 8,
          fontWeight: "400",
          marginTop: 4,
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

          const label = route.name;

          return (
            <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
              <Ionicons
                name={iconName as any}
                size={focused ? size + 2 : size}
                color={focused ? "#E91E63" : color}
              />
              <Text
                style={[
                  styles.tabButtonLabel,
                  focused && styles.tabButtonLabelActive,
                ]}
              >
                {label}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
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
    <Image source={require("../assets/manasa_logo.png")} style={styles.logo} />
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

  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  activeIconWrapper: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#FFE3EA",
  },

  tabButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 18,
  },

  tabButtonActive: {
    backgroundColor: "#FFE3EA",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  tabButtonLabel: {
    marginTop: 4,
    fontSize: 11,
    color: "#F8A1C4",
    fontWeight: "600",
  },

  tabButtonLabelActive: {
    color: "#E91E63",
  },
});
