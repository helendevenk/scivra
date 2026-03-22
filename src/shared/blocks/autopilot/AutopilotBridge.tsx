'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type {
  AutopilotMessage,
  StepHistoryEntry,
  VisualizationState,
  AutopilotStepResponse,
} from '@/shared/lib/autopilot/types';
import {
  AUTOPILOT_MAX_STEPS,
  AUTOPILOT_STEP_DELAY_MS,
} from '@/shared/lib/autopilot/constants';

interface AutopilotBridgeProps {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  generationId: string;
  prompt: string;
  language: 'zh' | 'en';
  sessionId: string;
  isActive: boolean;
  onSessionEnd: () => void;
  maxSteps?: number;
}

export function AutopilotBridge({
  iframeRef,
  generationId,
  prompt,
  language,
  sessionId,
  isActive,
  onSessionEnd,
  maxSteps = AUTOPILOT_MAX_STEPS,
}: AutopilotBridgeProps) {
  const stepRef = useRef(0);
  const historyRef = useRef<StepHistoryEntry[]>([]);
  const pendingStateResolveRef = useRef<((state: VisualizationState) => void) | null>(null);
  const pendingActionResolveRef = useRef<((result: string) => void) | null>(null);
  const activeRef = useRef(false);

  const postToIframe = useCallback((msg: AutopilotMessage) => {
    iframeRef.current?.contentWindow?.postMessage(msg, '*');
  }, [iframeRef]);

  const waitForState = useCallback((): Promise<VisualizationState> => {
    return new Promise((resolve) => {
      pendingStateResolveRef.current = resolve;
      postToIframe({ type: 'autopilot:get-state', sessionId });
    });
  }, [postToIframe, sessionId]);

  const waitForActionResult = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      pendingActionResolveRef.current = resolve;
    });
  }, []);

  const runLoop = useCallback(async () => {
    // Wait for iframe ready signal (sent by injected script on autopilot:start)
    // State is requested right after ready

    const state = await waitForState();

    while (activeRef.current && stepRef.current <= maxSteps) {
      const stepNumber = stepRef.current;
      const history = [...historyRef.current];

      // Call API
      let response: AutopilotStepResponse;
      try {
        const res = await fetch('/api/autopilot/step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            generationId,
            sessionId,
            task: prompt,
            history,
            visualizationState: state,
            stepNumber,
            language,
          }),
        });
        const json = await res.json();
        if (json.code !== 0 || !json.data) {
          console.error('[AutopilotBridge] API error:', json.message);
          break;
        }
        response = json.data as AutopilotStepResponse;
      } catch (err) {
        console.error('[AutopilotBridge] fetch error:', err);
        break;
      }

      if (!activeRef.current) break;

      const actionName = Object.keys(response.action)[0];

      // Dispatch action to iframe
      postToIframe({
        type: 'autopilot:execute',
        sessionId,
        action: response.action,
      });

      // Wait for action result (except tutor_speak which resolves immediately)
      let actionResult = 'ok';
      if (actionName !== 'tutor_speak') {
        actionResult = await waitForActionResult();
      }

      // Record history entry
      const entry: StepHistoryEntry = {
        stepIndex: stepNumber,
        evaluation: response.reflection.evaluation_previous_goal,
        memory: response.reflection.memory,
        nextGoal: response.reflection.next_goal,
        actionName,
        actionInput: (response.action[actionName] as Record<string, unknown>) ?? {},
        actionResult,
      };
      historyRef.current = [...historyRef.current, entry];
      stepRef.current++;

      if (actionName === 'done') {
        onSessionEnd();
        return;
      }

      // Step delay — give student time to observe
      await new Promise<void>((r) => setTimeout(r, AUTOPILOT_STEP_DELAY_MS));

      // Request updated state for next step
      if (activeRef.current) {
        const newState = await waitForState();
        Object.assign(state, newState);
      }
    }

    if (stepRef.current > maxSteps) {
      onSessionEnd();
    }
  }, [generationId, sessionId, prompt, language, maxSteps, waitForState, waitForActionResult, postToIframe, onSessionEnd]);

  useEffect(() => {
    if (!isActive) return;

    activeRef.current = true;
    stepRef.current = 0;
    historyRef.current = [];

    const handleMessage = (event: MessageEvent) => {
      const msg = event.data as AutopilotMessage;
      if (!msg || msg.sessionId !== sessionId) return;

      if (msg.type === 'autopilot:ready') {
        runLoop();
        return;
      }

      if (msg.type === 'autopilot:state') {
        const resolve = pendingStateResolveRef.current;
        pendingStateResolveRef.current = null;
        resolve?.(msg.state);
        return;
      }

      if (msg.type === 'autopilot:action-result') {
        const resolve = pendingActionResolveRef.current;
        pendingActionResolveRef.current = null;
        resolve?.(msg.result);
        return;
      }
    };

    window.addEventListener('message', handleMessage);

    // Trigger iframe script start
    postToIframe({ type: 'autopilot:start', sessionId });

    return () => {
      activeRef.current = false;
      window.removeEventListener('message', handleMessage);
      postToIframe({ type: 'autopilot:stop', sessionId });
    };
  }, [isActive, sessionId, postToIframe, runLoop]);

  return null; // Pure logic component, no UI
}
