import { requireAuthorOrAdminProfile } from "@/lib/auth";

export default async function AppBlogsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAuthorOrAdminProfile();
  return <>{children}</>;
}
