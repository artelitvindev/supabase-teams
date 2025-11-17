import TeamsSelect from "@/components/teams-select";

export default async function ProtectedPage() {
  return (
    <div className="flex h-svh w-full flex-col items-center justify-center gap-2">
      <TeamsSelect />
    </div>
  );
}
