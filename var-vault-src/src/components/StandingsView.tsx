import React from 'react';
import type { FinancialStanding } from '../types';
import { ArrowUp, ArrowDown, Minus, Share } from 'lucide-react';

interface Props {
  standings: FinancialStanding[];
}

const StandingsView: React.FC<Props> = ({ standings }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VAR Vault',
          text: 'Check out our league standings!',
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('App link copied to clipboard!');
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-3xl mx-auto">
      <div className="bg-fpl-purple text-white p-6 rounded-2xl shadow-lg mb-6 relative">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">VAR Vault</h1>
            <p className="text-fpl-green text-sm font-medium">League ID: 212889</p>
          </div>
          <button 
            onClick={handleShare}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Share"
          >
            <Share size={20} className="text-fpl-cyan" />
          </button>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="text-xs text-gray-300 uppercase">Pot</div>
            <div className="text-xl font-bold">$330</div>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="text-xs text-gray-300 uppercase">Weekly</div>
            <div className="text-xl font-bold">$5</div>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="text-xs text-gray-300 uppercase">1st Prize</div>
            <div className="text-xl font-bold">$90</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex text-xs font-semibold text-gray-500 px-4">
          <div className="w-8 text-center">Rank</div>
          <div className="flex-1">Team & Manager</div>
          <div className="w-16 text-right">Points</div>
          <div className="w-20 text-right">Profit</div>
        </div>

        {standings.map((manager) => {
          const rankDiff = manager.last_rank - manager.rank;
          return (
            <div 
              key={manager.id} 
              className={`bg-white rounded-xl p-4 shadow-sm flex items-center border-l-4 ${
                manager.rank === 1 ? 'border-fpl-green' : manager.rank <= 3 ? 'border-fpl-cyan' : 'border-transparent'
              }`}
            >
              <div className="w-8 flex flex-col items-center justify-center">
                <span className="font-bold text-gray-700">{manager.rank}</span>
                <div className="text-[10px]">
                   {rankDiff > 0 ? (
                    <span className="text-green-500 flex items-center"><ArrowUp size={10} /> {rankDiff}</span>
                  ) : rankDiff < 0 ? (
                    <span className="text-red-500 flex items-center"><ArrowDown size={10} /> {Math.abs(rankDiff)}</span>
                  ) : (
                    <span className="text-gray-400"><Minus size={10} /></span>
                  )}
                </div>
              </div>
              
              <div className="flex-1 pl-3">
                <h3 className="font-bold text-gray-900 truncate">{manager.entry_name}</h3>
                <p className="text-xs text-gray-500">{manager.player_name}</p>
                {manager.weeksWon > 0 && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-full">
                        🏆 x{manager.weeksWon}
                    </span>
                )}
              </div>

              <div className="w-16 text-right font-bold text-gray-700">
                {manager.total_points}
              </div>

              <div className={`w-20 text-right font-bold ${manager.netProfit >= 0 ? 'text-fpl-green' : 'text-red-500'}`}>
                {manager.netProfit >= 0 ? '+' : ''}${manager.netProfit.toFixed(0)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StandingsView;