import { createUploadthing, type FileRouter } from "uploadthing/next";
import { notificationServices } from "@/lib/server/firebase-admin";

const f = createUploadthing();
const fileLimits = {
  image: { maxFileSize: "4MB" as const, maxFileCount: 1 as const },
  video: { maxFileSize: "8MB" as const, maxFileCount: 1 as const },
  pdf: { maxFileSize: "4MB" as const, maxFileCount: 1 as const },
};

async function requireAuthorizedStaff(request: Request) {
  const match = (request.headers.get("authorization") || "").match(/^Bearer\s+(.+)$/i);
  if (!match) throw new Error("Staff sign-in is required to upload catalogue media.");
  const { auth, db } = notificationServices();
  const decoded = await auth.verifyIdToken(match[1]);
  const email = String(decoded.email || "").trim().toLowerCase();
  const allowed = new Set((process.env.RB_ADMIN_EMAILS || "").split(",").map(value => value.trim().toLowerCase()).filter(Boolean));
  const role = await db.collection("admins").doc(decoded.uid).get();
  const oneWordAdmin = decoded.uid === "rb-one-word-admin" && decoded.firebase?.sign_in_provider === "custom";
  if ((!oneWordAdmin && !allowed.has(email)) || !role.exists || !["owner", "staff"].includes(String(role.data()?.role || "").toLowerCase())) {
    throw new Error("Only authorized RB Consultancy staff can upload catalogue media.");
  }
  return { userId: decoded.uid };
}

export const ourFileRouter = {
  // Customer enquiry reference attachments. The public enquiry form requires
  // Firebase Auth and Firestore ownership checks before an enquiry is accepted.
  fileUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    video: { maxFileSize: "8MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.info("[RB Consultancy] customer reference uploaded", {
      size: file.size,
      type: file.type,
      urlAvailable: Boolean(file.url || file.ufsUrl),
    });
  }),
  // Separate endpoint: catalogue and gallery uploads require a verified
  // Firebase ID token, configured email allowlist and an existing staff role.
  adminFileUploader: f(fileLimits)
    .middleware(async ({ req }) => requireAuthorizedStaff(req))
    .onUploadComplete(async ({ file, metadata }) => {
      console.info("[RB Consultancy] staff catalogue media uploaded", {
        userId: metadata.userId,
        size: file.size,
        type: file.type,
        urlAvailable: Boolean(file.url || file.ufsUrl),
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
