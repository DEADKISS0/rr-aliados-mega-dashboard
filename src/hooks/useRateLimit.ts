"use client";
import { useState, useRef, useCallback } from "react";

interface UseRateLimitOptions {
  maxAttempts: number;
  windowMs: number;
}

interface RateLimitState {
  attempts: number;
  canAttempt: boolean;
  resetTime: number | null;
  recordAttempt: () => void;
}

export function useRateLimit({ maxAttempts = 3, windowMs = 60000 }: UseRateLimitOptions): RateLimitState {
  const [attempts, setAttempts] = useState(0);
  const [resetTime, setResetTime] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recordAttempt = useCallback(() => {
    setAttempts((prev) => {
      const next = prev + 1;
      if (next >= maxAttempts) {
        const now = Date.now();
        setResetTime(now + windowMs);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setAttempts(0);
          setResetTime(null);
        }, windowMs);
      }
      return next;
    });
  }, [maxAttempts, windowMs]);

  const canAttempt = attempts < maxAttempts;

  return { attempts, canAttempt, recordAttempt, resetTime };
}