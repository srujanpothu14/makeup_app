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
const ServiceCard = ({ service, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      {/* CLIPPING CONTAINER */}
      <View style={styles.inner}>
        <Card.Cover
          source={{
            uri: service.thumbnailUrl ?? "https://picsum.photos/300",
          }}
          style={styles.image}
        />

        <Card.Content style={styles.content}>
          <Text numberOfLines={1} style={styles.title}>
            {service.title}
          </Text>

          <Text numberOfLines={1} style={styles.subtitle}>
            {service.category} • {service.durationMin} mins
          </Text>

          <Text style={styles.price}>₹{service.price}</Text>

          <Button
            mode="contained"
            compact
            onPress={onPress}
            style={styles.button}
          >
            Book
          </Button>
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
    elevation: 4,     // shadow stays here
    backgroundColor: "#fff",
  },
  inner: {
    borderRadius: 16,
    overflow: "hidden", // clipping moved HERE
  },
  image: {
    height: 120,
  },
  content: {
    paddingTop: 8,
  },
  title: {
    fontWeight: "700",
    fontSize: 14,
  },
  subtitle: {
    fontSize: 12,
    color: "#777",
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E91E63",
    marginBottom: 6,
  },
  button: {
    borderRadius: 20,
    alignSelf: "flex-start",
  },
});
export default ServiceCard;