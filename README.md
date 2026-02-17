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
cd /Users/parulhardaha/Desktop/lokal-app
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
