# AI SDK Integration - Chatbot Feature

## ✅ Implementation Complete

Successfully integrated AI SDK 6 with a floating chatbot widget for SourceKom.

## Features Implemented

### 1. **Chat Widget Component** (`src/components/chat/chat-widget.tsx`)
- Floating chat button (bottom-right)
- Expandable chat window
- Minimize/maximize functionality
- Real-time streaming responses
- Message history
- User and assistant message styling
- Loading states

### 2. **Chat API Route** (`src/app/api/chat/route.ts`)
- OpenAI GPT-4o-mini integration
- Streaming responses
- SourceKom-specific system prompt
- Error handling
- Token limits (500 max tokens)

### 3. **Layout Integration**
- Added to `AppLayout` component
- Hidden on admin/dashboard pages
- Always visible on public pages

## Setup Required

### Environment Variables

Add to your `.env.local` file:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to your environment variables

## Usage

The chatbot appears automatically on all public pages:
- Homepage (`/`)
- About (`/about`)
- Services (`/services/*`)
- Legal (`/legal/*`)
- Contact (`/contact`)
- Browse (`/browse`)
- Resources (`/resources`)

Hidden on:
- Dashboard (`/dashboard`)
- Upload (`/upload`)
- Admin (`/admin`)

## Chatbot Capabilities

The AI assistant can:
- Answer questions about SourceKom's services
- Provide information about logistics, supply chain, resource optimization
- Guide users to contact forms
- Answer legal service questions
- Provide Saudi Arabian business context
- Direct users to appropriate resources

## Technical Details

- **Package**: `ai` and `@ai-sdk/openai`
- **Model**: GPT-4o-mini
- **Streaming**: Real-time response streaming
- **UI**: Custom chat widget with shadcn/ui components
- **State Management**: `useChat` hook from AI SDK

## Next Steps

1. Add `OPENAI_API_KEY` to environment variables
2. Test the chatbot on the homepage
3. Customize system prompt if needed
4. Add rate limiting if required
5. Monitor API usage and costs

## Files Created/Modified

- ✅ `src/app/api/chat/route.ts` - Chat API endpoint
- ✅ `src/components/chat/chat-widget.tsx` - Chat widget component
- ✅ `src/components/layout/app-layout.tsx` - Added chat widget integration
- ✅ `package.json` - Added `ai` and `@ai-sdk/openai` dependencies

## Testing

1. Start development server: `npm run dev`
2. Navigate to homepage
3. Click the chat button in bottom-right corner
4. Send a test message
5. Verify streaming response works

Ensure `OPENAI_API_KEY` is set in your environment variables!

