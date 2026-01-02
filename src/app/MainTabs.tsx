import React from "react";
import { Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ServicesScreen from "../screens/ServicesScreen";
import ServiceDetailScreen from "../screens/ServiceDetailScreen";
import GalleryScreen from "../screens/GalleryScreen";
import BookingScreen from "../screens/BookingScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tabs = createBottomTabNavigator();
const ServicesStack = createNativeStackNavigator();

/* -------------------- SERVICES STACK -------------------- */

function ServicesStackNavigator() {
  return (
    <ServicesStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "RalewayBold", // ⭐ Raleway Bold for stack headers
          fontSize: 26,
        },
      }}
    >
      <ServicesStack.Screen
        name="ServicesHome"
        component={ServicesScreen}
        options={{ headerShown: false }}
      />
      <ServicesStack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ title: "Service Details" }}
      />
    </ServicesStack.Navigator>
  );
}

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
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, any> = {
            Services: "list-outline",
            Gallery: "images-outline",
            Booking: "calendar-outline",
            Profile: "person-outline",
          };

          return (
            <Ionicons
              name={icons[route.name]}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tabs.Screen
        name="Services"
        component={ServicesStackNavigator}
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
    fontFamily: "RalewayBold", // ⭐ Raleway Bold for tab headers
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
