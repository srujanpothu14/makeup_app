import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = {
  TOKEN: "token",
  USER: "user",
  BOOKINGS: "bookings",
  USERS: "users",
} as const;

export async function getToken() {
  return AsyncStorage.getItem(KEY.TOKEN);
}
export async function setToken(token: string) {
  return AsyncStorage.setItem(KEY.TOKEN, token);
}
export async function clearToken() {
  return AsyncStorage.removeItem(KEY.TOKEN);
}

export async function getUser() {
  const raw = await AsyncStorage.getItem(KEY.USER);
  return raw ? JSON.parse(raw) : null;
}
export async function setUser(user: any) {
  return AsyncStorage.setItem(KEY.USER, JSON.stringify(user));
}
export async function clearUser() {
  return AsyncStorage.removeItem(KEY.USER);
}

export async function getBookings() {
  const raw = await AsyncStorage.getItem(KEY.BOOKINGS);
  return raw ? JSON.parse(raw) : [];
}
export async function setBookings(bookings: any[]) {
  return AsyncStorage.setItem(KEY.BOOKINGS, JSON.stringify(bookings));
}

export async function getUsers() {
  const raw = await AsyncStorage.getItem(KEY.USERS);
  return raw ? JSON.parse(raw) : [];
}

export async function setUsers(users: any[]) {
  return AsyncStorage.setItem(KEY.USERS, JSON.stringify(users));
}
