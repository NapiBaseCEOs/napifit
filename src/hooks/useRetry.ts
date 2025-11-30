import { useState, useCallback } from "react";

interface UseRetryOptions {
    maxAttempts?: number;
    delay?: number;
    onError?: (error: Error, attempt: number) => void;
}

export function useRetry<T>(
    fn: () => Promise<T>,
    options: UseRetryOptions = {}
) {
    const { maxAttempts = 3, delay = 1000, onError } = options;
    const [isRetrying, setIsRetrying] = useState(false);
    const [attempt, setAttempt] = useState(0);

    const execute = useCallback(async (): Promise<T> => {
        setIsRetrying(true);
        setAttempt(0);

        for (let i = 0; i < maxAttempts; i++) {
            try {
                setAttempt(i + 1);
                const result = await fn();
                setIsRetrying(false);
                return result;
            } catch (error) {
                const err = error as Error;
                onError?.(err, i + 1);

                if (i === maxAttempts - 1) {
                    setIsRetrying(false);
                    throw error;
                }

                // Wait before retrying
                await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
            }
        }

        setIsRetrying(false);
        throw new Error("Max retry attempts reached");
    }, [fn, maxAttempts, delay, onError]);

    return { execute, isRetrying, attempt };
}

// Helper function for retry with exponential backoff
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxAttempts = 3,
    baseDelay = 1000
): Promise<T> {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxAttempts - 1) throw error;

            const delay = baseDelay * Math.pow(2, i);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw new Error("Max retry attempts reached");
}
