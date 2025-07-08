"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const populateVoiceList = useCallback(() => {
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      setVoices(availableVoices);
      if (!selectedVoice) {
        // Prefer a Google US English voice if available, otherwise default to the first one
        const googleVoice = availableVoices.find(
          (voice) => voice.name === "Google US English"
        );
        setSelectedVoice(googleVoice || availableVoices[0]);
      }
    }
  }, [selectedVoice]);

  useEffect(() => {
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  }, [populateVoiceList]);
  
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
                  value={selectedVoice?.name}
                  onValueChange={(name) => {
                    setSelectedVoice(
                      voices.find((voice) => voice.name === name) || null
                    );
                  }}
                >
                  <SelectTrigger id="voice">
                    <SelectValue placeholder="Select a voice" />
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
