import { Service, User, Booking, Media } from "../types";

export const seedUsers: User[] = [
  {
    id: "u1",
    name: "Srujan Pothu",
    mobile_number: "7997037993",
    password: "123456",
  },
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

export const offers = [
  {
    id: "o1",
    title: "Bridal Bundle",
    description: "15% off on Bridal Makeup + Hair",
    serviceId: "s1",
    discountPercent: 15,
  },
  {
    id: "o2",
    title: "Skincare Treat",
    description: "20% off Hydra Facial",
    serviceId: "s3",
    discountPercent: 20,
  },
];
export const mockMedia: Media[] = [
  { id: "1", type: "image", url: "https://picsum.photos/seed/hair/400" },
  { id: "2", type: "image", url: "https://picsum.photos/seed/hair/401" },
  {
    id: "3",
    type: "video",
    url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  },
];

export const initialBookings: Booking[] = [];
