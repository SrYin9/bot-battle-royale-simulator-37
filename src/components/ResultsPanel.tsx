
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TournamentResult } from '@/lib/gameLogic';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ResultsPanelProps {
  results: TournamentResult[];
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results }) => {
  const chartData = results.map((result) => ({
    name: result.botName,
    score: result.totalScore,
    splitRate: (result.splitCount / (result.splitCount + result.stealCount)) * 100,
  })).sort((a, b) => b.score - a.score);

  // Get the top 8 bots for the chart
  const topBots = chartData.slice(0, 8);

  const getBotColor = (botName: string) => {
    // Simple hash function to generate consistent colors
    const hash = botName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Map to a bot color based on hash
    const colors = ['#9b87f5', '#60A5FA', '#4ADE80', '#F87171', '#FBBF24'];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Card className="w-full h-full animate-slide-up">
      <CardHeader>
        <CardTitle>Tournament Results</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topBots}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{fontSize: 12}}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [value, name === 'score' ? 'Total Score' : 'Split Rate (%)']}
                labelFormatter={(label) => `Bot: ${label}`}
              />
              <Bar dataKey="score" name="Total Score">
                {topBots.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBotColor(entry.name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Rank</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Bot</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Score</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Split %</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Steal %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((result, index) => {
                const totalMoves = result.splitCount + result.stealCount;
                const splitPercentage = totalMoves > 0 ? (result.splitCount / totalMoves) * 100 : 0;
                const stealPercentage = totalMoves > 0 ? (result.stealCount / totalMoves) * 100 : 0;
                
                return (
                  <tr key={result.botName}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{index + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{result.botName}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right">{result.totalScore}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-split">
                      {splitPercentage.toFixed(1)}%
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-steal">
                      {stealPercentage.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsPanel;
