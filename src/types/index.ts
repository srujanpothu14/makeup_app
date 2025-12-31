export type Service = {
  id: string;
  title: string;
  category: "Makeup" | "Skincare" | "Hair" | "Nails";
  durationMin: number;
  price: number;
  thumbnailUrl?: string;
  description?: string;
  artistId?: string;
};

export type Booking = {
  id: string;
  serviceId: string;
  userId: string;
  startTime: string; // ISO
  status: "pending" | "confirmed" | "cancelled";
};

export type User = {
  id: string;
  name: string;
  mobile_number: string;
  avatarUrl?: string;
};
