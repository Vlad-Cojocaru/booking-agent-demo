import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface CallControlsProps {
  isConnected: boolean;
  isMuted: boolean;
  isConnecting: boolean;
  error: string | null;
  onCall: () => void;
  onHangup: () => void;
  onToggleMute: () => void;
}

export const CallControls = ({
  isConnected,
  isMuted,
  isConnecting,
  error,
  onCall,
  onHangup,
  onToggleMute
}: CallControlsProps) => {
  return (
    <div className="flex items-center gap-6">
      {/* Call/Hangup Button */}
      {!isConnected ? (
        <Button
          onClick={onCall}
          disabled={isConnecting || !!error}
          size="lg"
          className={cn(
            "h-16 w-16 rounded-full transition-all duration-300",
            "bg-gradient-to-r from-primary to-primary-glow",
            "hover:scale-110 hover:shadow-[0_0_30px_hsl(var(--primary-glow)/0.6)]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          <Phone className="h-6 w-6" />
        </Button>
      ) : (
        <Button
          onClick={onHangup}
          size="lg"
          variant="destructive"
          className={cn(
            "h-16 w-16 rounded-full transition-all duration-300",
            "hover:scale-110 hover:shadow-[0_0_30px_hsl(var(--destructive)/0.6)]"
          )}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      )}

      {/* Mute Button */}
      {isConnected && (
        <Button
          onClick={onToggleMute}
          size="lg"
          variant="outline"
          className={cn(
            "h-12 w-12 rounded-full transition-all duration-300",
            "border-primary/30 hover:border-primary",
            isMuted && "bg-primary/10 border-primary text-primary"
          )}
        >
          {isMuted ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
      )}
    </div>
  );
};