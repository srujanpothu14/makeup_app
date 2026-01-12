import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Platform,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

/* -------------------- CONSTANTS -------------------- */

const { width } = Dimensions.get('window');
const OFFER_CARD_WIDTH = width - 32;
const REVIEW_CARD_WIDTH = 220;
const SERVICE_CARD_WIDTH = (width - 48) / 2;

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
  bio: 'Certified professional makeup artist with 6+ years of experience in bridal, party, and fashion makeup.',
  photo: 'https://picsum.photos/seed/owner/400',
};

const feedbacks = [
  { id: 'f1', name: 'Aishwarya', text: 'Absolutely loved my bridal makeup!' },
  { id: 'f2', name: 'Sneha', text: 'Great service, very friendly artist.' },
  { id: 'f3', name: 'Pooja', text: 'Best makeup studio in Hyderabad!' },
];

/* -------------------- UTILS -------------------- */

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
  const [offerIndex, setOfferIndex] = useState(0);

  const featuredServices = useMemo<Service[]>(
    () => seedServices.filter(s => ['s1', 's2', 's3', 's4'].includes(s.id)),
    [],
  );

  const memoOffers = useMemo<Offer[]>(() => offers, []);

  /* -------------------- SCROLL HANDLERS -------------------- */

  const handleReviewScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / REVIEW_CARD_WIDTH);
    setReviewIndex(index);
  }, []);

  const handleServiceScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SERVICE_CARD_WIDTH);
    setServiceIndex(index);
  }, []);

  const handleOfferScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / OFFER_CARD_WIDTH);
    setOfferIndex(index);
  }, []);

  /* -------------------- UI -------------------- */

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <HeroHeader logo={logo} studio={ownerDetails.studio} />

        {/* OFFERS */}
        <SectionHeader title="Exclusive Offers" />

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleOfferScroll}
          scrollEventThrottle={16}
        >
          {memoOffers.map(offer => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onPress={() => navigation.push('OfferDetails', { id: offer.id })}
            />
          ))}
        </ScrollView>

        <CarouselDots count={memoOffers.length} active={offerIndex} />

        {/* SERVICES */}
        <SectionHeader
          title="Featured Services"
          actionLabel="View all"
          onActionPress={() => navigation.navigate('Services')}
        />

        <FlashList
          data={featuredServices}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={width}
          renderItem={({ item, index }) => {
            if (index % 2 !== 0) return null;

            const second = featuredServices[index + 1];

            return (
              <View style={styles.servicePage}>
                <ServiceCard
                  service={item}
                  onPress={() => navigation.push('ServiceDetail', { id: item.id })}
                />

                {second && (
                  <ServiceCard
                    service={second}
                    onPress={() => navigation.push('ServiceDetail', { id: second.id })}
                  />
                )}
              </View>
            );
          }}
          onScroll={handleServiceScroll}
          scrollEventThrottle={16}
        />

        <CarouselDots count={featuredServices.length} active={serviceIndex} />

        {/* OWNER */}
        <View style={styles.ownerCard}>
          <Image source={{ uri: ownerDetails.photo }} style={styles.ownerImage} />
          <View style={styles.ownerText}>
            <Text style={styles.ownerName}>{ownerDetails.name}</Text>
            <Text style={styles.ownerBio}>{ownerDetails.bio}</Text>
          </View>
        </View>

        {/* LOCATION */}
        <View style={styles.infoCard}>
          <TouchableOpacity onPress={openMaps}>
            <MapCard image={locationImg} />
          </TouchableOpacity>

          <InfoRow icon="call-outline" text={ownerDetails.phone} />
          <InfoRow icon="logo-whatsapp" text="Chat on WhatsApp" />
          <InfoRow icon="logo-instagram" text="Instagram Profile" />
        </View>

        {/* REVIEWS */}
        <SectionHeader title="Customer Reviews" />

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleReviewScroll}
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

        {/* CTA */}
        <View style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>Ready to Glow?</Text>
          <TouchableOpacity
            style={styles.bookingBtn}
            onPress={() => navigation.navigate('Booking')}
          >
            <Text style={styles.bookingBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------- COMPONENTS -------------------- */

const SectionHeader = React.memo(
  ({
    title,
    actionLabel,
    onActionPress,
  }: {
    title: string;
    actionLabel?: string;
    onActionPress?: () => void;
  }) => (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onActionPress && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.seeAll}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  ),
);

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

  bookingTitle: { fontFamily: 'RalewayBold', fontSize: 20, marginBottom: 10 },
  container: { flex: 1 },
  feedbackCard: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: 14,
    marginRight: 12,
    padding: 14,
    width: REVIEW_CARD_WIDTH,
  },

  feedbackName: { color: colors.primary, fontWeight: '600' },
  feedbackText: { color: colors.subdued },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 4,
    margin: 16,
    padding: 16,
  },
  ownerBio: { color: colors.text, fontSize: 13 },
  ownerCard: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    margin: 16,
    padding: 16,
  },

  ownerImage: { borderRadius: 40, height: 80, width: 80 },

  ownerName: { fontFamily: 'RalewayBold', fontSize: 18 },
  ownerText: { flex: 1 },
  safe: { backgroundColor: colors.backgroundSoft, flex: 1 },
  sectionHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: { fontFamily: 'RalewayBold', fontSize: 18 },
  seeAll: { color: colors.primary },
  servicePage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    width,
  },
});
