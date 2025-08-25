import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VoiceOrbProps {
  isConnected: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  audioLevel: number;
  className?: string;
}

export const VoiceOrb = ({ 
  isConnected, 
  isSpeaking, 
  isListening, 
  audioLevel,
  className 
}: VoiceOrbProps) => {
  const orbRef = useRef<HTMLDivElement>(null);
  const [smoothAudioLevel, setSmoothAudioLevel] = useState(0);

  // Smooth audio level changes for better visual effect
  useEffect(() => {
    const smoothingFactor = 0.1;
    setSmoothAudioLevel(prev => prev + (audioLevel - prev) * smoothingFactor);
  }, [audioLevel]);

  const getOrbState = () => {
    if (isSpeaking) return "speaking";
    if (isListening) return "listening";
    if (isConnected) return "connected";
    return "idle";
  };

  const orbState = getOrbState();

  // Calculate dynamic values based on audio level
  const getAudioIntensity = () => {
    if (!isConnected) return 0;
    return smoothAudioLevel * (isSpeaking ? 1.2 : isListening ? 1.0 : 0.3);
  };

  const audioIntensity = getAudioIntensity();
  const pulseScale = 1 + (audioIntensity * 0.15);
  const glowIntensity = audioIntensity * 0.8;
  const particleCount = Math.floor(audioIntensity * 8) + 2;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* ElevenLabs Orb Container */}
      <div ref={orbRef} className="relative w-80 h-80 flex items-center justify-center">
        
        {/* Outer pulse rings - responsive to audio */}
        <div className="absolute inset-0">
          {[0, 1, 2, 3].map((ring) => (
            <div
              key={ring}
              className={cn(
                "absolute rounded-full border border-white/20 transition-all duration-300 ease-out",
                orbState === "idle" && "opacity-0 scale-75",
                orbState === "connected" && "opacity-10 scale-85",
                orbState === "listening" && "opacity-20 scale-90",
                orbState === "speaking" && "opacity-30 scale-95"
              )}
              style={{
                width: `${240 + ring * 30}px`,
                height: `${240 + ring * 30}px`,
                left: `${(320 - (240 + ring * 30)) / 2}px`,
                top: `${(320 - (240 + ring * 30)) / 2}px`,
                transform: `scale(${1 + (audioIntensity * 0.1 * (ring + 1))})`,
                opacity: `${0.1 + (audioIntensity * 0.3 * (ring + 1))}`,
                animationDelay: `${ring * 150}ms`
              }}
            />
          ))}
        </div>

        {/* Main orb - responsive to audio levels */}
        <div 
          className={cn(
            "relative w-60 h-60 rounded-full transition-all duration-200 ease-out",
            "bg-gradient-to-br from-[#0f7969] via-[#0a5a4f] to-[#063d35]",
            "shadow-[0_0_40px_rgba(15,121,105,0.5)]",
            "border border-white/30",
            orbState === "idle" && "opacity-60 scale-90",
            orbState === "connected" && "opacity-80 scale-95",
            orbState === "listening" && "opacity-90 scale-100",
            orbState === "speaking" && "opacity-100 scale-105"
          )}
          style={{
            transform: `scale(${pulseScale})`,
            boxShadow: `0 0 ${40 + (glowIntensity * 60)}px rgba(15,121,105,${0.5 + glowIntensity * 0.5})`
          }}
        >
          
          {/* Inner glow layers - responsive to audio */}
          <div 
            className="absolute inset-0 rounded-full bg-gradient-radial from-white/30 via-transparent to-transparent"
            style={{
              opacity: 0.3 + (glowIntensity * 0.7)
            }}
          />
          <div 
            className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent"
            style={{
              opacity: 0.2 + (glowIntensity * 0.6)
            }}
          />
          
          {/* Core inner circle - pulses with audio */}
          <div 
            className={cn(
              "absolute inset-6 rounded-full transition-all duration-200",
              "bg-gradient-to-br from-white/15 to-transparent"
            )}
            style={{
              opacity: 0.15 + (audioIntensity * 0.85),
              transform: `scale(${1 + (audioIntensity * 0.2)})`
            }}
          />
          
          {/* Center dot - most responsive to audio */}
          <div 
            className={cn(
              "absolute inset-12 rounded-full transition-all duration-100",
              "bg-white/25"
            )}
            style={{
              opacity: 0.25 + (audioIntensity * 0.75),
              transform: `scale(${1 + (audioIntensity * 0.3)})`
            }}
          />
          
          {/* ElevenLabs signature inner rings */}
          <div className="absolute inset-4 rounded-full border border-white/10" />
          <div className="absolute inset-8 rounded-full border border-white/5" />
        </div>

        {/* Floating particles - responsive to audio intensity */}
        {(isListening || isSpeaking) && audioIntensity > 0.1 && (
          <>
            {Array.from({ length: particleCount }, (_, particle) => (
              <div
                key={particle}
                className={cn(
                  "absolute w-1 h-1 rounded-full bg-white/60 animate-bounce"
                )}
                style={{
                  left: `${20 + (particle * 15) % 60}%`,
                  top: `${15 + (particle * 25) % 70}%`,
                  animationDelay: `${particle * 100}ms`,
                  animationDuration: `${1.5 + (audioIntensity * 1)}s`,
                  opacity: 0.6 + (audioIntensity * 0.4),
                  transform: `scale(${1 + (audioIntensity * 0.5)})`
                }}
              />
            ))}
          </>
        )}

        {/* ElevenLabs signature wave effect - responsive to audio */}
        {(isListening || isSpeaking) && audioIntensity > 0.05 && (
          <div className="absolute inset-0">
            {[0, 1, 2].map((wave) => (
              <div
                key={wave}
                className={cn(
                  "absolute rounded-full border border-white/20"
                )}
                style={{
                  width: `${288 + wave * 16}px`,
                  height: `${288 + wave * 16}px`,
                  left: wave === 0 ? '16px' : wave === 1 ? '0px' : '-16px',
                  top: wave === 0 ? '16px' : wave === 1 ? '0px' : '-16px',
                  opacity: (0.2 + (audioIntensity * 0.3)) * (1 - wave * 0.3),
                  animation: `ping ${2 + (audioIntensity * 2)}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                  animationDelay: `${wave * 200}ms`
                }}
              />
            ))}
          </div>
        )}

        {/* Audio level indicator rings */}
        {isConnected && audioIntensity > 0.1 && (
          <div className="absolute inset-0">
            {[0, 1, 2].map((level) => (
              <div
                key={`level-${level}`}
                className="absolute rounded-full border border-white/30"
                style={{
                  width: `${320 + level * 20}px`,
                  height: `${320 + level * 20}px`,
                  left: `${(320 - (320 + level * 20)) / 2}px`,
                  top: `${(320 - (320 + level * 20)) / 2}px`,
                  opacity: audioIntensity * (1 - level * 0.3),
                  animation: `ping ${1 + (audioIntensity * 1)}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                  animationDelay: `${level * 100}ms`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* State indicator with audio level */}
      <div className="absolute -bottom-8 sm:-bottom-12 left-1/2 transform -translate-x-1/2">
        <div className={cn(
          "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-medium transition-all duration-500",
          "bg-black/90 backdrop-blur-md border border-white/20 shadow-lg",
          orbState === "speaking" && "text-[#0f7969] bg-[#0f7969]/10 border-[#0f7969]/30 shadow-[#0f7969]/20",
          orbState === "listening" && "text-[#0f7969] bg-[#0f7969]/5 border-[#0f7969]/20 shadow-[#0f7969]/10",
          orbState === "connected" && "text-white/80 bg-black/90",
          orbState === "idle" && "text-white/60 bg-black/80"
        )}>
          {orbState === "speaking" && "Speaking"}
          {orbState === "listening" && `Listening ${Math.round(audioIntensity * 100)}%`}
          {orbState === "connected" && "Connected"}
          {orbState === "idle" && "Ready"}
        </div>
      </div>
    </div>
  );
};