import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  image: any;
};

export default function MapImageCard({ image }: Props) {
  const openMaps = () => {
    Linking.openURL("https://maps.app.goo.gl/FCCi1bsaCp5yQNi77");
  };

  return (
    <TouchableOpacity onPress={openMaps} activeOpacity={0.9}>
      <View style={styles.card}>
        <Image source={image} style={styles.image} />

        <View style={styles.overlay}>
          <Ionicons name="navigate-outline" size={20} color="#fff" />
          <Text style={styles.text}>Get Directions</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 180,
  },
  overlay: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "#E91E63",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
