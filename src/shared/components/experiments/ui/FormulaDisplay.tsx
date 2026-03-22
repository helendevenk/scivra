"use client";

import "katex/dist/katex.min.css";
import type { Formula } from "@/shared/types/experiment";
import katex from "katex";

interface FormulaDisplayProps {
  formulas: Formula[];
}

export function FormulaDisplay({ formulas }: FormulaDisplayProps) {
  return (
    <div className="rounded-lg border border-violet-600/20 bg-card/80 p-4 backdrop-blur-sm dark:border-violet-400/20">
      <h3 className="mb-3 font-serif text-sm font-semibold text-violet-600 dark:text-violet-400">
        Formulas
      </h3>
      <div className="flex flex-col gap-3">
        {formulas.map((formula, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div
              className="font-mono text-lg text-foreground"
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(formula.latex, {
                  throwOnError: false,
                  displayMode: false,
                }),
              }}
            />
            <span className="text-xs text-muted-foreground">
              {formula.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
