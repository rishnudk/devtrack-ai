"use client";

import { useState } from "react";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface QuizModalProps {
  topicName: string;
  notes: Note[];
}

export default function QuizModal({ topicName, notes }: QuizModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicName,
          notes: notes.map((n) => ({ title: n.title, content: n.content })),
        }),
      });

      if (!res.ok) throw new Error("Failed to generate quiz");

      const { quiz: generated } = await res.json();
      setQuiz(generated);
      setCurrent(0);
      setSelected(null);
      setAnswered(false);
      setScore(0);
      setFinished(false);
    } catch (error) {
      toast.error("Failed to generate quiz");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option === quiz[current].answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (current + 1 >= quiz.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleReset = () => {
    setQuiz([]);
    setFinished(false);
    setScore(0);
  };

  const question = quiz[current];
  const scorePercent = Math.round((score / quiz.length) * 100);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-blue-700 text-primary hover:text-blue-300 hover:bg-primary/10 hover:border-blue-600"
        >
          <BrainCircuit className="h-4 w-4 mr-2" />
          Take Quiz
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card border-slate-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            Quiz — {topicName}
          </DialogTitle>
        </DialogHeader>

        {/* Start screen */}
        {quiz.length === 0 && !loading && (
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-primary text-primary-foreground/10 rounded-full">
              <BrainCircuit className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="text-white font-semibold">Test your knowledge</p>
              <p className="text-muted-foreground text-sm mt-1">
                AI will generate 5 questions based on your notes for{" "}
                <span className="text-white">{topicName}</span>
              </p>
            </div>
            <Button
              onClick={handleGenerate}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              <BrainCircuit className="h-4 w-4 mr-2" />
              Generate Quiz
            </Button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-12 flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Generating quiz questions...</p>
          </div>
        )}

        {/* Quiz in progress */}
        {!loading && quiz.length > 0 && !finished && question && (
          <div className="space-y-4 py-2">
            {/* Progress */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Question {current + 1} of {quiz.length}
              </span>
              <span>Score: {score}</span>
            </div>

            <div className="w-full bg-card rounded-full h-1.5">
              <div
                className="bg-primary text-primary-foreground h-1.5 rounded-full transition-all"
                style={{ width: `${((current + 1) / quiz.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <p className="text-white font-medium leading-relaxed">
              {question.question}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {question.options.map((option) => {
                const isCorrect = option === question.answer;
                const isSelected = option === selected;

                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors",
                      !answered
                        ? "border-slate-700 text-foreground hover:border-slate-500 hover:bg-card"
                        : isCorrect
                        ? "border-green-500 bg-green-500/10 text-green-400"
                        : isSelected
                        ? "border-red-500 bg-red-500/10 text-red-400"
                        : "border-slate-700 text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {answered && isCorrect && (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                      {answered && isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <div className="bg-card rounded-lg p-3 text-sm text-foreground">
                <span className="text-white font-medium">Explanation: </span>
                {question.explanation}
              </div>
            )}

            {answered && (
              <Button
                onClick={handleNext}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {current + 1 >= quiz.length ? "See Results" : "Next Question"}
              </Button>
            )}
          </div>
        )}

        {/* Results screen */}
        {finished && (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div
              className={cn(
                "p-4 rounded-full",
                scorePercent >= 80
                  ? "bg-green-500/10"
                  : scorePercent >= 50
                  ? "bg-yellow-500/10"
                  : "bg-red-500/10"
              )}
            >
              <BrainCircuit
                className={cn(
                  "h-10 w-10",
                  scorePercent >= 80
                    ? "text-green-400"
                    : scorePercent >= 50
                    ? "text-yellow-400"
                    : "text-red-400"
                )}
              />
            </div>

            <div>
              <p className="text-white font-semibold text-xl">
                {score} / {quiz.length} correct
              </p>
              <Badge
                className={cn(
                  "mt-2",
                  scorePercent >= 80
                    ? "bg-green-500/20 text-green-400"
                    : scorePercent >= 50
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                )}
              >
                {scorePercent >= 80
                  ? "Excellent!"
                  : scorePercent >= 50
                  ? "Good effort!"
                  : "Keep studying!"}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-slate-700 text-foreground hover:text-white"
              >
                Try Again
              </Button>
              <Button
                onClick={() => setOpen(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}