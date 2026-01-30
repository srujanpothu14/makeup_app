export type Service = {
  id: string;
  title: string;
  category: "Makeup" | "Skincare" | "Hair" | "Nails" | "Other";
  durationMin: number;
  price: number;
  thumbnailUrl?: string;
  description?: string;
  artistId?: string;
};

export type Booking = {
  id: string;
  serviceIds: string[]; // ✅ multiple services
  userId: string;
  startTime: string;
  status: string;
};

export type User = {
  id: string;
  fullName?: string;
  name?: string;
  mobileNumber?: string;
  mobile_number?: string;
  password?: string;
  avatarUrl?: string;
  dateRegistered?: string;
};

export type Media = {
  id: string;
  type: "image" | "video";
  url: string;
};
export type Feedback = {
  id: string;
  name: string;
  text: string;
};
