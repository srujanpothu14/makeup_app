import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-paper";

type Service = {
  id: string;
  title: string;
  category: string;
  durationMin: number;
  price: number;
  thumbnailUrl?: string;
};

type Props = {
  service: Service;
  onPress: () => void;
};

const ServiceCard: React.FC<Props> = ({ service, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      {/* CLIPPING CONTAINER */}
      <View style={styles.inner}>
        {/* IMAGE */}
        <Card.Cover
          source={{
            uri: service.thumbnailUrl ?? "https://picsum.photos/300",
          }}
          style={styles.image}
        />

        {/* CONTENT */}
        <Card.Content style={styles.content}>
          <Text numberOfLines={1} style={styles.title}>
            {service.title}
          </Text>

          <Text numberOfLines={1} style={styles.subtitle}>
            {service.category} • {service.durationMin} mins
          </Text>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.price}>₹{service.price}</Text>

            <Button
              mode="contained"
              compact
              onPress={onPress}
              style={styles.button}
            >
              Book
            </Button>
          </View>
        </Card.Content>
      </View>
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#fff",
  },
  inner: {
    borderRadius: 16,
    overflow: "hidden",
  },

  /* Taller image for vertical look */
  image: {
    height: 180,          // ⬆️ taller than wide cards
  },

  content: {
    paddingTop: 8,
    paddingBottom: 12,
    flexGrow: 1,          // ⬅️ allows footer to stick bottom
  },

  title: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#777",
    marginBottom: 8,
  },

  /* Bottom row */
  footer: {
    marginTop: "auto",    // ⬅️ pushes to bottom
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E91E63",
  },

  button: {
    borderRadius: 20,
  },
});

export default ServiceCard;
