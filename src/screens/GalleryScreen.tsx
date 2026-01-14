import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

import { colors } from '../theme';
import { fetchpreviousWorkMedia } from '../mock/api';

type MediaItem = {
  id: string;
  type: 'image' | 'video';
  url: string;
};

/* ---------------- CARD COMPONENT ---------------- */

const GalleryCard = ({ item }: { item: MediaItem }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.inner}>
        {item.type === 'image' ? (
          <Image source={{ uri: item.url }} style={styles.media} />
        ) : (
          <View style={[styles.media, styles.videoPlaceholder]}>
            <Text style={styles.videoText}>🎬 Video</Text>
          </View>
        )}
      </View>
    </Card>
  );
};

/* ---------------- SCREEN ---------------- */

export default function GalleryScreen() {
  const [media, setMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    const loadMedia = async () => {
      const data = await fetchpreviousWorkMedia();
      setMedia(data);
    };
    loadMedia();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MediaItem }) => <GalleryCard item={item} />,
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={media}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },

  list: {
    paddingBottom: 16,
    paddingHorizontal: 8,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 4,
    flex: 1,
    margin: 8,
  },

  inner: {
    borderRadius: 16,
    overflow: 'hidden',
  },

  media: {
    backgroundColor: colors.placeholder,
    height: 180,
    width: '100%',
  },

  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  videoText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
