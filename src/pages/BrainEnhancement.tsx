import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Book, MemoryStick, Puzzle, CheckCircle, XCircle, RotateCcw, Trophy, HelpCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Katapayadi mapping: consonants to numbers
const katapayadi: Record<string, number> = {
  'क': 1, 'ट': 1, 'प': 1, 'य': 1,
  'ख': 2, 'ठ': 2, 'फ': 2, 'र': 2,
  'ग': 3, 'ड': 3, 'ब': 3, 'ल': 3,
  'घ': 4, 'ढ': 4, 'भ': 4, 'व': 4,
  'ङ': 5, 'ण': 5, 'म': 5,
  'च': 6, 'त': 6, 'श': 6,
  'छ': 7, 'थ': 7, 'ष': 7,
  'ज': 8, 'द': 8, 'स': 8,
  'झ': 9, 'ध': 9, 'ह': 9,
  'ञ': 0, 'न': 0,
};

// Sample Katapayadi phrases
const katapayadiChallenges = [
  { phrase: 'भद्राम्बुधिसिंधुरामः', meaning: 'Beautiful ocean Rama', answer: '433228' },
  { phrase: 'गोपीभाग्यमधुव्रात', meaning: 'Fortune of Gopis', answer: '314159265' },
  { phrase: 'श्रीगुरु', meaning: 'Revered Teacher', answer: '66' },
  { phrase: 'महाभारत', meaning: 'Great Epic', answer: '554' },
];

// Memory card data
const memoryCards = [
  { id: 1, content: '🕉️', pair: 'om' },
  { id: 2, content: '🕉️', pair: 'om' },
  { id: 3, content: '🪷', pair: 'lotus' },
  { id: 4, content: '🪷', pair: 'lotus' },
  { id: 5, content: '🐘', pair: 'elephant' },
  { id: 6, content: '🐘', pair: 'elephant' },
  { id: 7, content: '⚔️', pair: 'sword' },
  { id: 8, content: '⚔️', pair: 'sword' },
  { id: 9, content: '📿', pair: 'mala' },
  { id: 10, content: '📿', pair: 'mala' },
  { id: 11, content: '🪔', pair: 'diya' },
  { id: 12, content: '🪔', pair: 'diya' },
];

// Story fragments
const storyFragments = {
  ramayana: [
    'King Dasharatha ruled Ayodhya with great wisdom.',
    'Rama was exiled to the forest for 14 years.',
    'Sita was abducted by Ravana, the demon king.',
    'Hanuman helped Rama find Sita in Lanka.',
    'Rama defeated Ravana and rescued Sita.',
    'Rama returned to Ayodhya and was crowned king.',
  ],
  mahabharata: [
    'The Pandavas and Kauravas were cousins.',
    'The Kauravas cheated in a game of dice.',
    'The Pandavas were exiled for 13 years.',
    'Krishna became Arjuna\'s charioteer in the war.',
    'The great war of Kurukshetra was fought.',
    'The Pandavas won and established dharma.',
  ],
};

export default function BrainEnhancementPage() {
  // Katapayadi Decode State
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [decodeResult, setDecodeResult] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [showKatapayadiTutorial, setShowKatapayadiTutorial] = useState(false);

  // Memory Match State
  const [cards, setCards] = useState(memoryCards.sort(() => Math.random() - 0.5));
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [showMemoryTutorial, setShowMemoryTutorial] = useState(false);

  // Story Builder State
  const [selectedStory, setSelectedStory] = useState<'ramayana' | 'mahabharata'>('ramayana');
  const [storyOrder, setStoryOrder] = useState<string[]>([]);
  const [availableFragments, setAvailableFragments] = useState<string[]>([]);
  const [storyResult, setStoryResult] = useState<boolean | null>(null);
  const [showStoryTutorial, setShowStoryTutorial] = useState(false);

  useEffect(() => {
    resetStory();
  }, [selectedStory]);

  // Katapayadi Functions
  const checkAnswer = () => {
    const correct = katapayadiChallenges[currentChallenge].answer === userAnswer;
    setDecodeResult(correct ? 'correct' : 'incorrect');
    if (correct) setScore(score + 1);
  };

  const nextChallenge = () => {
    setCurrentChallenge((currentChallenge + 1) % katapayadiChallenges.length);
    setUserAnswer('');
    setDecodeResult(null);
  };

  // Memory Match Functions
  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      if (cards[first].pair === cards[second].pair) {
        setMatchedCards([...matchedCards, first, second]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const resetMemoryGame = () => {
    setCards(memoryCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
  };

  // Story Builder Functions
  const resetStory = () => {
    const fragments = [...storyFragments[selectedStory]].sort(() => Math.random() - 0.5);
    setAvailableFragments(fragments);
    setStoryOrder([]);
    setStoryResult(null);
  };

  const addToStory = (fragment: string) => {
    setStoryOrder([...storyOrder, fragment]);
    setAvailableFragments(availableFragments.filter(f => f !== fragment));
  };

  const removeFromStory = (fragment: string) => {
    setStoryOrder(storyOrder.filter(f => f !== fragment));
    setAvailableFragments([...availableFragments, fragment]);
  };

  const checkStoryOrder = () => {
    const correct = JSON.stringify(storyOrder) === JSON.stringify(storyFragments[selectedStory]);
    setStoryResult(correct);
  };

  // Tutorial Components
  const KatapayadiTutorial = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-headline flex items-center gap-2">
            <Book className="h-6 w-6 text-primary" />
            How to Play: Katapayadi Decode
          </h2>
          <Button size="sm" variant="ghost" onClick={() => setShowKatapayadiTutorial(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">📚 What is Katapayadi?</h3>
            <p className="text-sm text-muted-foreground">
              Katapayadi is an ancient Indian numeral system where Sanskrit consonants represent numbers 0-9. 
              It was used to encode mathematical and astronomical information in verses!
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">🎮 How to Play:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>You'll see a Sanskrit phrase (like "श्रीगुरु")</li>
              <li>Each consonant in the phrase represents a number</li>
              <li>Decode the phrase to find the hidden number</li>
              <li>Enter your answer and check if it's correct!</li>
            </ol>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📝 Example:</h3>
            <p className="text-sm mb-2">Phrase: <span className="font-mono">श्रीगुरु</span></p>
            <p className="text-sm text-muted-foreground">
              • श (sha) = 6<br/>
              • र (ra) = 2 (but श्र is considered one unit, so we skip)<br/>
              • ग (ga) = 3 (but री has no consonant after, counted as part)<br/>
              • ग (ga) = 3<br/>
              • र (ra) = 2 (but गु, so skip)<br/>
              <br/>
              The main consonants give us: <span className="font-bold">श = 6, ग = 3</span><br/>
              Reading the first consonants of each syllable: <strong>Answer: 66</strong>
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">💡 Tips:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Focus on the main consonants in each syllable</li>
              <li>Vowels don't have numeric values</li>
              <li>Read the consonants from left to right</li>
            </ul>
          </div>

          <Button onClick={() => setShowKatapayadiTutorial(false)} className="w-full">
            Got it! Let's Play
          </Button>
        </div>
      </div>
    </div>
  );

  const MemoryTutorial = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-headline flex items-center gap-2">
            <MemoryStick className="h-6 w-6 text-primary" />
            How to Play: Memory Match
          </h2>
          <Button size="sm" variant="ghost" onClick={() => setShowMemoryTutorial(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">🎯 Objective:</h3>
            <p className="text-sm text-muted-foreground">
              Find all 6 matching pairs of cultural symbols by remembering their positions!
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">🎮 How to Play:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>All cards start face down showing "?"</li>
              <li>Click any card to reveal its symbol</li>
              <li>Click a second card to find its match</li>
              <li>If they match, they stay revealed!</li>
              <li>If they don't match, they flip back - remember where they were!</li>
              <li>Find all 6 pairs to win</li>
            </ol>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🪷 Symbols You'll Find:</h3>
            <div className="grid grid-cols-3 gap-2 text-2xl text-center">
              <div className="p-2 bg-background rounded">🕉️ Om</div>
              <div className="p-2 bg-background rounded">🪷 Lotus</div>
              <div className="p-2 bg-background rounded">🐘 Elephant</div>
              <div className="p-2 bg-background rounded">⚔️ Sword</div>
              <div className="p-2 bg-background rounded">📿 Mala</div>
              <div className="p-2 bg-background rounded">🪔 Diya</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">💡 Tips:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Try to remember the position of each symbol you see</li>
              <li>Start from one corner and work systematically</li>
              <li>The fewer moves you make, the better your score!</li>
              <li>Click the reset button to shuffle and play again</li>
            </ul>
          </div>

          <Button onClick={() => setShowMemoryTutorial(false)} className="w-full">
            Got it! Let's Play
          </Button>
        </div>
      </div>
    </div>
  );

  const StoryTutorial = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-headline flex items-center gap-2">
            <Puzzle className="h-6 w-6 text-primary" />
            How to Play: Story Builder
          </h2>
          <Button size="sm" variant="ghost" onClick={() => setShowStoryTutorial(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">📖 Objective:</h3>
            <p className="text-sm text-muted-foreground">
              Arrange scrambled story fragments in the correct chronological order to recreate famous epics!
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">🎮 How to Play:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Choose a story: Ramayana or Mahabharata</li>
              <li>You'll see 6 scrambled fragments from the story</li>
              <li>Click on a fragment to add it to your story order</li>
              <li>If you made a mistake, click the "✕" to remove it</li>
              <li>Arrange all 6 fragments in chronological order</li>
              <li>Click "Check Order" to see if you got it right!</li>
            </ol>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📝 Example (Simplified):</h3>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Correct Order:</p>
              <div className="space-y-1 text-muted-foreground">
                <p>1️⃣ King Dasharatha ruled Ayodhya</p>
                <p>2️⃣ Rama was exiled to the forest</p>
                <p>3️⃣ Sita was abducted by Ravana</p>
                <p>4️⃣ Hanuman helped find Sita</p>
                <p>5️⃣ Rama defeated Ravana</p>
                <p>6️⃣ Rama returned and became king</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">📚 Stories Available:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Ramayana:</strong> The epic tale of Lord Rama's journey</li>
              <li><strong>Mahabharata:</strong> The story of the Pandavas and Kauravas</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">💡 Tips:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Think about the beginning, middle, and end of the story</li>
              <li>Look for cause-and-effect relationships</li>
              <li>Pay attention to key events and their sequence</li>
              <li>Use the Reset button to try a different approach</li>
            </ul>
          </div>

          <Button onClick={() => setShowStoryTutorial(false)} className="w-full">
            Got it! Let's Play
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      {showKatapayadiTutorial && <KatapayadiTutorial />}
      {showMemoryTutorial && <MemoryTutorial />}
      {showStoryTutorial && <StoryTutorial />}
      
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <BrainCircuit className="h-10 w-10 text-primary" />
          Brain Enhancement
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Engage in puzzles and games designed to boost your cognitive skills.
        </p>
      </header>
      <Tabs defaultValue="decode" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="decode">
            <Book className="mr-2 h-4 w-4" />
            Katapayadi Decode
          </TabsTrigger>
          <TabsTrigger value="memory">
            <MemoryStick className="mr-2 h-4 w-4" />
            Memory Match
          </TabsTrigger>
          <TabsTrigger value="story">
            <Puzzle className="mr-2 h-4 w-4" />
            Story Builder
          </TabsTrigger>
        </TabsList>

        {/* Katapayadi Decode */}
        <TabsContent value="decode">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Katapayadi Decoding Challenge</CardTitle>
                  <CardDescription>
                    Decode Sanskrit phrases using the Katapayadi number system
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowKatapayadiTutorial(true)}>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    How to Play
                  </Button>
                  <Badge variant="secondary" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Score: {score}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-muted/50 rounded-lg">
                <h3 className="text-2xl font-headline mb-2">{katapayadiChallenges[currentChallenge].phrase}</h3>
                <p className="text-muted-foreground italic">{katapayadiChallenges[currentChallenge].meaning}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Enter the decoded number:</label>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Enter numbers only"
                    disabled={decodeResult !== null}
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={checkAnswer} disabled={!userAnswer || decodeResult !== null}>
                    Check Answer
                  </Button>
                  {decodeResult && (
                    <Button onClick={nextChallenge} variant="outline">
                      Next Challenge →
                    </Button>
                  )}
                </div>

                {decodeResult && (
                  <Alert variant={decodeResult === 'correct' ? 'default' : 'destructive'}>
                    {decodeResult === 'correct' ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Correct!</AlertTitle>
                        <AlertDescription>Well done! You decoded it correctly.</AlertDescription>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Incorrect</AlertTitle>
                        <AlertDescription>
                          The correct answer is: {katapayadiChallenges[currentChallenge].answer}
                        </AlertDescription>
                      </>
                    )}
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Memory Match */}
        <TabsContent value="memory">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Memory Match Game</CardTitle>
                  <CardDescription>
                    Match pairs of cultural symbols and artifacts
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowMemoryTutorial(true)}>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    How to Play
                  </Button>
                  <Badge variant="secondary">Moves: {moves}</Badge>
                  <Badge variant="secondary">Matched: {matchedCards.length / 2}/6</Badge>
                  <Button size="sm" variant="outline" onClick={resetMemoryGame}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {cards.map((card, index) => (
                  <button
                    key={index}
                    onClick={() => handleCardClick(index)}
                    className={`aspect-square text-4xl rounded-lg border-2 transition-all ${
                      flippedCards.includes(index) || matchedCards.includes(index)
                        ? 'bg-primary/20 border-primary'
                        : 'bg-muted hover:bg-muted/70'
                    }`}
                    disabled={matchedCards.includes(index)}
                  >
                    {flippedCards.includes(index) || matchedCards.includes(index) ? card.content : '?'}
                  </button>
                ))}
              </div>

              {matchedCards.length === 12 && (
                <Alert className="mt-6">
                  <Trophy className="h-4 w-4" />
                  <AlertTitle>Congratulations!</AlertTitle>
                  <AlertDescription>You completed the game in {moves} moves!</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Story Builder */}
        <TabsContent value="story">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <CardTitle>Story Builder</CardTitle>
                  <CardDescription>
                    Arrange the fragments in correct chronological order
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowStoryTutorial(true)}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  How to Play
                </Button>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  size="sm"
                  variant={selectedStory === 'ramayana' ? 'default' : 'outline'}
                  onClick={() => setSelectedStory('ramayana')}
                >
                  Ramayana
                </Button>
                <Button
                  size="sm"
                  variant={selectedStory === 'mahabharata' ? 'default' : 'outline'}
                  onClick={() => setSelectedStory('mahabharata')}
                >
                  Mahabharata
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Your Story Order:</h3>
                <div className="space-y-2 min-h-[200px] p-4 border-2 border-dashed rounded-lg">
                  {storyOrder.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Drag fragments here to build the story</p>
                  ) : (
                    storyOrder.map((fragment, index) => (
                      <div
                        key={index}
                        className="p-3 bg-primary/10 border border-primary/30 rounded-md flex items-start justify-between gap-2"
                      >
                        <span className="text-sm">
                          {index + 1}. {fragment}
                        </span>
                        <Button size="sm" variant="ghost" onClick={() => removeFromStory(fragment)}>
                          ✕
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Available Fragments:</h3>
                <div className="space-y-2">
                  {availableFragments.map((fragment, index) => (
                    <button
                      key={index}
                      onClick={() => addToStory(fragment)}
                      className="w-full p-3 text-left bg-muted hover:bg-muted/70 rounded-md transition-colors text-sm"
                    >
                      {fragment}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={checkStoryOrder} disabled={storyOrder.length !== 6}>
                  Check Order
                </Button>
                <Button onClick={resetStory} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              {storyResult !== null && (
                <Alert variant={storyResult ? 'default' : 'destructive'}>
                  {storyResult ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Perfect!</AlertTitle>
                      <AlertDescription>You arranged the story correctly!</AlertDescription>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Not quite right</AlertTitle>
                      <AlertDescription>Try rearranging the fragments. Think about the chronological order.</AlertDescription>
                    </>
                  )}
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
