import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export default function HeroHeader({
  logo,
  studio,
  location,
}: {
  logo: any;
  studio: string;
  location?: string;
}) {
  return (
    <View style={styles.row}>
      <Image source={logo} style={styles.logo} />
      <View style={styles.textWrap}>
        <Text style={styles.title}>{studio}</Text>
        {location ? <Text style={styles.location}>{location}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 70, height: 70, resizeMode: "contain" },
  textWrap: { flex: 1 },
  title: { fontSize: 28, fontFamily: "RalewayBold" },
  location: { fontSize: 13, color: "#888", marginTop: 4 },
});
