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
      // Check for browser compatibility
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return toast.error("Voice input is not supported in this browser. Try using Chrome or Edge.");
      }

      // Try to use SpeechRecognition API first (works better on laptops)
      if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        let recognitionActive = true;
        
        // Show recording indicator
        const toastId = toast.success("Listening... Speak your answer (tap to stop)", {
          duration: 10000,
          position: "top-center"
        });
        
        // Add click listener to dismiss toast and stop recognition
        const dismissListener = () => {
          recognition.stop();
          toast.dismiss(toastId);
          document.removeEventListener('click', dismissListener);
        };
        
        // Add event listener with delay to prevent immediate triggering
        setTimeout(() => {
          document.addEventListener('click', dismissListener);
        }, 1000);
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript.trim()) {
            // Append to existing text with a space
            const newText = prompt ? prompt + " " + transcript : transcript;
            handleValueChange(newText);
            toast.success("Speech processed successfully!", {
              duration: 2000,
              position: "top-center"
            });
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          toast.error(`Speech recognition error: ${event.error}`);
          recognitionActive = false;
        };
        
        recognition.onend = () => {
          if (recognitionActive) {
            toast.dismiss(toastId);
          }
        };
        
        recognition.start();
        
        // Automatically stop after 30 seconds to prevent hanging
        setTimeout(() => {
          if (recognitionActive) {
            recognition.stop();
          }
        }, 30000);
        
        return;
      }
      
      // Fallback to MediaRecorder API (works better on mobile)
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Determine supported MIME types
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const audioChunks: Blob[] = [];

      // Show recording indicator with stop option
      const toastId = toast.success("Listening... Speak your answer (tap to stop)", {
        duration: 10000,
        position: "top-center"
      });
      
      // Add click listener to dismiss toast and stop recording
      const dismissListener = () => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
        }
        toast.dismiss(toastId);
        document.removeEventListener('click', dismissListener);
      };
      
      // Add event listener with delay to prevent immediate triggering
      setTimeout(() => {
        document.addEventListener('click', dismissListener);
      }, 1000);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Combine all chunks into a single audio blob
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        
        try {
          const formData = new FormData();
          formData.append("file", audioBlob, "recording.webm");
          formData.append("model", "whisper-1");

          const loadingToast = toast.loading("Processing your speech...", {
            position: "top-center"
          });

          const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            },
            body: formData,
          });

          toast.dismiss(loadingToast);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Transcription API error:", errorData);
            throw new Error(errorData.error?.message || "Failed to transcribe audio");
          }

          const result = await response.json();
          if (result.text.trim()) {
            // Append to existing text with a space
            const newText = prompt ? prompt + " " + result.text : result.text;
            handleValueChange(newText);
            toast.success("Speech processed successfully!", {
              duration: 2000,
              position: "top-center"
            });
          } else {
            toast.error("No speech detected. Please try again.");
          }
        } catch (error: any) {
          console.error("Transcription error:", error);
          toast.error(error.message || "Failed to process speech. Please try again.");
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
      // Higher threshold for laptop microphones which tend to have more background noise
      const SILENCE_THRESHOLD = 5; // Increased from 0.5
      const SILENCE_DURATION = 2000; // 2 seconds of silence before stopping

      const detectSilence = () => {
        // Check if recording is still active
        if (mediaRecorder.state !== "recording") return;
        
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
      
      // Safety timeout - stop recording after 30 seconds maximum
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
          try { audioContext.close(); } catch (e) {}
        }
      }, 30000);

    } catch (error: any) {
      console.error("Voice input error:", error);
      if (error.name === "NotAllowedError") {
        toast.error("Microphone access denied. Please allow microphone access in your browser settings.");
      } else if (error.name === "NotFoundError") {
        toast.error("No microphone found. Please connect a microphone and try again.");
      } else {
        toast.error("An error occurred during voice input: " + (error.message || "Unknown error"));
      }
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
