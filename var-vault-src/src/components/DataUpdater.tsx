import React, { useState } from 'react';
import { LEAGUE_SETTINGS } from '../constants';
import { fetchRealLeagueData } from '../services/fplService';
import { Copy, Check, AlertTriangle, DownloadCloud, ArrowLeft } from 'lucide-react';

interface Props {
    onClose: () => void;
}

const DataUpdater: React.FC<Props> = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState("");
    const [resultJson, setResultJson] = useState<string>("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetch = async () => {
        setLoading(true);
        setError(null);
        setProgress("Initializing...");
        
        try {
            const data = await fetchRealLeagueData(LEAGUE_SETTINGS.id, (msg) => setProgress(msg));
            
            // Format as a TypeScript file content
            const fileContent = `import type { BootstrapData } from '../types';

// Updated: ${data.timestamp}
// League: ${data.leagueId}
// Managers: ${data.managers.length}

export const BOOTSTRAP_DATA: BootstrapData = ${JSON.stringify(data, null, 2)};
`;
            setResultJson(fileContent);
            setProgress("Done!");
        } catch (err) {
            console.error(err);
            setError("Failed to fetch data. This is likely a CORS issue. Try using a CORS browser extension or check your network.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(resultJson);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 pb-24">
            <div className="max-w-3xl mx-auto">
                <button onClick={onClose} className="mb-6 flex items-center text-gray-400 hover:text-white">
                    <ArrowLeft size={20} className="mr-2" /> Back to League
                </button>

                <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                    <h1 className="text-2xl font-bold text-fpl-green mb-2 flex items-center">
                        <DownloadCloud className="mr-3" /> League Data Updater
                    </h1>
                    <p className="text-gray-400 text-sm mb-6">
                        Use this tool to fetch the latest data from FPL for League ID <strong>{LEAGUE_SETTINGS.id}</strong>.
                        Because this is a static app, you need to generate the data here, copy it, and paste it into your source code.
                    </p>

                    {!resultJson && (
                        <div className="flex flex-col items-center py-8">
                            {loading ? (
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-fpl-green border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                                    <p className="text-fpl-green font-mono animate-pulse">{progress}</p>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleFetch}
                                    className="bg-fpl-green text-fpl-purple font-bold py-4 px-8 rounded-xl hover:bg-white hover:scale-105 transition transform shadow-lg flex items-center"
                                >
                                    Start Data Fetch
                                </button>
                            )}
                            {error && (
                                <div className="mt-6 bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg flex items-start max-w-md">
                                    <AlertTriangle className="shrink-0 mr-3" />
                                    <div className="text-sm">{error}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {resultJson && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex justify-between items-end">
                                <div className="text-sm text-gray-400">
                                    Copy the code below and paste it into <code className="text-fpl-pink bg-gray-900 px-1 rounded">src/data/bootstrapData.ts</code>
                                </div>
                                <button 
                                    onClick={handleCopy}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition ${copied ? 'bg-fpl-green text-fpl-purple' : 'bg-fpl-purple text-white border border-fpl-green'}`}
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                    {copied ? 'Copied!' : 'Copy Code'}
                                </button>
                            </div>
                            <textarea 
                                readOnly
                                value={resultJson}
                                className="w-full h-96 bg-black font-mono text-xs text-green-400 p-4 rounded-xl border border-gray-700 focus:outline-none focus:border-fpl-green"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataUpdater;
