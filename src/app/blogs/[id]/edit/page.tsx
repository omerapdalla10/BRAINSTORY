import { redirect } from "next/navigation";

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPlaceholderPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  redirect(`/app/blogs/${id}/edit`);
}
