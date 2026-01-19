import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

/* -------------------- TYPES -------------------- */

type Props = {
  logo: ImageSourcePropType;
  studio: string;
};

/* -------------------- COMPONENT -------------------- */

const HeroHeader = React.memo(function HeroHeader({ logo, studio }: Props) {
  const lines = studio.split("\n");

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={logo} style={styles.logo} />

        <View style={styles.textWrap}>
          {lines.map((line, index) => (
            <Text key={`${line}-${index}`} style={styles.title}>
              {line}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
});

export default HeroHeader;

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },

  logo: {
    height: 70,
    resizeMode: "contain",
    width: 70,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  textWrap: {
    alignItems: "flex-start",
  },

  title: {
    fontFamily: "RalewayBold",
    fontSize: 26,
    lineHeight: 30,
  },
});
