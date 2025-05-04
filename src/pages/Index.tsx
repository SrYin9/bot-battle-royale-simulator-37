
import React, { useState, useEffect } from 'react';
import GameHeader from '@/components/GameHeader';
import GameSimulation from '@/components/GameSimulation';
import BotCard from '@/components/BotCard';
import PlayerControls from '@/components/PlayerControls';
import ResultsPanel from '@/components/ResultsPanel';
import ExplanationPanel from '@/components/ExplanationPanel';
import { availableBots } from '@/lib/botStrategies';
import { Bot, MatchResult, runTournament, playRound, TournamentResult, Move } from '@/lib/gameLogic';
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
  const [playerMode, setPlayerMode] = useState(false);
  const [mysteryBot, setMysteryBot] = useState<Bot | null>(null);
  const [waitingForPlayerMove, setWaitingForPlayerMove] = useState(false);
  const [playerLastMove, setPlayerLastMove] = useState<Move | undefined>(undefined);
  const [quickPlay, setQuickPlay] = useState(false);
  
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
    setPlayerMode(false);
    setQuickPlay(false);
  };

  // Handle selecting mystery bot
  const handleSelectMysteryBot = () => {
    // Create a mystery bot placeholder
    const mysteryBotPlaceholder: Bot = {
      id: 'mystery',
      name: 'Mystery Bot',
      description: 'Can you figure out which bot you are playing against? The identity will be revealed after the game.',
      strategy: () => 'split', // Placeholder strategy, will be replaced
      color: 'bg-neutral'
    };

    setSelectedBot1(mysteryBotPlaceholder);
    setSelectedBot2(null);
    setPlayerMode(true);
    setQuickPlay(false);

    // Randomly select a real bot as the mystery opponent
    const randomIndex = Math.floor(Math.random() * availableBots.length);
    setMysteryBot(availableBots[randomIndex]);
    
    toast({
      title: "Mystery Bot Selected!",
      description: "Try to figure out which bot you're playing against. Its identity will be revealed at the end."
    });
  };
  
  // Handle selecting quick play against random bot (20 rounds)
  const handleQuickPlay = () => {
    // Create a quick play bot placeholder
    const quickPlayBotPlaceholder: Bot = {
      id: 'quick-play',
      name: 'Quick Play Challenge',
      description: 'Play a quick 20-round game against a randomly selected bot.',
      strategy: () => 'split', // Placeholder strategy, will be replaced
      color: 'bg-primary'
    };

    setSelectedBot1(quickPlayBotPlaceholder);
    setSelectedBot2(null);
    setPlayerMode(true);
    setQuickPlay(true);
    setTotalRounds(20);

    // Randomly select a real bot as the opponent
    const randomIndex = Math.floor(Math.random() * availableBots.length);
    setMysteryBot(availableBots[randomIndex]);
    
    toast({
      title: "Quick Play Challenge!",
      description: "Play 20 rounds against a randomly selected bot. Make your first move!"
    });

    // Auto-start the game
    startQuickPlay();
  };
  
  // Start quick play
  const startQuickPlay = () => {
    if (!mysteryBot) return;
    
    setIsRunning(true);
    setCurrentRound(0);
    setMatchHistory([]);
    setBot1History([]);
    setBot2History([]);
    setShowResults(false);
    setWaitingForPlayerMove(true);
  };
  
  // Run a full simulation between selected bots
  const startSimulation = () => {
    if (playerMode || quickPlay) {
      if (!mysteryBot) {
        toast({
          title: "Error",
          description: "No mystery bot selected.",
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
      setWaitingForPlayerMove(true);
      
    } else {
      if (!selectedBot1 || !selectedBot2) {
        toast({
          title: "Select bots first",
          description: "Please select two bots to run the simulation.",
          variant: "destructive"
        });
        return;
      }
      
      setTotalRounds(100); // Reset to default for bot vs bot
      setIsRunning(true);
      setCurrentRound(0);
      setMatchHistory([]);
      setBot1History([]);
      setBot2History([]);
      setShowResults(false);
    }
  };
  
  // Reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentRound(0);
    setMatchHistory([]);
    setBot1History([]);
    setBot2History([]);
    setShowResults(false);
    setWaitingForPlayerMove(false);
    setPlayerLastMove(undefined);
    setTotalRounds(100); // Reset to default
  };
  
  // Run tournament with all bots
  const runFullTournament = () => {
    if ((playerMode || quickPlay) && mysteryBot) {
      // Reveal the mystery bot
      toast({
        title: "Mystery Bot Revealed!",
        description: `You were playing against ${mysteryBot.name}: ${mysteryBot.description}`
      });
      
      // Update the bot1 display with real bot information
      setSelectedBot1({
        ...mysteryBot,
        name: `${mysteryBot.name} (Mystery Bot)`
      });
      
    } else {
      const results = runTournament(availableBots, 100);
      setTournamentResults(results);
      setShowResults(true);
      
      toast({
        title: "Tournament complete!",
        description: `${results[0].botName} won with ${results[0].totalScore} points!`
      });
    }
  };

  // Handle player move
  const handlePlayerMove = (move: Move) => {
    if (!isRunning || !waitingForPlayerMove || !mysteryBot) return;
    
    setWaitingForPlayerMove(false);
    setPlayerLastMove(move);
    
    // Execute the mystery bot's strategy
    const botMove = mysteryBot.strategy(bot2History, bot1History);
    
    // Create a match result
    const result: MatchResult = {
      bot1Move: move,
      bot2Move: botMove,
      bot1Score: move === 'split' && botMove === 'split' ? 3 : 
                 move === 'split' && botMove === 'steal' ? 0 :
                 move === 'steal' && botMove === 'split' ? 5 : 1,
      bot2Score: botMove === 'split' && move === 'split' ? 3 : 
                 botMove === 'split' && move === 'steal' ? 0 :
                 botMove === 'steal' && move === 'split' ? 5 : 1
    };
    
    // Update state
    setMatchHistory(prev => [...prev, result]);
    setBot1History(prev => [...prev, move]);
    setBot2History(prev => [...prev, botMove]);
    setCurrentRound(currentRound + 1);
    
    // Wait before asking for next move
    setTimeout(() => {
      if (currentRound + 1 < totalRounds) {
        setWaitingForPlayerMove(true);
      }
    }, 1000);
  };
  
  // Run a single round when simulation is active
  useEffect(() => {
    if (!isRunning || playerMode || quickPlay) return;
    if (!selectedBot1 || !selectedBot2) return;
    
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

  // Check if player game is finished
  useEffect(() => {
    if ((playerMode || quickPlay) && isRunning && currentRound >= totalRounds) {
      setIsRunning(false);
      runFullTournament();
    }
  }, [currentRound, totalRounds, playerMode, quickPlay, isRunning]);
  
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
            {/* Quick Play Option */}
            <BotCard 
              key="quick-play"
              bot={{
                id: 'quick-play',
                name: 'Quick Play Challenge (20 rounds)',
                description: 'Play a quick 20-round game against a randomly selected bot. Choose your strategy!',
                strategy: () => 'split',
                color: 'bg-primary'
              }}
              selected={quickPlay}
              onClick={handleQuickPlay}
              isMystery={true}
            />
            
            {/* Mystery Bot Option */}
            <BotCard 
              key="mystery-bot"
              bot={{
                id: 'mystery',
                name: 'Play Against Mystery Bot',
                description: 'Test your strategy against a randomly selected bot. Can you figure out which one?',
                strategy: () => 'split',
                color: 'bg-neutral'
              }}
              selected={playerMode && !quickPlay}
              onClick={handleSelectMysteryBot}
              isMystery={true}
            />
            
            {availableBots.map(bot => (
              <BotCard 
                key={`bot1-${bot.id}`}
                bot={bot}
                selected={selectedBot1?.id === bot.id && !playerMode && !quickPlay}
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
          
          {(playerMode || quickPlay) && (
            <div className="mt-6">
              <PlayerControls 
                onMove={handlePlayerMove} 
                disabled={!waitingForPlayerMove || !isRunning} 
                lastPlayerMove={playerLastMove}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Bot 2</h2>
          <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {!playerMode && !quickPlay && availableBots.map(bot => (
              <BotCard 
                key={`bot2-${bot.id}`}
                bot={bot}
                selected={selectedBot2?.id === bot.id}
                onClick={() => handleSelectBot(bot, 2)}
              />
            ))}
            
            {(playerMode || quickPlay) && (
              <div className="text-center p-6 text-muted-foreground">
                {quickPlay 
                  ? "You are playing a 20-round quick challenge!"
                  : "You are playing against the mystery bot!"}
              </div>
            )}
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
