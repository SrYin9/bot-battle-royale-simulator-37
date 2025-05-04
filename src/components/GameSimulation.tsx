
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Bot, MatchResult } from '@/lib/gameLogic';

interface GameSimulationProps {
  bot1: Bot | null;
  bot2: Bot | null;
  currentRound: number;
  totalRounds: number;
  isRunning: boolean;
  matchHistory: MatchResult[];
}

const GameSimulation: React.FC<GameSimulationProps> = ({
  bot1,
  bot2,
  currentRound,
  totalRounds,
  isRunning,
  matchHistory
}) => {
  const [bot1Score, setBot1Score] = useState(0);
  const [bot2Score, setBot2Score] = useState(0);
  const [lastResult, setLastResult] = useState<MatchResult | null>(null);
  const [isPlayerGame, setIsPlayerGame] = useState(false);

  // Update scores when match history changes
  useEffect(() => {
    if (matchHistory.length > 0) {
      const newBot1Score = matchHistory.reduce((sum, match) => sum + match.bot1Score, 0);
      const newBot2Score = matchHistory.reduce((sum, match) => sum + match.bot2Score, 0);
      
      setBot1Score(newBot1Score);
      setBot2Score(newBot2Score);
      setLastResult(matchHistory[matchHistory.length - 1]);
      
      // Check if this is a player game (human vs bot)
      setIsPlayerGame(bot1?.id === 'mystery' || bot1?.id === 'quick-play');
    } else {
      setBot1Score(0);
      setBot2Score(0);
      setLastResult(null);
    }
  }, [matchHistory, bot1]);

  if (!bot1 || !bot2) {
    return (
      <Card className="w-full h-64 flex items-center justify-center">
        <CardContent className="text-center text-muted-foreground">
          Select two bots to start the simulation
        </CardContent>
      </Card>
    );
  }

  const getMoveClass = (move: 'split' | 'steal') => {
    return move === 'split' ? 'animate-pulse-split text-split' : 'animate-pulse-steal text-steal';
  };

  return (
    <div className="space-y-6 animate-bounce-in">
      <Card className="w-full p-6">
        <CardContent className="p-0">
          <div className="flex justify-between mb-4">
            <div className="text-lg font-medium">Round</div>
            <div className="text-lg font-medium">{currentRound} / {totalRounds}</div>
          </div>
          <Progress value={(currentRound / totalRounds) * 100} className="h-2 mb-6" />

          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-center space-y-2">
              <div className={`text-lg font-bold ${bot1?.color?.replace('bg-', 'text-') || ''}`}>
                {isPlayerGame ? 'You' : bot1.name}
              </div>
              <div className="text-3xl font-bold">{bot1Score}</div>
              {lastResult && (
                <div className={`text-lg font-medium ${getMoveClass(lastResult.bot1Move)}`}>
                  {lastResult.bot1Move === 'split' ? 'SPLIT' : 'STEAL'}
                </div>
              )}
            </div>

            <div className="text-center border-x px-4">
              <div className="text-sm text-muted-foreground mb-2">VS</div>
              {isRunning ? (
                <div className="animate-bounce text-xl">🔄</div>
              ) : lastResult ? (
                <div className="text-xl">
                  {lastResult.bot1Move === 'split' && lastResult.bot2Move === 'split' ? '🤝' : 
                   lastResult.bot1Move === 'steal' && lastResult.bot2Move === 'steal' ? '💥' : 
                   lastResult.bot1Move === 'steal' ? '😈' : '😢'}
                </div>
              ) : (
                <div className="text-xl">⚔️</div>
              )}
            </div>

            <div className="text-center space-y-2">
              <div className={`text-lg font-bold ${bot2?.color?.replace('bg-', 'text-') || ''}`}>
                {bot2.name}
              </div>
              <div className="text-3xl font-bold">{bot2Score}</div>
              {lastResult && (
                <div className={`text-lg font-medium ${getMoveClass(lastResult.bot2Move)}`}>
                  {lastResult.bot2Move === 'split' ? 'SPLIT' : 'STEAL'}
                </div>
              )}
            </div>
          </div>
          
          {/* Opponent's last move display for player games */}
          {isPlayerGame && lastResult && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="text-center font-medium mb-2">Opponent's Last Move</h3>
              <div className="flex items-center justify-center gap-4">
                <div className={`text-lg font-bold ${lastResult.bot2Move === 'split' ? 'text-split' : 'text-steal'}`}>
                  {lastResult.bot2Move === 'split' ? 'SPLIT' : 'STEAL'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {lastResult.bot2Move === 'split' 
                    ? "Your opponent chose to cooperate!" 
                    : "Your opponent chose to defect!"}
                </div>
              </div>
            </div>
          )}
          
          {/* Round summary for player games */}
          {isPlayerGame && lastResult && (
            <div className="mt-4 text-center">
              <div className="text-sm font-medium">
                {lastResult.bot1Move === 'split' && lastResult.bot2Move === 'split'
                  ? "Both chose to SPLIT: You each get 3 points!"
                  : lastResult.bot1Move === 'split' && lastResult.bot2Move === 'steal'
                  ? "You chose SPLIT, opponent chose STEAL: They get 5 points, you get 0."
                  : lastResult.bot1Move === 'steal' && lastResult.bot2Move === 'split'
                  ? "You chose STEAL, opponent chose SPLIT: You get 5 points, they get 0."
                  : "Both chose to STEAL: You each get 1 point."}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`${bot1?.color || ''} text-white`}>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">{isPlayerGame ? 'You' : bot1?.name}</h3>
            <p className="opacity-80">{isPlayerGame ? 'You are playing against the bot. Make your moves wisely!' : bot1?.description}</p>
          </CardContent>
        </Card>
        
        <Card className={`${bot2?.color || ''} text-white`}>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">{bot2?.name}</h3>
            <p className="opacity-80">{bot2?.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameSimulation;
