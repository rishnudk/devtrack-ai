import Sidebar from "@/components/shared/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A] font-sans text-neutral-200">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#0A0A0A] min-h-screen overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}