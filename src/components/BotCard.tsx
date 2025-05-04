
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Bot } from '@/lib/gameLogic';

interface BotCardProps {
  bot: Bot;
  selected: boolean;
  onClick: () => void;
}

const BotCard: React.FC<BotCardProps> = ({ bot, selected, onClick }) => {
  return (
    <Card 
      className={`w-full cursor-pointer transition-all duration-200 hover:shadow-md ${
        selected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className={`${bot.color || 'bg-neutral'} rounded-t-lg text-white`}>
        <CardTitle className="text-lg">{bot.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <CardDescription className="mb-2 text-xs">{bot.description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default BotCard;
