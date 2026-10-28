import { requireAdminProfile } from "@/lib/auth";

export default async function AppDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminProfile();
  return <>{children}</>;
}
