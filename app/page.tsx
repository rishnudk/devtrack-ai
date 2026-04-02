import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Code2,
  BookOpen,
  Sparkles,
  BrainCircuit,
  CheckCircle,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Track Your Topics",
    description:
      "Organize everything you're learning — React, Node, databases, anything. Create topics, add descriptions, and watch your progress grow.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Sparkles,
    title: "AI-Generated Notes",
    description:
      "Stuck on where to start? Let AI generate structured, practical notes for any topic or subtopic instantly. Edit and make them your own.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: BrainCircuit,
    title: "Test Your Knowledge",
    description:
      "Generate quizzes from your notes with one click. Answer multiple choice questions and get instant explanations for every answer.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description:
      "Mark topics as Not Started, In Progress, or Completed. Set a progress percentage and watch your dashboard fill up as you learn.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
];

const steps = [
  {
    step: "01",
    title: "Create a Topic",
    description: "Add any technology or concept you want to learn.",
  },
  {
    step: "02",
    title: "Add or Generate Notes",
    description: "Write your own notes or let AI generate structured ones.",
  },
  {
    step: "03",
    title: "Test Yourself",
    description: "Take AI-generated quizzes based on your notes.",
  },
  {
    step: "04",
    title: "Track Progress",
    description: "Update your progress and see everything on your dashboard.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">DevTrack AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-full px-4 py-1.5 text-blue-400 text-sm mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Learning Tracker
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
          Track what you learn.{" "}
          <span className="text-blue-400">Learn faster.</span>
        </h1>

        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          DevTrack AI helps developers organize their learning journey — create
          topics, generate AI notes, take quizzes, and track progress all in one
          place.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-base px-8"
            >
              Start for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-base px-8"
            >
              Sign in
            </Button>
          </Link>
        </div>

        {/* Hero visual */}
        <div className="mt-16 bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-slate-500 text-xs ml-2">devtrack-ai</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["React Hooks", "Node.js", "PostgreSQL"].map((topic, i) => (
              <div
                key={topic}
                className="bg-slate-800 rounded-lg p-3 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">
                    {topic}
                  </span>
                  <span
                    className={`text-xs ${
                      i === 0
                        ? "text-green-400"
                        : i === 1
                        ? "text-yellow-400"
                        : "text-slate-400"
                    }`}
                  >
                    {i === 0 ? "100%" : i === 1 ? "60%" : "0%"}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      i === 0
                        ? "bg-green-500 w-full"
                        : i === 1
                        ? "bg-yellow-500 w-3/5"
                        : "bg-slate-600 w-0"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to learn effectively
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Built specifically for developers who want to stay organized and
            make real progress.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-colors"
              >
                <div className={`p-3 rounded-lg ${feature.bg} w-fit mb-4`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Get started in minutes. No complicated setup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="text-blue-400 font-bold text-3xl mb-3">
                  {step.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 z-10">
                  <ArrowRight className="h-5 w-5 text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-blue-600/10 border border-blue-600/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to level up your learning?
          </h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto mb-8">
            Join developers who are tracking their progress and learning smarter
            with AI.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-base px-10"
            >
              Get started for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-slate-400 text-sm">DevTrack AI</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Built for developers, by developers
          </div>
        </div>
      </footer>
    </div>
  );
}