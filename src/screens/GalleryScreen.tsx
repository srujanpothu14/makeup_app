import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

import { colors } from '../theme';

const mockMedia = [
  { id: '1', type: 'image', uri: 'https://picsum.photos/seed/hair/400' },
  { id: '2', type: 'image', uri: 'https://picsum.photos/seed/hair/401' },
  {
    id: '3',
    type: 'video',
    uri: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
  },
];

export default function GalleryScreen() {
  const renderItem = ({ item }: { item: (typeof mockMedia)[0] }) => {
    return (
      <Card style={styles.card}>
        {/* CLIPPING CONTAINER (same pattern as ServiceCard) */}
        <View style={styles.inner}>
          {item.type === 'image' ? (
            <Image source={{ uri: item.uri }} style={styles.media} />
          ) : (
            <View style={[styles.media, styles.videoPlaceholder]}>
              <Text style={styles.videoText}>Video</Text>
            </View>
          )}
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockMedia}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 4,
    flex: 1,
    margin: 8,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  inner: {
    borderRadius: 16,
    overflow: 'hidden', // avoids shadow warning
  },
  list: {
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  /* Taller portrait-style media */
  media: {
    backgroundColor: colors.placeholder,
    height: 180, // same feel as ServiceCard image
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
