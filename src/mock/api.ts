import type { Booking, Service, User, Media, Feedback } from "../types";

import { seedUsers, seedServices, mockMedia, feedbacks } from "./data";
import { ApiError, requestFirstOk, requestJson } from "../api/client";
export { API_BASE_URL } from "../api/config";
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

const USE_REMOTE_API =
  !!process.env.EXPO_PUBLIC_API_URL &&
  process.env.EXPO_PUBLIC_API_URL !== "http://localhost:5000";

type OtpSendResult = {
  otpToken?: string;
  expiresIn?: number;
  message?: string;
};

type OtpVerifyResult = {
  verified: boolean;
  otpToken?: string;
  message?: string;
};

const mockOtpByMobile = new Map<string, { code: string; expiresAt: number }>();

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
  if (!USE_REMOTE_API) {
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

  const phone = mobile_number.startsWith("+")
    ? mobile_number
    : `+91${mobile_number}`;

  const result = await requestFirstOk<{ token: string; user: User }>(
    ["/auth/login", "/api/auth/login", "/login", "/api/login"],
    {
      method: "POST",
      body: { phone, pin: password },
    },
  );

  // Normalize the API response to match our User type
  const normalizedUser: User = {
    id: result.user.id,
    fullName: result.user.fullName || result.user.name,
    name: result.user.fullName || result.user.name,
    mobileNumber: result.user.mobileNumber || result.user.mobile_number,
    mobile_number: result.user.mobileNumber || result.user.mobile_number,
  };

  await setToken(result.token);
  await setUser(normalizedUser);
  return { token: result.token, user: normalizedUser };
}

export async function register(
  name: string,
  mobile_number: string,
  pin: string,
): Promise<{ token: string; user: User }> {
  if (!USE_REMOTE_API) {
    await delay();

    if (!/^\d{10}$/.test(mobile_number))
      throw new Error("Invalid mobile number");
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

  const result = await requestFirstOk<{ token: string; user: User }>(
    ["/auth/register", "/api/auth/register", "/register", "/api/register"],
    {
      method: "POST",
      body: {
        name,
        mobile_number,
        pin,
        password: pin,
      },
    },
  );

  await setToken(result.token);
  await setUser(result.user);
  return result;
}

export async function requestOtp(
  mobile_number: string,
): Promise<OtpSendResult> {
  if (!USE_REMOTE_API) {
    await delay(250);
    const code = "123456";
    mockOtpByMobile.set(mobile_number, {
      code,
      expiresAt: Date.now() + 2 * 60 * 1000,
    });
    return {
      expiresIn: 120,
      message: "OTP sent (mock)",
    };
  }

  // Format phone number with +91 prefix if not already present
  const phone = mobile_number.startsWith("+")
    ? mobile_number
    : `+91${mobile_number}`;

  return requestFirstOk<OtpSendResult>(
    [
      "/auth/send-otp",
      "/api/auth/send-otp",
      "/auth/otp/send",
      "/api/auth/otp/send",
      "/otp/send",
      "/api/otp/send",
    ],
    { method: "POST", body: { phone } },
  );
}

export async function verifyOtp(
  mobile_number: string,
  otp: string,
): Promise<OtpVerifyResult> {
  if (!USE_REMOTE_API) {
    await delay(250);
    const entry = mockOtpByMobile.get(mobile_number);
    if (!entry || Date.now() > entry.expiresAt) {
      return { verified: false, message: "OTP expired" };
    }
    if (entry.code !== otp) {
      return { verified: false, message: "Invalid OTP" };
    }
    return {
      verified: true,
      message: "OTP verified (mock)",
      otpToken: "mock-otp-token",
    };
  }

  // Format phone number with +91 prefix if not already present
  const phone = mobile_number.startsWith("+")
    ? mobile_number
    : `+91${mobile_number}`;

  const res = await requestFirstOk<any>(
    [
      "/auth/verify-otp",
      "/api/auth/verify-otp",
      "/auth/otp/verify",
      "/api/auth/otp/verify",
      "/otp/verify",
      "/api/otp/verify",
    ],
    {
      method: "POST",
      body: {
        phone,
        code: otp,
      },
    },
  );

  const verified = res?.verified === true;

  const otpToken = res?.otpToken ?? res?.otp_token ?? res?.token;

  return {
    verified: !!verified,
    otpToken: typeof otpToken === "string" ? otpToken : undefined,
    message: res?.message,
  };
}

export async function registerWithOtp(
  name: string,
  mobile_number: string,
  pin: string,
  otp: string,
  otpToken?: string,
): Promise<{ token: string; user: User }> {
  if (!USE_REMOTE_API) {
    const verify = await verifyOtp(mobile_number, otp);
    if (!verify.verified)
      throw new Error(verify.message ?? "OTP verification failed");
    return register(name, mobile_number, pin);
  }

  const result = await requestFirstOk<{ token: string; user: User }>(
    ["/auth/register"],
    {
      method: "POST",
      body: {
        fullName: name,
        pin,
        otpToken,
      },
    },
  );

  await setToken(result.token);
  await setUser(result.user);
  return result;
}

export async function me(): Promise<User | null> {
  if (!USE_REMOTE_API) {
    await delay(200);
    const token = await getToken();
    if (!token) return null;
    return getUser();
  }

  const token = await getToken();
  if (!token) return null;

  try {
    const user = await requestFirstOk<User>(
      ["/auth/me", "/api/auth/me", "/me", "/api/me"],
      { method: "GET", auth: true },
    );
    await setUser(user);
    return user;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      await clearToken();
      await clearUser();
      return null;
    }
    throw err;
  }
}

export async function logout(): Promise<void> {
  if (!USE_REMOTE_API) {
    await delay(100);
    await clearToken();
    await clearUser();
    return;
  }

  try {
    await requestFirstOk<unknown>(
      ["/auth/logout", "/api/auth/logout", "/logout", "/api/logout"],
      { method: "POST", auth: true },
    );
  } catch {
    // ignore
  } finally {
    await clearToken();
    await clearUser();
  }
}

export async function fetchServices(): Promise<Service[]> {
  if (!USE_REMOTE_API) {
    await delay(200);
    return seedServices;
  }

  return requestFirstOk<Service[]>(["/services", "/api/services"], {
    method: "GET",
  });
}

export async function fetchpreviousWorkMedia(): Promise<Media[]> {
  if (!USE_REMOTE_API) {
    await delay(200);
    return mockMedia;
  }

  return requestFirstOk<Media[]>(
    [
      "/media/previous-work",
      "/api/media/previous-work",
      "/gallery",
      "/api/gallery",
      "/media",
      "/api/media",
    ],
    { method: "GET" },
  );
}

export async function fetchFeedbacks(): Promise<Feedback[]> {
  if (!USE_REMOTE_API) {
    await delay(200);
    return feedbacks;
  }

  return requestFirstOk<Feedback[]>(
    [
      "/feedbacks",
      "/api/feedbacks",
      "/reviews",
      "/api/reviews",
      "/testimonials",
      "/api/testimonials",
    ],
    { method: "GET" },
  );
}
export async function fetchService(id: string): Promise<Service> {
  if (!USE_REMOTE_API) {
    await delay(200);
    const s = seedServices.find((x) => x.id === id);
    if (!s) throw new Error("Service not found");
    return s;
  }

  return requestFirstOk<Service>([`/services/${id}`, `/api/services/${id}`], {
    method: "GET",
  });
}

export async function createBooking(
  payload: Omit<Booking, "id" | "status">,
): Promise<Booking> {
  if (!USE_REMOTE_API) {
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

  const booking = await requestFirstOk<Booking>(
    ["/bookings", "/api/bookings"],
    { method: "POST", body: payload, auth: true },
  );
  return booking;
}

export async function listBookings(userId: string): Promise<Booking[]> {
  if (!USE_REMOTE_API) {
    await delay(200);
    const bookings: Booking[] = await getBookings();
    return bookings.filter((b) => b.userId === userId);
  }

  const encoded = encodeURIComponent(userId);
  return requestFirstOk<Booking[]>(
    [
      `/bookings?userId=${encoded}`,
      `/api/bookings?userId=${encoded}`,
      `/users/${encoded}/bookings`,
      `/api/users/${encoded}/bookings`,
    ],
    { method: "GET", auth: true },
  );
}
