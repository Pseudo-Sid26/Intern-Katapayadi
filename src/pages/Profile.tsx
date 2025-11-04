import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authClient } from '../services/authClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, historyData] = await Promise.all([
        authClient.getUserStats(),
        authClient.getGameHistory(),
      ]);
      setStats(statsData);
      setHistory(historyData);
    } catch (err) {
      console.error('Failed to load profile data:', err);
    }
  };

  const handleUpdateProfile = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await authClient.updateProfile(displayName);
      await refreshUser();
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertDescription>Please log in to view your profile.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const experienceProgress = stats ? (stats.experience / stats.experienceForNextLevel) * 100 : 0;
  const initials = user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid gap-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 text-2xl">
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-blue-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                        Cancel
                      </Button>
                    </div>
                    {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                    {success && <Alert><AlertDescription>{success}</AlertDescription></Alert>}
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold">{user.displayName}</h1>
                    <p className="text-gray-600">@{user.username}</p>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="mt-2">
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">Level {user.level}</div>
                <p className="text-sm text-gray-600">Total Score: {user.totalScore}</p>
                <Badge className="mt-2">{user.gamesPlayed} Games Played</Badge>
              </div>
            </div>

            {/* Experience Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Level {user.level}</span>
                <span className="text-gray-600">
                  {user.experience} / {stats?.experienceForNextLevel || 0} XP
                </span>
                <span>Level {user.level + 1}</span>
              </div>
              <Progress value={experienceProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="history">Game History</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Quiz Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-bold">{user.quizzesCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="font-bold">{user.stats.quizAccuracy.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Katapayadi Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Katapayadi Decode</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Best Score:</span>
                    <span className="font-bold">{user.stats.katapayadiScore}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Memory Match Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Memory Match</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Best Score:</span>
                    <span className="font-bold">{user.stats.memoryMatchBest} moves</span>
                  </div>
                </CardContent>
              </Card>

              {/* Story Builder Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Story Builder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-bold">{user.stats.storyBuilderCompleted}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            {user.achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your earned badges and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.achievements.map((achievement, idx) => (
                      <Badge key={idx} variant="secondary">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Recent Games</CardTitle>
                <CardDescription>Your last 20 game sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No games played yet</p>
                ) : (
                  <div className="space-y-2">
                    {history.map((game: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={game.completed ? 'default' : 'outline'}>
                              {game.gameType}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(game.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {game.subject && (
                            <p className="text-sm text-gray-600 mt-1">
                              {game.subject} - Class {game.class}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{game.score}</div>
                          {game.accuracy && (
                            <div className="text-sm text-gray-600">{game.accuracy.toFixed(0)}%</div>
                          )}
                          <div className="text-xs text-green-600">+{game.experienceGained} XP</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
