
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Split, Hand } from 'lucide-react';
import { Move } from '@/lib/gameLogic';

interface PlayerControlsProps {
  onMove: (move: Move) => void;
  disabled: boolean;
  lastPlayerMove?: Move;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ onMove, disabled, lastPlayerMove }) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Your Move</h2>
        
        <div className="flex flex-col gap-4">
          <Button 
            onClick={() => onMove('split')} 
            disabled={disabled} 
            variant={lastPlayerMove === 'split' ? 'default' : 'outline'} 
            className="flex items-center gap-2"
            size="lg"
          >
            <Hand className="w-5 h-5" />
            Split (Cooperate)
          </Button>
          
          <Button 
            onClick={() => onMove('steal')} 
            disabled={disabled} 
            variant={lastPlayerMove === 'steal' ? 'default' : 'outline'} 
            className="flex items-center gap-2"
            size="lg"
          >
            <Split className="w-5 h-5 rotate-180" />
            Steal (Defect)
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">
          {!disabled 
            ? "Choose your move - work together or betray?" 
            : "Wait for your opponent's next move..."}
        </p>
      </CardContent>
    </Card>
  );
};

export default PlayerControls;
