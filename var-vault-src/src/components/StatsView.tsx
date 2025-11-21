import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { Player, FinancialStanding } from '../types';
import { TrendingUp, Activity, Zap } from 'lucide-react';

interface Props {
  players: Player[];
  standings: FinancialStanding[];
}

const StatsView: React.FC<Props> = ({ players, standings }) => {
  // Mock data for differential players (Low ownership, high points)
  const differentials = players
    .filter(p => parseFloat(p.selected_by_percent) < 10 && p.total_points > 50)
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, 5);

  const data = [
    { name: 'GW10', You: 45, Rival: 60 },
    { name: 'GW11', You: 72, Rival: 55 },
    { name: 'GW12', You: 30, Rival: 40 },
    { name: 'GW13', You: 85, Rival: 62 },
    { name: 'GW14', You: 50, Rival: 50 },
    { name: 'GW15', You: 67, Rival: 58 },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Stats & Trends</h1>

      {/* Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center">
          <Activity size={16} className="mr-2" /> Recent Performance
        </h3>
        <div className="h-48 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Line type="monotone" dataKey="You" stroke="#00ff85" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} />
              <Line type="monotone" dataKey="Rival" stroke="#37003c" strokeWidth={3} dot={{r:4}} />
            </LineChart>
          </ResponsiveContainer>
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

      {/* Differentials */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center">
          <TrendingUp size={16} className="mr-2" /> Top Differentials
        </h3>
        <div className="space-y-3">
          {differentials.map((p) => (
            <div key={p.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-2 last:pb-0">
              <div>
                <div className="font-bold text-gray-800">{p.web_name}</div>
                <div className="text-xs text-gray-500">{p.team} • {p.element_type === 1 ? 'GK' : p.element_type === 2 ? 'DEF' : p.element_type === 3 ? 'MID' : 'FWD'}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-fpl-purple">{p.total_points} pts</div>
                <div className="text-xs text-fpl-pink">{p.selected_by_percent}% TSB</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsView;