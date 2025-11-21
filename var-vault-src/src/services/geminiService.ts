import { GoogleGenAI } from "@google/genai";
import type { FinancialStanding, Player } from "../types";

// In a real app, this key should be proxied securely.
// For this demo, we assume it is injected into process.env
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getLeagueInsights = async (
  standings: FinancialStanding[],
  topPlayers: Player[],
  userQuery?: string
): Promise<string> => {
  try {
    const standingsSummary = standings.map(s => 
      `${s.entry_name} (Rank ${s.rank}): ${s.total_points} pts, Profit: $${s.netProfit.toFixed(2)}`
    ).join('\n');

    const topAvailablePlayers = topPlayers
      .filter(p => parseInt(p.selected_by_percent) < 10) // Differentials
      .slice(0, 5)
      .map(p => `${p.web_name} (${p.team}) - Form: ${p.form}`)
      .join(', ');

    const prompt = `
      You are an expert Fantasy Premier League assistant for a private money league.
      
      League Context:
      - 11 Managers.
      - $30 buy-in.
      - $5 weekly prize for highest net score.
      - Remaining pot split between top 3 at end of season.
      
      Current Standings:
      ${standingsSummary}
      
      Notable Differential Players (low ownership, good form):
      ${topAvailablePlayers}

      User Question: ${userQuery || "Provide a witty summary of the league, who is making money, who is losing, and suggest one differential player to target."}

      Keep the response concise, fun, and formatted with Markdown. Use emojis.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the dugout (API Error). Please check your API Key.";
  }
};