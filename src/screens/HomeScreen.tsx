import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  Modal,
  StatusBar,
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
import { fetchpreviousWorkMedia, fetchFeedbacks } from '../mock/api';
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
  Gallery: undefined;
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

type MediaItem = {
  id: string;
  url: string;
  type: 'image' | 'video';
};

type Feedback = {
  id: string;
  name: string;
  text: string;
};

/* -------------------- DATA -------------------- */

const ownerDetails = {
  name: 'Manasa',
  studio: 'Manasa Beauty & Makeup Studio',
  location: 'Korutla, Telangana',
  phone: '+91 96421 66712',
  instagram:
    'https://www.instagram.com/manasa_makeovers_korutla?igsh=enR0ZGI4MHl3a25l',
  whatsapp: 'https://wa.me/919642166712?text=Hi',
  bio: 'Certified professional makeup artist with 6+ years of experience in bridal, party, and fashion makeup.',
  photo: 'https://picsum.photos/seed/owner/400',
};

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

const SectionHeader = ({
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
);

/* -------------------- SCREEN -------------------- */

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [reviewIndex, setReviewIndex] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [offerIndex, setOfferIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [galleryPreview, setGalleryPreview] = useState<MediaItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const featuredServices = useMemo<Service[]>(
    () => seedServices.filter(s => ['s1', 's2', 's3', 's4'].includes(s.id)),
    [],
  );

  const memoOffers = useMemo<Offer[]>(() => offers, []);

  useEffect(() => {
    const loadData = async () => {
      const [gallery, reviews] = await Promise.all([
        fetchpreviousWorkMedia(),
        fetchFeedbacks(),
      ]);

      setGalleryPreview(gallery.slice(0, 5));
      setFeedbacks(reviews);
    };

    loadData();
  }, []);

  const createScrollHandler = (itemWidth: number, setIndex: Function) =>
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
      setIndex(index);
    };

  const handleOfferScroll = useCallback(
    createScrollHandler(OFFER_CARD_WIDTH, setOfferIndex),
    [],
  );

  const handleServiceScroll = useCallback(
    createScrollHandler(SERVICE_CARD_WIDTH, setServiceIndex),
    [],
  );

  const handleReviewScroll = useCallback(
    createScrollHandler(REVIEW_CARD_WIDTH, setReviewIndex),
    [],
  );

  const handleGalleryScroll = useCallback(
    createScrollHandler(width, setGalleryIndex),
    [],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <HeroHeader logo={logo} studio={ownerDetails.studio} />

        {/* OFFERS */}
        <SectionHeader title="Exclusive Offers" />

        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onScroll={handleOfferScroll} scrollEventThrottle={16}>
          {memoOffers.map(offer => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onPress={() =>
                navigation.navigate('OfferDetails', { id: offer.id })
              }
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
          renderItem={({ item, index }) => {
            if (index % 2 !== 0) return null;
            const second = featuredServices[index + 1];

            return (
              <View style={styles.servicePage}>
                <ServiceCard
                  service={item}
                  onPress={() =>
                    navigation.navigate('ServiceDetail', { id: item.id })
                  }
                />
                {second && (
                  <ServiceCard
                    service={second}
                    onPress={() =>
                      navigation.navigate('ServiceDetail', { id: second.id })
                    }
                  />
                )}
              </View>
            );
          }}
          onScroll={handleServiceScroll}
          scrollEventThrottle={16}
        />

        <CarouselDots count={featuredServices.length} active={serviceIndex} />

        {/* GALLERY */}
        <SectionHeader
          title="Our Work"
          actionLabel="View all"
          onActionPress={() => navigation.navigate('Gallery')}
        />

        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onScroll={handleGalleryScroll} scrollEventThrottle={16}>
          {galleryPreview.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.galleryItem}
              onPress={() => setSelectedItem(item)}
            >
              {item.type === 'image' ? (
                <Image source={{ uri: item.url }} style={styles.galleryImage} />
              ) : (
                <View style={[styles.galleryImage, styles.videoPlaceholder]}>
                  <Text style={styles.videoText}>🎬 Video</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <CarouselDots count={galleryPreview.length} active={galleryIndex} />

        {/* REVIEWS */}
        <SectionHeader title="Customer Reviews" />

        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onScroll={handleReviewScroll} scrollEventThrottle={16}>
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
            onPress={() => navigation.navigate('Booking')}>
            <Text style={styles.bookingBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FULLSCREEN VIEWER */}
      <Modal visible={!!selectedItem} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" />

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSelectedItem(null)}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {selectedItem?.type === 'image' ? (
            <Image
              source={{ uri: selectedItem.url }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.fullscreenVideo}>
              <Text style={styles.videoText}>🎬 Video Player</Text>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
  },

  sectionTitle: { fontFamily: 'RalewayBold', fontSize: 18 },
  seeAll: { color: colors.primary },

  servicePage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    width,
  },

  galleryItem: { width, paddingHorizontal: 16 },

  galleryImage: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    backgroundColor: colors.placeholder,
  },

  videoPlaceholder: { justifyContent: 'center', alignItems: 'center' },

  videoText: { fontSize: 16, fontWeight: '600', color: colors.text },

  feedbackCard: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: 14,
    marginRight: 12,
    padding: 14,
    width: REVIEW_CARD_WIDTH,
  },

  feedbackText: { color: colors.subdued },
  feedbackName: { color: colors.primary, fontWeight: '600' },

  bookingCard: {
    alignItems: 'center',
    backgroundColor: colors.backgroundSoft,
    borderRadius: 16,
    margin: 16,
    padding: 20,
  },

  bookingTitle: {
    fontFamily: 'RalewayBold',
    fontSize: 20,
    marginBottom: 10,
  },

  bookingBtn: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },

  bookingBtnText: { color: colors.white, fontWeight: '600' },

  /* MODAL */

  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullscreenImage: {
    width: '100%',
    height: '100%',
  },

  fullscreenVideo: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },

  closeText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
