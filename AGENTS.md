# RB Consultancy — Project Operating Contract

RB Consultancy is a Botswana event-sanitation business focused on premium trailer-mounted VIP toilet hire. GitHub, this file and the product brief are the source of truth. The product owner is final reviewer.

## Customer journey and business rules
- Customers browse toilet-hire offerings, choose unit(s), and submit an enquiry with name, phone, optional email, event date, event location, event type/use, expected attendance, and notes/reference media.
- An enquiry is not a confirmed booking. Confirm receipt only after Firestore confirms the write.
- Staff review logistics and privately communicate quotations. Never publish prices, daily/weekend rates, delivery fees, totals or estimates in catalogue, basket, metadata, seeded data or analytics.
- Never put private quote amounts into public-readable catalogue/enquiry documents or customer-visible notes. Do not add checkout/payment.
- Only state free delivery within Gaborone where useful. Do not invent other logistics promises.
- Contacts: 72245296 and 77661973. Instagram: @rbconsultancy9256.
- Emphasize trailer-mounted VIP multi-compartment units, ceramic flush toilets, running-water handwashing, soap, sanitizing/disinfecting and event readiness. Target weddings, funerals, parties, corporate functions, expos, rallies, patlo/magadi and similar events.
- Standard chemical units and long-term site hire are separate tiers. Keep VIP event trailer hire dominant.
- Staff must be able to CRUD offerings and publish photos/videos. Use UploadThing for media uploads.
- Remove Africhiko, Namane Tyres, Boemo, steel fabrication and tyre-assistance identity/content. Never reuse source Firebase projects, credentials, customer data or allowlists.

## Protected PWA installation — permanent lock
Preserve Africhiko's approved install mechanism and lifecycle. Only change branding, identity, assets, colors and project-specific copy unless the product owner explicitly authorizes a specific installation change. Preserve native beforeinstallprompt capture, explicit user-click prompt, dismissible branded card, responsive positioning, embedded-browser/iOS guidance where present, service-worker registration, cache/offline behavior and event lifecycle. Do not redesign, replace, remove or weaken it. Keep install-related diffs minimal.

## Protected chatbot — permanent lock
Preserve the existing scripted guide, accessibility, dismissal, keyboard behavior, shortcuts and honest limitations. Change branding and project-specific copy/destinations only. Do not replace it or claim it is live AI, sends messages or changes records.

## Firebase and security
- The product owner configures Firebase and deployment environment. Never copy source Firebase IDs, credentials, VAPID keys, admin emails or service accounts.
- NEXT_PUBLIC_FIREBASE_* is public client configuration. FIREBASE_ADMIN_KEY and RB_ADMIN_EMAILS are server-only. Never commit real env files, service-account JSON, tokens or secrets.
- Admin authorization requires verified Firebase ID tokens and an owner-configured RB_ADMIN_EMAILS allowlist. Clients must never create/promote admin roles.
- Firestore rules must enforce owner/staff authorization, customer ownership and validated enquiry creation. Do not weaken rules to bypass errors.
- Use UploadThing for media. Do not migrate uploads to Firebase Storage or add Storage rules as an assumed requirement.
- Do not configure Firebase Console or deploy rules without explicit authorization.

## Implementation and verification
Preserve working Auth, enquiry conversations, notifications, catalogue CRUD, UploadThing, analytics privacy, PWA and offline behavior unless the brief explicitly requires change. No fake success or dead controls. Keep private/customer data out of analytics. Never force-push. Verify branch head before commit; report actual tests, changed files, configuration, deployment status, QA steps and readiness honestly.
