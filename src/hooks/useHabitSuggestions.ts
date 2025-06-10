import { useState, useCallback, useEffect } from 'react';
import { useHabits } from './useHabits';
import GeminiService, { generateRuleBasedSuggestions, type UsageInfo } from '../services/geminiService';

interface UseHabitSuggestionsReturn {
    suggestions: string[];
    isLoading: boolean;
    error: string | null;
    remainingRequests: number;
    totalRequests: number;
    refreshSuggestions: (input: string) => void;
    clearSuggestions: () => void;
}

export const useHabitSuggestions = (): UseHabitSuggestionsReturn => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usageInfo, setUsageInfo] = useState<UsageInfo>({ remaining: 10, total: 10, isLimited: false, used: 0, canMakeRequest: true });

    const { habits } = useHabits();

    // Update usage info on mount and when suggestions are generated
    const updateUsageInfo = useCallback(() => {
        GeminiService.getUsageInfo().then(info => {
            setUsageInfo(info);
        });
    }, []);

    useEffect(() => {
        updateUsageInfo();
    }, [updateUsageInfo]);

    // Get existing habit names for context
    const getExistingHabits = useCallback(() => {
        return habits.map(habit => habit.name);
    }, [habits]);

    const refreshSuggestions = useCallback(async (input: string) => {
        if (!input.trim()) {
            // Show rule-based suggestions for empty input
            const fallbackSuggestions = generateRuleBasedSuggestions('fitness');
            setSuggestions(fallbackSuggestions);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const existingHabits = getExistingHabits();

            // Try Gemini API first with context
            const aiSuggestions = await GeminiService.generateSuggestionsWithContext(
                input.trim(),
                existingHabits
            );
            setSuggestions(aiSuggestions);
            updateUsageInfo(); // Update usage after successful API call
        } catch (error: any) {
            console.warn('Gemini API failed, using rule-based suggestions:', error);

            // Fall back to rule-based suggestions
            const fallbackSuggestions = generateRuleBasedSuggestions(input.trim());
            setSuggestions(fallbackSuggestions);

            // Set appropriate error message
            if (error.message.includes('Daily AI suggestion limit reached')) {
                setError('Daily AI limit reached (10/day). Showing smart suggestions instead.');
            } else if (error.message.includes('API key not configured')) {
                setError('AI suggestions unavailable. Showing smart suggestions instead.');
            } else {
                setError('AI temporarily unavailable. Showing smart suggestions instead.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [updateUsageInfo, getExistingHabits]);

    const clearSuggestions = useCallback(() => {
        setSuggestions([]);
        setError(null);
    }, []);

    return {
        suggestions,
        isLoading,
        error,
        remainingRequests: usageInfo.remaining,
        totalRequests: usageInfo.total,
        refreshSuggestions,
        clearSuggestions,
    };
}; 