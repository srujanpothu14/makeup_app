
import { seedUsers, seedServices } from './data';
import { getBookings, setBookings, getToken, setToken, clearToken, getUser, setUser, clearUser } from './storage';
import { Booking, Service, User } from '../types';

// Simulate network latency
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export async function login(mobile_number: string, password: string): Promise<{ token: string; user: User }>{
  await delay();
  const user = seedUsers.find((u) => u.mobile_number === mobile_number);
  if (!user || password !== 'password') throw new Error('Invalid credentials');
  const token = 'mock-token-' + Date.now();
  await setToken(token);
  await setUser(user);
  return { token, user };
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

export async function fetchService(id: string): Promise<Service> {
  await delay(200);
  const s = seedServices.find((x) => x.id === id);
  if (!s) throw new Error('Service not found');
  return s;
}

export async function createBooking(payload: Omit<Booking, 'id' | 'status'>): Promise<Booking> {
  await delay(300);
  const bookings: Booking[] = await getBookings();
  const b: Booking = { id: 'b' + (bookings.length + 1), status: 'pending', ...payload };
  const next = [...bookings, b];
  await setBookings(next);
  return b;
}

export async function listBookings(userId: string): Promise<Booking[]> {
  await delay(200);
  const bookings: Booking[] = await getBookings();
  return bookings.filter((b) => b.userId === userId);
}
