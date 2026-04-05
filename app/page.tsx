"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Code2 } from "lucide-react";

const features = [
    {
        title: "Track Your Topics",
        description: "Organize everything you're learning. Create topics, add descriptions, and track your progress in real-time.",
    },
    {
        title: "AI-Generated Notes",
        description: "Let AI generate structured, practical notes for any topic instantly. Edit and make them perfectly yours.",
    },
    {
        title: "Test Your Knowledge",
        description: "Generate quizzes from your notes with one click. Get instant explanations for every multiple choice answer.",
    },
    {
        title: "Visualize Progress",
        description: "Mark topics as Not Started, In Progress, or Completed. Measure your mastery as you grow.",
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-neutral-200 font-sans selection:bg-neutral-800 selection:text-white">
            {/* Navbar */}
            <nav className="border-b border-neutral-900 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
                            <Code2 className="h-5 w-5 text-black" strokeWidth={2.5} />
                        </div>
                        <span className="font-semibold text-lg text-white tracking-tight">DevTrack</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                            Sign in
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-white text-black hover:bg-neutral-200 rounded-none h-10 px-6 font-semibold transition-colors">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 className="text-6xl sm:text-8xl font-medium tracking-tighter text-white leading-[1.05] mb-8">
                                Master concepts. <br className="hidden sm:block" />
                                Faster than ever.
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <p className="text-neutral-400 text-xl sm:text-2xl max-w-2xl mb-12 font-light leading-relaxed">
                                A definitive tracker for developers. Organize your learning journey, generate structured notes, and test your knowledge with AI.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex items-center gap-4 group"
                        >
                            <Link href="/signup">
                                <Button
                                    size="lg"
                                    className="bg-white text-black hover:bg-neutral-200 h-14 px-8 text-base rounded-none font-medium transition-colors"
                                >
                                    Start tracking for free
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Asymmetric Features Section */}
                <section className="border-t border-neutral-900 bg-[#0A0A0A]">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Sticky Left Column */}
                            <div className="p-12 md:p-24 border-b md:border-b-0 md:border-r border-neutral-900 md:sticky top-0 h-fit">
                                <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-white mb-6">
                                    Systematic learning.
                                </h2>
                                <p className="text-neutral-400 text-lg">
                                    Drop the messy text files and generic bookmarks. Build a personal knowledge base that works for you.
                                </p>
                            </div>

                            {/* Scrollable Right Column */}
                            <div>
                                {features.map((feature, i) => (
                                    <div key={i} className="p-12 md:p-24 border-b border-neutral-900 last:border-b-0 hover:bg-[#111] transition-colors duration-500">
                                        <div className="text-neutral-600 font-mono text-sm mb-6">0{i + 1}</div>
                                        <h3 className="text-2xl font-medium text-white mb-4">
                                            {feature.title}
                                        </h3>
                                        <p className="text-neutral-400 leading-relaxed text-lg font-light">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="border-t border-neutral-900 py-32 bg-[#0A0A0A]">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-5xl sm:text-7xl font-medium text-white mb-8 tracking-tight">
                            Start building your knowledge.
                        </h2>
                        <Link href="/signup">
                            <Button
                                size="lg"
                                className="bg-white text-black hover:bg-neutral-200 h-14 px-10 text-base rounded-none font-medium transition-colors"
                            >
                                Create Account
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-900 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-neutral-800 flex items-center justify-center rounded-sm">
                            <Code2 className="h-3 w-3 text-neutral-400" />
                        </div>
                        <span className="text-neutral-500 text-sm font-medium">DevTrack © {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex gap-8 text-sm text-neutral-500">
                        <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}