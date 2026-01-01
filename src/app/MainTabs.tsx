import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
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
        name="ServicesHome"
        component={ServicesScreen}
        options={{
          headerShown: false,
        }}
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
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any = "";
          if (route.name === "Services") iconName = "list";
          else if (route.name === "Gallery") iconName = "images";
          else if (route.name === "Booking") iconName = "calendar";
          else if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      {[
        { name: "Services", component: ServicesStackNavigator },
        { name: "Gallery", component: GalleryScreen },
        { name: "Booking", component: BookingWrapper },
        { name: "Profile", component: ProfileScreen },
      ].map(({ name, component }) => (
        <Tabs.Screen
          key={name}
          name={name}
          component={component}
          options={{
            title: name,
            headerTitleStyle: {
              fontSize: 30,
              fontWeight: "bold",
            },
            headerLeft: () => (
              <Image
                source={require("../assets/manasa_logo.png")}
                style={{
                  width: 40,
                  height: 40,
                  marginLeft: 15,
                  marginRight: 10,
                }}
              />
            ),
          }}
        />
      ))}
    </Tabs.Navigator>
  );
}