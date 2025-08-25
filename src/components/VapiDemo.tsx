import { useState } from "react";
import { VoiceOrb } from "./VoiceOrb";
import { CallControls } from "./CallControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVapi } from "@/hooks/useVapi";
import { Settings, Phone, X } from "lucide-react";
import { toast } from "sonner";

export const VapiDemo = () => {
  const [showConfig, setShowConfig] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [assistantId, setAssistantId] = useState("");
  
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    isListening,
    isMuted,
    error,
    audioLevel,
    startCall,
    endCall,
    toggleMute,
    setConfig,
    clearError
  } = useVapi();

  const handleSaveConfig = () => {
    if (!publicKey.trim() || !assistantId.trim()) {
      toast.error("Please fill in both Public Key and Assistant ID");
      return;
    }
    
    setConfig({ publicKey: publicKey.trim(), assistantId: assistantId.trim() });
    clearError(); // Clear any existing error when new config is saved
    setShowConfig(false);
    toast.success("Vapi configuration saved!");
  };

  const handleCall = async () => {
    if (!publicKey || !assistantId) {
      setShowConfig(true);
      toast.error("Please configure your Vapi credentials first");
      return;
    }
    
    try {
      await startCall();
      toast.success("Connected to Booking AI Agent");
    } catch (err) {
      toast.error("Failed to connect to Vapi");
    }
  };

  const handleHangup = () => {
    endCall();
    toast.info("Call ended");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="CurateFlow Logo" className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold text-foreground">CurateFlow AI Voice Agent</h1>
                <p className="text-sm text-muted-foreground">Booking Voice Agent Demo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-primary/30 text-primary">
                Demo Mode
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowConfig(!showConfig)}
                className="border-primary/30 hover:border-primary"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Configuration Popup */}
      {showConfig && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowConfig(false)}
          />
          
          {/* Popup */}
          <div className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
            <Card className="shadow-2xl border-primary/20 bg-card/95 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Vapi Configuration</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfig(false)}
                    className="h-8 w-8 p-0 hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Enter your Vapi credentials to connect to your voice agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="publicKey">Public Key</Label>
                  <Input
                    id="publicKey"
                    placeholder="Enter your Vapi public key"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assistantId">Assistant ID</Label>
                  <Input
                    id="assistantId"
                    placeholder="Enter your assistant ID"
                    value={assistantId}
                    onChange={(e) => setAssistantId(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveConfig} className="flex-1">
                    Save Configuration
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowConfig(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Main Demo Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center space-y-6 sm:space-y-8 max-w-2xl mx-auto">
          
          {/* Title Section */}
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-montserrat">
              AI Booking Agent
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground font-montserrat">
              Speak with our intelligent voice assistant for construction job bookings
            </p>
          </div>

          {/* Voice Orb */}
          <div className="py-4 sm:py-6">
            <VoiceOrb
              isConnected={isConnected}
              isSpeaking={isSpeaking}
              isListening={isListening}
              audioLevel={audioLevel}
              className="mx-auto"
            />
          </div>

          {/* Call Controls */}
          <div className="flex justify-center pt-4 sm:pt-6">
            <CallControls
              isConnected={isConnected}
              isMuted={isMuted}
              isConnecting={isConnecting}
              error={error}
              onCall={handleCall}
              onHangup={handleHangup}
              onToggleMute={toggleMute}
            />
          </div>

          {/* Status Messages */}
          <div className="space-y-2 sm:space-y-3">
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                {error}
              </div>
            )}

            {isConnecting && (
              <div className="flex items-center justify-center gap-2 text-primary">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>Connecting to voice agent...</span>
              </div>
            )}
          </div>

          {/* Demo Instructions */}
          {!isConnected && !isConnecting && (
            <Card className="max-w-lg mx-auto mt-4 sm:mt-6">
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>Click the call button to connect</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary/60" />
                    <span>Watch the orb respond as you speak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <span>Configure your Vapi credentials above</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>Powered by AI • Voice Assistant Demo</div>
            <div>Built for modern construction companies</div>
          </div>
        </div>
      </footer>
    </div>
  );
};