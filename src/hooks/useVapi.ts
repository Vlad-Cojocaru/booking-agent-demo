import { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

interface VapiConfig {
  publicKey: string;
  assistantId: string;
}

interface VapiState {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  isMuted: boolean;
  error: string | null;
  audioLevel: number; // Add audio level state
}

interface VapiHook extends VapiState {
  startCall: () => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  setConfig: (config: VapiConfig) => void;
}

export const useVapi = (): VapiHook => {
  const [state, setState] = useState<VapiState>({
    isConnected: false,
    isConnecting: false,
    isSpeaking: false,
    isListening: false,
    isMuted: false,
    error: null,
    audioLevel: 0
  });

  const [config, setConfigState] = useState<VapiConfig | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const speakingInterval = useRef<NodeJS.Timeout | null>(null);
  const listeningInterval = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const setConfig = useCallback((newConfig: VapiConfig) => {
    setConfigState(newConfig);
  }, []);

  // Audio level monitoring function
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateAudioLevel = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume level
      const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;
      const normalizedLevel = Math.min(average / 128, 1); // Normalize to 0-1
      
      setState(prev => ({ ...prev, audioLevel: normalizedLevel }));
      
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };
    
    updateAudioLevel();
  }, []);

  // Setup audio monitoring
  const setupAudioMonitoring = useCallback(async () => {
    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Connect microphone to analyser
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);

      // Start monitoring
      monitorAudioLevel();
    } catch (error) {
      console.warn('Audio monitoring setup failed:', error);
    }
  }, [monitorAudioLevel]);

  const startCall = useCallback(async () => {
    if (!config) {
      setState(prev => ({ ...prev, error: 'Vapi configuration not set' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isConnecting: true, error: null }));
      
      console.log('Starting call with config:', { 
        publicKey: config.publicKey.substring(0, 10) + '...', 
        assistantId: config.assistantId 
      });

      // Initialize Vapi instance
      if (!vapiRef.current) {
        console.log('Creating new Vapi instance...');
        console.log('API Key length:', config.publicKey.length);
        console.log('API Key starts with:', config.publicKey.substring(0, 10));
        vapiRef.current = new Vapi(config.publicKey);

        // Set up event listeners
        vapiRef.current.on('call-start', () => {
          console.log('Call started successfully');
          setState(prev => ({ 
            ...prev, 
            isConnected: true, 
            isConnecting: false 
          }));
          // Setup audio monitoring when call starts
          setupAudioMonitoring();
        });

        vapiRef.current.on('call-end', () => {
          // Cleanup audio monitoring
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          
          // Cleanup audio context and stream
          if (microphoneRef.current) {
            microphoneRef.current.disconnect();
            microphoneRef.current = null;
          }
          if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
          }
          if (analyserRef.current) {
            analyserRef.current = null;
          }
          
          // Ensure all states are reset
          setState(prev => ({ 
            ...prev, 
            isConnected: false, 
            isConnecting: false,
            isSpeaking: false, 
            isListening: false,
            isMuted: false,
            audioLevel: 0
          }));
        });

        vapiRef.current.on('speech-start', () => {
          setState(prev => ({ 
            ...prev, 
            isSpeaking: prev.isConnected, // Only set speaking if still connected
            isListening: false 
          }));
        });

        vapiRef.current.on('speech-end', () => {
          setState(prev => ({ 
            ...prev, 
            isSpeaking: false, 
            isListening: prev.isConnected // Only set listening if still connected
          }));
        });

        vapiRef.current.on('error', (error) => {
          console.error('Vapi error event:', error);
          setState(prev => ({ 
            ...prev, 
            error: error.message || 'An error occurred',
            isConnecting: false 
          }));
        });
      }

      // Start the call
      console.log('Starting Vapi call...');
      await vapiRef.current.start(config.assistantId);
      console.log('Vapi call started successfully');
      
    } catch (error) {
      console.error('Vapi call failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to start call',
        isConnecting: false 
      }));
    }
  }, [config, setupAudioMonitoring]);

  const endCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      vapiRef.current = null; // Clear the reference to ensure clean state
    }
    
    // Cleanup audio monitoring
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Cleanup audio context and stream
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current = null;
    }
    
    // Force reset all states immediately
    setState({
      isConnected: false,
      isConnecting: false,
      isSpeaking: false,
      isListening: false,
      isMuted: false,
      error: null,
      audioLevel: 0
    });
  }, []);

  const toggleMute = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!state.isMuted);
    }
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, [state.isMuted]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startCall,
    endCall,
    toggleMute,
    setConfig,
    clearError
  };
};