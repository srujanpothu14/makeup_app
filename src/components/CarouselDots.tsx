import React from "react";
import { View, StyleSheet } from "react-native";

export default React.memo(function CarouselDots({
  count,
  active,
}: {
  count: number;
  active: number;
}) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i === active && styles.active]} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  active: { backgroundColor: "#E91E63", width: 18 },
});
