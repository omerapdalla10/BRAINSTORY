import { requireAdminProfile } from "@/lib/auth";

export default async function AppContentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminProfile();
  return <>{children}</>;
}
