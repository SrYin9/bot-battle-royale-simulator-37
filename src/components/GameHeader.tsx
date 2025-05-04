
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, RefreshCw } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  subtitle: string;
  onStart: () => void;
  onReset: () => void;
  isRunning: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({ title, subtitle, onStart, onReset, isRunning }) => {
  return (
    <div className="w-full flex flex-col items-center mb-8 animate-slide-up">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground mt-2 max-w-2xl text-center">
        {subtitle}
      </p>
      
      <div className="flex gap-4 mt-6">
        <Button 
          onClick={onStart}
          size="lg"
          className="gap-2"
          disabled={isRunning}
        >
          <PlayCircle className="w-5 h-5" />
          Start Simulation
        </Button>
        <Button 
          onClick={onReset} 
          variant="outline" 
          size="lg"
          className="gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default GameHeader;
