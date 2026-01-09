import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import MapCard from "../components/MapsLocationCard";
import ServiceCard from "../components/ServiceCard";

/* -------------------- DATA -------------------- */

const featuredServices = [
  {
    id: "1",
    title: "Bridal Makeup",
    category: "Makeup",
    durationMin: 120,
    price: 8000,
  },
  {
    id: "2",
    title: "Hair Styling",
    category: "Hair",
    durationMin: 60,
    price: 2500,
  },
];

const ownerDetails = {
  name: "Manasa",
  studio: "Manasa Beauty & Makeup Studio",
  location: "Hyderabad, Telangana",
  phone: "+91 96421 66712",
  instagram:
    "https://www.instagram.com/manasa_makeovers_korutla?igsh=enR0ZGI4MHl3a25l",
  whatsapp: "https://wa.me/919642166712?text=Hi",
};

const studioLocation = {
  name: "Manasa Makeup Studio & Beauty Zone",
  latitude: 18.8247202,
  longitude: 78.7030454,
};

const feedbacks = [
  {
    id: "f1",
    name: "Aishwarya",
    text: "Absolutely loved my bridal makeup! Highly professional.",
  },
  {
    id: "f2",
    name: "Sneha",
    text: "Great service, very friendly and talented artist.",
  },
  {
    id: "f3",
    name: "Pooja",
    text: "Best makeup studio in Hyderabad!",
  },
];

/* -------------------- MAP FUNCTION -------------------- */

const openMaps = () => {
  const latitude = 18.8247202;
  const longitude = 78.7030454;
  const name = "Manasa Makeup Studio & Beauty Zone";

  const url =
    Platform.OS === "ios"
      ? `maps:0,0?q=${name}@${latitude},${longitude}`
      : `geo:0,0?q=${latitude},${longitude}(${name})`;

  Linking.openURL(url);
};

/* -------------------- SCREEN -------------------- */

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const renderService = ({ item }: { item: any }) => (
    <View style={styles.cardWrapper}>
      <ServiceCard
        service={item}
        onPress={() => navigation.navigate("ServiceDetail", { id: item.id })}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HERO */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{ownerDetails.studio}</Text>
        <Text style={styles.heroSubtitle}>
          By {ownerDetails.name} – Professional Makeup Artist
        </Text>
      </View>

      {/* OWNER INFO */}
      <View style={styles.infoCard}>
        <TouchableOpacity onPress={openMaps} activeOpacity={0.9}>
          <MapCard image={require("../assets/location.png")} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${ownerDetails.phone}`)}
        >
          <InfoRow icon="call-outline" text={ownerDetails.phone} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL(ownerDetails.whatsapp)}
        >
          <InfoRow icon="logo-whatsapp" text="Chat on WhatsApp" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL(ownerDetails.instagram)}
        >
          <InfoRow icon="logo-instagram" text="Instagram Profile" />
        </TouchableOpacity>
      </View>

      {/* FEEDBACKS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.feedbackList}
      >
        {feedbacks.map((f) => (
          <View key={f.id} style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>"{f.text}"</Text>
            <Text style={styles.feedbackName}>– {f.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* FEATURED SERVICES */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Services</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Services")}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlashList
        data={featuredServices}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </ScrollView>
  );
}

/* -------------------- SMALL COMPONENT -------------------- */

function InfoRow({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color="#E91E63" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 12,
  },

  /* Hero */
  hero: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: "RalewayBold",
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#777",
  },

  /* Owner Info */
  infoCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },

  /* Section */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "RalewayBold",
  },
  seeAll: {
    fontSize: 14,
    color: "#E91E63",
  },

  /* Feedback */
  feedbackList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  feedbackCard: {
    width: 220,
    padding: 14,
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: "#FFF0F5",
  },
  feedbackText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
  feedbackName: {
    fontSize: 12,
    color: "#E91E63",
    fontWeight: "600",
  },

  /* Services */
  horizontalList: {
    paddingLeft: 8,
    paddingRight: 16,
  },
  cardWrapper: {
    width: 180,
  },
});
