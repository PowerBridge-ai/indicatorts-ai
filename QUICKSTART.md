# AI Trading Strategy Sandbox - Quick Start

## What's Been Built

A complete full-stack AI trading application with:

### Backend (Supabase)
- **PostgreSQL Database** with tables for market data, strategies, backtests, AI training sessions, and proxy pool
- **Row Level Security (RLS)** on all tables for secure user data isolation
- **Edge Functions** (serverless API):
  - `fetch-blofin-data` - Fetches market data from Blofin with proxy rotation
  - `train-ai-strategy` - Trains strategies using OpenRouter AI models
  - `run-backtest` - Executes backtests with performance metrics
  - `initialize-proxies` - Manages proxy pool for rate limit avoidance

### Frontend (React + Vite)
- **Modern React UI** built with TypeScript
- **Real-time charting** using Recharts
- **State management** with Zustand
- **Authentication** with Supabase Auth
- **Responsive design** with clean, professional styling

### Features
1. **Market Data Management**
   - Fetch OHLCV data from Blofin exchange
   - Multiple symbols (BTC-USDT, ETH-USDT, etc.)
   - Multiple timeframes (1m, 5m, 1H, 4H, 1D)
   - Automatic proxy rotation with load balancing

2. **Strategy Creation**
   - Manual strategies
   - AI-generated strategies (OpenRouter)
   - Indicator-based strategies (from indicatorts library)

3. **AI Training**
   - Analyze historical data with AI models
   - Generate entry/exit rules automatically
   - Risk management parameter suggestions
   - Support for GPT-4, Claude, and other models

4. **Backtesting**
   - Run strategies against historical data
   - Performance metrics: Return, Drawdown, Sharpe, Win Rate
   - Trade history with entry/exit details
   - Compare multiple strategy results

5. **Proxy System**
   - Load balancing across 50+ proxies
   - Automatic rotation to avoid rate limits
   - Health monitoring and error tracking

## Setup Instructions

### 1. Environment Variables

Create `app/.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your Supabase project dashboard at https://supabase.com

### 2. Database Setup

The database schema is already deployed to your Supabase instance with:
- market_data table
- strategies table
- backtests table
- ai_training_sessions table
- proxy_pool table

All tables have RLS enabled and proper policies configured.

### 3. Initialize Proxy Pool

Add your proxy URLs to the `initialize-proxies` Edge Function, then run:

```bash
curl -X POST "https://your-supabase-url.supabase.co/functions/v1/initialize-proxies?action=init"
```

### 4. Get OpenRouter API Key

1. Visit https://openrouter.ai
2. Sign up (free tier available)
3. Generate an API key
4. Use it in the application when training AI strategies

### 5. Build and Deploy

The project is already built. To rebuild:

```bash
npm run build
```

This builds:
- The indicator library (dist/esm, dist/cjs, dist/types)
- The web application (dist/app)

## Using the Application

### First Time Setup

1. **Sign Up**: Create an account in the application
2. **Fetch Market Data**: Select a symbol and timeframe, click "Fetch Data"
3. **View Chart**: Market data will display in the price chart

### Creating Strategies

**Manual Strategy**:
1. Click "New Strategy"
2. Enter a name and select "Manual"
3. Configure the strategy parameters

**AI Strategy**:
1. Ensure you have market data loaded
2. Enter your OpenRouter API key
3. Select an AI model
4. Click "Train Strategy"
5. AI will analyze data and create a strategy

### Running Backtests

1. Select a strategy from the list
2. Configure date range and initial capital
3. Click "Run Backtest"
4. View results: return, drawdown, Sharpe ratio, win rate

### Analyzing Results

- Compare multiple backtests side-by-side
- Review trade history in detail
- Identify best-performing strategies
- Refine strategies based on results

## Proxy Configuration

To add more proxies, update `supabase/functions/initialize-proxies/index.ts`:

```typescript
const PROXY_LIST = [
  'http://proxy-1.example.com:8080',
  'http://proxy-2.example.com:8080',
  // Add up to 50+ proxies
];
```

Then reinitialize the proxy pool.

## API Endpoints

All Edge Functions are deployed and ready:

- `POST /functions/v1/fetch-blofin-data?symbol=BTC-USDT&timeframe=1H&limit=100`
- `POST /functions/v1/train-ai-strategy`
- `POST /functions/v1/run-backtest`
- `POST /functions/v1/initialize-proxies?action=init`

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Recharts, Zustand
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **APIs**: Blofin (market data), OpenRouter (AI models)
- **Library**: indicatorts (60+ technical indicators)

## Next Steps

1. Deploy the app to a hosting platform (Vercel, Netlify, etc.)
2. Add your proxy URLs to the proxy pool
3. Start fetching market data from Blofin
4. Train your first AI strategy
5. Run backtests and optimize

## File Structure

```
project/
├── src/                    # Indicator library (60+ indicators)
├── app/                    # React application
│   ├── src/
│   │   ├── main.tsx       # App entry point
│   │   ├── lib/           # API clients, Supabase config
│   │   ├── components/    # UI components
│   │   └── pages/         # Login page
│   └── index.html
├── dist/
│   ├── app/               # Built web application
│   ├── esm/               # ES module build
│   ├── cjs/               # CommonJS build
│   └── types/             # TypeScript types
├── supabase/functions/    # Edge Functions (deployed)
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies

</ file_structure>

## Support

For issues or questions:
- Check SETUP.md for detailed setup guide
- Review Supabase logs for backend errors
- Check browser console for frontend errors

## License

MIT
