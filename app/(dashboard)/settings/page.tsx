import Header from "@/components/shared/Header";

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Settings" description="Manage your account" />
      <main className="flex-1 p-6">
        <p className="text-muted-foreground">Settings coming soon...</p>
      </main>
    </div>
  );
}