# Gemini API Setup Instructions

## 1. Get Your Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## 2. Add API Key as Environment Variable

Create a `.env` file in your project root and add:

```bash
VITE_GEMINI_API_KEY=your-actual-api-key-here
```

**Important**: Never commit your API key to version control!

## 3. Features

- ✅ **10 AI suggestions per day per user**
- ✅ **Fast response time** (~200-500ms)
- ✅ **Smart fallback** to rule-based suggestions when limit reached
- ✅ **Usage tracking** shown in UI
- ✅ **Completely free** (Gemini free tier: 15 requests/minute, 1500/day)

## 4. Rate Limiting

- Users get 10 AI-powered suggestions per day
- Counter resets at midnight
- When limit reached, switches to intelligent rule-based suggestions
- Usage is stored in browser localStorage

## 5. Fallback System

If API fails or limit reached, the system uses smart rule-based suggestions for:
- Exercise/Fitness habits
- Reading/Study habits  
- Water/Hydration habits
- Meditation/Mindfulness habits
- Sleep habits
- Generic habits

This ensures users always get helpful suggestions! 