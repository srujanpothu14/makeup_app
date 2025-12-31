
# Beauty App Starter (No Backend)

Expo + TypeScript React Native app using a **mock backend** (in-memory + AsyncStorage).

## Features
- Auth gate with mock login (`user@example.com` / `password`)
- Services list, detail, and booking
- Bookings persisted locally via AsyncStorage

## Run
1. `npm install`
2. `npm run start`
3. Open in Expo Go / emulator.

## Where to customize
- `src/mock/data.ts` — seed services and users
- `src/mock/api.ts` — fake API methods (no network)
- Later, swap to real API by replacing calls in `src/api/*` with axios.
