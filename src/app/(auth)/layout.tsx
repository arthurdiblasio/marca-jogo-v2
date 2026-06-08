import { requireGuest } from "@/shared/auth/require-guest";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireGuest();

  return children;
}