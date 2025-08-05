'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateOracleHint } from '@/ai/flows/oracle-hint-generator';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Lightbulb, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const formSchema = z.object({
  answer: z.string().min(1, { message: 'An answer is required.' }),
});

type Puzzle = {
  id: string;
  question: string;
  solution: string;
  solutionWord: string;
};

type PuzzleClientProps = {
  puzzle: Puzzle;
};

export function PuzzleClient({ puzzle }: PuzzleClientProps) {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.answer.trim() === puzzle.solution) {
      setFeedback({ type: 'success', message: 'Correct! You have solved the riddle.' });
    } else {
      setFeedback({ type: 'error', message: 'Not quite. The ancients demand precision. Try again!' });
    }
  }

  async function getHint() {
    if (hint) return; // Don't fetch if hint already exists
    setIsHintLoading(true);
    setHint(null);
    try {
      const result = await generateOracleHint({ puzzleSolution: puzzle.solutionWord });
      setHint(result.hint);
    } catch (error) {
      console.error('Error getting hint:', error);
      setHint('The Oracle is silent at this moment. Perhaps try again later.');
    } finally {
      setIsHintLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Katapayadi Puzzle #{puzzle.id}</CardTitle>
        <CardDescription className="text-base pt-4">{puzzle.question}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Answer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the numerical answer" {...field} disabled={feedback?.type === 'success'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {feedback && (
              <Alert variant={feedback.type === 'success' ? 'default' : 'destructive'}>
                {feedback.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{feedback.type === 'success' ? 'Success!' : 'Incorrect'}</AlertTitle>
                <AlertDescription>{feedback.message}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button type="submit" className="flex-1" disabled={feedback?.type === 'success'}>Submit Answer</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" className="flex-1" onClick={getHint}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Consult the Oracle
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-headline flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 text-primary" />
                      The Oracle Speaks
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    {isHintLoading && (
                      <div className="flex items-center justify-center h-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4">The Oracle is consulting the cosmos...</p>
                      </div>
                    )}
                    {hint && <p className="text-lg italic text-foreground/90">{hint}</p>}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
