"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

import PromptInput from "./PromptInput";
import toast from "react-hot-toast";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SpeechRecognition =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function PromptInputWithBottomActions({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [prompt, setPrompt] = useState<string>(value);

  const handleValueChange = (value: string) => {
    setPrompt(value);
    onChange(value);
  };

  const handleVoiceInput = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return toast.error("Voice input is not supported in this browser");
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const audioChunks: Blob[] = [];

      // Show recording indicator
      toast.success("Listening... Speak your answer", {
        duration: 2000,
        position: "top-center"
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Combine all chunks into a single audio blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
        
        try {
          const formData = new FormData();
          formData.append("file", audioBlob, "recording.webm");
          formData.append("model", "whisper-1");

          toast.loading("Processing your speech...", {
            duration: 3000,
            position: "top-center"
          });

          const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to transcribe audio");
          }

          const result = await response.json();
          if (result.text.trim()) {
            handleValueChange(prompt + " " + result.text);
            toast.success("Speech processed successfully!", {
              duration: 2000,
              position: "top-center"
            });
          }
        } catch (error: any) {
          console.error("Transcription error:", error);
          toast.error("Failed to process speech. Please try again.");
        }
      };

      // Start recording
      mediaRecorder.start();

      // Setup audio analysis for silence detection
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 2048;

      let silenceStart: number | null = null;
      const SILENCE_THRESHOLD = 0.5;
      const SILENCE_DURATION = 1500; // 1.5 seconds of silence before stopping

      const detectSilence = () => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        // Calculate average volume
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

        if (average < SILENCE_THRESHOLD) {
          if (!silenceStart) {
            silenceStart = Date.now();
          } else if (Date.now() - silenceStart > SILENCE_DURATION) {
            // Stop recording after silence duration
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
            audioContext.close();
            return;
          }
        } else {
          silenceStart = null;
        }

        requestAnimationFrame(detectSilence);
      };

      detectSilence();

    } catch (error: any) {
      toast.error("An error occurred during voice input: " + error.message);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <form className="flex w-full flex-col items-start rounded-medium bg-default-100 transition-colors hover:bg-default-200/70">
        <PromptInput
          classNames={{
            inputWrapper: "!bg-transparent shadow-none",
            innerWrapper: "relative",
            input: "pt-1 pl-2 pb-6 !pr-10 text-medium",
          }}
          minRows={3}
          radius="lg"
          value={prompt}
          variant="flat"
          onValueChange={handleValueChange}
        />
        <div className="flex w-full items-center justify-between gap-2 overflow-scroll px-4 pb-4">
          <div className="flex w-full gap-1 md:gap-3">
            <Button
              size="sm"
              startContent={
                <Icon
                  className="text-default-500"
                  icon="solar:soundwave-linear"
                  width={18}
                />
              }
              variant="flat"
              onPress={handleVoiceInput}
            >
              Type with Voice
            </Button>
          </div>
          <p className="py-1 text-tiny text-default-400">
            Chars:{prompt?.length}
          </p>
        </div>
      </form>
    </div>
  );
}
