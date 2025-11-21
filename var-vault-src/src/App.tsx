import { useEffect, useState } from 'react';
import { Tab } from './types';
import type { FinancialStanding, Player } from './types';
import { getLeagueData, getTeamPicks, MOCK_PLAYERS_DB, getCurrentStoredGameweek, resetSimulation } from './services/fplService';
import BottomNav from './components/BottomNav';
import StandingsView from './components/StandingsView';
import TeamView from './components/TeamView';
import StatsView from './components/StatsView';
import AssistantView from './components/AssistantView';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.STANDINGS);
  const [standings, setStandings] = useState<FinancialStanding[]>([]);
  const [myTeam, setMyTeam] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize GW from storage if available, otherwise starts at 15
  const [currentGw, setCurrentGw] = useState(() => getCurrentStoredGameweek());

  const fetchData = async (gw: number) => {
    setLoading(true);
    const { standings: leagueStandings } = await getLeagueData(gw);
    setStandings(leagueStandings);
    
    // Load User's Team (only needed once really, but kept here)
    if (myTeam.length === 0) {
      const team = await getTeamPicks(1);
      setMyTeam(team);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData(currentGw);
  }, []);

  const handleAdvanceGameweek = () => {
    const nextGw = currentGw + 1;
    setCurrentGw(nextGw);
    fetchData(nextGw);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-fpl-purple text-white">
          <div className="w-12 h-12 border-4 border-fpl-green border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="animate-pulse font-bold">Loading League Data...</p>
        </div>
      );
    }

    switch (activeTab) {
      case Tab.STANDINGS:
        return (
          <div className="relative">
             <StandingsView 
              standings={standings} 
              currentGw={currentGw}
              onAdvanceGameweek={handleAdvanceGameweek}
            />
            {currentGw > 15 && (
              <div className="fixed top-4 right-4 z-50 opacity-30 hover:opacity-100 transition-opacity">
                <button 
                  onClick={resetSimulation}
                  className="text-[10px] bg-red-500 text-white px-2 py-1 rounded shadow-sm"
                >
                  Reset Sim
                </button>
              </div>
            )}
          </div>
        );
      case Tab.TEAM:
        return <TeamView team={myTeam} />;
      case Tab.STATS:
        return <StatsView players={MOCK_PLAYERS_DB} standings={standings} />;
      case Tab.ASSISTANT:
        return <AssistantView standings={standings} players={MOCK_PLAYERS_DB} />;
      default:
        return (
          <StandingsView 
            standings={standings} 
            currentGw={currentGw}
            onAdvanceGameweek={handleAdvanceGameweek}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans antialiased pb-20">
      {renderContent()}
      {!loading && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
}

export default App;