import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System & UI Library | Nettle Regenerative",
  description:
    "Interactive Design System, UI Components, Color Tokens, Typography, and Design Guidelines for Nettle Regenerative Farm.",
};

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
