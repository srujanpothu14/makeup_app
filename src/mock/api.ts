import { Booking, Service, User, Media, Feedback } from "../types";

import { seedUsers, seedServices, mockMedia, feedbacks } from "./data";
import {
  getBookings,
  setBookings,
  getToken,
  setToken,
  clearToken,
  getUser,
  setUser,
  clearUser,
  getUsers,
  setUsers,
} from "./storage";

// Simulate network latency
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

async function listAllUsers(): Promise<User[]> {
  const storedUsers: User[] = await getUsers();
  const merged = [...seedUsers, ...storedUsers];
  const byMobile = new Map<string, User>();
  for (const u of merged) byMobile.set(u.mobile_number, u);
  return Array.from(byMobile.values());
}

export async function login(
  mobile_number: string,
  password: string,
): Promise<{ token: string; user: User }> {
  await delay();
  const users = await listAllUsers();
  const user = users.find((u) => u.mobile_number === mobile_number);
  if (!user || user.password !== password)
    throw new Error("Invalid credentials");
  const token = "mock-token-" + Date.now();
  await setToken(token);
  await setUser(user);
  return { token, user };
}

export async function register(
  name: string,
  mobile_number: string,
  pin: string,
): Promise<{ token: string; user: User }> {
  await delay();

  if (!/^\d{10}$/.test(mobile_number)) throw new Error("Invalid mobile number");
  if (!/^\d{4}$/.test(pin)) throw new Error("PIN must be 4 digits");

  const users = await listAllUsers();
  if (users.some((u) => u.mobile_number === mobile_number)) {
    throw new Error("Mobile number already registered");
  }

  const newUser: User = {
    id: "u" + Date.now(),
    name,
    mobile_number,
    password: pin,
  };

  const storedUsers: User[] = await getUsers();
  await setUsers([...storedUsers, newUser]);

  const token = "mock-token-" + Date.now();
  await setToken(token);
  await setUser(newUser);

  return { token, user: newUser };
}

export async function me(): Promise<User | null> {
  await delay(200);
  const token = await getToken();
  if (!token) return null;
  return getUser();
}

export async function logout(): Promise<void> {
  await delay(100);
  await clearToken();
  await clearUser();
}

export async function fetchServices(): Promise<Service[]> {
  await delay(200);
  return seedServices;
}

export async function fetchpreviousWorkMedia(): Promise<Media[]> {
  await delay(200);
  return mockMedia;
}

export async function fetchFeedbacks(): Promise<Feedback[]> {
  await delay(200);
  return feedbacks;
}
export async function fetchService(id: string): Promise<Service> {
  await delay(200);
  const s = seedServices.find((x) => x.id === id);
  if (!s) throw new Error("Service not found");
  return s;
}

export async function createBooking(
  payload: Omit<Booking, "id" | "status">,
): Promise<Booking> {
  await delay(300);
  const bookings: Booking[] = await getBookings();
  const b: Booking = {
    id: "b" + (bookings.length + 1),
    status: "pending",
    ...payload,
  };
  const next = [...bookings, b];
  await setBookings(next);
  return b;
}

export async function listBookings(userId: string): Promise<Booking[]> {
  await delay(200);
  const bookings: Booking[] = await getBookings();
  return bookings.filter((b) => b.userId === userId);
}
