# Preview Instructions

## Application Successfully Built!

Your AI Trading Strategy Sandbox is ready. The application has been built to `dist/app/`.

## What's Working

✅ **Full-Stack Application**
- React frontend with authentication
- Supabase backend with PostgreSQL database
- Edge Functions for API operations
- Market data integration with Blofin
- AI strategy training with OpenRouter
- Backtesting engine

✅ **Database Schema**
- All tables created with Row Level Security
- market_data, strategies, backtests, ai_training_sessions, proxy_pool

✅ **Edge Functions Deployed**
- fetch-blofin-data (market data with proxy rotation)
- train-ai-strategy (AI-powered strategy generation)
- run-backtest (backtest execution)
- initialize-proxies (proxy pool management)

## Using the Preview

The preview server will automatically serve the built application from `dist/app/`.

### First Steps

1. **Sign Up**: Create an account using your email and password
2. **Fetch Market Data**:
   - Select a symbol (BTC-USDT, ETH-USDT, etc.)
   - Choose a timeframe (1m, 5m, 1H, 4H, 1D)
   - Click "Fetch Data"

3. **Create Strategies**:
   - Manual strategies for custom rules
   - AI strategies (requires OpenRouter API key)
   - Indicator-based strategies

4. **Run Backtests**:
   - Select a strategy
   - Set date range and capital
   - View performance metrics

## Environment

The application is pre-configured with your Supabase credentials from `.env`:
- VITE_SUPABASE_URL: https://ildtvadvpcabvjxelmog.supabase.co
- VITE_SUPABASE_ANON_KEY: (configured)

## Features Available

### Market Data
- Real-time data from Blofin exchange
- Multiple cryptocurrencies
- Various timeframes
- Proxy rotation for rate limit avoidance

### Strategy Management
- Create, view, and select strategies
- Track performance metrics
- Compare multiple strategies

### AI Training
- Generate strategies using AI models
- Analyze historical patterns
- Automatic risk management
- (Requires OpenRouter API key from https://openrouter.ai)

### Backtesting
- Run strategies on historical data
- View detailed metrics: return, drawdown, Sharpe ratio, win rate
- Compare backtest results
- Review trade history

## Proxy Configuration

To add your proxy URLs:
1. Update `supabase/functions/initialize-proxies/index.ts`
2. Add your 50+ proxy URLs to the PROXY_LIST array
3. Run initialization via the Edge Function

## Next Steps

1. Try creating your first strategy
2. Fetch some market data
3. Run a backtest to see performance
4. Optionally: Get an OpenRouter API key to train AI strategies
5. Add your proxy URLs for production use

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **APIs**: Blofin (market data) + OpenRouter (AI)
- **Indicators**: 60+ technical indicators included

## Support

All backend services are deployed and ready. The application will connect automatically to your Supabase instance.

Enjoy your AI Trading Strategy Sandbox!
