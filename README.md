# Lokal App (Passwordless OTP demo)

This is a minimal Expo + TypeScript demo implementing a passwordless OTP flow. The goal is to show the core logic (OTP generation, expiry, attempt tracking), session persistence, and a tiny UI (Login → OTP → Session) you can run with Expo web or native.

Contents
- `src/types/type.ts` — Type definitions (OtpRecord, UserSession)
- `src/services/otpManager.ts` — In-memory OTP store and validation
- `src/services/storageService.ts` — AsyncStorage wrapper for session
- `src/services/auth.ts` — login / logout / checkLoginStatus helpers
- `src/hooks/useSessionTimer.ts` — Hook returning formatted live session duration (MM:SS)
- `src/screens/*` — `LoginScreen`, `OtpScreen`, `SessionScreen`
- `App.tsx` — Navigation and session restore

Getting started
1. Clone and install:

```bash
git clone https://github.com/parulhardaha/lokal-app.git
cd lokal-app
npm install
```

2. Run the web build (or use `expo start`):

```bash
npm run web
# or
expo start --web
```

3. Open the app in the browser (Expo will usually open http://localhost:19006). Open the browser DevTools Console (Cmd+Option+I on macOS) to see console.log output.

Core design and behavior

1) OTP logic and expiry handling
--------------------------------
- Generation: when the user presses "Send OTP" we generate a random 6-digit string (100000–999999) using Math.random.
- Storage: OTPs are stored in an in-memory Map keyed by email (Map<string, OtpRecord>). This keeps the demo simple and means OTPs are local to the running process.
- Expiry: each OTP has an `expiresAt` timestamp set to `Date.now() + 60_000` (60 seconds). On validation we compare `Date.now()` to `expiresAt` and return an "Expired" response if exceeded and delete the record.
- Attempts: each `OtpRecord` stores an `attempts` counter. On each incorrect validation the counter increments. If `attempts >= MAX_ATTEMPTS` (3) validation returns "Maximum attempts exceeded".
- Regeneration: calling `generateOtp(email)` replaces the existing record for that email and resets attempts to 0 and sets a fresh expiry. This means regenerating invalidates the previous OTP immediately.

Notes on security and production
- This demo stores OTPs in memory and prints the code for dev convenience. In production you should never expose OTPs in logs or UI, and you should generate, store and validate OTPs on a secure server (persisting to a database or cache with proper TTL). You should also rate-limit requests and use secure channels (email/SMS) to deliver OTPs.

2) Data structures used and why
--------------------------------
- OtpRecord: `{ code: string; expiresAt: number; attempts: number }`
  - Rationale: compact structure that stores everything needed for validation logic (code equality, TTL, and attempt count).

- UserSession: `{ email: string; startTime: number }`
  - Rationale: minimal session information required for this demo — we only need a canonical identifier (email) and a login timestamp for the session timer.

- Storage choices:
  - `Map<string, OtpRecord>` for OTPs — in-memory Map gives constant-time lookups and simple semantics for a demo. It also ensures regenerating/clearing is straightforward (Map.set / Map.delete).
  - `AsyncStorage` for session persistence — allows the app to survive reloads and is the standard local storage mechanism for React Native/Expo. It’s simple to use and sufficient for demo-level persistence.

3) External SDKs chosen and why
--------------------------------
- Expo: used as the app runtime because it's fast to iterate with web/native targets and simplifies bootstrapping a React Native app.
- `@react-native-async-storage/async-storage`: lightweight, well-supported AsyncStorage shim for React Native — used to persist the `UserSession` so the session survives reloads.
- `@react-navigation/native` + `@react-navigation/native-stack`: navigation stack across Login, OTP and Session screens.

Why not an OTP SDK here?
- For a simple demo the OTP logic is local and trivial to implement; production OTP flows typically use an external messaging provider (SendGrid, Twilio, Amazon SES/SNS) combined with server-side storage and verification. Integrating those providers would be the natural next step but was intentionally left out to keep the example focused and runnable without secrets or network setup.

4) What GPT helped with vs what you (developer) implemented
------------------------------------------------------------
- GPT contributions (what I generated for you):
  - Project scaffold (source files, directory structure, TS interfaces).
  - Core implementations: `otpManager.ts` (generation, expiry, attempts), `storageService.ts`, `auth.ts` helpers, `useSessionTimer.ts` hook and the three screen components.
  - Small developer conveniences: dev-mode debug displays, web alert fallbacks, and a simple optional log-server pattern to forward client logs to a local terminal (explained in the README when enabled).
  - Fixes for React Hooks ordering and other small runtime issues discovered while testing.

- What you (the developer) did / verified:
  - Ran the app on web and verified runtime behavior (observed console logs in browser DevTools).
  - Adjusted behavior and reverted some changes as you iterated (that’s expected while shaping UX).
  - Confirmed how logs behave on web vs terminal and requested a terminal-visible logging option.

Notes on collaboration
- GPT produced code and suggestions; you ran and tested locally and directed follow-ups. The implementation is intentionally minimal so you can safely extend it (replace in-memory OTPs with a server, wire a real email/SMS provider, add unit tests, or switch to a modal/toast UX).

Next steps you might consider
- Move OTP logic to a server endpoint and use a provider (Twilio/SES) to deliver codes.
- Add unit tests for `otpManager` (happy path, expiry, attempt-limit). I can add Jest tests if you want.
- Replace browser alert() with an in-app toast/modal for a nicer UX across platforms.

License / Disclaimer
- This repo is a demo. Do not use the in-memory approach for production authentication. Always secure OTP generation, delivery and verification on a trusted backend and avoid leaking tokens in logs.

---
If you'd like, I can add the optional local `log-server` and a `src/services/logger.ts` shim that posts to it so you can see client logs in a terminal as well — say the word and I’ll wire it in.
# Lokal App (Passwordless OTP demo)

Passwordless OTP flow using an in-memory OTP manager and AsyncStorage for session persistence

Files created under `src/`:

- `src/types/type.ts` — Type definitions (OtpRecord, UserSession)
- `src/services/otpManager.ts` — In-memory OTP store and validation
- `src/services/storageService.ts` — AsyncStorage wrapper for session
- `src/services/auth.ts` — login / logout / checkLoginStatus helpers
- `src/hooks/useSessionTimer.ts` — Hook returning formatted live session duration (MM:SS)
- `src/screens/LoginScreen.tsx` — Enter email, generate OTP, navigate to OTP screen
- `src/screens/OtpScreen.tsx` — Enter OTP, validate, login
- `src/screens/SessionScreen.tsx` — Show login time, live timer, logout
- `App.tsx` — Navigation and initial session restore

How to run

1. Install dependencies:

```bash
git clone https://github.com/parulhardaha/lokal-app.git
cd lokal-app
npm install
```

2. Start the Expo web server:

```bash
npm run web
```

3. See the browser's console log for the generated OTP and error logs

Notes

- OTPs are stored in-memory. App reload clears them (but sessions are persisted in AsyncStorage).
- The implementation is very minimal and focused on the requested logic
