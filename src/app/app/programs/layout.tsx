import { requireAdminProfile } from "@/lib/auth";

export default async function AppProgramsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminProfile();
  return <>{children}</>;
}
