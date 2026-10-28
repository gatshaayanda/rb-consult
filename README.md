# RB Consultancy

Premium trailer-mounted VIP toilet and mobile ablution hire for events in Botswana.

## Customer experience
Browse hire options, select units, and send an enquiry with event date, location, event type/use, expected attendance, contact details and optional reference media. RB Consultancy reviews each enquiry and privately discusses pricing. An enquiry is not a confirmed booking. There is no public rate card, checkout or payment flow.

Contact: 72245296 / 77661973. Instagram: @rbconsultancy9256.

## Admin
The /admin route supports authorized staff operations, enquiry review, catalogue CRUD and publishing image/video/PDF media. Admin access requires a server-only RB_ADMIN_EMAILS allowlist and Firebase Admin credentials.

## PWA
The native install prompt and service-worker lifecycle are protected foundation behavior. Keep install mechanics, dismissal, responsive placement, caching and offline behavior intact; change identity/branding only unless the product owner approves a specific install change.

## Stack and setup
Next.js / React / TypeScript, Firebase Auth and Cloud Firestore, UploadThing, Vercel Analytics and Speed Insights.

Copy .env.example to .env.local and configure the dedicated RB Consultancy Firebase project, UploadThing token, actual NEXT_PUBLIC_BASE_URL, comma-separated RB_ADMIN_EMAILS and server-only FIREBASE_ADMIN_KEY. Never commit real environment files or service-account credentials. The product owner configures Firebase and Vercel; a Git push does not mean deployment succeeded.

Development: npm install, then npm run dev. When configuration is ready, run npx tsc --noEmit, npm run lint and npm run build.
