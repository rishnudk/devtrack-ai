import { BookOpen, CheckCircle, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    label: "Total Topics",
    value: "0",
    icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    label: "In Progress",
    value: "0",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    label: "Completed",
    value: "0",
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    label: "Total Notes",
    value: "0",
    icon: Zap,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="bg-slate-900 border-slate-800"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-slate-400 text-sm font-medium">
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

        {/* Empty state */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-blue-600/10 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              No topics yet
            </h3>
            <p className="text-slate-400 text-sm max-w-sm">
              Head to the Topics page to create your first learning topic and
              start tracking your progress.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}