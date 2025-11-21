import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { Player, FinancialStanding, GameweekResult } from '../types';
import { TrendingUp, Activity, Zap, Trophy, AlertCircle } from 'lucide-react';

interface Props {
  players: Player[];
  standings: FinancialStanding[];
  gameweeks: GameweekResult[];
}

const StatsView: React.FC<Props> = ({ standings, gameweeks }) => {
  // Handle empty state (e.g. before data is fetched)
  if (!gameweeks || gameweeks.length === 0) {
    return (
      <div className="pb-24 pt-4 px-4 max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">League Stats</h1>
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center text-gray-500 flex flex-col items-center">
          <AlertCircle size={48} className="text-gray-300 mb-4" />
          <p className="font-medium">No history available yet</p>
          <p className="text-xs mt-2 max-w-xs">
            Once you fetch league data using the Updater tool, charts and weekly winners will appear here.
          </p>
        </div>
      </div>
    );
  }

  // 1. Prepare Chart Data: Cumulative points progression for Top 5
  const top5Managers = [...standings]
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, 5);

  const cumulativeData: any[] = [];
  const runningTotals: Record<number, number> = {};
  
  // Initialize 0
  top5Managers.forEach(m => runningTotals[m.id] = 0);

  gameweeks.forEach(gw => {
      const dataPoint: any = { name: `GW${gw.gw}` };
      gw.scores.forEach(score => {
          if (runningTotals[score.managerId] !== undefined) {
              runningTotals[score.managerId] += score.points;
          }
      });
      // Assign to dataPoint
      top5Managers.forEach(m => {
          dataPoint[m.entry_name] = runningTotals[m.id] || 0;
      });
      cumulativeData.push(dataPoint);
  });

  // Colors for lines
  const colors = ['#37003c', '#00ff85', '#ff2882', '#00ffff', '#383838'];

  return (
    <div className="pb-24 pt-4 px-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">League Stats</h1>

      {/* Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center">
          <Activity size={16} className="mr-2" /> Title Race (Top 5)
        </h3>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} minTickGap={30} />
              <YAxis domain={['auto', 'auto']} tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} width={30} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} />
              {top5Managers.map((manager, index) => (
                  <Line 
                    key={manager.id}
                    type="monotone" 
                    dataKey={manager.entry_name} 
                    stroke={colors[index % colors.length]} 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{r: 4}}
                  />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Winners Log */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center">
          <Trophy size={16} className="mr-2" /> Weekly Winners
        </h3>
        <div className="max-h-64 overflow-y-auto no-scrollbar space-y-2">
          {[...gameweeks].reverse().map((gw) => {
             // Find manager names for winners
             const winnerNames = gw.winners.map(id => 
                standings.find(m => m.id === id)?.entry_name || 'Unknown'
             ).join(', ');

             return (
                <div key={gw.gw} className="flex items-center justify-between border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-fpl-green/20 text-fpl-green flex items-center justify-center text-xs font-bold mr-3">
                            GW{gw.gw}
                        </div>
                        <div>
                            <div className="font-bold text-gray-800 text-sm">{winnerNames}</div>
                            <div className="text-xs text-gray-400">Top Score</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-fpl-purple">${gw.prizePerWinner.toFixed(0)}</div>
                    </div>
                </div>
             );
          })}
        </div>
      </div>

      {/* Chip Usage Table */}
      <div className="bg-white p-4 rounded-2xl shadow-sm overflow-hidden">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center">
          <Zap size={16} className="mr-2" /> Chip Usage
        </h3>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="text-xs font-bold text-gray-400 uppercase pb-2 pr-4 sticky left-0 bg-white z-10">Manager</th>
                <th className="text-xs font-bold text-gray-400 uppercase pb-2 text-center w-12">WC</th>
                <th className="text-xs font-bold text-gray-400 uppercase pb-2 text-center w-12">FH</th>
                <th className="text-xs font-bold text-gray-400 uppercase pb-2 text-center w-12">TC</th>
                <th className="text-xs font-bold text-gray-400 uppercase pb-2 text-center w-12">BB</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((manager) => (
                <tr key={manager.id} className="border-t border-gray-100 text-sm">
                  <td className="py-3 pr-4 font-medium text-gray-800 truncate max-w-[120px] sticky left-0 bg-white z-10 border-r border-gray-50 sm:border-none">
                    {manager.entry_name}
                  </td>
                  <td className="py-3 text-center">
                    {manager.used_chips.includes('wc') ? (
                      <div className="w-6 h-6 mx-auto rounded-full bg-fpl-green text-fpl-purple flex items-center justify-center text-[10px] font-bold shadow-sm" title="Wildcard Used">WC</div>
                    ) : (
                      <div className="w-2 h-2 mx-auto rounded-full bg-gray-200"></div>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {manager.used_chips.includes('fh') ? (
                      <div className="w-6 h-6 mx-auto rounded-full bg-fpl-pink text-white flex items-center justify-center text-[10px] font-bold shadow-sm" title="Free Hit Used">FH</div>
                    ) : (
                      <div className="w-2 h-2 mx-auto rounded-full bg-gray-200"></div>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {manager.used_chips.includes('tc') ? (
                      <div className="w-6 h-6 mx-auto rounded-full bg-fpl-purple text-white flex items-center justify-center text-[10px] font-bold shadow-sm" title="Triple Captain Used">TC</div>
                    ) : (
                      <div className="w-2 h-2 mx-auto rounded-full bg-gray-200"></div>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {manager.used_chips.includes('bb') ? (
                      <div className="w-6 h-6 mx-auto rounded-full bg-fpl-cyan text-fpl-purple flex items-center justify-center text-[10px] font-bold shadow-sm" title="Bench Boost Used">BB</div>
                    ) : (
                      <div className="w-2 h-2 mx-auto rounded-full bg-gray-200"></div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsView;