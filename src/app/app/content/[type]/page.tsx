import { notFound } from "next/navigation";
import ContentManager from "@/components/admin/ContentManager";
import { CONTENT_CONFIG, isContentType } from "@/lib/content-config";
import { listContent } from "@/lib/content";

export const dynamic = "force-dynamic";

type ContentPageProps = {
  params: Promise<{ type: string }>;
};

export async function generateMetadata({ params }: ContentPageProps) {
  const { type } = await params;
  return { title: isContentType(type) ? `${CONTENT_CONFIG[type].plural} | Brainstory` : "Brainstory" };
}

export default async function AppContentPage({ params }: ContentPageProps) {
  const { type } = await params;
  if (!isContentType(type)) {
    notFound();
  }

  const config = CONTENT_CONFIG[type];
  const items = await listContent(type);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black">{config.plural}</h1>
        <p className="text-sm text-slate-500 mt-1">{config.description}</p>
      </div>
      <ContentManager initialItems={items} type={type} />
    </div>
  );
}
