import { requireAdminProfile } from "@/lib/auth";

export default async function AppProfilesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminProfile();
  return <>{children}</>;
}
