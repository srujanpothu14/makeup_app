import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";

import MapCard from "../components/MapsLocationCard";
import ServiceCard from "../components/ServiceCard";
import { seedServices } from "../mock/data";

/* -------------------- DATA -------------------- */

const featuredServices = seedServices.filter((s) =>
  ["s1", "s2", "s3"].includes(s.id)
);

const ownerDetails = {
  name: "Manasa",
  studio: "Manasa Beauty & Makeup Studio",
  location: "Korutla, Telangana",
  phone: "+91 96421 66712",
  instagram:
    "https://www.instagram.com/manasa_makeovers_korutla?igsh=enR0ZGI4MHl3a25l",
  whatsapp: "https://wa.me/919642166712?text=Hi",
  bio: "Certified professional makeup artist with 6+ years of experience in bridal, party, and fashion makeup. Known for elegant, long-lasting looks.",
  photo: "https://picsum.photos/seed/owner/400",
};

const feedbacks = [
  { id: "f1", name: "Aishwarya", text: "Absolutely loved my bridal makeup!" },
  { id: "f2", name: "Sneha", text: "Great service, very friendly artist." },
  { id: "f3", name: "Pooja", text: "Best makeup studio in Hyderabad!" },
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

  const [reviewIndex, setReviewIndex] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);

  const reviewRef = useRef<ScrollView>(null);
  const serviceRef = useRef<any>(null);

  /* AUTO SLIDE REVIEWS */
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (reviewIndex + 1) % feedbacks.length;
      reviewRef.current?.scrollTo({ x: next * 220, animated: true });
      setReviewIndex(next);
    }, 3000);
    return () => clearInterval(interval);
  }, [reviewIndex]);

  /* AUTO SLIDE SERVICES */
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (serviceIndex + 1) % featuredServices.length;
      serviceRef.current?.scrollToOffset({
        offset: next * 180,
        animated: true,
      });
      setServiceIndex(next);
    }, 3500);
    return () => clearInterval(interval);
  }, [serviceIndex]);

  const renderService = ({ item }: { item: any }) => (
    <View style={styles.cardWrapper}>
      <ServiceCard
        service={item}
        onPress={() => navigation.push("ServiceDetail", { id: item.id })}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* HERO */}
        <View style={styles.hero}>
          <Image
            source={{ uri: ownerDetails.photo }}
            style={{
              width: 75,
              height: 75,
              borderRadius: 50,
              marginBottom: 10,
            }}
          />
          <Text style={styles.heroTitle}>{ownerDetails.studio}</Text>
          <Text style={styles.heroSubtitle}>
            By {ownerDetails.name} – Professional Makeup Artist
          </Text>
          <Text style={styles.heroLocation}>{ownerDetails.location}</Text>

          <View style={styles.heroActions}>
            <ActionButton
              icon="call"
              text="Call"
              onPress={() => Linking.openURL(`tel:${ownerDetails.phone}`)}
            />
            <ActionButton
              icon="logo-whatsapp"
              text="WhatsApp"
              onPress={() => Linking.openURL(ownerDetails.whatsapp)}
            />
          </View>
        </View>

        {/* ABOUT OWNER */}
        <SectionHeader title="About the Artist" />
        <View style={styles.ownerCard}>
          <Image source={{ uri: ownerDetails.photo }} style={styles.ownerImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.ownerName}>{ownerDetails.name}</Text>
            <Text style={styles.ownerBio}>{ownerDetails.bio}</Text>
          </View>
        </View>

        {/* LOCATION + CONTACT */}
        <View style={styles.infoCard}>
          <TouchableOpacity onPress={openMaps} activeOpacity={0.9}>
            <MapCard image={require("../assets/location.png")} />
          </TouchableOpacity>

          <InfoRow icon="call-outline" text={ownerDetails.phone} />
          <InfoRow icon="logo-whatsapp" text="Chat on WhatsApp" />
          <InfoRow icon="logo-instagram" text="Instagram Profile" />
        </View>

        {/* FEATURED SERVICES */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Featured Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Services")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <FlashList
          ref={serviceRef}
          data={featuredServices}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          onScroll={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / 180
            );
            setServiceIndex(index);
          }}
        />

        <Dots count={featuredServices.length} active={serviceIndex} />

        {/* REVIEWS */}
        <SectionHeader title="Customer Reviews" />

        <ScrollView
          ref={reviewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.feedbackList}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / 220);
            setReviewIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {feedbacks.map((f) => (
            <View key={f.id} style={styles.feedbackCard}>
              <Text style={styles.feedbackText}>"{f.text}"</Text>
              <Text style={styles.feedbackName}>– {f.name}</Text>
            </View>
          ))}
        </ScrollView>

        <Dots count={feedbacks.length} active={reviewIndex} />

        {/* BOOKING CTA */}
        <View style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>Ready to Glow?</Text>
          <Text style={styles.bookingText}>
            Book your beauty session with Manasa today.
          </Text>
          <TouchableOpacity
            style={styles.bookingBtn}
            onPress={() => navigation.navigate("Booking")}
          >
            <Text style={styles.bookingBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        {/* INSTAGRAM CTA */}
        <TouchableOpacity
          style={styles.instagramCard}
          onPress={() => Linking.openURL(ownerDetails.instagram)}
        >
          <Ionicons name="logo-instagram" size={26} color="#E91E63" />
          <Text style={styles.instagramText}>
            Follow us on Instagram for latest looks
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------- COMPONENTS -------------------- */

function ActionButton({ icon, text, onPress }: any) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <Ionicons name={icon} size={18} color="#fff" />
      <Text style={styles.actionText}>{text}</Text>
    </TouchableOpacity>
  );
}

function InfoRow({ icon, text }: any) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color="#E91E63" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function SectionHeader({ title }: any) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function Dots({ count, active }: any) {
  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i === active && styles.activeDot]}
        />
      ))}
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },

  hero: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: "#FFF0F5",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  heroTitle: { fontSize: 26, fontFamily: "RalewayBold" },
  heroSubtitle: { fontSize: 15, color: "#555", marginTop: 4 },
  heroLocation: { fontSize: 13, color: "#888", marginTop: 4 },

  heroActions: { flexDirection: "row", marginTop: 16, gap: 12 },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E91E63",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },

  actionText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  ownerCard: {
    flexDirection: "row",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFF0F5",
    gap: 12,
    alignItems: "center",
  },

  ownerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  ownerName: { fontSize: 18, fontFamily: "RalewayBold" },
  ownerBio: { fontSize: 13, color: "#555", marginTop: 4 },

  infoCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  infoText: { fontSize: 14, color: "#333" },

  sectionHeader: { paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
  sectionHeaderRow: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: { fontSize: 18, fontFamily: "RalewayBold" },
  seeAll: { fontSize: 14, color: "#E91E63" },

  feedbackList: { paddingLeft: 16, paddingRight: 8 },
  feedbackCard: {
    width: 220,
    padding: 14,
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: "#FFF0F5",
  },

  feedbackText: { fontSize: 14, color: "#444", marginBottom: 6 },
  feedbackName: { fontSize: 12, color: "#E91E63", fontWeight: "600" },

  horizontalList: { paddingLeft: 8, paddingRight: 16 },
  cardWrapper: { width: 180 },

  dotsContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ddd", marginHorizontal: 4 },
  activeDot: { backgroundColor: "#E91E63", width: 18 },

  bookingCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#FFF0F5",
    alignItems: "center",
  },

  bookingTitle: { fontSize: 20, fontFamily: "RalewayBold", marginBottom: 6 },
  bookingText: { color: "#555", marginBottom: 12, textAlign: "center" },

  bookingBtn: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
  },

  bookingBtnText: { color: "#fff", fontWeight: "600" },

  instagramCard: {
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFE3EA",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
  },

  instagramText: { color: "#E91E63", fontWeight: "600" },
});
