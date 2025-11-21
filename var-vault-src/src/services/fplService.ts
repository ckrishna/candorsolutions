import type { Manager, GameweekResult, Player, FinancialStanding } from '../types';
import { LEAGUE_SETTINGS, TEAMS } from '../constants';

// Helper to generate random integer
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

// Mock Managers (Friends)
const MOCK_MANAGERS: Manager[] = [
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

export const getLeagueData = async (): Promise<{ standings: FinancialStanding[], gameweeks: GameweekResult[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const currentGameweek = 15; // Suppose we are in GW 15
  const gameweeks: GameweekResult[] = [];
  const managerData = JSON.parse(JSON.stringify(MOCK_MANAGERS)); // Deep copy

  // Simulate history
  for (let gw = 1; gw <= currentGameweek; gw++) {
    const gwScores = managerData.map((m: Manager) => {
      const rawScore = randomInt(30, 100);
      const transfers = randomInt(0, 1) === 1 ? 4 : 0; // Occasional -4 hit
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

    gameweeks.push({
      gw,
      scores: gwScores,
      winners,
      prizePerWinner: LEAGUE_SETTINGS.weeklyPrize / winners.length
    });

    // Update manager totals
    managerData.forEach((m: Manager) => {
      const s = gwScores.find((score: any) => score.managerId === m.id);
      m.total_points += s.netPoints; // FPL usually tracks raw, but this league cares about net
      m.event_total = s.points;
      m.event_transfers_cost = s.points - s.netPoints;
    });
  }

  // Sort managers by total points for rank
  managerData.sort((a: Manager, b: Manager) => b.total_points - a.total_points);
  
  // Calculate Financials
  const financialStandings: FinancialStanding[] = managerData.map((m: Manager, index: number) => {
    let winnings = 0;
    let weeksWon = 0;

    gameweeks.forEach(gw => {
      if (gw.winners.includes(m.id)) {
        winnings += gw.prizePerWinner;
        weeksWon++;
      }
    });

    // Mock Chips Data
    // Randomly assign chips to make it look real
    const used_chips: string[] = [];
    if (Math.random() > 0.4) used_chips.push('wc');
    if (Math.random() > 0.8) used_chips.push('tc');
    if (Math.random() > 0.9) used_chips.push('bb');
    if (Math.random() > 0.95) used_chips.push('fh');

    return {
      ...m,
      rank: index + 1,
      last_rank: index + 1 + randomInt(-2, 2), // Simulate movement
      weeklyWinnings: winnings,
      netProfit: winnings - LEAGUE_SETTINGS.buyIn,
      weeksWon,
      used_chips
    };
  });

  return { standings: financialStandings, gameweeks };
};

export const getTeamPicks = async (_managerId: number): Promise<Player[]> => {
  // Return a valid formation (1 GK, 3-5 DEF, 3-5 MID, 1-3 FWD)
  // Simply filtering from MOCK DB for demo
  const gks = MOCK_PLAYERS_DB.filter(p => p.element_type === 1).slice(0, 2);
  const defs = MOCK_PLAYERS_DB.filter(p => p.element_type === 2).slice(0, 5);
  const mids = MOCK_PLAYERS_DB.filter(p => p.element_type === 3).slice(0, 5);
  const fwds = MOCK_PLAYERS_DB.filter(p => p.element_type === 4).slice(0, 3);
  
  return [...gks, ...defs, ...mids, ...fwds];
};