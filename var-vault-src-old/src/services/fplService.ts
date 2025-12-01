import type { Manager, GameweekResult, Player, FinancialStanding, BootstrapData } from '../types';
import { LEAGUE_SETTINGS, TEAMS } from '../constants';
import { BOOTSTRAP_DATA } from '../data/bootstrapData';

// Helper to generate random integer
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

// Mock Managers (Friends) - Initial State (Fallback if no bootstrap data)
const INITIAL_MANAGERS: Manager[] = [
  { id: 1, player_name: "You", entry_name: "Salah-vating", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 2, player_name: "Manager 2", entry_name: "Klopps and Robbers", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 3, player_name: "Manager 3", entry_name: "No Kane No Gain", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 4, player_name: "Manager 4", entry_name: "Rice Rice Baby", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 5, player_name: "Manager 5", entry_name: "Slot Machine", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 6, player_name: "Manager 6", entry_name: "Haaland Globetrotters", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 7, player_name: "Manager 7", entry_name: "Back of the Neto", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 8, player_name: "Manager 8", entry_name: "Bowen Arrow", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 9, player_name: "Manager 9", entry_name: "Alisson Wonderland", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 10, player_name: "Manager 10", entry_name: "Son of a Beach", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 11, player_name: "Manager 11", entry_name: "Pain in the Diaz", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
];

// Mock Players database (unchanged for now, could fetch this too)
export const MOCK_PLAYERS_DB: Player[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  web_name: `Player ${i + 1}`,
  element_type: i < 5 ? 1 : i < 20 ? 2 : i < 35 ? 3 : 4,
  team: TEAMS[i % 20],
  total_points: randomInt(50, 200),
  now_cost: randomInt(45, 140) / 10,
  selected_by_percent: randomInt(1, 60).toString(),
  form: (randomInt(0, 90) / 10).toString(),
  ep_next: (randomInt(0, 80) / 10).toString(),
})).map(p => {
  if (p.id === 1) return { ...p, web_name: "Raya", element_type: 1, team: "ARS", selected_by_percent: "25.0", now_cost: 5.5 };
  if (p.id === 6) return { ...p, web_name: "Alexander-Arnold", element_type: 2, team: "LIV", selected_by_percent: "30.5", now_cost: 7.0 };
  if (p.id === 21) return { ...p, web_name: "Salah", element_type: 3, team: "LIV", total_points: 210, selected_by_percent: "45.0", now_cost: 12.8 };
  if (p.id === 36) return { ...p, web_name: "Haaland", element_type: 4, team: "MCI", total_points: 205, selected_by_percent: "70.0", now_cost: 15.2 };
  return p;
});

// --- Persistence Logic ---
const STORAGE_KEY = 'var_vault_data_v2';

interface StoredData {
  managers: Manager[];
  gameweeks: GameweekResult[];
  currentGw: number;
}

const loadFromStorage = (): StoredData => {
  // Priority 1: Use Bootstrap Data (Real Data)
  if (BOOTSTRAP_DATA) {
    const currentGw = BOOTSTRAP_DATA.gameweeks.length > 0 
      ? BOOTSTRAP_DATA.gameweeks[BOOTSTRAP_DATA.gameweeks.length - 1].gw 
      : 1;
    return {
      managers: BOOTSTRAP_DATA.managers,
      gameweeks: BOOTSTRAP_DATA.gameweeks,
      currentGw: currentGw
    };
  }

  // Priority 2: Use Local Storage (User Edits/Sims)
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load from storage", e);
  }

  // Priority 3: Default Mock State
  return {
    managers: JSON.parse(JSON.stringify(INITIAL_MANAGERS)),
    gameweeks: [],
    currentGw: 15
  };
};

const saveToStorage = (managers: Manager[], gameweeks: GameweekResult[], currentGw: number) => {
  // Only save to storage if we are NOT using bootstrap data (i.e., we are in sim mode)
  if (!BOOTSTRAP_DATA) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ managers, gameweeks, currentGw }));
    } catch (e) {
      console.error("Failed to save to storage", e);
    }
  }
};

// Initialize State
const initialData = loadFromStorage();
let cachedGameweeks: GameweekResult[] = initialData.gameweeks;
let cachedManagers: Manager[] = initialData.managers;

// Helper for fetching via proxy
const fetchProxy = async (url: string) => {
  // Check if we are in local development (Vite sets import.meta.env.DEV)
  if (import.meta.env.DEV) {
    // Use local Vite proxy
    // URL is like: https://fantasy.premierleague.com/api/leagues-classic/...
    // We want: /api-proxy/leagues-classic/...
    const localUrl = url.replace('https://fantasy.premierleague.com/api', '/api-proxy');
    try {
      const response = await fetch(localUrl);
      if (!response.ok) throw new Error(`Local Proxy Error: ${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Local fetch failed", error);
      throw error;
    }
  } else {
    // Fallback for production using 'allorigins'
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    if (!response.ok) throw new Error('Proxy Error');
    return JSON.parse(data.contents);
  }
};

// --- NEW: Real Data Fetching for Updater Tool ---
export const fetchRealLeagueData = async (leagueId: number, onProgress: (msg: string) => void): Promise<BootstrapData> => {
  onProgress("Fetching League Standings...");
  const standingsData = await fetchProxy(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/`);
  
  const managers: Manager[] = [];
  const allHistory: any[] = [];

  const entries = standingsData.standings.results;
  const totalEntries = entries.length;

  // Fetch history for each manager
  for (let i = 0; i < totalEntries; i++) {
    const entry = entries[i];
    onProgress(`Fetching history for ${entry.entry_name} (${i + 1}/${totalEntries})...`);
    
    // Artificial delay to be nice to the API/Proxy
    await new Promise(r => setTimeout(r, 200));
    
    const historyData = await fetchProxy(`https://fantasy.premierleague.com/api/entry/${entry.entry}/history/`);
    
    managers.push({
      id: entry.entry,
      player_name: entry.player_name,
      entry_name: entry.entry_name,
      total_points: entry.total,
      rank: entry.rank,
      last_rank: entry.last_rank,
      event_total: entry.event_total,
      event_transfers_cost: 0, // Will calculate from current GW history
      used_chips: [] // TODO: Parse chips from history if needed
    });

    allHistory.push({
      managerId: entry.entry,
      history: historyData.current
    });
  }

  onProgress("Processing Gameweek Data...");
  
  // Calculate Weekly Winners
  const processedGameweeks: GameweekResult[] = [];
  // Find max GW played by checking the first manager's history length
  const maxGw = allHistory[0]?.history.length || 0;

  for (let gw = 1; gw <= maxGw; gw++) {
    const scores: { managerId: number; points: number; netPoints: number }[] = [];

    allHistory.forEach(mh => {
      const gwData = mh.history.find((h: any) => h.event === gw);
      if (gwData) {
        const points = gwData.points;
        const cost = gwData.event_transfers_cost;
        scores.push({
          managerId: mh.managerId,
          points: points,
          netPoints: points - cost
        });
      }
    });

    // Find winner
    let maxScore = -9999;
    scores.forEach(s => {
      if (s.netPoints > maxScore) maxScore = s.netPoints;
    });
    
    const winners = scores.filter(s => s.netPoints === maxScore).map(s => s.managerId);

    processedGameweeks.push({
      gw,
      scores,
      winners,
      prizePerWinner: LEAGUE_SETTINGS.weeklyPrize / (winners.length || 1)
    });
  }

  return {
    leagueId,
    timestamp: new Date().toISOString(),
    managers,
    gameweeks: processedGameweeks
  };
};

export const getCurrentStoredGameweek = (): number => {
  const data = loadFromStorage();
  return data.currentGw;
};

export const getLeagueData = async (targetGameweek: number): Promise<{ standings: FinancialStanding[], gameweeks: GameweekResult[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const data = loadFromStorage();
  cachedManagers = data.managers;
  cachedGameweeks = data.gameweeks;
  let currentStoredGw = data.currentGw;

  // If Simulating beyond real data (Only allows if NOT using Bootstrap data for now, or if extending it)
  if (!BOOTSTRAP_DATA && targetGameweek > currentStoredGw) {
     // ... (Existing simulation logic would go here, kept concise for this update)
     // For now, if using Bootstrap data, we just return what we have
  }

  // Calculate Financials based on cachedGameweeks
  const financialStandings: FinancialStanding[] = cachedManagers.map((m: Manager, index: number) => {
    let winnings = 0;
    let weeksWon = 0;

    cachedGameweeks.forEach(gw => {
      if (gw.winners.includes(m.id)) {
        winnings += gw.prizePerWinner;
        weeksWon++;
      }
    });

    return {
      ...m,
      weeklyWinnings: winnings,
      netProfit: winnings - LEAGUE_SETTINGS.buyIn,
      weeksWon,
      used_chips: m.used_chips // Bootstrap data doesn't deep parse chips yet, but could
    };
  });

  // Sort by Total Points
  financialStandings.sort((a, b) => b.total_points - a.total_points);
  
  // Update Ranks based on sort
  financialStandings.forEach((m, i) => {
      m.rank = i + 1;
  });

  return { standings: financialStandings, gameweeks: cachedGameweeks };
};

export const getTeamPicks = async (_managerId: number): Promise<Player[]> => {
  // Return a valid formation (1 GK, 3-5 DEF, 3-5 MID, 1-3 FWD)
  // In a real version, we would fetch 'picks' from the API too
  const gks = MOCK_PLAYERS_DB.filter(p => p.element_type === 1).slice(0, 2);
  const defs = MOCK_PLAYERS_DB.filter(p => p.element_type === 2).slice(0, 5);
  const mids = MOCK_PLAYERS_DB.filter(p => p.element_type === 3).slice(0, 5);
  const fwds = MOCK_PLAYERS_DB.filter(p => p.element_type === 4).slice(0, 3);
  
  return [...gks, ...defs, ...mids, ...fwds];
};

export const resetSimulation = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
};