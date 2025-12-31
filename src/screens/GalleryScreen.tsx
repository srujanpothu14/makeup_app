import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";

const mockMedia = [
  { id: "1", type: "image", uri: "https://via.placeholder.com/150" },
  { id: "2", type: "image", uri: "https://via.placeholder.com/200" },
  {
    id: "3",
    type: "video",
    uri: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  },
];

export default function GalleryScreen() {
  const renderItem = ({ item }: { item: (typeof mockMedia)[0] }) => {
    if (item.type === "image") {
      return <Image source={{ uri: item.uri }} style={styles.media} />;
    }
    if (item.type === "video") {
      return (
        <View style={styles.media}>
          <Text style={styles.videoPlaceholder}>Video Placeholder</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockMedia}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  media: {
    width: "48%",
    height: 150,
    margin: "1%",
    backgroundColor: "#eee",
  },
  videoPlaceholder: {
    textAlign: "center",
    lineHeight: 150,
    color: "#555",
  },
});
