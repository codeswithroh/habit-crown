import { supabase } from './supabase';

// Google Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface UsageInfo {
    remaining: number;
    total: number;
    used: number;
    isLimited: boolean;
    canMakeRequest: boolean;
}

class GeminiService {
    static async canMakeRequest(): Promise<boolean> {
        try {
            const usageInfo = await this.getUsageInfo();
            return usageInfo.canMakeRequest;
        } catch (error) {
            console.warn('Could not check AI usage limit:', error);
            // If we can't check the limit, allow the request but it will fail later
            return true;
        }
    }

    static async getUsageInfo(): Promise<UsageInfo> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('User not authenticated');
            }

            const { data, error } = await supabase.rpc('get_ai_usage_stats', {
                user_uuid: user.id
            });

            if (error) {
                throw error;
            }

            return {
                remaining: data.remaining,
                total: data.total,
                used: data.used,
                isLimited: data.isLimited,
                canMakeRequest: data.canMakeRequest
            };
        } catch (error) {
            console.warn('Could not get AI usage info:', error);
            // Return default values if we can't get usage info
            return {
                remaining: 10,
                total: 10,
                used: 0,
                isLimited: false,
                canMakeRequest: true
            };
        }
    }

    static async incrementUsage(): Promise<UsageInfo> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('User not authenticated');
            }

            const { data, error } = await supabase.rpc('increment_ai_usage', {
                user_uuid: user.id
            });

            if (error) {
                throw error;
            }

            return {
                remaining: data.remaining,
                total: data.total,
                used: data.used,
                isLimited: data.isLimited,
                canMakeRequest: data.canMakeRequest
            };
        } catch (error) {
            console.error('Could not increment AI usage:', error);
            throw error;
        }
    }

    static async checkUsageLimit(): Promise<UsageInfo> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('User not authenticated');
            }

            const { data, error } = await supabase.rpc('check_ai_usage_limit', {
                user_uuid: user.id
            });

            if (error) {
                throw error;
            }

            return {
                remaining: data.remaining,
                total: data.total,
                used: data.used,
                isLimited: data.isLimited,
                canMakeRequest: data.canMakeRequest
            };
        } catch (error) {
            console.warn('Could not check AI usage limit:', error);
            throw error;
        }
    }

    static async generateSuggestions(input: string): Promise<string[]> {
        return this.generateSuggestionsWithContext(input, []);
    }

    static async generateSuggestionsWithContext(input: string, existingHabits: string[] = []): Promise<string[]> {
        // Check rate limit first
        const canMake = await this.canMakeRequest();
        if (!canMake) {
            const usageInfo = await this.getUsageInfo();
            throw new Error(`Daily AI suggestion limit reached (${usageInfo.used}/${usageInfo.total}). Using smart suggestions instead.`);
        }

        // Check if API key is available
        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured');
        }

        try {
            const suggestions = await this.callGeminiAPIWithContext(input, existingHabits);
            if (suggestions && suggestions.length > 0) {
                // Increment usage in database
                await this.incrementUsage();
                return suggestions;
            }
            throw new Error('No suggestions generated');
        } catch (error) {
            console.warn('Gemini API failed:', error);
            throw error;
        }
    }

    private static async callGeminiAPIWithContext(input: string, existingHabits: string[]): Promise<string[]> {
        const existingHabitsText = existingHabits.length > 0
            ? `\n\nUser's existing habits:\n${existingHabits.map(h => `- ${h}`).join('\n')}`
            : '';

        const prompt = `Generate exactly 3 short, one-liner habit suggestions for "${input}". 

Requirements:
- Each habit must be a single, short sentence (max 8 words)
- Make them actionable and specific
- Focus on daily micro-habits
- Avoid duplicating existing habits
- Format as numbered list

Examples:
1. Walk 10,000 steps daily
2. Meditate for 5 minutes each morning
3. Drink water before every meal

Topic: ${input}${existingHabitsText}

Generate 3 new habits:`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 150,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error.message || 'Gemini API error');
        }

        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return this.parseGeminiSuggestions(generatedText, input);
    }

    private static parseGeminiSuggestions(text: string, _input: string): string[] {
        const lines = text.split('\n').filter(line => line.trim());
        const suggestions: string[] = [];

        for (const line of lines) {
            const match = line.match(/^\d+\.\s*(.+)$/);
            if (match && match[1].trim()) {
                suggestions.push(match[1].trim());
            }
        }

        // If parsing fails or we don't have enough suggestions, throw error
        if (suggestions.length < 3) {
            throw new Error('Failed to parse enough suggestions from Gemini response');
        }

        return suggestions.slice(0, 3);
    }
}

// Smart rule-based fallback suggestions (one-liners)
export function generateRuleBasedSuggestions(input: string): string[] {
    const lowerInput = input.toLowerCase();
    const suggestions: string[] = [];

    if (lowerInput.includes('exercise') || lowerInput.includes('workout') || lowerInput.includes('fitness')) {
        suggestions.push(
            'Walk 10,000 steps daily',
            'Do 20 push-ups each morning',
            'Take stairs instead of elevators'
        );
    } else if (lowerInput.includes('read') || lowerInput.includes('book') || lowerInput.includes('study')) {
        suggestions.push(
            'Read 10 pages before bed',
            'Listen to audiobooks while commuting',
            'Read one article during lunch'
        );
    } else if (lowerInput.includes('water') || lowerInput.includes('drink') || lowerInput.includes('hydrat')) {
        suggestions.push(
            'Drink water before every meal',
            'Carry a water bottle everywhere',
            'Set hourly water drinking reminders'
        );
    } else if (lowerInput.includes('meditat') || lowerInput.includes('mindful') || lowerInput.includes('relax')) {
        suggestions.push(
            'Meditate for 5 minutes daily',
            'Practice deep breathing twice daily',
            'Take mindful walks in nature'
        );
    } else if (lowerInput.includes('sleep') || lowerInput.includes('rest')) {
        suggestions.push(
            'Sleep 8 hours every night',
            'Avoid screens before bedtime',
            'Create a consistent bedtime routine'
        );
    } else if (lowerInput.includes('eat') || lowerInput.includes('food') || lowerInput.includes('nutrition')) {
        suggestions.push(
            'Eat 5 servings of vegetables daily',
            'Plan meals every Sunday',
            'Chew food slowly and mindfully'
        );
    } else if (lowerInput.includes('work') || lowerInput.includes('productivity') || lowerInput.includes('focus')) {
        suggestions.push(
            'Use Pomodoro timer for work',
            'Write 3 priorities each morning',
            'Turn off phone during deep work'
        );
    } else {
        suggestions.push(
            `Practice ${input} for 30 minutes`,
            `Set daily ${input} reminders`,
            `Track ${input} progress weekly`
        );
    }

    return suggestions.slice(0, 3);
}

export default GeminiService; 