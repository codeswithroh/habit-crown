import { useState, useEffect } from 'react';
import GeminiService, { type UsageInfo } from '../services/geminiService';
import { useAuth } from './useAuth';

export const useAIUsage = () => {
    const [usageInfo, setUsageInfo] = useState<UsageInfo>({
        remaining: 10,
        total: 10,
        used: 0,
        isLimited: false,
        canMakeRequest: true
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchUsageInfo = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const info = await GeminiService.getUsageInfo();
            setUsageInfo(info);
        } catch (err) {
            console.error('Failed to fetch AI usage info:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch usage info');
            // Set default values on error
            setUsageInfo({
                remaining: 10,
                total: 10,
                used: 0,
                isLimited: false,
                canMakeRequest: true
            });
        } finally {
            setLoading(false);
        }
    };

    const checkCanMakeRequest = async (): Promise<boolean> => {
        if (!user) return false;

        try {
            return await GeminiService.canMakeRequest();
        } catch (err) {
            console.error('Failed to check AI request permission:', err);
            return false;
        }
    };

    const incrementUsage = async (): Promise<UsageInfo> => {
        if (!user) {
            throw new Error('User not authenticated');
        }

        try {
            const newUsageInfo = await GeminiService.incrementUsage();
            setUsageInfo(newUsageInfo);
            return newUsageInfo;
        } catch (err) {
            console.error('Failed to increment AI usage:', err);
            throw err;
        }
    };

    const refreshUsage = () => {
        fetchUsageInfo();
    };

    useEffect(() => {
        fetchUsageInfo();
    }, [user]);

    return {
        usageInfo,
        loading,
        error,
        canMakeRequest: usageInfo.canMakeRequest,
        isLimited: usageInfo.isLimited,
        remaining: usageInfo.remaining,
        used: usageInfo.used,
        total: usageInfo.total,
        checkCanMakeRequest,
        incrementUsage,
        refreshUsage
    };
}; 