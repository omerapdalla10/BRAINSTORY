import { redirect } from "next/navigation";

export default function LegacyBlogsRedirectPage() {
  redirect("/app/blogs");
}
