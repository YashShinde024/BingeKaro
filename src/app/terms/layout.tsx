import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "BingeKaro Terms of Service. Review the rules and guidelines governing the use of the platform.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
