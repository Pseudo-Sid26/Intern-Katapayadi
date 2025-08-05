import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award, BarChart3, History, Flame } from 'lucide-react';

const user = {
  name: 'Arya',
  avatarUrl: 'https://placehold.co/100x100.png',
  dataAiHint: 'woman smiling',
  score: 12580,
  streak: 15,
  badges: ['Master of Mauryas', 'Gupta Genius', 'Chola Champion'],
  history: [
    { game: 'Self Quizzing: History', score: 250, date: '2 days ago' },
    { game: 'Multiplayer: Geography', score: 180, date: '3 days ago' },
    { game: 'Brain Enhancement: Symbols', score: 320, date: '5 days ago' },
  ]
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.dataAiHint} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="font-headline text-4xl">{user.name}</CardTitle>
            <CardDescription className="text-lg">A dedicated learner and quiz enthusiast.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-center">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-xl font-headline"><BarChart3 className="h-6 w-6 text-primary" />Total Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">{user.score.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-xl font-headline"><Flame className="h-6 w-6 text-primary" />Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">{user.streak} days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-xl font-headline"><Award className="h-6 w-6 text-primary" />Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">{user.badges.length}</p>
              </CardContent>
            </Card>
          </div>
          
          <Separator className="my-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-headline mb-4 flex items-center gap-3"><Award className="h-6 w-6 text-primary" />Badges Earned</h3>
              <div className="flex flex-wrap gap-2">
                {user.badges.map(badge => (
                  <Badge key={badge} variant="secondary" className="text-base py-1 px-3">{badge}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-headline mb-4 flex items-center gap-3"><History className="h-6 w-6 text-primary" />Recent Activity</h3>
              <ul className="space-y-4">
                {user.history.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-muted/50 p-3 rounded-md">
                    <div>
                      <p className="font-semibold">{item.game}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <p className="font-bold text-lg text-primary">+{item.score}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
