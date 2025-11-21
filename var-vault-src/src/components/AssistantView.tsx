import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { getLeagueInsights } from '../services/geminiService';
import type { FinancialStanding, Player } from '../types';
import ReactMarkdown from 'react-markdown';

interface Props {
  standings: FinancialStanding[];
  players: Player[];
}

const AssistantView: React.FC<Props> = ({ standings, players }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (loading) return;
    setLoading(true);
    const result = await getLeagueInsights(standings, players, query);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-3xl mx-auto h-full flex flex-col">
       <div className="bg-gradient-to-r from-fpl-purple to-indigo-900 p-6 rounded-2xl shadow-lg mb-6 text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
            <Sparkles className="mr-2 text-fpl-green" /> Assistant
        </h1>
        <p className="text-indigo-200 text-sm">
            Powered by Gemini. Ask for suggestions, transfer targets, or roast your friends' teams.
        </p>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        {!response && (
            <div className="grid grid-cols-1 gap-2">
                <button onClick={() => setQuery("Who is the best differential captain for next week?")} className="p-3 bg-white text-left text-sm text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition">
                    🧢 Who is the best differential captain?
                </button>
                <button onClick={() => setQuery("Analyze the league finances. Who is efficient?")} className="p-3 bg-white text-left text-sm text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition">
                    💰 Analyze league finances
                </button>
                <button onClick={() => setQuery("Suggest a transfer to replace Haaland.")} className="p-3 bg-white text-left text-sm text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition">
                    🔄 Suggest a transfer to replace Haaland
                </button>
            </div>
        )}

        {response && (
            <div className="bg-white p-5 rounded-2xl shadow-md animate-fade-in">
                <div className="prose prose-sm prose-indigo max-w-none">
                    <ReactMarkdown>{response}</ReactMarkdown>
                </div>
                <button 
                    onClick={() => setResponse(null)}
                    className="mt-4 text-xs text-gray-400 underline"
                >
                    Clear response
                </button>
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-6 relative">
        <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your league..."
            className="w-full p-4 pr-12 rounded-full shadow-lg border-0 focus:ring-2 focus:ring-fpl-green text-gray-800"
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
        />
        <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="absolute right-2 top-2 p-2 bg-fpl-green text-fpl-purple rounded-full hover:bg-green-400 transition disabled:opacity-50"
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-fpl-purple border-t-transparent rounded-full animate-spin" />
            ) : (
                <Send size={20} />
            )}
        </button>
      </div>
    </div>
  );
};

export default AssistantView;