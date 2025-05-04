import { Move, BotStrategy, PAYOFFS, Bot } from './gameLogic';
import random from 'random';

// Define the payoff matrix
const PAYOFFS_ORIGINAL = {
    'split': {
        'split': [3, 3],
        'steal': [0, 5],
    },
    'steal': {
        'split': [5, 0],
        'steal': [1, 1],
    }
};

// Function to introduce a 5% chance of messing up the move
const applyError = (move: Move): Move => {
    if (random.float() < 0.05) { // 5% chance of error
        return move === 'split' ? 'steal' : 'split';
    }
    return move;
};

// Define bot strategies
export const alwaysSplit: BotStrategy = () => 'split';

export const alwaysSteal: BotStrategy = () => 'steal';

export const titForTat: BotStrategy = (botHistory, opponentHistory) => {
    if (!opponentHistory.length) {
        return 'split';
    }
    return opponentHistory[opponentHistory.length - 1];
};

export const forgivingTitForTat10: BotStrategy = (botHistory, opponentHistory) => {
    if (!opponentHistory.length) {
        return 'split';
    }
    if (opponentHistory[opponentHistory.length - 1] === 'steal' && random.float() > 0.1) {
        return 'steal';
    }
    return 'split';
};

export const forgivingTitForTat30: BotStrategy = (botHistory, opponentHistory) => {
    if (!opponentHistory.length) {
        return 'split';
    }
    if (opponentHistory[opponentHistory.length - 1] === 'steal' && random.float() > 0.3) {
        return 'steal';
    }
    return 'split';
};

export const forgivingTitForTat50: BotStrategy = (botHistory, opponentHistory) => {
    if (!opponentHistory.length) {
        return 'split';
    }
    if (opponentHistory[opponentHistory.length - 1] === 'steal' && random.float() > 0.5) {
        return 'steal';
    }
    return 'split';
};

export const generousBot: BotStrategy = () => {
    return random.float() < 0.8 ? 'split' : 'steal';
};

export const cautiousBot: BotStrategy = (botHistory, opponentHistory) => {
    if (!opponentHistory.length) {
        return 'split';
    }
    const cooperationRate = opponentHistory.filter(move => move === 'split').length / opponentHistory.length;
    return cooperationRate > 0.7 ? 'split' : 'steal';
};

export const bully: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 2 && 
        opponentHistory[opponentHistory.length - 1] === 'steal' && 
        opponentHistory[opponentHistory.length - 2] === 'steal') {
        return 'split';
    }
    return 'steal';
};

export const exploiter: BotStrategy = (botHistory, opponentHistory) => {
    if (botHistory.length < 3) {
        return ['split', 'steal', 'split'][botHistory.length];
    }
    if (!opponentHistory.slice(0, 3).includes('steal')) {
        return 'steal';
    }
    return titForTat(botHistory, opponentHistory);
};

export const pavlov: BotStrategy = (botHistory, opponentHistory) => {
    if (!botHistory.length) {
        return 'split';
    }
    const lastMove = botHistory[botHistory.length - 1];
    const lastScore = PAYOFFS[lastMove][opponentHistory[opponentHistory.length - 1]][0];
    if (lastScore >= 3) { // Reward threshold
        return lastMove;
    }
    return lastMove === 'split' ? 'steal' : 'split';
};

export const grudger: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.includes('steal')) {
        return 'steal';
    }
    return 'split';
};

export const adaptiveTitForTat: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 2 && 
        opponentHistory[opponentHistory.length - 1] === 'steal' && 
        opponentHistory[opponentHistory.length - 2] === 'steal') {
        return 'steal';
    }
    return titForTat(botHistory, opponentHistory);
};

export const randomBot: BotStrategy = () => {
    return random.boolean() ? 'split' : 'steal';
};

export const alternator: BotStrategy = (botHistory) => {
    return botHistory.length % 2 === 0 ? 'split' : 'steal';
};

export const detective: BotStrategy = (botHistory, opponentHistory) => {
    if (botHistory.length < 4) {
        return ['split', 'steal', 'split', 'split'][botHistory.length];
    }
    if (opponentHistory.slice(0, 4).includes('steal')) {
        return titForTat(botHistory, opponentHistory);
    }
    return 'steal';
};

export const generousPavlov: BotStrategy = (botHistory, opponentHistory) => {
    if (!botHistory.length) {
        return 'split';
    }
    const lastMove = botHistory[botHistory.length - 1];
    const lastScore = PAYOFFS[lastMove][opponentHistory[opponentHistory.length - 1]][0];
    if (lastScore >= 3 || random.float() < 0.2) {
        return lastMove;
    }
    return lastMove === 'split' ? 'steal' : 'split';
};

export const cautiousForgiver: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 2 && 
        opponentHistory[opponentHistory.length - 1] === 'steal' && 
        opponentHistory[opponentHistory.length - 2] === 'steal') {
        return random.float() < 0.1 ? 'split' : 'steal';
    }
    return 'split';
};

export const hopefulBot: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 3 && 
        opponentHistory[opponentHistory.length - 1] === 'steal' && 
        opponentHistory[opponentHistory.length - 2] === 'steal' && 
        opponentHistory[opponentHistory.length - 3] === 'steal') {
        return 'steal';
    }
    return 'split';
};

export const adaptiveGenerousBot: BotStrategy = (botHistory, opponentHistory) => {
    if (!opponentHistory.length) {
        return random.float() < 0.8 ? 'split' : 'steal';
    }
    const cooperationRate = opponentHistory.filter(move => move === 'split').length / opponentHistory.length;
    if (cooperationRate > 0.6) {
        return random.float() < 0.9 ? 'split' : 'steal';
    }
    return random.float() < 0.5 ? 'split' : 'steal';
};

export const persistentBully: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 3 && 
        opponentHistory[opponentHistory.length - 1] === 'steal' && 
        opponentHistory[opponentHistory.length - 2] === 'steal' && 
        opponentHistory[opponentHistory.length - 3] === 'steal') {
        return 'split';
    }
    return 'steal';
};

export const sneakyExploiter: BotStrategy = (botHistory, opponentHistory) => {
    if (botHistory.length < 5) {
        return ['split', 'steal', 'split', 'steal', 'split'][botHistory.length];
    }
    if (!opponentHistory.slice(0, 5).includes('steal')) {
        return 'steal';
    }
    return titForTat(botHistory, opponentHistory);
};

export const aggressiveAlternator: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 3 && 
        opponentHistory[opponentHistory.length - 1] === 'split' && 
        opponentHistory[opponentHistory.length - 2] === 'split' && 
        opponentHistory[opponentHistory.length - 3] === 'split') {
        return 'steal';
    }
    return botHistory.length % 2 === 0 ? 'split' : 'steal';
};

export const learningBot: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length < 10) {
        return random.float() < 0.6 ? 'split' : 'steal';
    }
    const recentCooperation = opponentHistory.slice(-10).filter(move => move === 'split').length / 10;
    return recentCooperation > 0.6 ? 'split' : 'steal';
};

export const winStayLoseShift: BotStrategy = (botHistory, opponentHistory) => {
    if (!botHistory.length) {
        return 'split';
    }
    const lastMove = botHistory[botHistory.length - 1];
    const lastScore = PAYOFFS[lastMove][opponentHistory[opponentHistory.length - 1]][0];
    return lastScore >= 3 ? lastMove : (lastMove === 'split' ? 'steal' : 'split');
};

export const titForTwoTats: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 2 && 
        opponentHistory[opponentHistory.length - 1] === 'steal' && 
        opponentHistory[opponentHistory.length - 2] === 'steal') {
        return 'steal';
    }
    return 'split';
};

export const randomForgiver: BotStrategy = () => {
    return random.float() < 0.3 || random.boolean() ? 'split' : 'steal';
};

export const chaoticBot: BotStrategy = (botHistory, opponentHistory) => {
    if (!opponentHistory.length) {
        return random.boolean() ? 'split' : 'steal';
    }
    if (opponentHistory.filter(move => move === 'steal').length / opponentHistory.length > 0.5) {
        return 'steal';
    }
    return random.boolean() ? 'split' : 'steal';
};

export const forgivingDetective: BotStrategy = (botHistory, opponentHistory) => {
    if (botHistory.length < 4) {
        return ['split', 'steal', 'split', 'split'][botHistory.length];
    }
    if (opponentHistory.slice(0, 4).includes('steal') && random.float() < 0.2) {
        return 'split';
    }
    return 'steal';
};

export const adaptiveGrudger: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 2 && 
        opponentHistory[opponentHistory.length - 1] === 'steal' && 
        opponentHistory[opponentHistory.length - 2] === 'steal') {
        return random.float() < 0.1 ? 'split' : 'steal';
    }
    return 'split';
};

export const probingTitForTat: BotStrategy = (botHistory, opponentHistory) => {
    if (botHistory.length % 10 === 0) {
        return 'steal';
    }
    return titForTat(botHistory, opponentHistory);
};

export const forgivingProbingTitForTat10: BotStrategy = (botHistory, opponentHistory) => {
    if (botHistory.length % 10 === 0 && random.float() < 0.1) {
        return 'split';
    }
    return titForTat(botHistory, opponentHistory);
};

export const sneakyAlternator: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 3 && 
        opponentHistory[opponentHistory.length - 1] === 'split' && 
        opponentHistory[opponentHistory.length - 2] === 'split' && 
        opponentHistory[opponentHistory.length - 3] === 'split') {
        return 'steal';
    }
    return botHistory.length % 2 === 0 ? 'split' : 'steal';
};

export const deceptiveTitForTat: BotStrategy = (botHistory, opponentHistory) => {
    if (!opponentHistory.length) {
        return 'split';
    }
    const move = opponentHistory[opponentHistory.length - 1];
    return random.float() < 0.1 ? 'steal' : move;
};

export const aggressivePavlov: BotStrategy = (botHistory, opponentHistory) => {
    if (!botHistory.length) {
        return 'steal';
    }
    const lastMove = botHistory[botHistory.length - 1];
    const lastScore = PAYOFFS[lastMove][opponentHistory[opponentHistory.length - 1]][0];
    if (lastScore >= 3) { // Reward threshold
        return lastMove;
    }
    return lastMove === 'split' ? 'steal' : 'split';
};

export const randomDefector: BotStrategy = () => {
    return random.float() < 0.8 ? 'steal' : 'split';
};

export const greedyProber: BotStrategy = (botHistory, opponentHistory) => {
    if (botHistory.length < 5) {
        return ['split', 'steal', 'split', 'steal', 'split'][botHistory.length];
    }
    if (!opponentHistory.slice(0, 5).includes('steal')) {
        return 'steal';
    }
    return titForTat(botHistory, opponentHistory);
};

export const forgivingGrudger: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 2 && 
        opponentHistory[opponentHistory.length - 1] === 'steal' && 
        opponentHistory[opponentHistory.length - 2] === 'steal') {
        return random.float() < 0.2 ? 'split' : 'steal';
    }
    return 'split';
};

export const hopefulAlternator: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 3 && 
        opponentHistory[opponentHistory.length - 1] === 'split' && 
        opponentHistory[opponentHistory.length - 2] === 'split' && 
        opponentHistory[opponentHistory.length - 3] === 'split') {
        return 'split';
    }
    return botHistory.length % 2 === 0 ? 'split' : 'steal';
};

export const cautiousTitForTat: BotStrategy = (botHistory, opponentHistory) => {
    if (botHistory.length < 2) {
        return 'split';
    }
    return opponentHistory[opponentHistory.length - 1];
};

export const generousAlternator: BotStrategy = (botHistory) => {
    return random.float() < 0.8 ? 'split' : (botHistory.length % 2 === 0 ? 'split' : 'steal');
};

export const trustingProber: BotStrategy = (botHistory, opponentHistory) => {
    if (botHistory.length < 3) {
        return ['split', 'steal', 'split'][botHistory.length];
    }
    if (opponentHistory.slice(0, 3).includes('steal')) {
        return 'split';
    }
    return titForTat(botHistory, opponentHistory);
};

export const adaptiveCooperator: BotStrategy = (botHistory, opponentHistory) => {
    if (!opponentHistory.length) {
        return 'split';
    }
    const cooperationRate = opponentHistory.filter(move => move === 'split').length / opponentHistory.length;
    if (cooperationRate > 0.6) {
        return random.float() < 0.9 ? 'split' : 'steal';
    }
    return random.float() < 0.5 ? 'split' : 'steal';
};

export const hopefulTitForTat: BotStrategy = (botHistory, opponentHistory) => {
    if (botHistory.length < 3) {
        return 'split';
    }
    return opponentHistory[opponentHistory.length - 1];
};

export const forgivingHopefulTitForTat10: BotStrategy = (botHistory, opponentHistory) => {
    if (botHistory.length < 3) {
        return 'split';
    }
    if (opponentHistory[opponentHistory.length - 1] === 'steal' && random.float() < 0.1) {
        return 'split';
    }
    return opponentHistory[opponentHistory.length - 1];
};

export const forgivingAlternator: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 1 && opponentHistory[opponentHistory.length - 1] === 'steal' && random.float() < 0.3) {
        return 'split';
    }
    return botHistory.length % 2 === 0 ? 'split' : 'steal';
};

export const trustingTitForTat: BotStrategy = (botHistory, opponentHistory) => {
    if (!opponentHistory.length) {
        return 'split';
    }
    if (opponentHistory[opponentHistory.length - 1] === 'steal' && random.float() < 0.2) {
        return 'split';
    }
    return opponentHistory[opponentHistory.length - 1];
};

export const adaptiveForgiver: BotStrategy = (botHistory, opponentHistory) => {
    if (!opponentHistory.length) {
        return 'split';
    }
    const defectionRate = opponentHistory.filter(move => move === 'steal').length / opponentHistory.length;
    const forgivenessRate = defectionRate > 0.5 ? 0.1 : 0.5;
    if (opponentHistory[opponentHistory.length - 1] === 'steal' && random.float() < forgivenessRate) {
        return 'split';
    }
    return random.float() < 0.8 ? 'split' : 'steal';
};

export const generousGrudger: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 2 && 
        opponentHistory[opponentHistory.length - 1] === 'steal' && 
        opponentHistory[opponentHistory.length - 2] === 'steal') {
        return random.float() < 0.5 ? 'split' : 'steal';
    }
    return 'split';
};

export const optimisticProber: BotStrategy = (botHistory, opponentHistory) => {
    if (botHistory.length < 3) {
        return ['split', 'steal', 'split'][botHistory.length];
    }
    if (opponentHistory.slice(0, 3).includes('steal')) {
        return 'split';
    }
    return titForTat(botHistory, opponentHistory);
};

export const persistentAlternator: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 2 && 
        opponentHistory[opponentHistory.length - 1] === 'split' && 
        opponentHistory[opponentHistory.length - 2] === 'split') {
        return 'steal';
    }
    return botHistory.length % 2 === 0 ? 'split' : 'steal';
};

export const deceptiveGrudger: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.includes('steal')) {
        return random.float() < 0.1 ? 'split' : 'steal';
    }
    return 'split';
};

export const greedyPavlov: BotStrategy = (botHistory, opponentHistory) => {
    if (!botHistory.length) {
        return 'steal';
    }
    const lastMove = botHistory[botHistory.length - 1];
    const lastScore = PAYOFFS[lastMove][opponentHistory[opponentHistory.length - 1]][0];
    if (lastScore >= 3) { // Reward threshold
        return lastMove;
    }
    return lastMove === 'split' ? 'steal' : 'split';
};

export const randomExploiter: BotStrategy = () => {
    return random.float() < 0.7 ? 'steal' : 'split';
};

export const sneakyGrudger: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length >= 2 && 
        opponentHistory[opponentHistory.length - 1] === 'steal' && 
        opponentHistory[opponentHistory.length - 2] === 'steal') {
        return 'steal';
    }
    return 'split';
};

export const adaptiveDefector: BotStrategy = (botHistory, opponentHistory) => {
    if (!opponentHistory.length) {
        return 'steal';
    }
    const cooperationRate = opponentHistory.filter(move => move === 'split').length / opponentHistory.length;
    if (cooperationRate > 0.6) {
        return random.float() < 0.9 ? 'steal' : 'split';
    }
    return random.float() < 0.5 ? 'steal' : 'split';
};

export const chaoticAlternator: BotStrategy = (botHistory, opponentHistory) => {
    if (opponentHistory.length && opponentHistory.filter(move => move === 'steal').length / opponentHistory.length > 0.6) {
        return 'steal';
    }
    return random.boolean() ? 'split' : 'steal';
};

export const aggressiveProber: BotStrategy = (botHistory, opponentHistory) => {
    if (botHistory.length < 4) {
        return ['split', 'steal', 'split', 'steal'][botHistory.length];
    }
    if (!opponentHistory.slice(0, 4).includes('steal')) {
        return 'steal';
    }
    return titForTat(botHistory, opponentHistory);
};

// Create a list of predefined bots
export const availableBots: Bot[] = [
  {
    id: 'always-split',
    name: 'Cooperative Carl',
    strategy: alwaysSplit,
    description: 'Always chooses to split, no matter what.',
    color: 'bg-bot-green'
  },
  {
    id: 'always-steal',
    name: 'Greedy Greg',
    strategy: alwaysSteal,
    description: 'Always chooses to steal, no matter what.',
    color: 'bg-bot-red'
  },
  {
    id: 'tit-for-tat',
    name: 'Copycat Charlie',
    strategy: titForTat,
    description: 'Starts with split, then copies what you did last round.',
    color: 'bg-bot-blue'
  },
  {
    id: 'forgiving-tft-10',
    name: 'Forgiving Fiona (10%)',
    strategy: forgivingTitForTat10,
    description: 'Like Copycat but forgives approximately 10% of the time.',
    color: 'bg-bot-purple'
  },
  {
    id: 'forgiving-tft-30',
    name: 'Forgiving Fiona (30%)',
    strategy: forgivingTitForTat30,
    description: 'Like Copycat but forgives approximately 30% of the time.',
    color: 'bg-bot-purple'
  },
  {
    id: 'forgiving-tft-50',
    name: 'Forgiving Fiona (50%)',
    strategy: forgivingTitForTat50,
    description: 'Like Copycat but forgives approximately 50% of the time.',
    color: 'bg-bot-purple'
  },
  {
    id: 'grudger',
    name: 'Grudger Gary',
    strategy: grudger,
    description: 'Splits until you steal once, then steals forever.',
    color: 'bg-bot-yellow'
  },
  {
    id: 'pavlov',
    name: 'Pavlov Patricia',
    strategy: pavlov,
    description: 'Repeats last move if it got a good score, otherwise switches.',
    color: 'bg-bot-purple'
  },
  {
    id: 'random',
    name: 'Random Randy',
    strategy: randomBot,
    description: 'Randomly chooses to split or steal each round.',
    color: 'bg-neutral'
  },
  {
    id: 'generous',
    name: 'Generous Gina',
    strategy: generousBot,
    description: 'Splits 80% of the time, steals 20% of the time.',
    color: 'bg-bot-green'
  },
  {
    id: 'exploiter',
    name: 'Exploiter Eddie',
    strategy: exploiter,
    description: 'Tests you first, then exploits if you seem too cooperative.',
    color: 'bg-bot-red'
  },
  {
    id: 'tit-for-two-tats',
    name: 'Patient Paul',
    strategy: titForTwoTats,
    description: 'Only steals if you steal twice in a row.',
    color: 'bg-bot-blue'
  },
  {
    id: 'adaptive-tit-for-tat',
    name: 'Adaptive Andy',
    strategy: adaptiveTitForTat,
    description: 'Uses tit-for-tat but switches to always steal if you defect twice in a row.',
    color: 'bg-bot-yellow'
  },
  {
    id: 'cautious-bot',
    name: 'Cautious Cathy',
    strategy: cautiousBot,
    description: 'Cooperates only if the opponent has cooperated more than 70% of the time.',
    color: 'bg-bot-blue'
  },
  {
    id: 'bully',
    name: 'Bully Bob',
    strategy: bully,
    description: 'Starts by defecting and continues defecting unless the opponent retaliates twice in a row.',
    color: 'bg-bot-red'
  },
  {
    id: 'generous-pavlov',
    name: 'Generous Pavlov',
    strategy: generousPavlov,
    description: 'Like Pavlov but forgives approximately 20% of the time.',
    color: 'bg-bot-purple'
  },
  {
    id: 'cautious-forgiver',
    name: 'Cautious Forgiver',
    strategy: cautiousForgiver,
    description: 'Cooperates unless the opponent defects more than twice in a row. Occasionally forgives.',
    color: 'bg-bot-blue'
  },
  {
    id: 'hopeful-bot',
    name: 'Hopeful Harry',
    strategy: hopefulBot,
    description: 'Always starts with cooperation. Defects only if the opponent defects three times in a row.',
    color: 'bg-bot-green'
  },
  {
    id: 'adaptive-generous-bot',
    name: 'Adaptive Generous Bot',
    strategy: adaptiveGenerousBot,
    description: 'Starts with 80% cooperation. Adjusts cooperation rate based on the opponent\'s behavior.',
    color: 'bg-bot-green'
  },
  {
    id: 'persistent-bully',
    name: 'Persistent Bully',
    strategy: persistentBully,
    description: 'Starts by defecting. Cooperates only if the opponent retaliates three times in a row.',
    color: 'bg-bot-red'
  },
  {
    id: 'sneaky-exploiter',
    name: 'Sneaky Exploiter',
    strategy: sneakyExploiter,
    description: 'Alternates between split and steal. Exploits if the opponent doesn\'t retaliate within the first five rounds.',
    color: 'bg-bot-red'
  },
  {
    id: 'aggressive-alternator',
    name: 'Aggressive Alternator',
    strategy: aggressiveAlternator,
    description: 'Alternates between split and steal but defects twice in a row if the opponent cooperates three times consecutively.',
    color: 'bg-bot-yellow'
  },
  {
    id: 'learning-bot',
    name: 'Learning Bot',
    strategy: learningBot,
    description: 'Learns the opponent\'s cooperation rate over the last 10 rounds and adjusts its strategy.',
    color: 'bg-bot-blue'
  },
  {
    id: 'win-stay-lose-shift',
    name: 'Win-Stay-Lose-Shift',
    strategy: winStayLoseShift,
    description: 'Starts with split. Repeats the last move if rewarded, otherwise switches.',
    color: 'bg-bot-purple'
  },
  {
    id: 'random-forgiver',
    name: 'Random Forgiver',
    strategy: randomForgiver,
    description: 'Chooses randomly between split and steal but forgives defections 30% of the time.',
    color: 'bg-neutral'
  },
  {
    id: 'chaotic-bot',
    name: 'Chaotic Bot',
    strategy: chaoticBot,
    description: 'Alternates randomly but switches to full defection if the opponent defects more than 50% of the time.',
    color: 'bg-neutral'
  },
  {
    id: 'forgiving-detective',
    name: 'Forgiving Detective',
    strategy: forgivingDetective,
    description: 'Tests the opponent: split, steal, split, split. Forgives defections 20% of the time.',
    color: 'bg-bot-blue'
  },
  {
    id: 'adaptive-grudger',
    name: 'Adaptive Grudger',
    strategy: adaptiveGrudger,
    description: 'Cooperates until the opponent defects twice in a row. Occasionally forgives.',
    color: 'bg-bot-yellow'
  },
  {
    id: 'probing-tit-for-tat',
    name: 'Probing Tit-for-Tat',
    strategy: probingTitForTat,
    description: 'Starts with cooperation but occasionally probes the opponent by defecting once every 10 rounds.',
    color: 'bg-bot-blue'
  },
  {
    id: 'forgiving-probing-tft-10',
    name: 'Forgiving Probing Tit-for-Tat (10%)',
    strategy: forgivingProbingTitForTat10,
    description: 'Starts with cooperation but occasionally probes the opponent by defecting once every 10 rounds. Forgives defections 10% of the time.',
    color: 'bg-bot-blue'
  },
  {
    id: 'sneaky-alternator',
    name: 'Sneaky Alternator',
    strategy: sneakyAlternator,
    description: 'Alternates between split and steal but defects twice in a row if the opponent cooperates three times consecutively.',
    color: 'bg-bot-yellow'
  },
  {
    id: 'deceptive-tit-for-tat',
    name: 'Deceptive Tit-for-Tat',
    strategy: deceptiveTitForTat,
    description: 'Mimics the opponent\'s last move but occasionally defects (10% chance).',
    color: 'bg-bot-blue'
  },
  {
    id: 'aggressive-pavlov',
    name: 'Aggressive Pavlov',
    strategy: aggressivePavlov,
    description: 'Starts with steal. Repeats the last move if rewarded, otherwise switches.',
    color: 'bg-bot-red'
  },
  {
    id: 'random-defector',
    name: 'Random Defector',
    strategy: randomDefector,
    description: 'Chooses randomly between split and steal but defects 80% of the time.',
    color: 'bg-bot-red'
  },
  {
    id: 'greedy-prober',
    name: 'Greedy Prober',
    strategy: greedyProber,
    description: 'Tests the opponent by alternating between split and steal. Exploits if the opponent doesn\'t retaliate within the first five rounds.',
    color: 'bg-bot-red'
  },
  {
    id: 'forgiving-grudger',
    name: 'Forgiving Grudger',
    strategy: forgivingGrudger,
    description: 'Cooperates until the opponent defects twice in a row. Occasionally forgives.',
    color: 'bg-bot-yellow'
  },
  {
    id: 'hopeful-alternator',
    name: 'Hopeful Alternator',
    strategy: hopefulAlternator,
    description: 'Alternates between split and steal but switches to full cooperation if the opponent cooperates three times consecutively.',
    color: 'bg-bot-green'
  },
  {
    id: 'cautious-tit-for-tat',
    name: 'Cautious Tit-for-Tat',
    strategy: cautiousTitForTat,
    description: 'Mimics the opponent\'s last move but starts with two consecutive cooperations.',
    color: 'bg-bot-blue'
  },
  {
    id: 'generous-alternator',
    name: 'Generous Alternator',
    strategy: generousAlternator,
    description: 'Alternates between split and steal but cooperates 80% of the time.',
    color: 'bg-bot-green'
  },
  {
    id: 'trusting-prober',
    name: 'Trusting Prober',
    strategy: trustingProber,
    description: 'Tests the opponent by alternating between split and steal. Switches to full cooperation if the opponent retaliates.',
    color: 'bg-bot-blue'
  },
  {
    id: 'adaptive-cooperator',
    name: 'Adaptive Cooperator',
    strategy: adaptiveCooperator,
    description: 'Starts with cooperation. Adjusts cooperation rate based on the opponent\'s behavior.',
    color: 'bg-bot-green'
  },
  {
    id: 'hopeful-tit-for-tat',
    name: 'Hopeful Tit-for-Tat',
    strategy: hopefulTitForTat,
    description: 'Mimics the opponent\'s last move but starts with three consecutive cooperations.',
    color: 'bg-bot-blue'
  },
  {
    id: 'forgiving-hopeful-tft-10',
    name: 'Forgiving Hopeful Tit-for-Tat (10%)',
    strategy: forgivingHopefulTitForTat10,
    description: 'Mimics the opponent\'s last move but starts with three consecutive cooperations. Forgives defections 10% of the time.',
    color: 'bg-bot-blue'
  },
  {
    id: 'forgiving-alternator',
    name: 'Forgiving Alternator',
    strategy: forgivingAlternator,
    description: 'Alternates between split and steal but forgives defections 30% of the time.',
    color: 'bg-bot-green'
  },
  {
    id: 'trusting-tit-for-tat',
    name: 'Trusting Tit-for-Tat',
    strategy: trustingTitForTat,
    description: 'Mimics the opponent\'s last move but occasionally cooperates (20% chance) even after a defection.',
    color: 'bg-bot-blue'
  },
  {
    id: 'adaptive-forgiver',
    name: 'Adaptive Forgiver',
    strategy: adaptiveForgiver,
    description: 'Starts with cooperation. Adjusts forgiveness rate based on the opponent\'s behavior.',
    color: 'bg-bot-green'
  },
  {
    id: 'generous-grudger',
    name: 'Generous Grudger',
    strategy: generousGrudger,
    description: 'Cooperates until the opponent defects twice in a row. Forgives 50% of the time.',
    color: 'bg-bot-yellow'
  },
  {
    id: 'optimistic-prober',
    name: 'Optimistic Prober',
    strategy: optimisticProber,
    description: 'Tests the opponent by alternating between split and steal. Switches to full cooperation if the opponent retaliates.',
    color: 'bg-bot-blue'
  },
  {
    id: 'persistent-alternator',
    name: 'Persistent Alternator',
    strategy: persistentAlternator,
    description: 'Alternates between split and steal but defects twice in a row if the opponent cooperates twice consecutively.',
    color: 'bg-bot-yellow'
  },
  {
    id: 'deceptive-grudger',
    name: 'Deceptive Grudger',
    strategy: deceptiveGrudger,
    description: 'Starts by cooperating but switches to full defection if the opponent defects even once. Occasionally forgives (10% chance).',
    color: 'bg-bot-yellow'
  },
  {
    id: 'greedy-pavlov',
    name: 'Greedy Pavlov',
    strategy: greedyPavlov,
    description: 'Starts with steal. Repeats the last move if rewarded, otherwise switches.',
    color: 'bg-bot-red'
  },
  {
    id: 'random-exploiter',
    name: 'Random Exploiter',
    strategy: randomExploiter,
    description: 'Chooses randomly between split and steal but defects 70% of the time.',
    color: 'bg-bot-red'
  },
  {
    id: 'sneaky-grudger',
    name: 'Sneaky Grudger',
    strategy: sneakyGrudger,
    description: 'Cooperates until the opponent defects twice in a row. Switches to full defection and never forgives.',
    color: 'bg-bot-yellow'
  },
  {
    id: 'adaptive-defector',
    name: 'Adaptive Defector',
    strategy: adaptiveDefector,
    description: 'Starts with defection. Adjusts defection rate based on the opponent\'s behavior.',
    color: 'bg-bot-red'
  },
  {
    id: 'chaotic-alternator',
    name: 'Chaotic Alternator',
    strategy: chaoticAlternator,
    description: 'Alternates randomly between split and steal but switches to full defection if the opponent defects more than 60% of the time.',
    color: 'bg-neutral'
  },
  {
    id: 'aggressive-prober',
    name: 'Aggressive Prober',
    strategy: aggressiveProber,
    description: 'Tests the opponent by alternating between split and steal. Exploits if the opponent doesn\'t retaliate within the first four rounds.',
    color: 'bg-bot-red'
  },
  {
    id: 'alternator',
    name: 'Alternator Alex',
    strategy: alternator,
    description: 'Alternates between split and steal.',
    color: 'bg-neutral'
  },
  {
    id: 'detective',
    name: 'Detective Dan',
    strategy: detective,
    description: 'Tests the opponent: split, steal, split, split. Exploits if no retaliation.',
    color: 'bg-bot-blue'
  }
];
