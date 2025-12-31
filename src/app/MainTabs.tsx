import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServicesScreen from "../screens/ServicesScreen";
import ServiceDetailScreen from "../screens/ServiceDetailScreen";
import GalleryScreen from "../screens/GalleryScreen";
import BookingScreen from "../screens/BookingScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tabs = createBottomTabNavigator();
const ServicesStack = createNativeStackNavigator();

function ServicesStackNavigator() {
  return (
    <ServicesStack.Navigator>
      <ServicesStack.Screen
        name="Services"
        component={ServicesScreen}
        options={{ headerShown: false }}
      />
      <ServicesStack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
      />
    </ServicesStack.Navigator>
  );
}

function BookingWrapper() {
  return <BookingScreen route={{ params: { id: "default-service-id" } }} />;
}

export default function MainTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Services" component={ServicesStackNavigator} />
      <Tabs.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{ title: "Gallery" }}
      />
      <Tabs.Screen name="Booking" component={BookingWrapper} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}
