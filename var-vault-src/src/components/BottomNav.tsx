import React from 'react';
import { Tab } from '../types';
import { Trophy, Shirt, BarChart2, MessageSquareMore } from 'lucide-react';

interface Props {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const BottomNav: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: Tab.STANDINGS, label: 'Standings', icon: Trophy },
    { id: Tab.TEAM, label: 'My Team', icon: Shirt },
    { id: Tab.STATS, label: 'Stats', icon: BarChart2 },
    { id: Tab.ASSISTANT, label: 'Assistant', icon: MessageSquareMore },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 shadow-lg z-50 pb-4">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-16 transition-colors duration-200 ${
                isActive ? 'text-fpl-purple' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
