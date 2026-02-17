# Lokal App (Passwordless OTP demo)

This is a minimal Expo app implementing a passwordless OTP flow

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
- Storage: OTPs are stored in an in-memory Map keyed by email (Map<string, OtpRecord>). It means OTPs are local to the running process.
- Expiry: each OTP has an `expiresAt` timestamp set to `Date.now() + 60_000` (60 seconds). On validation we compare `Date.now()` to `expiresAt` and return an "Expired" response if exceeded and delete the record.
- Attempts: each `OtpRecord` stores an `attempts` counter. On each incorrect validation the counter increments. If `attempts >= MAX_ATTEMPTS` (3) validation returns "Maximum attempts exceeded".
- Regeneration: calling `generateOtp(email)` replaces the existing record for that email and resets attempts to 0 and sets a fresh expiry. This means regenerating invalidates the previous OTP immediately.

2) Data structures used and why
--------------------------------
- OtpRecord: `{ code: string; expiresAt: number; attempts: number }`
  - Rationale: compact structure that stores everything needed for validation logic (code equality, TTL, and attempt count).

- UserSession: `{ email: string; startTime: number }`
  - Rationale: minimal session information required for this demo — we only need a canonical identifier (email) and a login timestamp for the session timer.

- Storage choices:
  - `Map<string, OtpRecord>` for OTPs — in-memory Map gives constant-time lookups and simple semantics for a demo. It also ensures regenerating/clearing is straightforward (Map.set / Map.delete).
  - `AsyncStorage` for session persistence — allows the app to survive reloads and is the standard local storage mechanism for React Native/Expo. It’s simple to use and sufficient for demo purpose.

3) External SDKs chosen and why
--------------------------------
- Expo: used as the app runtime because it's fast and very simple to iterate with web targets and simplifies deveoping a React Native app.
- `@react-native-async-storage/async-storage`: lightweight, well-supported AsyncStorage for React Native — used to persist the `UserSession`
- `@react-navigation/native` + `@react-navigation/native-stack`: navigation stack across Login, OTP and Session screens.


4) What GPT helped with vs what you (developer) implemented
------------------------------------------------------------
- What I provided:
  - I am new to React Native. I first googled basic terms like CLI vs Expo, hooks etc which were written in assignment doc
  - I chose Expo because it is easy and simple to set up for demo apps.
  - I watched "Learn React Native Expo in 47 Minutes" (https://www.youtube.com/watch?v=bES5bMSL54M) which helped me get started quickly.
  - I already knew frontend/backend basics from Flask projects using Jinja templates etc, so many concepts were relatable.
  - I first sketched the basic design and components in a notebook and then I wrote a detailed prompt for ChatGPT containing initial pseudocode and the core authentication requirements (OTP behavior, session persistence, attempt rules, UI flow). https://chatgpt.com/share/6994c7a3-54fc-8013-a128-2eb3d86fb76d
  - Iterated debugging steps and decisions (fixing hook order, deciding to show OTP in-app for development, handling web alert fallback).

- What GPT generated / helped implement:
  - A concrete file structure, types, service implementations (otpManager, storageService, auth), the session timer hook, and basic screen components.
  - Guidance on platform differences (web vs native logs, Watchman).