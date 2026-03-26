"use client";

import { useCallback, useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import type { LearningCard as LearningCardType } from "@/shared/types/experiment";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LearningCardListProps {
  cards: LearningCardType[];
  onAllExpanded: () => void;
  isMobile?: boolean;
}

export function LearningCardList({
  cards,
  onAllExpanded,
  isMobile = false,
}: LearningCardListProps) {
  const expandedSet = useRef(new Set<string>());

  const handleValueChange = useCallback(
    (value: string[]) => {
      value.forEach((v) => expandedSet.current.add(v));
      if (expandedSet.current.size >= cards.length) {
        onAllExpanded();
      }
    },
    [cards.length, onAllExpanded]
  );

  // Mobile: default all expanded
  const defaultValue = isMobile ? cards.map((c) => c.id) : [];

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      className="space-y-2"
    >
      {cards.map((card) => (
        <AccordionItem
          key={card.id}
          value={card.id}
          className="rounded-lg border border-primary/10 bg-card px-4"
        >
          <AccordionTrigger className="text-foreground hover:no-underline">
            <span className="font-heading text-sm font-semibold">
              {card.title}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {/* Content */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {card.content}
              </p>

              {/* Formula */}
              {card.formula && (
                <div className="rounded-lg bg-primary/5 p-3">
                  <div
                    className="text-center text-lg text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: katex.renderToString(card.formula.latex, {
                        throwOnError: false,
                        displayMode: true,
                      }),
                    }}
                  />
                  <p className="mt-1 text-center text-xs text-muted-foreground">
                    {card.formula.description}
                  </p>
                </div>
              )}

              {/* Related parameter hint */}
              {card.relatedParameterId && (
                <p className="text-xs text-primary">
                  💡 Try adjusting the{" "}
                  <span className="font-medium">{card.relatedParameterId}</span>{" "}
                  slider in the experiment above
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
