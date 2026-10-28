import type { Metadata } from "next";
import ProgramsManager from "@/components/programs/ProgramsManager";
import { getAllPrograms } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Programs | Brainstory",
};

export const dynamic = "force-dynamic";

export default async function AppProgramsPage() {
  const programs = await getAllPrograms();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black">Programs</h1>
        <p className="text-sm text-slate-500 mt-1">
          Add, edit and reorder the programs shown on the public Programs page.
        </p>
      </div>
      <ProgramsManager initialPrograms={programs} />
    </div>
  );
}
