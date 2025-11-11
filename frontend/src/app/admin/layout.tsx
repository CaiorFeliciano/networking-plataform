import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Networking Platform",
  description: "Área administrativa da plataforma",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
