import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import ServiceCard from "../components/ServiceCard";
import OfferCard from "../components/OfferCard";
import CarouselDots from "../components/CarouselDots";
import HeroHeader from "../components/HeroHeader";
import { seedServices, offers } from "../mock/data";
import { fetchpreviousWorkMedia, fetchFeedbacks } from "../mock/api";
import { colors } from "../theme";
import logo from "../assets/manasa_logo.png";
import locationImg from "../assets/location.png";

const { width } = Dimensions.get("window");
const OFFER_CARD_WIDTH = width - 32;

/* -------------------- TYPES -------------------- */

type Service = {
  id: string;
  title: string;
  category: string;
  durationMin: number;
  price: number;
  thumbnailUrl?: string;
};

type Offer = {
  id: string;
  title: string;
};

type MediaItem = {
  id: string;
  url: string;
  type: "image" | "video";
};

type Feedback = {
  id: string;
  name: string;
  text: string;
};

type OwnerDetails = {
  name: string;
  studio: string;
  designation: string;
  location: string;
  locationUrl: string;
  phone: string;
  instagram: string;
  whatsapp: string;
  bio: string;
  facebook: string;
  photo: string;
};

/* -------------------- DATA -------------------- */

const ownerDetails: OwnerDetails = {
  name: "Manasa",
  studio: "Manasa Makeup Studio\nAnd Beauty Zone",
  designation: "Professional Makeup Artist",
  location: "Korutla, Telangana",
  locationUrl: "https://maps.app.goo.gl/5VM2qV599jiPovEj8?g_st=iw",
  phone: "9642166712",
  instagram:
    "https://www.instagram.com/manasa_makeovers_korutla?igsh=enR0ZGI4MHl3a25l",
  whatsapp: "https://wa.me/919642166712?text=Hi",
  bio: "Certified professional makeup artist with 6+ years of experience.",
  facebook: "https://www.facebook.com/share/1b1vQoV78G/?mibextid=wwXIfr",
  photo: "https://maps.app.goo.gl/TJ7cExHcMTJmixDc9",
};

const WHY_CHOOSE_ITEMS = [
  { icon: "💄", text: "6+ Years Experience" },
  { icon: "🏆", text: "Certified Artist" },
  { icon: "👰", text: "500+ Happy Brides" },
  { icon: "✨", text: "Premium Products" },
];

const OffersCarousel = React.memo(function OffersCarousel({
  offersData,
  activeIndex,
  onMomentumEnd,
  onPressOffer,
}: {
  offersData: Offer[];
  activeIndex: number;
  onMomentumEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onPressOffer: (id: string) => void;
}) {
  return (
    <>
      <SectionHeader title="Exclusive Offers" />
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
      >
        {offersData.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onPress={() => onPressOffer(offer.id)}
          />
        ))}
      </ScrollView>
      <CarouselDots count={offersData.length} active={activeIndex} />
    </>
  );
});

const ServicesCarousel = React.memo(function ServicesCarousel({
  slides,
  services,
  activeIndex,
  onMomentumEnd,
  onPressService,
  onViewAll,
}: {
  slides: number;
  services: Service[];
  activeIndex: number;
  onMomentumEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onPressService: (id: string) => void;
  onViewAll: () => void;
}) {
  return (
    <>
      <SectionHeader
        title="Featured Services"
        actionLabel="View all"
        onActionPress={onViewAll}
      />
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
      >
        {Array.from({ length: slides }).map((_, i) => {
          const first = services[i * 2];
          const second = services[i * 2 + 1];

          return (
            <View key={i} style={styles.servicePage}>
              {first && (
                <ServiceCard
                  service={first}
                  onPress={() => onPressService(first.id)}
                  onBook={() => onPressService(first.id)}
                />
              )}
              {second && (
                <ServiceCard
                  service={second}
                  onPress={() => onPressService(second.id)}
                  onBook={() => onPressService(second.id)}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
      <CarouselDots count={slides} active={activeIndex} />
    </>
  );
});

const GalleryCarousel = React.memo(function GalleryCarousel({
  slides,
  items,
  activeIndex,
  onMomentumEnd,
  onSelect,
  onViewAll,
}: {
  slides: number;
  items: MediaItem[];
  activeIndex: number;
  onMomentumEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onSelect: (item: MediaItem) => void;
  onViewAll: () => void;
}) {
  return (
    <>
      <SectionHeader
        title="Our Work"
        actionLabel="View all"
        onActionPress={onViewAll}
      />
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
      >
        {Array.from({ length: slides }).map((_, i) => {
          const first = items[i * 2];
          const second = items[i * 2 + 1];

          return (
            <View key={i} style={styles.galleryPage}>
              {[first, second].map(
                (item) =>
                  item && (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.galleryGridItem}
                      onPress={() => onSelect(item)}
                    >
                      <Image
                        source={{ uri: item.url }}
                        style={styles.galleryImage}
                      />
                    </TouchableOpacity>
                  ),
              )}
            </View>
          );
        })}
      </ScrollView>
      <CarouselDots count={slides} active={activeIndex} />
    </>
  );
});

const ReviewsCarousel = React.memo(function ReviewsCarousel({
  slides,
  items,
  activeIndex,
  onMomentumEnd,
}: {
  slides: number;
  items: Feedback[];
  activeIndex: number;
  onMomentumEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  return (
    <>
      <SectionHeader title="Customer Reviews" />
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
      >
        {Array.from({ length: slides }).map((_, i) => {
          const first = items[i * 2];
          const second = items[i * 2 + 1];

          return (
            <View key={i} style={styles.reviewPage}>
              {[first, second].map(
                (f) =>
                  f && (
                    <View key={f.id} style={styles.feedbackCard}>
                      <Text style={styles.feedbackText}>{f.text}</Text>
                      <Text style={styles.feedbackName}>– {f.name}</Text>
                    </View>
                  ),
              )}
            </View>
          );
        })}
      </ScrollView>
      <CarouselDots count={slides} active={activeIndex} />
    </>
  );
});

const WhyChooseSection = React.memo(function WhyChooseSection() {
  return (
    <>
      <SectionHeader title="Why Choose Us" />
      <View style={styles.whyChooseGrid}>
        {WHY_CHOOSE_ITEMS.map((item, i) => (
          <View key={i} style={styles.whyChooseItem}>
            <Text style={styles.whyIcon}>{item.icon}</Text>
            <Text style={styles.whyText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </>
  );
});

const BookingCta = React.memo(function BookingCta({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <View style={styles.bookingCard}>
      <Text style={styles.bookingTitle}>Ready to Glow?</Text>
      <TouchableOpacity style={styles.bookingBtn} onPress={onPress}>
        <Text style={styles.bookingBtnText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
});

const AboutSection = React.memo(function AboutSection({
  owner,
}: {
  owner: OwnerDetails;
}) {
  return (
    <>
      <SectionHeader title="About Us" />
      <View style={styles.artistCard}>
        <Image source={{ uri: owner.photo }} style={styles.artistImage} />

        <View style={styles.artistInfo}>
          <Text style={styles.artistName}>{owner.name}</Text>
          <Text style={styles.artistStudio}>{owner.designation}</Text>
          <Text style={styles.artistBio}>{owner.bio}</Text>
        </View>
      </View>
    </>
  );
});

const SocialSection = React.memo(function SocialSection({
  owner,
}: {
  owner: OwnerDetails;
}) {
  return (
    <View style={styles.socialCard}>
      <TouchableOpacity
        style={styles.socialIconBtn}
        onPress={() => Linking.openURL(`tel:${owner.phone}`)}
      >
        <Ionicons name="call-outline" size={22} color={colors.primary} />
        <Text style={styles.socialLabel}>Call</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialIconBtn}
        onPress={() => Linking.openURL(owner.whatsapp)}
      >
        <Ionicons name="logo-whatsapp" size={22} color={colors.primary} />
        <Text style={styles.socialLabel}>WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialIconBtn}
        onPress={() => Linking.openURL(owner.instagram)}
      >
        <Ionicons name="logo-instagram" size={22} color={colors.primary} />
        <Text style={styles.socialLabel}>Instagram</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialIconBtn}
        onPress={() => Linking.openURL(owner.facebook)}
      >
        <Ionicons name="logo-facebook" size={22} color={colors.primary} />
        <Text style={styles.socialLabel}>Facebook</Text>
      </TouchableOpacity>
    </View>
  );
});

const StudioDetailsSection = React.memo(function StudioDetailsSection({
  owner,
  onOpenMap,
}: {
  owner: OwnerDetails;
  onOpenMap: () => void;
}) {
  return (
    <>
      <Text style={styles.aboutSubTitle}>Studio Details</Text>
      <View style={styles.studioCard}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>{owner.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>Mon – Sun | 9 AM – 8 PM</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="car-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>Parking Available</Text>
        </View>
        <TouchableOpacity style={styles.mapPreviewCard} onPress={onOpenMap}>
          <Image source={locationImg} style={styles.mapImage} />

          <View style={styles.mapOverlay}>
            <Ionicons name="location-outline" size={18} color="white" />
            <Text style={styles.mapOverlayText}>View on Map</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
});

/* -------------------- UTILS -------------------- */

const SectionHeader = React.memo(function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onActionPress && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.seeAll}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const createScrollHandler =
  (itemWidth: number, setIndex: (index: number) => void) =>
  (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
    setIndex(index);
  };

/* -------------------- SCREEN -------------------- */

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
    return unsubscribe;
  }, [navigation]);

  const [offerIndex, setOfferIndex] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  const [galleryPreview, setGalleryPreview] = useState<MediaItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const featuredServices = useMemo<Service[]>(
    () => seedServices.filter((s) => ["s1", "s2", "s3", "s4"].includes(s.id)),
    [],
  );

  const memoOffers = useMemo<Offer[]>(() => offers, []);

  const serviceSlides = Math.ceil(featuredServices.length / 2);
  const gallerySlides = Math.ceil(galleryPreview.length / 2);
  const reviewSlides = Math.ceil(feedbacks.length / 2);

  useEffect(() => {
    const loadData = async () => {
      const [gallery, reviews] = await Promise.all([
        fetchpreviousWorkMedia(),
        fetchFeedbacks(),
      ]);
      setGalleryPreview(gallery.slice(0, 6));
      setFeedbacks(reviews);
    };
    loadData();
  }, []);

  const handleOfferScroll = useMemo(
    () => createScrollHandler(OFFER_CARD_WIDTH, setOfferIndex),
    [],
  );

  const handleServiceScroll = useMemo(
    () => createScrollHandler(width, setServiceIndex),
    [],
  );

  const handleGalleryScroll = useMemo(
    () => createScrollHandler(width, setGalleryIndex),
    [],
  );

  const handleReviewScroll = useMemo(
    () => createScrollHandler(width, setReviewIndex),
    [],
  );

  const handleOpenOffer = useCallback(
    (offerId: string) => navigation.navigate("OfferDetails", { id: offerId }),
    [navigation],
  );

  const handleOpenService = useCallback(
    (serviceId: string) =>
      navigation.navigate("ServiceDetail", { id: serviceId }),
    [navigation],
  );

  const handleViewAllServices = useCallback(
    () => navigation.navigate("Services"),
    [navigation],
  );

  const handleViewAllGallery = useCallback(
    () => navigation.navigate("Gallery"),
    [navigation],
  );

  const handleBookNow = useCallback(
    () => navigation.navigate("Booking"),
    [navigation],
  );

  const handleOpenMap = useCallback(
    () => Linking.openURL(ownerDetails.locationUrl),
    [],
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView ref={scrollRef} style={styles.container}>
        <HeroHeader logo={logo} studio={ownerDetails.studio} />

        <OffersCarousel
          offersData={memoOffers}
          activeIndex={offerIndex}
          onMomentumEnd={handleOfferScroll}
          onPressOffer={handleOpenOffer}
        />

        <ServicesCarousel
          slides={serviceSlides}
          services={featuredServices}
          activeIndex={serviceIndex}
          onMomentumEnd={handleServiceScroll}
          onPressService={handleOpenService}
          onViewAll={handleViewAllServices}
        />

        <GalleryCarousel
          slides={gallerySlides}
          items={galleryPreview}
          activeIndex={galleryIndex}
          onMomentumEnd={handleGalleryScroll}
          onSelect={setSelectedItem}
          onViewAll={handleViewAllGallery}
        />

        <ReviewsCarousel
          slides={reviewSlides}
          items={feedbacks}
          activeIndex={reviewIndex}
          onMomentumEnd={handleReviewScroll}
        />

        <WhyChooseSection />

        <BookingCta onPress={handleBookNow} />

        <AboutSection owner={ownerDetails} />

        <SocialSection owner={ownerDetails} />

        <StudioDetailsSection owner={ownerDetails} onOpenMap={handleOpenMap} />
      </ScrollView>

      {/* FULLSCREEN IMAGE */}
      <Modal visible={!!selectedItem} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSelectedItem(null)}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {selectedItem && (
            <Image
              source={{ uri: selectedItem.url }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { backgroundColor: colors.backgroundSoft, flex: 1 },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
  },

  sectionTitle: { fontFamily: "RalewayBold", fontSize: 18 },
  seeAll: { color: colors.primary },

  servicePage: {
    width,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },

  galleryPage: {
    width,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 8,
  },

  reviewPage: {
    width,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  galleryGridItem: {
    width: (width - 48) / 2,
    borderRadius: 16,
    overflow: "hidden",
  },

  galleryImage: {
    width: "100%",
    height: 280,
    borderRadius: 16,
  },

  feedbackCard: {
    width: (width - 48) / 2,
    padding: 14,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    marginVertical: 8,
  },

  feedbackText: { color: colors.subdued },

  feedbackName: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 13,
    textAlign: "right",
  },

  whyChooseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
  },

  whyChooseItem: {
    width: "48%",
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },

  whyIcon: {
    fontSize: 28,
    marginBottom: 6,
  },

  whyText: {
    fontWeight: "600",
    textAlign: "center",
  },

  bookingCard: {
    alignItems: "center",
    backgroundColor: colors.backgroundSoft,
    borderRadius: 16,
    margin: 16,
    padding: 20,
  },

  bookingTitle: {
    fontFamily: "RalewayBold",
    fontSize: 20,
    marginBottom: 10,
  },

  bookingBtn: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },

  bookingBtnText: { color: colors.white, fontWeight: "600" },

  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },

  fullscreenImage: {
    width: "100%",
    height: "100%",
  },

  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },

  closeText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  aboutSubTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 16,
  },

  artistCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 20,
    margin: 16,
    padding: 16,
    alignItems: "center",
    elevation: 2,
  },

  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
    backgroundColor: colors.placeholder,
  },

  artistInfo: {
    flex: 1,
  },

  artistName: {
    fontSize: 18,
    fontWeight: "700",
  },

  artistStudio: {
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 6,
  },

  artistBio: {
    fontSize: 13,
    color: colors.subdued,
  },

  studioCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    margin: 16,
    padding: 16,
    elevation: 2,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  infoText: {
    marginLeft: 10,
    color: colors.text,
  },

  socialCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 14,
    elevation: 2,
  },

  socialIconBtn: {
    alignItems: "center",
    justifyContent: "center",
  },

  socialLabel: {
    fontSize: 12,
    marginTop: 4,
    color: colors.subdued,
    fontWeight: "500",
  },

  mapPreviewCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,
  },

  mapImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
    backgroundColor: colors.placeholder,
  },

  mapOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  mapOverlayText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
