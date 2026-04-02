import Header from "@/components/shared/Header";
import { db } from "@/lib/db";
import { topics, notes } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BookOpen, CheckCircle, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
    {
      label: "Total Topics",
      value: totalTopics,
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Total Notes",
      value: totalNotes,
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  const statusConfig = {
    not_started: {
      label: "Not Started",
      className: "bg-slate-700 text-foreground",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-yellow-500/20 text-yellow-400",
    },
    completed: {
      label: "Completed",
      className: "bg-green-500/20 text-green-400",
    },
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Dashboard"
        description={`Welcome back, ${session.user.name}`}
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-card border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-muted-foreground text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Topics */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold">Recent Topics</h3>

          {userTopics.length === 0 ? (
            <Card className="bg-card border-slate-800">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 bg-primary text-primary-foreground/10 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  No topics yet
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Head to the Topics page to create your first learning topic.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userTopics.slice(0, 6).map((topic) => {
                const status = statusConfig[topic.status];
                return (
                  <Link key={topic.id} href={`/topics/${topic.id}`}>
                    <Card className="bg-card border-slate-800 hover:border-slate-600 transition-colors cursor-pointer">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-medium truncate">
                            {topic.name}
                          </h4>
                          <Badge className={status.className}>
                            {status.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-white">{topic.progress}%</span>
                        </div>
                        <Progress
                          value={topic.progress}
                          className="h-1.5 bg-card"
                        />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}