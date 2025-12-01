import React from 'react';
import type { Player } from '../types';

interface Props {
  team: Player[];
}

const PlayerCard: React.FC<{ player: Player; isBench?: boolean }> = ({ player, isBench }) => (
  <div className="flex flex-col items-center justify-center w-20">
    <div className={`relative ${isBench ? 'w-10 h-10' : 'w-12 h-12'} mb-1 rounded-full overflow-hidden border-2 ${isBench ? 'border-gray-400 bg-gray-200' : 'border-white bg-fpl-green'}`}>
       <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.id * 123}.png`} 
            alt={player.web_name} 
            className="w-full h-full object-cover object-top"
            onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://fantasy.premierleague.com/static/media/shirt_1-1.dfc5967f.webp'; 
            }}
       />
    </div>
    <div className={`text-center w-full ${isBench ? 'opacity-75' : ''}`}>
      <div className="bg-fpl-purple text-white text-[10px] px-1 truncate rounded-t-sm font-bold leading-tight py-0.5">
        {player.web_name}
      </div>
      <div className="bg-white text-gray-900 text-[10px] px-1 border-t border-gray-200 rounded-b-sm font-bold shadow-sm">
        {player.total_points}
      </div>
    </div>
  </div>
);

const TeamView: React.FC<Props> = ({ team }) => {
  // Simple sort for demo: GK, DEF, MID, FWD
  // In reality, need `position` from picks
  const gk = team.filter(p => p.element_type === 1).slice(0, 1);
  const def = team.filter(p => p.element_type === 2).slice(0, 4); // 442 for demo
  const mid = team.filter(p => p.element_type === 3).slice(0, 4);
  const fwd = team.filter(p => p.element_type === 4).slice(0, 2);
  const bench = team.filter(p => !gk.includes(p) && !def.includes(p) && !mid.includes(p) && !fwd.includes(p));

  return (
    <div className="h-full pb-24 bg-gray-100 flex flex-col">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold text-fpl-purple text-center">Gameweek 15 Team</h2>
        <p className="text-center text-gray-500 text-xs">Points: 67 • Average: 52</p>
      </div>

      <div className="flex-1 relative overflow-hidden p-2">
         {/* Pitch Background */}
         <div className="absolute inset-2 bg-gradient-to-b from-green-600 to-green-500 rounded-xl border-2 border-white/30 shadow-inner flex flex-col">
            {/* Lines */}
            <div className="absolute top-0 left-0 w-full h-full border-2 border-white/20 rounded-xl"></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/20 rounded-full"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-b border-l border-r border-white/20 rounded-b-lg"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 border-t border-l border-r border-white/20 rounded-t-lg"></div>

            {/* Players Container */}
            <div className="relative z-10 flex flex-col h-full justify-between py-4">
                <div className="flex justify-center">{gk.map(p => <PlayerCard key={p.id} player={p} />)}</div>
                <div className="flex justify-around px-4">{def.map(p => <PlayerCard key={p.id} player={p} />)}</div>
                <div className="flex justify-around px-2">{mid.map(p => <PlayerCard key={p.id} player={p} />)}</div>
                <div className="flex justify-center gap-8">{fwd.map(p => <PlayerCard key={p.id} player={p} />)}</div>
            </div>
         </div>
      </div>

      {/* Bench */}
      <div className="mt-2 mx-2 bg-white rounded-xl p-3 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Bench</h3>
        <div className="flex justify-between">
           {bench.map(p => <PlayerCard key={p.id} player={p} isBench />)}
        </div>
      </div>
    </div>
  );
};

export default TeamView;