
// Define types
export type Move = 'split' | 'steal';
export type BotHistory = Move[];
export type BotStrategy = (botHistory: BotHistory, opponentHistory: BotHistory) => Move;

export interface Bot {
  id: string;
  name: string;
  strategy: BotStrategy;
  description: string;
  color?: string;
}

export interface MatchResult {
  bot1Move: Move;
  bot2Move: Move;
  bot1Score: number;
  bot2Score: number;
}

export interface TournamentResult {
  botName: string;
  totalScore: number;
  matches: number;
  splitCount: number;
  stealCount: number;
  avgScore: number;
}

// Payoff matrix
export const PAYOFFS: Record<Move, Record<Move, [number, number]>> = {
  split: {
    split: [3, 3],
    steal: [0, 5],
  },
  steal: {
    split: [5, 0],
    steal: [1, 1],
  }
};

// Apply error to simulate human mistakes (5% chance)
export const applyError = (move: Move): Move => {
  if (Math.random() < 0.05) {
    return move === 'split' ? 'steal' : 'split';
  }
  return move;
};

// Play a single round between two bots
export const playRound = (
  bot1: Bot, 
  bot2: Bot, 
  bot1History: BotHistory, 
  bot2History: BotHistory,
  applyErrors = true
): MatchResult => {
  let move1 = bot1.strategy(bot1History, bot2History);
  let move2 = bot2.strategy(bot2History, bot1History);

  // Apply errors if enabled
  if (applyErrors) {
    move1 = applyError(move1);
    move2 = applyError(move2);
  }

  // Update histories
  bot1History.push(move1);
  bot2History.push(move2);

  // Calculate scores based on the payoff matrix
  const [score1, score2] = PAYOFFS[move1][move2];

  return {
    bot1Move: move1,
    bot2Move: move2,
    bot1Score: score1,
    bot2Score: score2
  };
};

// Simulate a full game between two bots
export const simulateGame = (
  bot1: Bot,
  bot2: Bot,
  rounds: number = 100,
  applyErrors = true
): {
  totalScores: [number, number];
  history: MatchResult[];
} => {
  const bot1History: BotHistory = [];
  const bot2History: BotHistory = [];
  const matchHistory: MatchResult[] = [];
  let bot1Score = 0;
  let bot2Score = 0;

  for (let i = 0; i < rounds; i++) {
    const result = playRound(bot1, bot2, bot1History, bot2History, applyErrors);
    matchHistory.push(result);
    bot1Score += result.bot1Score;
    bot2Score += result.bot2Score;
  }

  return {
    totalScores: [bot1Score, bot2Score],
    history: matchHistory
  };
};

// Run a tournament with multiple bots
export const runTournament = (
  bots: Bot[],
  rounds: number = 100,
  applyErrors = true
): TournamentResult[] => {
  const botStats: Record<string, {
    totalScore: number,
    matches: number,
    splitCount: number,
    stealCount: number
  }> = {};

  // Initialize stats for each bot
  bots.forEach(bot => {
    botStats[bot.name] = {
      totalScore: 0,
      matches: 0,
      splitCount: 0,
      stealCount: 0
    };
  });

  // Run all pairwise matches
  for (let i = 0; i < bots.length; i++) {
    for (let j = 0; j < bots.length; j++) {
      if (i === j) continue; // Skip self-matches for now

      const bot1 = bots[i];
      const bot2 = bots[j];
      
      const { totalScores, history } = simulateGame(bot1, bot2, rounds, applyErrors);
      
      // Update stats
      botStats[bot1.name].totalScore += totalScores[0];
      botStats[bot1.name].matches++;
      
      botStats[bot2.name].totalScore += totalScores[1];
      botStats[bot2.name].matches++;
      
      // Count moves
      history.forEach(round => {
        if (round.bot1Move === 'split') {
          botStats[bot1.name].splitCount++;
        } else {
          botStats[bot1.name].stealCount++;
        }
        
        if (round.bot2Move === 'split') {
          botStats[bot2.name].splitCount++;
        } else {
          botStats[bot2.name].stealCount++;
        }
      });
    }
  }

  // Convert stats to results array and calculate averages
  const results = Object.entries(botStats).map(([botName, stats]) => ({
    botName,
    totalScore: stats.totalScore,
    matches: stats.matches,
    splitCount: stats.splitCount,
    stealCount: stats.stealCount,
    avgScore: stats.matches > 0 ? stats.totalScore / stats.matches : 0
  }));

  // Sort by total score in descending order
  return results.sort((a, b) => b.totalScore - a.totalScore);
};
