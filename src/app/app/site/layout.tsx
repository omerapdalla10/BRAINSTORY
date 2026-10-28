import { requireAdminProfile } from "@/lib/auth";

export default async function AppSiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminProfile();
  return <>{children}</>;
}
