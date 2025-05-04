
import React, { useState, useEffect } from 'react';
import GameHeader from '@/components/GameHeader';
import GameSimulation from '@/components/GameSimulation';
import BotCard from '@/components/BotCard';
import ResultsPanel from '@/components/ResultsPanel';
import ExplanationPanel from '@/components/ExplanationPanel';
import { availableBots } from '@/lib/botStrategies';
import { Bot, MatchResult, runTournament, playRound, TournamentResult } from '@/lib/gameLogic';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  // State
  const [selectedBot1, setSelectedBot1] = useState<Bot | null>(null);
  const [selectedBot2, setSelectedBot2] = useState<Bot | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(100);
  const [matchHistory, setMatchHistory] = useState<MatchResult[]>([]);
  const [tournamentResults, setTournamentResults] = useState<TournamentResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Bot histories
  const [bot1History, setBot1History] = useState<('split' | 'steal')[]>([]);
  const [bot2History, setBot2History] = useState<('split' | 'steal')[]>([]);
  
  // Handle bot selection
  const handleSelectBot = (bot: Bot, position: number) => {
    if (position === 1) {
      setSelectedBot1(bot);
    } else {
      setSelectedBot2(bot);
    }
  };
  
  // Run a full simulation between selected bots
  const startSimulation = () => {
    if (!selectedBot1 || !selectedBot2) {
      toast({
        title: "Select bots first",
        description: "Please select two bots to run the simulation.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    setCurrentRound(0);
    setMatchHistory([]);
    setBot1History([]);
    setBot2History([]);
    setShowResults(false);
  };
  
  // Reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentRound(0);
    setMatchHistory([]);
    setBot1History([]);
    setBot2History([]);
    setShowResults(false);
  };
  
  // Run tournament with all bots
  const runFullTournament = () => {
    const results = runTournament(availableBots, 100);
    setTournamentResults(results);
    setShowResults(true);
    
    toast({
      title: "Tournament complete!",
      description: `${results[0].botName} won with ${results[0].totalScore} points!`
    });
  };
  
  // Run a single round when simulation is active
  useEffect(() => {
    if (!isRunning || !selectedBot1 || !selectedBot2) return;
    
    const timer = setTimeout(() => {
      if (currentRound < totalRounds) {
        // Play one round
        const result = playRound(
          selectedBot1, 
          selectedBot2, 
          bot1History, 
          bot2History
        );
        
        // Update state
        setMatchHistory(prev => [...prev, result]);
        setBot1History(prev => [...prev, result.bot1Move]);
        setBot2History(prev => [...prev, result.bot2Move]);
        setCurrentRound(currentRound + 1);
      } else {
        // End simulation
        setIsRunning(false);
        runFullTournament();
      }
    }, 300); // Slow enough to see what's happening
    
    return () => clearTimeout(timer);
  }, [isRunning, currentRound, selectedBot1, selectedBot2]);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <GameHeader 
        title="Bot Battle Royale Simulator" 
        subtitle="Watch AI strategies compete in the classic Split or Steal dilemma. Who will emerge victorious?"
        onStart={startSimulation}
        onReset={resetSimulation}
        isRunning={isRunning}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Bot 1</h2>
          <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {availableBots.map(bot => (
              <BotCard 
                key={`bot1-${bot.id}`}
                bot={bot}
                selected={selectedBot1?.id === bot.id}
                onClick={() => handleSelectBot(bot, 1)}
              />
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <GameSimulation 
            bot1={selectedBot1}
            bot2={selectedBot2}
            currentRound={currentRound}
            totalRounds={totalRounds}
            isRunning={isRunning}
            matchHistory={matchHistory}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Bot 2</h2>
          <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {availableBots.map(bot => (
              <BotCard 
                key={`bot2-${bot.id}`}
                bot={bot}
                selected={selectedBot2?.id === bot.id}
                onClick={() => handleSelectBot(bot, 2)}
              />
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2">
          {showResults ? (
            <ResultsPanel results={tournamentResults} />
          ) : (
            <ExplanationPanel />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
