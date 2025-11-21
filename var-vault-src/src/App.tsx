import { useEffect, useState } from 'react';
import { Tab } from './types';
import type { FinancialStanding, Player } from './types';
import { getLeagueData, getTeamPicks, MOCK_PLAYERS_DB } from './services/fplService';
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

  useEffect(() => {
    const initData = async () => {
      // 1. Load Standings & Financials
      const { standings: leagueStandings } = await getLeagueData();
      setStandings(leagueStandings);

      // 2. Load User's Team (Using ID 1 for 'You')
      const team = await getTeamPicks(1);
      setMyTeam(team);

      setLoading(false);
    };

    initData();
  }, []);

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
        return <StandingsView standings={standings} />;
      case Tab.TEAM:
        return <TeamView team={myTeam} />;
      case Tab.STATS:
        return <StatsView players={MOCK_PLAYERS_DB} standings={standings} />;
      case Tab.ASSISTANT:
        return <AssistantView standings={standings} players={MOCK_PLAYERS_DB} />;
      default:
        return <StandingsView standings={standings} />;
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