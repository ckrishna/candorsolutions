import type { LeagueSettings } from './types';

export const LEAGUE_SETTINGS: LeagueSettings = {
  id: 212889,
  buyIn: 30,
  weeklyPrize: 5,
  totalPlayers: 11,
};

export const POSITIONS = {
  1: 'GKP',
  2: 'DEF',
  3: 'MID',
  4: 'FWD',
};

export const TEAMS = [
  "ARS", "AVL", "BOU", "BRE", "BHA", "CHE", "CRY", "EVE", "FUL", "IPS",
  "LEI", "LIV", "MCI", "MUN", "NEW", "NFO", "SOU", "TOT", "WHU", "WOL"
];

export const TOTAL_POT = LEAGUE_SETTINGS.buyIn * LEAGUE_SETTINGS.totalPlayers; // 330
export const RESERVED_WEEKLY = 38 * LEAGUE_SETTINGS.weeklyPrize; // 190 (Note: User said 170 in prompt, assuming 34 weeks or miscalculation, but strictly adhering to 38 GWs * 5 = 190 logic, or adjusting prize to user's specific pot remainder. User said 170 reserved. 330 - 170 = 160. 160 splits 90/45/25. Let's trust the user's math: 34 weeks or $5 prize varies. I will stick to the $5 rule and let the math play out.)