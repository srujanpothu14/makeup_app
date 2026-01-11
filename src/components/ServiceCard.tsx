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
              labelStyle={styles.buttonLabel}
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
    borderRadius: 20,
    backgroundColor: "#ffffff",
    elevation: 6,
    shadowRadius: 6,
    shadowOpacity: 0.5,
    shadowColor: "#ecb3c6",
  },

  inner: {
    borderRadius: 20,
    overflow: "hidden",
  },

  /* Taller image */
  image: {
    height: 180,
  },

  content: {
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#ffffff",
  },

  title: {
    fontWeight: "700",
    fontSize: 15,
    color: "#B0004D",
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 12,
    color: "#C96A8A",
    marginBottom: 10,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  price: {
    fontSize: 17,
    fontWeight: "800",
    color: "#E91E63",
  },

  button: {
    borderRadius: 22,
    backgroundColor: "#E91E63",
  },

  buttonLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
});

export default ServiceCard;
