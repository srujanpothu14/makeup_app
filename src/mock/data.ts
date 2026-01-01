import { Service, User, Booking } from "../types";

export const seedUsers: User[] = [
  { id: "u1", name: "Demo User", mobile_number: "7997037993" },
];

export const seedServices: Service[] = [
  {
    id: "s1",
    title: "Bridal Makeup",
    category: "Makeup",
    durationMin: 120,
    price: 8000,
    description: "Full bridal package with trial.",
    thumbnailUrl: "https://picsum.photos/seed/bridal/400",
  },
  {
    id: "s2",
    title: "Party Glam",
    category: "Makeup",
    durationMin: 60,
    price: 2500,
    description: "Glitter, glow, and lashes.",
    thumbnailUrl: "https://picsum.photos/seed/glam/400",
  },
  {
    id: "s3",
    title: "Hydra Facial",
    category: "Skincare",
    durationMin: 75,
    price: 3500,
    description: "Deep cleanse, exfoliation, hydration.",
    thumbnailUrl: "https://picsum.photos/seed/hydra/400",
  },
  {
    id: "s4",
    title: "Hair Styling",
    category: "Hair",
    durationMin: 45,
    price: 1500,
    description: "Curls, braids, or sleek looks.",
    thumbnailUrl: "https://picsum.photos/seed/hair/400",
  },
  {
    id: "s5",
    title: "Hair Styling",
    category: "Hair",
    durationMin: 45,
    price: 1500,
    description: "Curls, braids, or sleek looks.",
    thumbnailUrl: "https://picsum.photos/seed/hair/400",
  },
  {
    id: "s6",
    title: "Hair Styling",
    category: "Hair",
    durationMin: 45,
    price: 1500,
    description: "Curls, braids, or sleek looks.",
    thumbnailUrl: "https://picsum.photos/seed/hair/400",
  },
  {
    id: "s7",
    title: "Hair Styling",
    category: "Hair",
    durationMin: 45,
    price: 1500,
    description: "Curls, braids, or sleek looks.",
    thumbnailUrl: "https://picsum.photos/seed/hair/400",
  },
  {
    id: "s8",
    title: "Hair Styling",
    category: "Hair",
    durationMin: 45,
    price: 1500,
    description: "Curls, braids, or sleek looks.",
    thumbnailUrl: "https://picsum.photos/seed/hair/400",
  },
];

export const initialBookings: Booking[] = [];
