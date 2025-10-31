import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { chatTools } from '@/lib/chat-tools'

export async function POST(request: Request) {
  try {
    const { message, messages = [], userId } = await request.json()

    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Build conversation history
    const conversationHistory = [
      ...(Array.isArray(messages) ? messages : []),
      { role: 'user', content: message }
    ]

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: `You are SourceKom's intelligent AI assistant with FULL end-to-end platform capabilities. You can help users with:

**DISCOVERY & BROWSING**:
1. Search and find resources across the platform
2. Browse resources by category
3. View featured and popular resources
4. Get detailed information about specific resources
5. List all available categories

**E2E PLATFORM FUNCTIONALITY** (users can complete full workflows through chat):
6. **Purchase Resources**: Help users purchase paid resources (will guide them to payment page)
7. **Favorites Management**: Add or remove resources from favorites
8. **Reviews & Ratings**: Submit reviews and ratings for purchased resources
9. **Support Tickets**: Create support tickets for any issues or questions
10. **Contact Forms**: Submit business inquiries, partnership requests, or general contact
11. **Newsletter**: Subscribe users to newsletter and updates
12. **Dashboard Access**: View user dashboard stats, purchases, favorites, and activity
13. **Purchase History**: View user's purchase history and downloads

**IMPORTANT GUIDELINES**:
- When users want to BUY/PURCHASE a resource → Use purchaseResource tool (requires userId)
- When users want to FAVORITE/SAVE a resource → Use favoriteResource tool (requires userId and action: 'favorite'/'unfavorite')
- When users want to REVIEW or RATE a resource → Use submitReview tool (requires userId, rating 1-5, optional comment)
- When users need HELP or have ISSUES → Use createSupportTicket tool (requires subject and message, userId optional)
- When users want to CONTACT the company → Use submitContactForm tool (requires name, email, message)
- When users want NEWSLETTER updates → Use subscribeNewsletter tool (requires email)
- When authenticated users ask about "my dashboard", "my stats", "my account" → Use getUserDashboard tool (requires userId)
- When authenticated users ask about "my purchases" → Use getUserPurchases tool (requires userId)
- Always use search/list tools when users search, browse, or explore
- Always provide helpful URLs and direct links to resources and pages

**Platform Context**:
- SourceKom is a resource sharing and legal consultancy platform in Saudi Arabia
- Resources can be free or paid (priced in SAR - Saudi Riyal)
- Users can browse, search, purchase, favorite, review, and download resources
- Categories: Office Space, Equipment, Personnel, Storage, Vehicles, Legal Services, Digital Products, Templates, Guides
- Payment gateway: MyFatoorah (Saudi Arabia)
- Users must be authenticated for: purchases, favorites, reviews, dashboard access

**Authentication Handling**:
- For authenticated actions (purchase, favorite, review, dashboard), you will receive userId from the request
- If userId is not provided for actions that require it, politely inform the user they need to log in
- Suggest using the login button or typing "login" to authenticate
- Always check if userId is available before calling authenticated tools
- After authentication, warmly welcome the user by name if available

**Response Style**:
- Be friendly, professional, and action-oriented
- After performing actions, provide clear next steps or confirmations
- Always include clickable URLs to relevant pages
- Format resource lists with titles, prices (in SAR), ratings, and brief descriptions
- When purchases are initiated, guide users to the payment page
- Confirm successful actions (favorited, reviewed, subscribed, etc.)
- If a tool fails, explain why and suggest alternatives

**Tool Usage Best Practices**:
- Use tools proactively for actionable requests
- Don't use tools for simple informational questions (answer directly)
- Always interpret tool results and present them clearly
- Provide actionable next steps after tool execution
- Include relevant URLs so users can click through to complete actions`,
      messages: conversationHistory,
      maxTokens: 1500,
      tools: {
        searchResources: tool({
          description: chatTools.searchResources.description,
          parameters: chatTools.searchResources.parameters,
          execute: chatTools.searchResources.execute
        }),
        listResourcesByCategory: tool({
          description: chatTools.listResourcesByCategory.description,
          parameters: chatTools.listResourcesByCategory.parameters,
          execute: chatTools.listResourcesByCategory.execute
        }),
        getResourceDetails: tool({
          description: chatTools.getResourceDetails.description,
          parameters: chatTools.getResourceDetails.parameters,
          execute: chatTools.getResourceDetails.execute
        }),
        listCategories: tool({
          description: chatTools.listCategories.description,
          parameters: chatTools.listCategories.parameters,
          execute: chatTools.listCategories.execute
        }),
        getUserPurchases: tool({
          description: chatTools.getUserPurchases.description,
          parameters: chatTools.getUserPurchases.parameters,
          execute: userId ? chatTools.getUserPurchases.execute : async () => ({
            success: false,
            error: 'Authentication required. Please log in to view your purchases.'
          })
        }),
        getFeaturedResources: tool({
          description: chatTools.getFeaturedResources.description,
          parameters: chatTools.getFeaturedResources.parameters,
          execute: chatTools.getFeaturedResources.execute
        }),
        purchaseResource: tool({
          description: chatTools.purchaseResource.description,
          parameters: chatTools.purchaseResource.parameters,
          execute: userId ? chatTools.purchaseResource.execute : async () => ({
            success: false,
            error: 'Authentication required. Please log in to purchase resources.'
          })
        }),
        favoriteResource: tool({
          description: chatTools.favoriteResource.description,
          parameters: chatTools.favoriteResource.parameters,
          execute: userId ? chatTools.favoriteResource.execute : async () => ({
            success: false,
            error: 'Authentication required. Please log in to favorite resources.'
          })
        }),
        submitReview: tool({
          description: chatTools.submitReview.description,
          parameters: chatTools.submitReview.parameters,
          execute: userId ? chatTools.submitReview.execute : async () => ({
            success: false,
            error: 'Authentication required. Please log in to submit reviews.'
          })
        }),
        createSupportTicket: tool({
          description: chatTools.createSupportTicket.description,
          parameters: chatTools.createSupportTicket.parameters,
          execute: chatTools.createSupportTicket.execute
        }),
        submitContactForm: tool({
          description: chatTools.submitContactForm.description,
          parameters: chatTools.submitContactForm.parameters,
          execute: chatTools.submitContactForm.execute
        }),
        subscribeNewsletter: tool({
          description: chatTools.subscribeNewsletter.description,
          parameters: chatTools.subscribeNewsletter.parameters,
          execute: chatTools.subscribeNewsletter.execute
        }),
        getUserDashboard: tool({
          description: chatTools.getUserDashboard.description,
          parameters: chatTools.getUserDashboard.parameters,
          execute: userId ? chatTools.getUserDashboard.execute : async () => ({
            success: false,
            error: 'Authentication required. Please log in to view your dashboard.'
          })
        })
      }
    })

    return result.toDataStreamResponse()
  } catch (error: any) {
    console.error('Chat API error:', error)
    
    // If OpenAI API key is missing, return helpful error
    if (error.message?.includes('API key') || error.message?.includes('OPENAI')) {
      return Response.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      )
    }
    
    return Response.json(
      { error: 'Failed to process chat message', details: error.message },
      { status: 500 }
    )
  }
}



