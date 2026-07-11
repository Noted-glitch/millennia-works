import type { Metadata } from "next";
import { AdminSessionGuard } from "@/components/AdminSessionGuard";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminSessionGuard />
      {children}
    </>
  );
}
