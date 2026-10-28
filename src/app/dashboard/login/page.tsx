import { redirect } from "next/navigation";
export default function LegacyDashboardLoginRedirectPage() {
  redirect("/auth/login");
}
