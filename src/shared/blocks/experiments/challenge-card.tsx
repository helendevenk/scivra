"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import type { Challenge } from "@/shared/types/experiment";

const POSITIVE_FEEDBACK = [
  "Exactly!",
  "Nice work!",
  "You got it!",
  "That's right!",
  "Spot on!",
  "Nailed it!",
  "Perfect!",
  "You're getting it!",
];

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: (challengeId: string) => void;
  onNeedHelp: (parameterId?: string) => void;
}

type AnswerState = "unanswered" | "correct" | "wrong";

export function ChallengeCard({ challenge, onComplete, onNeedHelp }: ChallengeCardProps) {
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [positiveFeedback] = useState(
    () => POSITIVE_FEEDBACK[Math.floor(Math.random() * POSITIVE_FEEDBACK.length)]
  );

  const handleSelect = (option: string) => {
    if (answerState === "correct") return;

    setSelectedOption(option);

    if (option === challenge.correctAnswer) {
      setAnswerState("correct");
      onComplete(challenge.id);
    } else {
      setAnswerState("wrong");
    }
  };

  const handleTryAgain = () => {
    setAnswerState("unanswered");
    setSelectedOption(null);
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-colors",
        answerState === "correct" && "border-[hsl(var(--np-green))] bg-[hsl(var(--np-green))]/5",
        answerState === "wrong" && "border-[hsl(var(--np-gold))] bg-[hsl(var(--np-gold))]/5",
        answerState === "unanswered" && "border-primary/10 bg-card"
      )}
    >
      {/* Question */}
      <p className="mb-4 font-medium text-foreground">{challenge.question}</p>

      {/* Options */}
      {answerState !== "correct" && (
        <div className="space-y-2">
          {challenge.options?.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                selectedOption === option && answerState === "wrong"
                  ? "border-[hsl(var(--np-gold))] bg-[hsl(var(--np-gold))]/10 text-foreground"
                  : "border-primary/10 bg-card text-foreground hover:bg-accent"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Correct feedback */}
      {answerState === "correct" && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[hsl(var(--np-green))]">✓</span>
          <span className="font-medium text-[hsl(var(--np-green))]">{positiveFeedback}</span>
          <span className="text-muted-foreground">— {challenge.correctAnswer}</span>
        </div>
      )}

      {/* Wrong feedback */}
      {answerState === "wrong" && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-[hsl(var(--np-gold))]">
            {challenge.hint || "Hmm, take another look at the experiment above."}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleTryAgain}
              className="rounded-lg border border-primary/20 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              Try Again
            </button>
            {challenge.relatedParameterId && (
              <button
                type="button"
                onClick={() => onNeedHelp(challenge.relatedParameterId)}
                className="rounded-lg border border-primary/20 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
              >
                Go back to experiment
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
