# AIPayMind Frontend

> React + TypeScript frontend for PayMind - AI-powered payment solution on Arc blockchain

## Overview

AIPayMind is the frontend application for PayMind, built with React 18, TypeScript, and Tailwind CSS. It provides a modern, intuitive interface for managing USDC payments, interacting with DeFi protocols, and leveraging AI-powered payment automation.

## Features

### ✅ Dashboard
- Real-time USDC balance tracking
- Active payments monitoring
- Monthly volume analytics
- Recent transaction history
- Quick action buttons

### ✅ Payment Modal
- Send USDC payments instantly
- Real-time API integration
- Loading and success states
- Error handling with helpful messages
- Auto-refresh after transactions

### ✅ AI Chat Assistant
- Natural language payment processing
- Conversation history
- Real-time AI responses
- Loading indicators
- Example commands

### ✅ Transaction History
- Complete transaction list
- Status filtering
- Date sorting
- Amount and recipient display

### ✅ Profile Management
- User information
- Wallet address display
- Settings configuration

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Router** - Navigation
- **Lucide React** - Icons

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env:
# VITE_API_URL=http://localhost:5000

# Start development server
npm run dev
```

The app will be available at: **http://localhost:5173**

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## Project Structure

```
src/
├── api/
│   ├── api.ts              # Real API integration
│   └── mockApi.ts          # Mock data fallback
├── pages/
│   ├── Dashboard.tsx       # Main dashboard
│   ├── Chat.tsx           # AI assistant
│   ├── Transactions.tsx   # Transaction history
│   ├── Profile.tsx        # User profile
│   ├── Landing.tsx        # Landing page
│   └── Login.tsx          # Login page
├── components/
│   ├── ChatBox.tsx        # Chat interface
│   ├── Button.tsx         # Reusable button
│   ├── Card.tsx           # Card container
│   ├── Navbar.tsx         # Navigation bar
│   ├── Sidebar.tsx        # Sidebar navigation
│   ├── Table.tsx          # Data table
│   └── Loader.tsx         # Loading spinner
├── layouts/
│   └── DashboardLayout.tsx  # Dashboard layout wrapper
├── utils/
│   └── auth.ts            # Authentication utilities
├── App.tsx                # Main app component
└── main.tsx              # Entry point
```

## API Integration

The frontend connects to the backend API at `http://localhost:5000` (configurable via `.env`).

### API Client (`src/api/api.ts`)

```typescript
// Dashboard
getDashboardStats()
getRecentTransactions(limit)

// Payments
sendPayment(data)
schedulePayment(data)
createConditionalPayment(data)
estimatePaymentFee(data)

// DeFi
executeSwap(data)
supplyToLending(data)
borrowFromLending(data)
addLiquidity(data)
autoRebalance(data)

// Creator
sendMicropayment(data)
sendTip(data)
createSubscription(data)

// Chat
sendChatMessage(message, history)
```

## Configuration

### Environment Variables (.env)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

### Development

For local development without backend:
- Mock data automatically loads if API is unavailable
- All UI components work with sample data
- Perfect for UI development and testing

### Production

```bash
# Build for production
npm run build

# Output will be in dist/
# Deploy dist/ folder to your hosting service
```

## Components

### Button Component
Reusable button with variants (primary, secondary, outline).

### Card Component
Container component for content sections.

### ChatBox Component
AI chat interface with message history and input.

### Dashboard Layout
Main layout wrapper with sidebar and navigation.

## Features in Detail

### Quick Actions

All buttons are fully functional:

1. **Send Payment**
   - Opens modal with payment form
   - Validates input
   - Calls backend API
   - Shows success/error feedback

2. **Schedule**
   - Navigates to AI Assistant
   - For scheduling recurring payments

3. **AI Assistant**
   - Navigates to chat interface
   - Natural language commands

4. **History**
   - Navigates to transactions page
   - Full transaction list

### Payment Modal States

1. **Default State**: Form with recipient, amount, note
2. **Loading State**: "Sending..." with disabled buttons
3. **Success State**: Green checkmark + confirmation
4. **Error State**: Red error message with retry option

### AI Chat Interface

- Send natural language commands
- View conversation history
- Automatic scrolling
- Loading indicators
- Example commands displayed

## Styling

Built with Tailwind CSS:

```typescript
// Example usage
<div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
    Action
  </button>
</div>
```

## Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Code splitting** with React Router
- **Lazy loading** for pages
- **Optimized builds** with Vite
- **Fast HMR** during development

## Deployment

### Vercel
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --dir=dist
```

### AWS S3
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

## Troubleshooting

### Port 5173 already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
# Or change port in vite.config.ts
```

### API connection errors
- Ensure backend is running on port 5000
- Check VITE_API_URL in .env
- Verify CORS is enabled in backend

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) in the root directory.

## License

MIT License - see [LICENSE](../LICENSE) file for details.

## Links

- **Main README**: [../README.md](../README.md)
- **Backend README**: [../PayMind/README.md](../PayMind/README.md)
- **API Reference**: [../API_REFERENCE.md](../API_REFERENCE.md)
- **Setup Guide**: [../SETUP.md](../SETUP.md)

---

**Built with ❤️ for the Arc Hackathon 2025**
