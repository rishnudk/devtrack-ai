import Header from "@/components/shared/Header";
import { db } from "@/lib/db";
import { topics, notes } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userTopics = await db
    .select()
    .from(topics)
    .where(eq(topics.userId, session.user.id));

  const userNotes = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, session.user.id));

  const totalTopics = userTopics.length;
  const inProgress = userTopics.filter((t) => t.status === "in_progress").length;
  const completed = userTopics.filter((t) => t.status === "completed").length;
  const totalNotes = userNotes.length;

  const stats = [
    { label: "Total Topics", value: totalTopics },
    { label: "In Progress", value: inProgress },
    { label: "Completed", value: completed },
    { label: "Total Notes", value: totalNotes },
  ];

  const statusConfig = {
    not_started: "NOT STARTED",
    in_progress: "IN PROGRESS",
    completed: "COMPLETED",
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0A]">
      <Header
        title="Dashboard"
        description="System overview and current status."
      />

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-16">
        {/* Stats */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-900 border border-neutral-900">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#0A0A0A] p-8 flex flex-col justify-between">
                <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest mb-4">
                  {stat.label}
                </p>
                <p className="text-5xl font-medium text-white tracking-tighter">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Topics */}
        <section className="space-y-6">
          <h3 className="text-white text-2xl font-medium tracking-tight">Active Topics</h3>

          {userTopics.length === 0 ? (
            <div className="border border-neutral-900 p-16 flex flex-col items-center justify-center text-center">
              <span className="text-neutral-600 font-mono text-sm uppercase tracking-widest mb-4">
                [ Empty State ]
              </span>
              <h3 className="text-white font-medium text-xl mb-2 tracking-tight">
                No active records.
              </h3>
              <p className="text-neutral-500 font-light mb-6">
                System awaiting initialization sequence.
              </p>
              <Link href="/topics" className="border border-white bg-transparent text-white hover:bg-white hover:text-black transition-colors px-6 py-2 text-sm font-medium">
                Create Topic
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userTopics.slice(0, 6).map((topic) => {
                const statusLabel = statusConfig[topic.status];
                return (
                  <Link key={topic.id} href={`/topics/${topic.id}`}>
                    <div className="group border border-neutral-900 bg-[#0A0A0A] p-6 hover:border-white transition-colors cursor-pointer flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
                            [ {statusLabel} ]
                          </span>
                          <ArrowRight className="h-4 w-4 text-neutral-700 group-hover:text-white transition-colors" />
                        </div>
                        <h4 className="text-white text-xl font-medium tracking-tight mb-2">
                          {topic.name}
                        </h4>
                      </div>
                      
                      <div className="mt-8">
                        <div className="flex justify-between text-xs font-mono text-neutral-500 tracking-widest mb-2">
                          <span>PROGRESS</span>
                          <span className="text-white">{topic.progress}%</span>
                        </div>
                        <div className="w-full h-[2px] bg-neutral-900">
                          <div 
                            className="h-full bg-white transition-all duration-500 ease-out" 
                            style={{ width: `${topic.progress}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}