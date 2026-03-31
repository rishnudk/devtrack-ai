import Header from "@/components/shared/Header";

export default function TopicsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Topics" description="Manage your learning topics" />
      <main className="flex-1 p-6">
        <p className="text-slate-400">Topics coming soon...</p>
      </main>
    </div>
  );
}