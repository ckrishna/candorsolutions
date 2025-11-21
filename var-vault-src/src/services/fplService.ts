import type { Manager, GameweekResult, Player, FinancialStanding } from '../types';
import { LEAGUE_SETTINGS, TEAMS } from '../constants';

// Helper to generate random integer
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

// Mock Managers (Friends) - Initial State
const INITIAL_MANAGERS: Manager[] = [
  { id: 1, player_name: "You", entry_name: "Salah-vating", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 2, player_name: "John", entry_name: "Klopps and Robbers", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 3, player_name: "Sarah", entry_name: "No Kane No Gain", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 4, player_name: "Mike", entry_name: "Rice Rice Baby", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 5, player_name: "Emma", entry_name: "Slot Machine", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 6, player_name: "David", entry_name: "Haaland Globetrotters", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 7, player_name: "Chris", entry_name: "Back of the Neto", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 8, player_name: "Tom", entry_name: "Bowen Arrow", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 9, player_name: "Lisa", entry_name: "Alisson Wonderland", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 10, player_name: "James", entry_name: "Son of a Beach", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
  { id: 11, player_name: "Robert", entry_name: "Pain in the Diaz", total_points: 0, rank: 0, last_rank: 0, event_total: 0, event_transfers_cost: 0, used_chips: [] },
];

// Mock Players database
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
  // Give some famous names
  if (p.id === 1) return { ...p, web_name: "Raya", element_type: 1, team: "ARS", selected_by_percent: "25.0", now_cost: 5.5 };
  if (p.id === 6) return { ...p, web_name: "Alexander-Arnold", element_type: 2, team: "LIV", selected_by_percent: "30.5", now_cost: 7.0 };
  if (p.id === 7) return { ...p, web_name: "Gabriel", element_type: 2, team: "ARS", selected_by_percent: "28.2", now_cost: 6.1 };
  if (p.id === 21) return { ...p, web_name: "Salah", element_type: 3, team: "LIV", total_points: 210, selected_by_percent: "45.0", now_cost: 12.8 };
  if (p.id === 22) return { ...p, web_name: "Palmer", element_type: 3, team: "CHE", total_points: 195, selected_by_percent: "52.0", now_cost: 10.5 };
  if (p.id === 23) return { ...p, web_name: "Saka", element_type: 3, team: "ARS", total_points: 180, selected_by_percent: "35.0", now_cost: 10.1 };
  if (p.id === 36) return { ...p, web_name: "Haaland", element_type: 4, team: "MCI", total_points: 205, selected_by_percent: "70.0", now_cost: 15.2 };
  if (p.id === 37) return { ...p, web_name: "Isak", element_type: 4, team: "NEW", total_points: 140, selected_by_percent: "15.0", now_cost: 8.4 };
  return p;
});

// --- Persistence Logic ---
const STORAGE_KEY = 'var_vault_data_v1';

interface StoredData {
  managers: Manager[];
  gameweeks: GameweekResult[];
  currentGw: number;
}

const loadFromStorage = (): StoredData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load from storage", e);
  }
  // Default state: GW 15
  return {
    managers: JSON.parse(JSON.stringify(INITIAL_MANAGERS)),
    gameweeks: [],
    currentGw: 15
  };
};

const saveToStorage = (managers: Manager[], gameweeks: GameweekResult[], currentGw: number) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ managers, gameweeks, currentGw }));
  } catch (e) {
    console.error("Failed to save to storage", e);
  }
};

// Initialize State from Storage
const initialData = loadFromStorage();
let cachedGameweeks: GameweekResult[] = initialData.gameweeks;
let cachedManagers: Manager[] = initialData.managers;

// Initial generation if starting fresh at GW15
if (cachedGameweeks.length === 0) {
    // We need to create a 'base' set of points so they aren't all 0 for the first view
    cachedManagers.forEach(m => {
        m.total_points = randomInt(800, 1000); // Base points for GW15
    });
}

export const getCurrentStoredGameweek = (): number => {
  // Return the last stored GW or default 15
  const data = loadFromStorage();
  return data.currentGw;
};

export const getLeagueData = async (targetGameweek: number): Promise<{ standings: FinancialStanding[], gameweeks: GameweekResult[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const data = loadFromStorage();
  cachedManagers = data.managers;
  cachedGameweeks = data.gameweeks;
  let currentStoredGw = data.currentGw;

  // If we are asking for a gameweek we haven't generated yet, generate the gap
  if (targetGameweek > currentStoredGw) {
    for (let gw = currentStoredGw + 1; gw <= targetGameweek; gw++) {
      const gwScores = cachedManagers.map((m: Manager) => {
        const rawScore = randomInt(30, 100);
        const transfers = randomInt(0, 10) > 8 ? 4 : 0; // 20% chance of -4 hit
        return {
          managerId: m.id,
          points: rawScore,
          netPoints: rawScore - transfers
        };
      });

      // Find winner(s)
      let maxScore = -999;
      gwScores.forEach((s: any) => {
        if (s.netPoints > maxScore) maxScore = s.netPoints;
      });
      const winners = gwScores.filter((s: any) => s.netPoints === maxScore).map((s: any) => s.managerId);

      cachedGameweeks.push({
        gw,
        scores: gwScores,
        winners,
        prizePerWinner: LEAGUE_SETTINGS.weeklyPrize / winners.length
      });

      // Update manager totals (Persistent)
      cachedManagers.forEach((m: Manager) => {
        const s = gwScores.find((score: any) => score.managerId === m.id);
        if (s) {
            m.total_points += s.netPoints; 
            m.event_total = s.points;
            m.event_transfers_cost = s.points - s.netPoints;
            
            // Random rank shuffle logic
            m.last_rank = m.rank;
        }
      });
    }
    
    // Save state after simulation
    saveToStorage(cachedManagers, cachedGameweeks, targetGameweek);
  }

  // Create a fresh copy for sorting
  const sortedManagers = [...cachedManagers];

  // Sort managers by total points for rank
  sortedManagers.sort((a: Manager, b: Manager) => b.total_points - a.total_points);
  
  // Calculate Financials
  const financialStandings: FinancialStanding[] = sortedManagers.map((m: Manager, index: number) => {
    let winnings = 0;
    let weeksWon = 0;

    cachedGameweeks.forEach(gw => {
      if (gw.winners.includes(m.id)) {
        winnings += gw.prizePerWinner;
        weeksWon++;
      }
    });

    // Mock Chips Data (Randomly assign if advancing)
    if (targetGameweek > 15 && Math.random() > 0.8 && m.used_chips.length < 2) {
        const chips = ['wc', 'fh', 'bb', 'tc'] as const;
        const randomChip = chips[Math.floor(Math.random() * chips.length)];
        if (!m.used_chips.includes(randomChip)) {
             m.used_chips.push(randomChip);
        }
    }
    // Initial mock chips for demo
    if (targetGameweek === 15 && m.used_chips.length === 0) {
        if (Math.random() > 0.4) m.used_chips.push('wc');
        if (Math.random() > 0.8) m.used_chips.push('tc');
    }

    return {
      ...m,
      rank: index + 1,
      // last_rank is handled in simulation loop or defaulted
      last_rank: m.last_rank || index + 1,
      weeklyWinnings: winnings,
      netProfit: winnings - LEAGUE_SETTINGS.buyIn,
      weeksWon,
      used_chips: m.used_chips
    };
  });

  return { standings: financialStandings, gameweeks: cachedGameweeks };
};

export const getTeamPicks = async (_managerId: number): Promise<Player[]> => {
  // Return a valid formation (1 GK, 3-5 DEF, 3-5 MID, 1-3 FWD)
  const gks = MOCK_PLAYERS_DB.filter(p => p.element_type === 1).slice(0, 2);
  const defs = MOCK_PLAYERS_DB.filter(p => p.element_type === 2).slice(0, 5);
  const mids = MOCK_PLAYERS_DB.filter(p => p.element_type === 3).slice(0, 5);
  const fwds = MOCK_PLAYERS_DB.filter(p => p.element_type === 4).slice(0, 3);
  
  return [...gks, ...defs, ...mids, ...fwds];
};

// Helper to reset simulation
export const resetSimulation = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
};
