import { Service, User, Booking, Media, Feedback } from "../types";

export const seedUsers: User[] = [
  {
    id: "u1",
    name: "Srujan Pothu",
    mobile_number: "7997037993",
    password: "1234",
  },
];

export const seedServices: Service[] = [
  {
    id: "s1",
    title: "Bridal Makeup",
    category: "Makeup",
    durationMin: 120,
    price: 8000,
    description: "Complete bridal makeup package with trial.",
    thumbnailUrl: "https://picsum.photos/seed/bridal/400",
  },
  {
    id: "s2",
    title: "Party Makeup",
    category: "Makeup",
    durationMin: 60,
    price: 2500,
    description: "Glam party makeup for special occasions.",
    thumbnailUrl: "https://picsum.photos/seed/party/400",
  },
  {
    id: "s3",
    title: "Semi-Permanent Make-up",
    category: "Makeup",
    durationMin: 90,
    price: 6000,
    description: "Long-lasting semi-permanent makeup.",
    thumbnailUrl: "https://picsum.photos/seed/semi/400",
  },
  {
    id: "s4",
    title: "Hydra Facial",
    category: "Skincare",
    durationMin: 75,
    price: 3500,
    description: "Deep cleansing and hydration facial.",
    thumbnailUrl: "https://picsum.photos/seed/hydra/400",
  },
  {
    id: "s5",
    title: "Facial (All Types)",
    category: "Skincare",
    durationMin: 60,
    price: 2000,
    description: "Customized facial for all skin types.",
    thumbnailUrl: "https://picsum.photos/seed/facial/400",
  },
  {
    id: "s6",
    title: "Hair Straightening",
    category: "Hair",
    durationMin: 120,
    price: 5000,
    description: "Smooth and straight hair treatment.",
    thumbnailUrl: "https://picsum.photos/seed/straight/400",
  },
  {
    id: "s7",
    title: "Keratin Treatment",
    category: "Hair",
    durationMin: 120,
    price: 5500,
    description: "Frizz control and hair smoothing treatment.",
    thumbnailUrl: "https://picsum.photos/seed/keratin/400",
  },
  {
    id: "s8",
    title: "Hair Cut & Hair Colouring",
    category: "Hair",
    durationMin: 90,
    price: 3000,
    description: "Professional haircut and coloring services.",
    thumbnailUrl: "https://picsum.photos/seed/color/400",
  },
  {
    id: "s9",
    title: "Hair Extensions",
    category: "Hair",
    durationMin: 90,
    price: 7000,
    description: "Natural-looking hair extension services.",
    thumbnailUrl: "https://picsum.photos/seed/extensions/400",
  },
  {
    id: "s10",
    title: "Manicure & Pedicure",
    category: "Nails",
    durationMin: 60,
    price: 1800,
    description: "Complete hand and foot care treatment.",
    thumbnailUrl: "https://picsum.photos/seed/mani/400",
  },
  {
    id: "s11",
    title: "Nail Art",
    category: "Nails",
    durationMin: 45,
    price: 1200,
    description: "Creative and trendy nail designs.",
    thumbnailUrl: "https://picsum.photos/seed/nailart/400",
  },
  {
    id: "s12",
    title: "Mehendi",
    category: "Other",
    durationMin: 60,
    price: 2500,
    description: "Traditional and modern mehendi designs.",
    thumbnailUrl: "https://picsum.photos/seed/mehendi/400",
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
  { id: "3", type: "image", url: "https://picsum.photos/seed/hair/401" },
  { id: "4", type: "image", url: "https://picsum.photos/seed/hair/401" },
  { id: "5", type: "image", url: "https://picsum.photos/seed/hair/401" },
  { id: "6", type: "image", url: "https://picsum.photos/seed/hair/401" },
  { id: "7", type: "image", url: "https://picsum.photos/seed/hair/401" },
  { id: "8", type: "image", url: "https://picsum.photos/seed/hair/401" },
  {
    id: "9",
    type: "video",
    url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  },
];
export const feedbacks: Feedback[] = [
  { id: "f1", name: "Aishwarya", text: "Absolutely loved my bridal makeup!" },
  { id: "f2", name: "Sneha", text: "Great service, very friendly artist." },
  { id: "f3", name: "Pooja", text: "Best makeup studio in Hyderabad!" },
];

export const ownerDetails = {
  name: "Manasa",
  studio: "Manasa Makeup Studio &\nBeauty Zone",
  designation: "Professional Makeup Artist",
  location: "Korutla, Telangana",
  locationUrl: "https://maps.app.goo.gl/5VM2qV599jiPovEj8?g_st=iw",
  phone: "9642166712",
  instagram:
    "https://www.instagram.com/manasa_makeovers_korutla?igsh=enR0ZGI4MHl3a25l",
  whatsapp: "https://wa.me/919642166712?text=Hi",
  bio: "Certified professional makeup artist with 6+ years of experience.",
  facebook: "https://www.facebook.com/share/1b1vQoV78G/?mibextid=wwXIfr",
  photo: "https://maps.app.goo.gl/TJ7cExHcMTJmixDc9",
};

export const whyChooseItems = [
  { icon: "💄", text: "6+ Years Experience" },
  { icon: "🏆", text: "Certified Artist" },
  { icon: "👰", text: "500+ Happy Brides" },
  { icon: "✨", text: "Premium Products" },
];

export const initialBookings: Booking[] = [];
