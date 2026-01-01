import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { Card } from "react-native-paper";

const mockMedia = [
  { id: "1", type: "image", uri: "https://picsum.photos/seed/hair/400" },
  { id: "2", type: "image", uri: "https://picsum.photos/seed/hair/401" },
  {
    id: "3",
    type: "video",
    uri: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  },
];

export default function GalleryScreen() {
  const renderItem = ({ item }: { item: (typeof mockMedia)[0] }) => {
    return (
      <Card style={styles.card}>
        {/* CLIPPING CONTAINER (same pattern as ServiceCard) */}
        <View style={styles.inner}>
          {item.type === "image" ? (
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
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  list: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },

  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#fff",
  },

  inner: {
    borderRadius: 16,
    overflow: "hidden", // avoids shadow warning
  },

  /* Taller portrait-style media */
  media: {
    height: 180,        // same feel as ServiceCard image
    width: "100%",
    backgroundColor: "#eee",
  },

  videoPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },

  videoText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "600",
  },
});
