"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// @ts-expect-error
const Joyride: any = dynamic(() => import('react-joyride').then((mod: any) => ({ default: mod.Joyride || mod.default })), { ssr: false });
import { 
  Play, Pause, SkipForward, Maximize, Minimize, Volume2, VolumeX, 
  Settings, User, Radio, Activity, Globe, Crosshair, 
  Cpu, MessageSquare, MonitorPlay, AlertTriangle, Loader2, RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// --- NARRATION & TOUR DATA ---
const TOUR_STEPS: any[] = [
  {
    target: '.tour-step-dashboard',
    content: 'Welcome to BI-VAC v4.2, the Bio-Intelligence Vaccine Early-Warning Center. This automated platform provides real-time aggregates of global genomic shifts.',
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '.tour-step-surveillance',
    content: 'Our Global Surveillance module actively tracks live detection feeds across active regions, instantly mapping evasion risks for critical variants.',
    placement: 'right',
  },
  {
    target: '.tour-step-structural-genomics',
    content: 'Under Structural Genomics, users can interact with high-resolution 3D visualizations of viral proteins and DNA, revealing exact mutation points and structural vulnerabilities.',
    placement: 'right',
  },
  {
    target: '.tour-step-simulation',
    content: 'Finally, our Outbreak Defense Simulator offers hands-on sequence matching and neutralization training, while our AI Assistant handles complex queries instantly.',
    placement: 'right',
  }
];

export default function LiveDemoPlayer() {
  const router = useRouter();
  
  // States
  const [mode, setMode] = useState<'VIDEO' | 'INTERACTIVE'>('VIDEO');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Must be true for Autoplay policies
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Interactive Tour States
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Web Speech API Narrator
  const speakNarration = (text: string) => {
    if (typeof window === 'undefined' || isMuted) return;
    
    // Cancel previous
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Find a good female voice (usually Google UK Female or similar)
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google UK English Female'));
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    utterance.rate = 0.95; // Slightly slower, cinematic pacing
    utterance.pitch = 1.1; // Slightly higher pitch
    
    // Simulate live subtitles
    const words = text.split(' ');
    let currentWord = 0;
    const subtitleInterval = setInterval(() => {
      if (currentWord <= words.length) {
        setCurrentSubtitle(words.slice(0, currentWord).join(' '));
        currentWord++;
      } else {
        clearInterval(subtitleInterval);
      }
    }, (utterance.rate * 1000 * text.length / 15) / words.length); // Rough estimation

    utterance.onend = () => {
      clearInterval(subtitleInterval);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleJoyrideCallback = (data: any) => {
    const { status, type, index } = data;
    const finishedStatuses = ['finished', 'skipped'];

    if (type === 'step:after' || type === 'target:notFound') {
      setStepIndex(index + (data.action === 'prev' ? -1 : 1));
    } else if (finishedStatuses.includes(status)) {
      setRunTour(false);
      setStepIndex(0);
      setCurrentSubtitle('');
      window.speechSynthesis.cancel();
    } else if (type === 'step:before') {
      // Speak the narration for the current step
      const stepText = TOUR_STEPS[index].content as string;
      speakNarration(stepText);
      
      // Handle route changes for demonstration purposes
      if (index === 1) router.push('/surveillance');
      if (index === 2) router.push('/structural-genomics');
      if (index === 3) router.push('/simulation-lab');
      if (index === 0 && pathname !== '/') router.push('/');
    }
  };

  const startInteractiveDemo = () => {
    setMode('INTERACTIVE');
    setRunTour(true);
    setStepIndex(0);
    if (pathname !== '/') router.push('/');
  };

  // Ensure voices are loaded
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Cleanup speech
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  // Video Controls Logic
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Autoplay/Play prevented:", error);
            setIsPlaying(false);
          });
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setCurrentTime((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && videoRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    } else {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(err => console.error(err));
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }
    }
  };

  const handleVideoError = () => {
    setHasError(true);
    setIsLoading(false);
    setIsBuffering(false);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  return (
    <section className="w-full mt-12 mb-20 relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-brand-blue/5 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-blue/50 to-transparent" />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest flex items-center">
            <MonitorPlay className="mr-4 text-brand-blue" size={28} />
            Platform Demo Center
          </h2>
          <p className="text-sm font-medium text-white/40 tracking-wide mt-2 uppercase">
            Live Automated Walkthrough & Capability Showcase
          </p>
        </div>
        
        {/* Mode Toggle */}
        <div className="flex items-center space-x-2 mt-6 md:mt-0 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
          <button 
            onClick={() => setMode('VIDEO')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              mode === 'VIDEO' ? "bg-brand-blue text-black shadow-[0_0_20px_rgba(0,210,255,0.4)]" : "text-white/40 hover:text-white"
            )}
          >
            Cinematic Feed
          </button>
          <button 
            onClick={() => {
              if (mode === 'VIDEO') startInteractiveDemo();
            }}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              mode === 'INTERACTIVE' ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]" : "text-white/40 hover:text-white"
            )}
          >
            AI-Guided Tour
          </button>
        </div>
      </div>

      {/* Main Player Container */}
      <div 
        ref={playerContainerRef}
        className={cn(
          "relative w-full aspect-video md:aspect-[21/9] rounded-[40px] border border-white/10 bg-[#050505] overflow-hidden group shadow-2xl transition-all",
          isFullscreen ? "rounded-none border-none aspect-auto h-screen" : ""
        )}
      >
        
        {/* Scanning Lines overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay z-10" />
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <motion.div 
            animate={{ y: ['-10%', '110%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-full h-32 bg-gradient-to-b from-transparent via-brand-blue/10 to-transparent"
          />
        </div>

        {/* --- MODE A: VIDEO PLAYER --- */}
        <AnimatePresence>
          {mode === 'VIDEO' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black"
            >
              
              {/* Error State */}
              {hasError && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm space-y-4">
                  <AlertTriangle size={48} className="text-red-500 animate-pulse" />
                  <h3 className="text-lg font-black uppercase tracking-widest text-white">Signal Lost</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest text-center max-w-sm">
                    Connection to cinematic feed could not be established. Ensure network stability.
                  </p>
                  <button 
                    onClick={handleRetry}
                    className="mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all flex items-center"
                  >
                    <RotateCcw size={16} className="mr-2" /> Re-establish Link
                  </button>
                </div>
              )}

              {/* Loading State */}
              {isLoading && !hasError && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm space-y-4">
                  <Loader2 size={40} className="text-brand-blue animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue animate-pulse">
                    Decrypting Visual Data...
                  </span>
                </div>
              )}

              {/* Buffering State */}
              {isBuffering && !isLoading && !hasError && (
                <div className="absolute top-8 right-8 z-30 flex items-center space-x-2 bg-black/60 px-4 py-2 rounded-full border border-brand-blue/30 backdrop-blur-sm">
                  <Activity size={14} className="text-brand-blue animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Buffering</span>
                </div>
              )}

              <video 
                ref={videoRef}
                className="w-full h-full object-cover opacity-80"
                loop 
                muted={isMuted} 
                playsInline 
                autoPlay
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onCanPlay={() => setIsLoading(false)}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                onError={handleVideoError}
                src="https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
                onClick={handlePlayPause}
              />
              
              {/* Center Big Play/Pause Button (only visible when paused or hovered) */}
              <div 
                className={cn(
                  "absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-300 pointer-events-none",
                  !isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
                  className="w-24 h-24 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-brand-blue hover:text-black hover:scale-110 transition-all shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(0,210,255,0.5)] pointer-events-auto"
                >
                  {isPlaying ? <Pause size={40} className="ml-1" /> : <Play size={40} className="ml-2" />}
                </button>
              </div>

              {/* Bottom Video Controls Bar */}
              <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 pt-16 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center space-x-4 md:space-x-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40 transform translate-y-2 group-hover:translate-y-0">
                <button 
                  onClick={handlePlayPause}
                  className="text-white hover:text-brand-blue transition-colors outline-none"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button 
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime = 0;
                  }}
                  className="text-white hover:text-brand-blue transition-colors outline-none hidden md:block"
                >
                  <SkipForward size={24} />
                </button>

                <div 
                  className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden relative cursor-pointer group/bar"
                  onClick={handleSeek}
                >
                  <div 
                    className="absolute top-0 left-0 h-full bg-brand-blue transition-all duration-100 shadow-[0_0_10px_rgba(0,210,255,0.8)]" 
                    style={{ width: `${currentTime}%` }}
                  />
                  {/* Hover visualizer */}
                  <div className="absolute top-0 left-0 h-full w-full bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none" />
                </div>

                <div className="flex items-center space-x-4 md:space-x-6">
                  <button onClick={() => {
                    setIsMuted(!isMuted);
                    if (videoRef.current) videoRef.current.muted = !isMuted;
                  }} className="text-white hover:text-brand-blue transition-colors outline-none">
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                  <button 
                    onClick={toggleFullscreen}
                    className="text-white hover:text-brand-blue transition-colors outline-none"
                  >
                    {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MODE B: INTERACTIVE TOUR --- */}
        <AnimatePresence>
          {mode === 'INTERACTIVE' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-30"
            >
              {/* Tour Visual Backdrop */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute">
                  <Activity size={300} className="text-brand-blue/5 animate-pulse" strokeWidth={0.5} />
                </div>
              </div>

              {/* AI Presenter Avatar */}
              <div className="relative z-20 mb-12">
                <div className="w-32 h-32 rounded-full border-2 border-brand-blue/50 p-2 relative shadow-[0_0_50px_rgba(0,210,255,0.2)]">
                  <div className={cn(
                    "absolute inset-0 rounded-full border-2 border-transparent border-t-brand-blue animate-spin",
                    runTour ? "opacity-100" : "opacity-0"
                  )} style={{ animationDuration: '3s' }} />
                  <div className="w-full h-full bg-brand-blue/10 rounded-full flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                    {runTour ? (
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-brand-blue/20"
                      />
                    ) : null}
                    <Cpu size={40} className="text-brand-blue relative z-10" />
                  </div>
                </div>
                {/* Voice waves */}
                {runTour && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-1">
                    {[1,2,3,4,5].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: ['4px', `${(i * 7 % 20) + 10}px`, '4px'] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1.5 bg-brand-blue rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Status Text */}
              <div className="text-center z-20 relative">
                <h3 className="text-3xl font-black text-white uppercase tracking-widest mb-4">
                  {runTour ? 'AI Guide Active' : 'System Standby'}
                </h3>
                
                {/* Start Button */}
                {!runTour && (
                  <button 
                    onClick={startInteractiveDemo}
                    className="px-8 py-4 bg-brand-blue text-black font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-transform flex items-center shadow-[0_0_30px_rgba(0,210,255,0.5)] mx-auto"
                  >
                    <Play size={20} className="mr-3" /> Initialize Guided Tour
                  </button>
                )}
              </div>

              {/* Live Subtitles Panel */}
              <AnimatePresence>
                {runTour && currentSubtitle && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-12 w-full max-w-4xl px-4 md:px-8 z-30"
                  >
                    <div className="bg-black/80 backdrop-blur-2xl border border-brand-blue/30 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,210,255,0.1)] relative overflow-hidden">
                      {/* Scanning line */}
                      <motion.div 
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue to-transparent"
                      />
                      <div className="flex items-start space-x-4">
                        <div className="mt-1 hidden md:block">
                          <MessageSquare size={18} className="text-brand-blue" />
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue mb-2">Athena - Lead Intelligence Operator</div>
                          <p className="text-base md:text-xl font-medium text-white leading-relaxed">
                            {currentSubtitle}
                            <motion.span 
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="inline-block w-2 h-4 md:h-5 bg-brand-blue ml-1 align-middle"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* The Actual Joyride Component for the Tour */}
      <Joyride
        steps={TOUR_STEPS}
        run={runTour}
        stepIndex={stepIndex}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#00D2FF',
            backgroundColor: '#050505',
            arrowColor: '#050505',
            textColor: '#ffffff',
            overlayColor: 'rgba(0,0,0,0.8)'
          },
          tooltipContainer: {
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            textAlign: 'left'
          },
          buttonNext: {
            backgroundColor: '#00D2FF',
            color: '#000000',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            borderRadius: '8px',
            padding: '12px 24px',
          },
          buttonSkip: {
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            fontWeight: 700,
          }
        }}
      />
    </section>
  );
}
