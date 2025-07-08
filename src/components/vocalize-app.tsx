"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Play,
  Pause,
  StopCircle,
  Download,
  Volume2,
  Settings,
} from "lucide-react";
import PronunciationDialog from "./pronunciation-dialog";
import { Toaster } from "./ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

type Status = "idle" | "playing" | "paused" | "error";

export default function VocalizeApp() {
  const [text, setText] = useState(
    "Hello, welcome to Vocalize. You can type or paste any text here and I will read it for you. Try changing my voice or speed!"
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [isMounted, setIsMounted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const populateVoiceList = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setSelectedVoice((currentVoice) => {
          if (currentVoice) return currentVoice;
          const googleVoice = availableVoices.find(
            (v) => v.name === "Google US English"
          );
          return googleVoice || availableVoices[0];
        });
      }
    };
    
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    return () => {
      speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, [isMounted]);

  const handlePlay = () => {
    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      return;
    }

    if (window.speechSynthesis.speaking) {
       window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.voice = selectedVoice;
    utterance.volume = volume;
    utterance.rate = rate;

    utterance.onstart = () => setStatus("playing");
    utterance.onpause = () => setStatus("paused");
    utterance.onresume = () => setStatus("playing");
    utterance.onend = () => setStatus("idle");
    utterance.onerror = (event) => {
      console.error("SpeechSynthesisUtterance.onerror", event);
      toast({
        title: "Speech Error",
        description: `An error occurred during speech synthesis: ${event.error}`,
        variant: "destructive",
      })
      setStatus("error");
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setStatus("idle");
  };

  const handleDownload = () => {
     toast({
        title: "Feature not available",
        description: "Direct audio download from the browser is not supported.",
      });
  }

  if (!isMounted) {
    return (
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">
            Vocalize
          </CardTitle>
          <CardDescription className="text-center">
            Your personal Text-to-Speech assistant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[150px] w-full mb-6" />
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-medium text-primary">
              <Settings className="h-5 w-5" />
              <h3 className="text-lg">Controls</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
          <div className="flex gap-2">
            <Skeleton className="h-12 w-28" />
            <Skeleton className="h-12 w-12" />
            <Skeleton className="h-12 w-12" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-36" />
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">
            Vocalize
          </CardTitle>
          <CardDescription className="text-center">
            Your personal Text-to-Speech assistant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[150px] text-base mb-6"
          />
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-medium text-primary">
              <Settings className="h-5 w-5" />
              <h3 className="text-lg">Controls</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="voice">Voice</Label>
                <Select
                  value={selectedVoice?.name || ""}
                  onValueChange={(name) => {
                    setSelectedVoice(
                      voices.find((voice) => voice.name === name) || null
                    );
                  }}
                  disabled={voices.length === 0}
                >
                  <SelectTrigger id="voice">
                    <SelectValue placeholder="Loading voices..." />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="speed">Speed: {rate.toFixed(1)}x</Label>
                <Slider
                  id="speed"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[rate]}
                  onValueChange={(value) => setRate(value[0])}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="volume">
                  <Volume2 className="inline-block mr-1 h-4 w-4" /> Volume
                </Label>
                <Slider
                  id="volume"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePlay}
                  size="lg"
                  disabled={status === "playing" || !text}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Play className="h-5 w-5" />
                  <span className="ml-2">
                    {status === "paused" ? "Resume" : "Play"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start or resume playback</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePause}
                  size="lg"
                  variant="outline"
                  disabled={status !== "playing"}
                >
                  <Pause className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pause playback</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleStop}
                  size="lg"
                  variant="outline"
                  disabled={status === "idle"}
                >
                  <StopCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Stop playback</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex gap-2">
            <PronunciationDialog text={text} />
             <Tooltip>
              <TooltipTrigger asChild>
                 <Button onClick={handleDownload} variant="outline" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Download className="mr-2 h-4 w-4"/>
                    Download
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download as audio file (feature unavailable)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
      <Toaster />
    </TooltipProvider>
  );
}
