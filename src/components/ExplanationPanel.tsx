
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const ExplanationPanel: React.FC = () => {
  return (
    <Card className="w-full animate-slide-up">
      <CardHeader>
        <CardTitle>Understanding The Game</CardTitle>
        <CardDescription>Learn about the game theory concepts behind our simulation</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rules">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="theory">Game Theory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rules" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">The Split or Steal Game:</h3>
              <p className="text-muted-foreground">
                In each round, two bots choose to either SPLIT or STEAL. The payoffs are:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="bg-split/20 p-2 rounded text-sm">Both SPLIT</span>
                  <span>→</span>
                  <span>Both get 3 points (cooperation)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-steal/20 p-2 rounded text-sm">Both STEAL</span>
                  <span>→</span>
                  <span>Both get 1 point (mutual defection)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-neutral/20 p-2 rounded text-sm">One SPLITS, one STEALS</span>
                  <span>→</span>
                  <span>STEAL gets 5 points, SPLIT gets 0 (exploitation)</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mt-4 mb-2">The Dilemma:</h3>
              <p className="text-muted-foreground">
                While mutual cooperation (both SPLIT) yields the highest collective reward, there's
                always a temptation to STEAL for individual gain. This tension between cooperation
                and self-interest is the core of the game.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="strategies" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Common Bot Strategies:</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Always Split</h4>
                  <p className="text-sm text-muted-foreground">
                    Always cooperates. Kind but exploitable.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Always Steal</h4>
                  <p className="text-sm text-muted-foreground">
                    Always defects. Maximizes individual gain at collective expense.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Tit for Tat</h4>
                  <p className="text-sm text-muted-foreground">
                    Starts by splitting, then copies what the opponent did last round.
                    Simple but surprisingly effective.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Grudger</h4>
                  <p className="text-sm text-muted-foreground">
                    Cooperates until the opponent defects once, then defects forever.
                    Never forgives.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Forgiving Strategies</h4>
                  <p className="text-sm text-muted-foreground">
                    Similar to Tit for Tat but occasionally forgives defections.
                    Can repair broken cooperation.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="theory">
            <div>
              <h3 className="text-lg font-medium mb-2">Game Theory Concepts:</h3>
              <p className="text-muted-foreground mb-4">
                This game is a version of the famous Prisoner's Dilemma, one of the 
                foundational problems in game theory.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Nash Equilibrium</h4>
                  <p className="text-sm text-muted-foreground">
                    In a single round, both players stealing is the Nash equilibrium - 
                    neither can improve by changing strategy unilaterally.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Repeated Games</h4>
                  <p className="text-sm text-muted-foreground">
                    When played repeatedly, cooperation can emerge as players can punish or 
                    reward past behavior.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Evolution of Cooperation</h4>
                  <p className="text-sm text-muted-foreground">
                    In tournaments, strategies that balance cooperation with protection against 
                    exploitation (like Tit for Tat) often perform best.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Error Tolerance</h4>
                  <p className="text-sm text-muted-foreground">
                    In our simulation, bots have a 5% chance of making an error. Strategies that 
                    can recover from mistakes are more robust.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExplanationPanel;
