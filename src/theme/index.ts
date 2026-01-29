export const colors = {
  primary: "#E91E63",
  primaryLight: "#FFE3EA",
  accent: "#F8A1C4",
  backgroundSoft: "#FFF0F5",
  white: "#ffffff",
  text: "#333333",
  muted: "#777777",
  subdued: "#555555",
  placeholder: "#eeeeee",
  mutedLight: "#dddddd",
  shadow: "#000000",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
};

export const radii = {
  small: 8,
  medium: 16,
  large: 24,
};

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  floating: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  sheet: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
};
export default { colors, spacing, radii, shadows };
