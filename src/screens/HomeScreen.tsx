import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
import OfferCard from "../components/OfferCard";
import CarouselDots from "../components/CarouselDots";
import HeroHeader from "../components/HeroHeader";
import InfoRow from "../components/InfoRow";
import { seedServices, offers } from "../mock/data";

/* -------------------- DATA -------------------- */

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

  // Memoized lists to avoid re-computation on each render
  const featuredServices = useMemo(
    () => seedServices.filter((s) => ["s1", "s2", "s3"].includes(s.id)),
    []
  );
  const memoOffers = useMemo(() => offers, [offers]);

  const reviewRef = useRef<ScrollView>(null);
  const serviceRef = useRef<any>(null);

  /* AUTO SLIDE REVIEWS */
  useEffect(() => {
    if (!feedbacks.length) return;
    const interval = setInterval(() => {
      setReviewIndex((prev) => {
        const next = (prev + 1) % feedbacks.length;
        reviewRef.current?.scrollTo({ x: next * 220, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const onReviewScroll = useCallback((e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / 220);
    setReviewIndex(index);
  }, []);

  /* AUTO SLIDE SERVICES */
  useEffect(() => {
    if (!featuredServices.length) return;
    const interval = setInterval(() => {
      setServiceIndex((prev) => {
        const next = (prev + 1) % featuredServices.length;
        serviceRef.current?.scrollToOffset({
          offset: next * 180,
          animated: true,
        });
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [featuredServices.length]);

  const renderService = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.cardWrapper}>
        <ServiceCard
          service={item}
          onPress={() => navigation.push("ServiceDetail", { id: item.id })}
        />
      </View>
    ),
    [navigation]
  );

  const onServiceScroll = useCallback((e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / 180);
    setServiceIndex(index);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <View style={styles.hero}>
          <HeroHeader
            logo={require("../assets/manasa_logo.png")}
            studio={ownerDetails.studio}
            location={ownerDetails.location}
          />
        </View>
        {/* EXCLUSIVE OFFERS */}
        {memoOffers && memoOffers.length > 0 && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Exclusive Offers</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.offersList}
            >
              {memoOffers.map((o: any) => (
                <OfferCard
                  key={o.id}
                  offer={o}
                  onPress={() => navigation.push("OfferDetails", { id: o.id })}
                />
              ))}
            </ScrollView>
          </>
        )}
        {/* FEATURED SERVICES */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Featured Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Services")}>
            <Text style={styles.seeAll}>View all</Text>
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
          onScroll={onServiceScroll}
        />
        <CarouselDots count={featuredServices.length} active={serviceIndex} />

        {/* ABOUT OWNER */}
        <SectionHeader title="About the Artist" />
        <View style={styles.ownerCard}>
          <Image
            source={{ uri: ownerDetails.photo }}
            style={styles.ownerImage}
          />
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

        {/* REVIEWS */}
        <SectionHeader title="Customer Reviews" />

        <ScrollView
          ref={reviewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.feedbackList}
          onScroll={onReviewScroll}
          scrollEventThrottle={16}
        >
          {feedbacks.map((f) => (
            <View key={f.id} style={styles.feedbackCard}>
              <Text style={styles.feedbackText}>"{f.text}"</Text>
              <Text style={styles.feedbackName}>– {f.name}</Text>
            </View>
          ))}
        </ScrollView>

        <CarouselDots count={feedbacks.length} active={reviewIndex} />

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

const SectionHeader = React.memo(function SectionHeader({ title }: any) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
});

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF0F5" },
  container: { flex: 1 },

  hero: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#FFF0F5",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  heroActions: { flexDirection: "row", marginTop: 16, gap: 12 },

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

  offersList: { paddingLeft: 16, paddingRight: 8, marginBottom: 8 },

  horizontalList: { paddingLeft: 8, paddingRight: 16 },
  cardWrapper: { width: 180 },

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
