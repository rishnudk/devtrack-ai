"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Code2,
    BookOpen,
    Sparkles,
    BrainCircuit,
    BarChart3,
    ArrowRight,
} from "lucide-react";

const features = [
    {
        icon: BookOpen,
        title: "Track Your Topics",
        description:
            "Organize everything you're learning. Create topics, add descriptions, and track your progress in real-time.",
    },
    {
        icon: Sparkles,
        title: "AI-Generated Notes",
        description:
            "Let AI generate structured, practical notes for any topic instantly. Edit and make them perfectly yours.",
    },
    {
        icon: BrainCircuit,
        title: "Test Your Knowledge",
        description:
            "Generate quizzes from your notes with one click. Get instant explanations for every multiple choice answer.",
    },
    {
        icon: BarChart3,
        title: "Visualize Progress",
        description:
            "Mark topics as Not Started, In Progress, or Completed. Measure your mastery as you grow.",
    },
];

const steps = [
    { step: "01", title: "Create Topic", desc: "Add any concept you want to learn." },
    { step: "02", title: "Generate Notes", desc: "Let AI build a structured guide." },
    { step: "03", title: "Take Quizzes", desc: "Test yourself on the generated notes." },
    { step: "04", title: "Track Mastery", desc: "Update your dashboard progress." },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2C2F27] via-[#2A2D25] to-[#30332B] text-[#EDEDED] selection:bg-[#7C5CFF]/30 selection:text-white font-sans overflow-x-hidden">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-[#40443A]/50 bg-[#2C2F27]/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-[#3A3D34] rounded-xl border border-[#40443A]">
                            <Code2 className="h-5 w-5 text-[#C4FF3D]" />
                        </div>
                        <span className="font-bold text-lg text-[#EDEDED] tracking-tight">DevTrack<span className="text-[#8A8F85]">.ai</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <span className="text-sm font-medium text-[#B5B8AE] hover:text-[#EDEDED] transition-colors cursor-pointer">
                                Sign in
                            </span>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-[#D9D9D9] text-[#2C2F27] hover:bg-white border-none rounded-lg font-semibold shadow-sm transition-all hover:scale-105 active:scale-95">
                                Join Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative max-w-6xl mx-auto px-6 py-24 sm:py-32 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-[#3A3D34]/50 border border-[#40443A] rounded-full px-4 py-1.5 text-[#C4FF3D] text-xs font-semibold mb-8 uppercase tracking-wider shadow-sm"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        AI-Powered Developer Tracker
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#EDEDED] to-[#B5B8AE] tracking-tight leading-tight max-w-4xl mb-6 drop-shadow-sm"
                    >
                        Master any tech stack, <br className="hidden sm:block" />
                        <span className="text-[#7C5CFF]">faster than ever.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-[#B5B8AE] text-lg sm:text-xl max-w-2xl mb-12 leading-relaxed"
                    >
                        Organize your learning journey, generate structured notes with AI, and test your knowledge with auto-generated quizzes—all in one premium workspace.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center justify-center gap-4 flex-wrap"
                    >
                        <Link href="/signup">
                            <Button
                                size="lg"
                                className="bg-[#D9D9D9] text-[#2C2F27] hover:bg-white text-base px-8 h-12 rounded-xl font-bold transition-all shadow-lg shadow-white/5 hover:scale-105 active:scale-95"
                            >
                                Start Learning Free
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-[#40443A] bg-[#3A3D34]/50 text-[#EDEDED] hover:bg-[#40443A] hover:text-white text-base px-8 h-12 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                            >
                                Sign In
                            </Button>
                        </Link>
                    </motion.div>
                </section>

                {/* Features Cards Section */}
                <section className="max-w-6xl mx-auto px-6 py-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    className="bg-[#3A3D34] border border-[#40443A] rounded-2xl p-6 group transition-all hover:bg-[#3A3D34]/80 shadow-lg shadow-black/10"
                                >
                                    <div className="p-3 rounded-xl bg-[#2C2F27] border border-[#40443A] w-fit mb-5 group-hover:border-[#7C5CFF]/50 transition-colors">
                                        <Icon className="h-6 w-6 text-[#7C5CFF]" />
                                    </div>
                                    <h3 className="text-[#EDEDED] font-bold text-lg mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[#8A8F85] leading-relaxed text-sm group-hover:text-[#B5B8AE] transition-colors">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* How it Works / Steps */}
                <section className="max-w-6xl mx-auto px-6 py-24 border-t border-[#40443A]/40 mt-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#EDEDED] mb-4">
                            Your frictionless learning loop
                        </h2>
                        <p className="text-[#B5B8AE] max-w-xl mx-auto">
                            Everything you need to go from a beginner to a master.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                className="relative bg-[#3A3D34]/40 border border-[#40443A]/60 rounded-2xl p-6 backdrop-blur-sm z-10"
                            >
                                <span className="text-[#C4FF3D] font-black text-4xl opacity-50 block mb-4">
                                    {step.step}
                                </span>
                                <h3 className="text-[#EDEDED] font-bold mb-2 text-lg">{step.title}</h3>
                                <p className="text-[#8A8F85] text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="max-w-4xl mx-auto px-6 py-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-[#7C5CFF]/20 to-transparent border border-[#7C5CFF]/30 rounded-[2rem] p-12 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[#3A3D34]/20 backdrop-blur-3xl -z-10" />
                        <Sparkles className="h-8 w-8 text-[#C4FF3D] mx-auto mb-6 opacity-80" />
                        <h2 className="text-3xl sm:text-5xl font-bold text-[#EDEDED] mb-6 tracking-tight">
                            Ready to learn without limits?
                        </h2>
                        <p className="text-[#B5B8AE] text-lg mb-8 max-w-xl mx-auto">
                            Drop the messy text files and generic bookmarks. Build a personal knowledge base that tests you natively.
                        </p>
                        <Link href="/signup">
                            <Button
                                size="lg"
                                className="bg-[#D9D9D9] text-[#2C2F27] hover:bg-white text-base px-10 h-14 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 border-none shadow-xl shadow-[#7C5CFF]/20"
                            >
                                Create Free Account
                            </Button>
                        </Link>
                    </motion.div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#40443A]/50 bg-[#2C2F27] py-10 mt-10">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-[#3A3D34] rounded">
                            <Code2 className="h-4 w-4 text-[#8A8F85]" />
                        </div>
                        <span className="text-[#8A8F85] text-sm font-medium">DevTrack.ai © {new Date().getFullYear()}</span>
                    </div>
                    <div className="text-[#8A8F85] text-sm flex gap-6">
                        <span className="cursor-pointer hover:text-[#EDEDED] transition-colors">Privacy</span>
                        <span className="cursor-pointer hover:text-[#EDEDED] transition-colors">Terms</span>
                        <span className="cursor-pointer hover:text-[#EDEDED] transition-colors">Contact</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}