import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { colors } from '../theme';
import ServicesScreen from '../screens/ServicesScreen';
import GalleryScreen from '../screens/GalleryScreen';
import BookingScreen from '../screens/BookingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';

const Tabs = createBottomTabNavigator();

/* -------------------- TYPES -------------------- */

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type TabIcon = {
  filled: IoniconName;
  outline: IoniconName;
};

/* -------------------- BOOKING WRAPPER -------------------- */

function BookingWrapper() {
  return <BookingScreen route={{ params: { id: 'default-service-id' } }} />;
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

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.accent,

        tabBarStyle: {
          backgroundColor: colors.white,
          height: 60 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 2,
          borderTopWidth: 0,
          shadowColor: colors.shadow,
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 6,
          zIndex: 10,
        },

        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, TabIcon> = {
            Home: { filled: 'home', outline: 'home-outline' },
            Services: { filled: 'list', outline: 'list-outline' },
            Gallery: { filled: 'images', outline: 'images-outline' },
            Booking: { filled: 'calendar', outline: 'calendar-outline' },
            Profile: { filled: 'person', outline: 'person-outline' },
          };

          const iconName = focused ? icons[route.name].filled : icons[route.name].outline;

          return (
            <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
              <Ionicons
                name={iconName}
                size={focused ? size + 2 : size}
                color={focused ? colors.primary : color}
              />
              <Text style={[styles.tabButtonLabel, focused && styles.tabButtonLabelActive]}>
                {route.name}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tabs.Screen name="Services" component={ServicesScreen} options={tabOptions('Services')} />
      <Tabs.Screen name="Gallery" component={GalleryScreen} options={tabOptions('Gallery')} />
      <Tabs.Screen name="Booking" component={BookingWrapper} options={tabOptions('Booking')} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={tabOptions('Profile')} />
    </Tabs.Navigator>
  );
}

/* -------------------- SHARED OPTIONS -------------------- */

const tabOptions = (title: string) => ({
  title,
  headerTitleStyle: {
    fontFamily: 'RalewayBold',
    fontSize: 22,
  },
  headerLeft: () => <Image source={require('../assets/manasa_logo.png')} style={styles.logo} />,
});

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    height: 110,
  },

  headerTitleContainer: {
    paddingTop: 0,
  },

  logo: {
    backgroundColor: colors.primaryLight,
    borderRadius: 25,
    height: 48,
    marginLeft: 15,
    marginRight: 10,
    padding: 4,
    width: 48,
  },

  tabButton: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },

  tabButtonActive: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  tabButtonLabel: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },

  tabButtonLabelActive: {
    color: colors.primary,
  },
});
