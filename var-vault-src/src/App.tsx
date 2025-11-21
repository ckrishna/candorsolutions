import { useEffect, useState } from 'react';
import { Tab } from './types';
import type { FinancialStanding, Player, GameweekResult } from './types';
import { getLeagueData, getTeamPicks, MOCK_PLAYERS_DB, getCurrentStoredGameweek } from './services/fplService';
import { BOOTSTRAP_DATA } from './data/bootstrapData';
import BottomNav from './components/BottomNav';
import StandingsView from './components/StandingsView';
import TeamView from './components/TeamView';
import StatsView from './components/StatsView';
import AssistantView from './components/AssistantView';
import DataUpdater from './components/DataUpdater';

function App() {
  // Default to UPDATER if no data exists yet (First run / Setup mode)
  const [activeTab, setActiveTab] = useState<Tab>(BOOTSTRAP_DATA ? Tab.STANDINGS : Tab.UPDATER);
  const [standings, setStandings] = useState<FinancialStanding[]>([]);
  const [gameweekHistory, setGameweekHistory] = useState<GameweekResult[]>([]);
  const [myTeam, setMyTeam] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize GW from storage or bootstrap
  const [currentGw, setCurrentGw] = useState(() => getCurrentStoredGameweek());

  const fetchData = async (gw: number) => {
    if (standings.length === 0) setLoading(true);
    
    const { standings: leagueStandings, gameweeks } = await getLeagueData(gw);
    setStandings(leagueStandings);
    setGameweekHistory(gameweeks);
    
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

  const handleRefreshData = () => {
    fetchData(currentGw);
  };

  const getFormattedDate = () => {
    if (!BOOTSTRAP_DATA?.timestamp) return undefined;
    try {
      return new Date(BOOTSTRAP_DATA.timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (e) {
      return BOOTSTRAP_DATA.timestamp;
    }
  };

  const renderContent = () => {
    if (activeTab === Tab.UPDATER) {
        return <DataUpdater onClose={() => setActiveTab(Tab.STANDINGS)} />;
    }

    if (loading && standings.length === 0) {
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
              lastUpdated={getFormattedDate()}
              onAdvanceGameweek={handleAdvanceGameweek}
              onRefreshData={handleRefreshData}
              onOpenUpdater={() => setActiveTab(Tab.UPDATER)}
            />
          </div>
        );
      case Tab.TEAM:
        return <TeamView team={myTeam} />;
      case Tab.STATS:
        return <StatsView players={MOCK_PLAYERS_DB} standings={standings} gameweeks={gameweekHistory} />;
      case Tab.ASSISTANT:
        return <AssistantView standings={standings} players={MOCK_PLAYERS_DB} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans antialiased pb-20">
      {renderContent()}
      {activeTab !== Tab.UPDATER && !loading && (
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}

export default App;