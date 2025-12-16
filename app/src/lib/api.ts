import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const api = {
  async fetchMarketData(symbol: string, timeframe: string, limit: number = 100) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token || '';

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/fetch-blofin-data?symbol=${symbol}&timeframe=${timeframe}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.json();
  },

  async trainAIStrategy(
    symbol: string,
    timeframe: string,
    startDate: string,
    endDate: string,
    modelName: string,
    openRouterKey: string
  ) {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error('Not authenticated');

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/train-ai-strategy`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
          'X-OpenRouter-Key': openRouterKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol,
          timeframe,
          startDate,
          endDate,
          modelName,
          hyperparameters: {},
        }),
      }
    );
    return response.json();
  },

  async runBacktest(
    strategyId: string,
    symbol: string,
    timeframe: string,
    startDate: string,
    endDate: string,
    initialCapital: number
  ) {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error('Not authenticated');

    const response = await fetch(`${SUPABASE_URL}/functions/v1/run-backtest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        strategy_id: strategyId,
        symbol,
        timeframe,
        start_date: startDate,
        end_date: endDate,
        initial_capital: initialCapital,
      }),
    });
    return response.json();
  },

  async getStrategies() {
    const { data, error } = await supabase.from('strategies').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createStrategy(name: string, type: 'manual' | 'ai' | 'indicator', config: any) {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('strategies')
      .insert({
        user_id: sessionData.session.user.id,
        name,
        type,
        config,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getBacktests() {
    const { data, error } = await supabase.from('backtests').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};
