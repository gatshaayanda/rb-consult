import type { Metadata } from "next";
import AfrichikoPortal from "@/components/AfrichikoPortal";

export const metadata: Metadata = {
  title: "Enquiry operations",
  description: "Review event-hire enquiries, private quotations and toilet-hire catalogue options.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AfrichikoPortal page="admin" />;
}
