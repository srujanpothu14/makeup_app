import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../theme";
import { fetchpreviousWorkMedia } from "../mock/api";

type MediaItem = {
  id: string;
  type: "image" | "video";
  url: string;
};

/* ---------------- CARD ---------------- */

const GalleryCard = React.memo(function GalleryCard({
  item,
  onPress,
}: {
  item: MediaItem;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {item.type === "image" ? (
        <Image source={{ uri: item.url }} style={styles.media} />
      ) : (
        <View style={[styles.media, styles.videoPlaceholder]}>
          <Text style={styles.videoText}>🎬 Video</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

/* ---------------- SCREEN ---------------- */

export default function GalleryScreen() {
  const navigation = useNavigation<any>();
  const listRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", () => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });

    return unsubscribe;
  }, [navigation]);

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    const loadMedia = async () => {
      const data = await fetchpreviousWorkMedia();
      setMedia(data);
    };
    loadMedia();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MediaItem }) => (
      <GalleryCard item={item} onPress={() => setSelectedItem(item)} />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        ref={listRef}
        data={media}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
      />

      {/* FULLSCREEN VIEWER */}
      <Modal
        visible={!!selectedItem}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" />

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSelectedItem(null)}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {selectedItem?.type === "image" ? (
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
    padding: 8,
  },

  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.placeholder,
    elevation: 3,
  },

  media: {
    height: 180,
    width: "100%",
  },

  videoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.placeholder,
  },

  videoText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  /* MODAL */

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

  fullscreenVideo: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
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
});
