import { requireAdminProfile } from "@/lib/auth";

export default async function AppCategoriesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminProfile();
  return <>{children}</>;
}
