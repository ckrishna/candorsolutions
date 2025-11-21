import React, { useState } from 'react';
import type { FinancialStanding } from '../types';
import { LEAGUE_SETTINGS } from '../constants';
import { ArrowUp, ArrowDown, Minus, Share, Check, RefreshCw } from 'lucide-react';

interface Props {
  standings: FinancialStanding[];
  currentGw: number;
  lastUpdated?: string;
  onAdvanceGameweek: () => void;
  onRefreshData: () => void;
  onOpenUpdater: () => void;
}

const StandingsView: React.FC<Props> = ({ standings, currentGw, lastUpdated, onAdvanceGameweek, onOpenUpdater }) => {
  const [copied, setCopied] = useState(false);

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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-3xl mx-auto">
      <div className="bg-fpl-purple text-white p-6 rounded-2xl shadow-lg mb-6 relative">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">VAR Vault</h1>
            <div className="text-fpl-green text-sm font-medium">
              <p className="flex items-center gap-2">ID: {LEAGUE_SETTINGS.id} • GW {currentGw}</p>
              {lastUpdated && (
                <p className="text-xs text-indigo-300 mt-1 opacity-80 font-normal">
                  Updated: {lastUpdated}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={onOpenUpdater}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                title="Update League Data"
            >
                <RefreshCw size={20} className="text-fpl-cyan" />
            </button>
            <div className="relative">
                <button 
                onClick={handleShare}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Share"
                >
                {copied ? <Check size={20} className="text-fpl-green" /> : <Share size={20} className="text-fpl-cyan" />}
                </button>
                {copied && (
                <div className="absolute right-0 top-full mt-2 bg-white text-fpl-purple text-xs font-bold px-2 py-1 rounded shadow-md animate-fade-in whitespace-nowrap z-10">
                    Link Copied!
                </div>
                )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="text-xs text-gray-300 uppercase">Pot</div>
            <div className="text-xl font-bold">${LEAGUE_SETTINGS.buyIn * LEAGUE_SETTINGS.totalPlayers}</div>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="text-xs text-gray-300 uppercase">Weekly</div>
            <div className="text-xl font-bold">${LEAGUE_SETTINGS.weeklyPrize}</div>
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
        
        {standings.map((manager) => (
          <div key={manager.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center">
             <div className="w-8 text-center font-bold text-gray-400">
               {manager.rank}
               <div className="flex justify-center mt-1">
                {manager.rank < manager.last_rank ? (
                   <ArrowUp size={12} className="text-fpl-green" />
                ) : manager.rank > manager.last_rank ? (
                   <ArrowDown size={12} className="text-red-500" />
                ) : (
                   <Minus size={12} className="text-gray-300" />
                )}
               </div>
             </div>
             <div className="flex-1 min-w-0 px-2">
               <div className="font-bold text-gray-900 truncate">{manager.entry_name}</div>
               <div className="text-xs text-gray-500 truncate">{manager.player_name}</div>
             </div>
             <div className="w-16 text-right font-bold text-gray-800">
               {manager.total_points}
             </div>
             <div className={`w-20 text-right font-bold ${manager.netProfit >= 0 ? 'text-fpl-green' : 'text-red-500'}`}>
               {manager.netProfit >= 0 ? '+' : ''}${manager.netProfit.toFixed(2)}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandingsView;