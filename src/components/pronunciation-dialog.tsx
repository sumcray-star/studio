"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { checkPronunciation } from "@/app/actions";
import type { ImprovePronunciationOutput } from "@/ai/flows/improve-pronunciation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

interface PronunciationDialogProps {
  text: string;
}

export default function PronunciationDialog({ text }: PronunciationDialogProps) {
  const [word, setWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImprovePronunciationOutput | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!word.trim() || !text.trim()) {
      toast({
        title: "Missing Information",
        description:
          "Please ensure you have text in the main area and have entered a word to check.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await checkPronunciation({ text, word });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          "Could not get pronunciation suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          AI Pronunciation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Pronunciation Checker</DialogTitle>
          <DialogDescription>
            Get AI-powered suggestions for word pronunciations based on the
            context of your text.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="word" className="text-right">
                Word
              </Label>
              <Input
                id="word"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 'Genkit'"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Check Pronunciation
            </Button>
          </DialogFooter>
        </form>
        {result && (
          <div className="mt-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">Suggestion</h3>
                <p>
                  <strong className="text-primary">Original:</strong> {result.originalWord}
                </p>
                <p>
                  <strong className="text-primary">Suggested:</strong>{" "}
                  {result.suggestedPronunciation}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong>Reason:</strong> {result.reason}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
