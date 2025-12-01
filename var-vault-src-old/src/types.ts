export type Chip = 'wc' | 'fh' | 'bb' | 'tc';

export interface Player {
  id: number;
  web_name: string;
  element_type: number; // 1: GK, 2: DEF, 3: MID, 4: FWD
  team: string;
  total_points: number;
  now_cost: number;
  selected_by_percent: string;
  form: string;
  ep_next: string; // Expected points next gameweek
}

export interface Manager {
  id: number;
  player_name: string; // Real name
  entry_name: string; // Team name
  total_points: number;
  rank: number;
  last_rank: number;
  event_total: number; // Points this gameweek
  event_transfers_cost: number; // Hits taken
  used_chips: Chip[]; // Array of used chip identifiers
}

export interface GameweekResult {
  gw: number;
  scores: { managerId: number; points: number; netPoints: number }[];
  winners: number[]; // Array of manager IDs who won/tied
  prizePerWinner: number;
}

export interface LeagueSettings {
  id: number;
  buyIn: number;
  weeklyPrize: number;
  totalPlayers: number;
}

export interface BootstrapData {
  leagueId: number;
  timestamp: string;
  managers: Manager[];
  gameweeks: GameweekResult[];
}

export const Tab = {
  STANDINGS: 'standings',
  TEAM: 'team',
  STATS: 'stats',
  ASSISTANT: 'assistant',
  UPDATER: 'updater', // Added Updater Tab
} as const;

export type Tab = typeof Tab[keyof typeof Tab];

// Extended interface for our calculated financial standings
export interface FinancialStanding extends Manager {
  weeklyWinnings: number;
  netProfit: number;
  weeksWon: number;
}