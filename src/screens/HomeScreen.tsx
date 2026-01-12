import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Platform,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import MapCard from '../components/MapsLocationCard';
import ServiceCard from '../components/ServiceCard';
import OfferCard from '../components/OfferCard';
import CarouselDots from '../components/CarouselDots';
import HeroHeader from '../components/HeroHeader';
import InfoRow from '../components/InfoRow';
import { seedServices, offers } from '../mock/data';
import { colors } from '../theme';
import logo from '../assets/manasa_logo.png';
import locationImg from '../assets/location.png';

/* -------------------- TYPES -------------------- */

type RootStackParamList = {
  ServiceDetail: { id: string };
  OfferDetails: { id: string };
  Services: undefined;
  Booking: undefined;
};

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

/* -------------------- DATA -------------------- */

const ownerDetails = {
  name: 'Manasa',
  studio: 'Manasa Beauty & Makeup Studio',
  location: 'Korutla, Telangana',
  phone: '+91 96421 66712',
  instagram: 'https://www.instagram.com/manasa_makeovers_korutla?igsh=enR0ZGI4MHl3a25l',
  whatsapp: 'https://wa.me/919642166712?text=Hi',
  bio: 'Certified professional makeup artist with 6+ years of experience in bridal, party, and fashion makeup. Known for elegant, long-lasting looks.',
  photo: 'https://picsum.photos/seed/owner/400',
};

const feedbacks = [
  { id: 'f1', name: 'Aishwarya', text: 'Absolutely loved my bridal makeup!' },
  { id: 'f2', name: 'Sneha', text: 'Great service, very friendly artist.' },
  { id: 'f3', name: 'Pooja', text: 'Best makeup studio in Hyderabad!' },
];

/* -------------------- MAP FUNCTION -------------------- */

const openMaps = () => {
  const latitude = 18.8247202;
  const longitude = 78.7030454;
  const name = 'Manasa Makeup Studio & Beauty Zone';

  const url =
    Platform.OS === 'ios'
      ? `maps:0,0?q=${name}@${latitude},${longitude}`
      : `geo:0,0?q=${latitude},${longitude}(${name})`;

  Linking.openURL(url);
};

/* -------------------- SCREEN -------------------- */

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [reviewIndex, setReviewIndex] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);

  const featuredServices = useMemo<Service[]>(
    () => seedServices.filter(s => ['s1', 's2', 's3', 's4'].includes(s.id)),
    [],
  );

  const memoOffers = useMemo<Offer[]>(() => offers, []);

  const reviewRef = useRef<ScrollView>(null);
  const serviceRef = useRef<FlashList<Service>>(null);

  /* AUTO SLIDE REVIEWS */
  useEffect(() => {
    if (!feedbacks.length) return;
    const interval = setInterval(() => {
      setReviewIndex(prev => {
        const next = (prev + 1) % feedbacks.length;
        reviewRef.current?.scrollTo({ x: next * 220, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const onReviewScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / 220);
    setReviewIndex(index);
  }, []);

  /* AUTO SLIDE SERVICES */
  useEffect(() => {
    if (!featuredServices.length) return;
    const interval = setInterval(() => {
      setServiceIndex(prev => {
        const next = (prev + 1) % featuredServices.length;
        serviceRef.current?.scrollToOffset({
          offset: next * 200,
          animated: true,
        });
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [featuredServices.length]);

  const renderService = useCallback(
    ({ item }: { item: Service }) => (
      <View style={styles.cardWrapper}>
        <ServiceCard
          service={item}
          onPress={() => navigation.push('ServiceDetail', { id: item.id })}
        />
      </View>
    ),
    [navigation],
  );

  const onServiceScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / 180);
    setServiceIndex(index);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <HeroHeader logo={logo} studio={ownerDetails.studio} location={ownerDetails.location} />
        </View>

        {/* OFFERS */}
        {memoOffers.length > 0 && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Exclusive Offers</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.offersList}
            >
              {memoOffers.map(o => (
                <OfferCard
                  key={o.id}
                  offer={o}
                  onPress={() => navigation.push('OfferDetails', { id: o.id })}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* FEATURED SERVICES */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Featured Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Services')}>
            <Text style={styles.seeAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <FlashList
          ref={serviceRef}
          data={featuredServices}
          renderItem={renderService}
          keyExtractor={item => item.id}
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
          <Image source={{ uri: ownerDetails.photo }} style={styles.ownerImage} />
          <View style={styles.ownerTextWrap}>
            <Text style={styles.ownerName}>{ownerDetails.name}</Text>
            <Text style={styles.ownerBio}>{ownerDetails.bio}</Text>
          </View>
        </View>

        {/* LOCATION */}
        <View style={styles.infoCard}>
          <TouchableOpacity onPress={openMaps} activeOpacity={0.9}>
            <MapCard image={locationImg} />
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
          {feedbacks.map(f => (
            <View key={f.id} style={styles.feedbackCard}>
              <Text style={styles.feedbackText}>{f.text}</Text>
              <Text style={styles.feedbackName}>– {f.name}</Text>
            </View>
          ))}
        </ScrollView>

        <CarouselDots count={feedbacks.length} active={reviewIndex} />

        {/* BOOKING CTA */}
        <View style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>Ready to Glow?</Text>
          <Text style={styles.bookingText}>Book your beauty session with Manasa today.</Text>
          <TouchableOpacity
            style={styles.bookingBtn}
            onPress={() => navigation.navigate('Booking')}
          >
            <Text style={styles.bookingBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        {/* INSTAGRAM CTA */}
        <TouchableOpacity
          style={styles.instagramCard}
          onPress={() => Linking.openURL(ownerDetails.instagram)}
        >
          <Ionicons name="logo-instagram" size={26} color={colors.primary} />
          <Text style={styles.instagramText}>Follow us on Instagram for latest looks</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const SectionHeader = React.memo(({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
));

SectionHeader.displayName = 'SectionHeader';

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  bookingBtn: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  bookingBtnText: { color: colors.white, fontWeight: '600' },
  bookingCard: {
    alignItems: 'center',
    backgroundColor: colors.backgroundSoft,
    borderRadius: 16,
    margin: 16,
    padding: 20,
  },

  bookingText: { color: colors.text, marginBottom: 12, textAlign: 'center' },

  bookingTitle: { fontFamily: 'RalewayBold', fontSize: 20, marginBottom: 6 },

  cardWrapper: { width: 200 },

  container: { backgroundColor: colors.backgroundSoft, flex: 1 },
  feedbackCard: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: 14,
    marginRight: 12,
    padding: 14,
    width: 220,
  },

  feedbackList: { paddingLeft: 16, paddingRight: 8 },
  feedbackName: { color: colors.primary, fontSize: 12, fontWeight: '600' },

  feedbackText: { color: colors.subdued, fontSize: 14, marginBottom: 6 },

  hero: { backgroundColor: colors.backgroundSoft, paddingHorizontal: 20, paddingTop: 15 },

  horizontalList: { paddingLeft: 8, paddingRight: 16 },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 4,
    margin: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  instagramCard: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 12,
    marginHorizontal: 16,
    padding: 16,
  },
  instagramText: { color: colors.primary, fontWeight: '600' },

  offersList: { marginBottom: 8, paddingLeft: 16, paddingRight: 8 },

  ownerBio: { color: colors.text, fontSize: 13, marginTop: 4 },
  ownerCard: {
    alignItems: 'center',
    backgroundColor: colors.backgroundSoft,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    padding: 16,
  },
  ownerImage: { borderRadius: 40, height: 80, width: 80 },
  ownerName: { fontFamily: 'RalewayBold', fontSize: 18 },

  ownerTextWrap: { flex: 1 },
  safe: { backgroundColor: colors.white, flex: 1 },
  scrollContent: { paddingBottom: 12 },
  sectionHeader: { marginBottom: 8, marginTop: 16, paddingHorizontal: 16 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 16,
  },

  sectionTitle: { fontFamily: 'RalewayBold', fontSize: 18 },
  seeAll: { color: colors.primary, fontSize: 14 },
});
