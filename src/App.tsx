import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

// Types
interface Heart {
  id: number;
  x: number;
  y: number;
  type: 'red' | 'pink' | 'light';
  message: string;
  popped: boolean;
  scale: number;
  offsetX: number;
  offsetY: number;
  isVisible: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  tx: number;
  ty: number;
}

// Hidden messages for the hearts
const hiddenMessages = [
  "You are the CSS to my HTML.",
  "Are you a magician? Because whenever I look at you, everyone else disappears.",
  "Do you have a map? I keep getting lost in your eyes.",
  "Is your name Google? Because you have everything I've been searching for.",
  "Are you a parking ticket? Because you've got FINE written all over you.",
  "Do you believe in love at first sight, or should I walk by again?",
  "Are you a Wi-Fi signal? Because I'm feeling a strong connection.",
  "Are you a camera? Because every time I look at you, I smile.",
  "Are you a time traveler? Because I see you in my future.",
  "Are you a bank loan? Because you have my interest.",
  "Do you have a Band-Aid? Because I scraped my knee falling for you.",
  "Are you a charger? Because I'm dying without you.",
];

// Generate hearts with random positions
const generateHearts = (): Heart[] => {
  const hearts: Heart[] = [];
  const types: ('red' | 'pink' | 'light')[] = ['red', 'pink', 'light'];
  
  for (let i = 0; i < 12; i++) {
    hearts.push({
      id: i,
      x: 8 + (i % 4) * 23 + Math.random() * 8,
      y: 12 + Math.floor(i / 4) * 28 + Math.random() * 10,
      type: types[i % 3],
      message: hiddenMessages[i],
      popped: false,
      scale: 0.8 + Math.random() * 0.4,
      offsetX: 0,
      offsetY: 0,
      isVisible: false,
    });
  }
  return hearts;
};

// Particle component for burst effect
const BurstParticles = ({ x, y, color, onComplete }: { x: number; y: number; color: string; onComplete: () => void }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 60 + Math.random() * 40;
      newParticles.push({
        id: i,
        x: 0,
        y: 0,
        color,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
      });
    }
    setParticles(newParticles);

    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [color, onComplete]);

  return (
    <div 
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: p.color,
            animation: 'particle-burst 0.6s ease-out forwards',
            ['--tx' as string]: `${p.tx}px`,
            ['--ty' as string]: `${p.ty}px`,
          }}
        />
      ))}
    </div>
  );
};

// Confetti component
const Confetti = () => {
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; delay: number; color: string; shape: string }>>([]);

  useEffect(() => {
    const colors = ['#e63946', '#ff6b81', '#ff8fa3', '#ffc2d1', '#ffd700'];
    const newPieces = [];
    for (let i = 0; i < 80; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.5 ? 'circle' : 'heart',
      });
    }
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute ${piece.shape === 'circle' ? 'rounded-full w-3 h-3' : 'w-4 h-4'}`}
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            backgroundColor: piece.color,
            animation: `confetti-fall ${2 + Math.random() * 2}s linear infinite`,
            animationDelay: `${piece.delay}s`,
          }}
        >
          {piece.shape === 'heart' && (
            <svg viewBox="0 0 24 24" fill={piece.color} className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

// Section 1: Landing Page
const LandingPage = ({ onTap }: { onTap: () => void }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleTap = () => {
    setIsExiting(true);
    setTimeout(onTap, 600);
  };

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center bg-valentine-bg cursor-pointer select-none transition-all duration-500 ${isExiting ? 'opacity-0 scale-110' : 'opacity-100'}`}
      onClick={handleTap}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[100%] bg-gradient-radial from-valentine-pale/40 via-valentine-bg to-valentine-bg animate-pulse" 
             style={{ animationDuration: '4s' }} />
      </div>

      {/* Floating hearts in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#ff8fa3">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto ${isExiting ? 'animate-implode' : ''}`}>
        <div className="overflow-hidden flex justify-center">
          <h1 
            className="typewriter-landing font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-valentine-red mb-6"
            style={{ textShadow: '2px 2px 4px rgba(230, 57, 70, 0.3)' }}
          >
            look i made something for you
          </h1>
        </div>
        <p 
          className="font-body text-lg md:text-xl text-valentine-pink animate-fade-up"
          style={{ animationDelay: '3.5s', animationFillMode: 'both', opacity: 0 }}
        >
          ( tap on the screen )
        </p>
      </div>

      {/* Pulsing hint */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-pulse"
        style={{ animationDelay: '1.5s' }}
      >
        <div className="w-6 h-10 border-2 border-valentine-pink rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-valentine-pink rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

// Section 2: Heart Garden
const HeartGarden = ({ onComplete }: { onComplete: () => void }) => {
  const [hearts, setHearts] = useState<Heart[]>(generateHearts());
  const [burstParticles, setBurstParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [showMessage, setShowMessage] = useState<{ id: number; message: string; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const heartPopAudioRef = useRef<HTMLAudioElement | null>(null);
  const messageTimerRef = useRef<number | null>(null);

  useEffect(() => {
    heartPopAudioRef.current = new Audio('/Heart_pop_sound-402323.mp3');
    
    // Cleanup function to clear message timer on unmount
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  // Sequential rendering - make hearts visible one by one
  useEffect(() => {
    hearts.forEach((heart, index) => {
      setTimeout(() => {
        setHearts(prev => prev.map(h => 
          h.id === heart.id ? { ...h, isVisible: true } : h
        ));
      }, index * 80); // 80ms delay between each heart for fast sequential rendering
    });
  }, []);

  // Collision detection and heart repositioning
  useEffect(() => {
    if (!showMessage || !containerRef.current || !messageRef.current) {
      // Reset offsets when message is hidden
      if (!showMessage) {
        setHearts(prev => prev.map(h => ({ ...h, offsetX: 0, offsetY: 0 })));
      }
      return;
    }

    const messageRect = messageRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Message box dimensions with padding
    const msgLeft = messageRect.left - containerRect.left - 20;
    const msgRight = messageRect.right - containerRect.left + 20;
    const msgTop = messageRect.top - containerRect.top - 20;
    const msgBottom = messageRect.bottom - containerRect.top + 20;

    setHearts(prev => prev.map(heart => {
      if (heart.popped) return heart;

      // Calculate heart position in pixels
      const heartX = (containerRect.width * heart.x) / 100;
      const heartY = (containerRect.height * heart.y) / 100;
      const heartSize = 80; // Approximate heart size

      // Check collision
      const heartLeft = heartX - heartSize / 2;
      const heartRight = heartX + heartSize / 2;
      const heartTop = heartY - heartSize / 2;
      const heartBottom = heartY + heartSize / 2;

      const isColliding = !(
        heartRight < msgLeft ||
        heartLeft > msgRight ||
        heartBottom < msgTop ||
        heartTop > msgBottom
      );

      if (isColliding) {
        // Calculate displacement direction
        const heartCenterX = heartX;
        const heartCenterY = heartY;
        const msgCenterX = (msgLeft + msgRight) / 2;
        const msgCenterY = (msgTop + msgBottom) / 2;

        const dx = heartCenterX - msgCenterX;
        const dy = heartCenterY - msgCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        // Push heart away from message center
        const pushDistance = 150;
        const offsetX = (dx / distance) * pushDistance;
        const offsetY = (dy / distance) * pushDistance;

        return { ...heart, offsetX, offsetY };
      }

      return { ...heart, offsetX: 0, offsetY: 0 };
    }));
  }, [showMessage]);

  const handleHeartClick = (heart: Heart, event: React.MouseEvent) => {
    // Prevent clicking if heart is already popped OR if a message is currently showing
    if (heart.popped || showMessage) return;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const colors: Record<string, string> = {
      red: '#e63946',
      pink: '#ff6b81',
      light: '#ff8fa3',
    };

    // Play heart pop sound
    if (heartPopAudioRef.current) {
      heartPopAudioRef.current.currentTime = 0;
      heartPopAudioRef.current.play().catch(err => console.log('Audio play failed:', err));
    }

    // Add burst particles
    const particleId = Date.now();
    setBurstParticles(prev => [...prev, { id: particleId, x: centerX, y: centerY, color: colors[heart.type] }]);

    // Show message
    setShowMessage({ id: heart.id, message: heart.message, x: centerX, y: centerY });

    // Mark heart as popped
    setHearts(prev => prev.map(h => h.id === heart.id ? { ...h, popped: true } : h));

    // Clear any existing message timer to prevent race conditions
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    // Clear message after delay
    messageTimerRef.current = setTimeout(() => {
      setShowMessage(null);
      messageTimerRef.current = null;
    }, 4000);

    // Remove particles from array
    setTimeout(() => {
      setBurstParticles(prev => prev.filter(p => p.id !== particleId));
    }, 900);
  };

  // Check if all hearts are popped
  const allPopped = hearts.every(h => h.popped);

  useEffect(() => {
    if (allPopped) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [allPopped, onComplete]);

  const heartImages: Record<string, string> = {
    red: '/heart-red.png',
    pink: '/heart-pink.png',
    light: '/heart-light.png',
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-valentine-bg relative overflow-hidden p-4 md:p-8"
    >
      {/* Progress indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
        <p className="font-body text-sm text-valentine-red">
          {hearts.filter(h => h.popped).length} / {hearts.length} hearts popped
        </p>
      </div>

      {/* Hearts grid */}
      <div className="relative w-full h-screen pt-16">
        {hearts.map((heart, index) => (
          <div
            key={heart.id}
            className={`absolute transition-all duration-300 ease-out ${
              heart.popped 
                ? 'opacity-0 scale-0' 
                : heart.isVisible 
                  ? 'opacity-100' 
                  : 'opacity-0 scale-0'
            }`}
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              transform: `translate(${heart.offsetX}px, ${heart.offsetY}px) scale(${heart.scale})`,
              animation: heart.isVisible && !heart.popped 
                ? `float ${3 + (index % 3) * 0.5}s ease-in-out infinite` 
                : 'none',
              animationDelay: `${index * 0.1}s`,
              willChange: 'transform',
            }}
          >
            <div
              className="heart-container heart-glow cursor-pointer"
              onClick={(e) => handleHeartClick(heart, e)}
            >
              <img
                src={heartImages[heart.type]}
                alt="heart"
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain animate-pulse-glow"
                style={{ animationDelay: `${index * 0.3}s` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Burst particles */}
      {burstParticles.map(p => (
        <BurstParticles
          key={p.id}
          x={p.x}
          y={p.y}
          color={p.color}
          onComplete={() => {}}
        />
      ))}

      {/* Message popup */}
      {showMessage && (
        <div
          ref={messageRef}
          className="fixed z-40 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 md:p-6 max-w-xs animate-message-unfold"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="text-center">
            <div className="text-3xl mb-2">💌</div>
            <p className="font-body text-sm md:text-base text-gray-700 leading-relaxed">
              {showMessage.message}
            </p>
          </div>
        </div>
      )}

      {/* All popped indicator */}
      {allPopped && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-elastic-scale">
            <div className="text-5xl mb-4">🎉</div>
            <p className="font-display text-3xl text-valentine-red">All hearts opened!</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Section 3a: Pre-question Dialog (May I ask you a question?)
const PreQuestionDialog = ({ onYes }: { onYes: () => void }) => {
  const [noButtonSize, setNoButtonSize] = useState(100);
  const [yesButtonSize, setYesButtonSize] = useState(100);

  const handleNoClick = () => {
    // Shrink the No button
    setNoButtonSize(prev => Math.max(prev - 15, 20));
    // Grow the Yes button
    setYesButtonSize(prev => prev + 20);
  };

  return (
    <div className="min-h-screen bg-valentine-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

      {/* Floating background hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 2}s ease-in-out infinite`,
            }}
          >
            <svg width="60" height="60" viewBox="0 0 24 24" fill="#e63946">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Main card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-12 max-w-lg w-full mx-4 text-center animate-elastic-scale">
        {/* Decorative hearts */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div className="animate-heartbeat">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="#e63946" className="drop-shadow-lg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>

        {/* GIF */}
        <div className="mb-6 mt-4">
          <img 
            src="/May_i_ask_you_a_question_GIFs.gif" 
            alt="May I ask you a question?"
            className="w-full max-w-xs mx-auto rounded-2xl shadow-lg"
          />
        </div>

        <div className="overflow-hidden flex justify-center mb-8">
          <h2 className="typewriter-prequestion font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-valentine-red animate-text-glow">
            may i ask you a question?
          </h2>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center items-center relative">
          <button
            onClick={onYes}
            className="px-8 py-3 bg-valentine-red text-white font-body font-semibold rounded-full 
                     shadow-lg shadow-valentine-red/30 hover:shadow-valentine-red/50 
                     hover:bg-valentine-pink transition-all duration-300
                     animate-pulse relative z-10"
            style={{
              transform: `scale(${yesButtonSize / 100})`,
              transformOrigin: 'center',
            }}
          >
            Yes 💖
          </button>

          <button
            onClick={handleNoClick}
            className="px-8 py-3 bg-gray-200 text-gray-600 font-body font-semibold rounded-full 
                     shadow-lg hover:bg-gray-300 transition-all duration-300"
            style={{
              transform: `scale(${noButtonSize / 100})`,
              transformOrigin: 'center',
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

// Section 3: Proposal Dialog
const ProposalDialog = ({ onYes, onNo }: { onYes: () => void; onNo: () => void }) => {
  const [noClickCount, setNoClickCount] = useState(0);
  const [currentGif, setCurrentGif] = useState("Will_you_be_my_valentine_GIFs.gif");
  const [showTransitionText, setShowTransitionText] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [displayedLyrics, setDisplayedLyrics] = useState<{ id: number; text: string }[]>([]);
  const [showGif, setShowGif] = useState(true);
  const [showText, setShowText] = useState(true);
  const [showButtons, setShowButtons] = useState(true);
  const [showDialog, setShowDialog] = useState(true);
  const [proposalText] = useState("Will you be my valentine?");
  const [isFinalPhase, setIsFinalPhase] = useState(false);
  const [, setIsPlayingSong] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const angryGifs = ['Angry_1.gif', 'Angry_2.gif', 'Angry_3.gif','Angry_4.gif'];
  
  // Lyrics with timestamps (in milliseconds)
  const lyrics = [
    { time: 2340, text: "Yaado Na Baval Ne" },
    { time: 11090, text: "Aavya Phool Re Have" },
    { time: 18820, text: "Tu Aave To" },
    { time: 23020, text: "Duniyaaa..." },
    { time: 27500, text: "Aakhi..." },
    { time: 29990, text: "Dhul Re Have" },
  ];

  useEffect(() => {
    audioRef.current = new Audio('/Vhalam Aavo Ne.mp3');
  }, []);

 const playSongWithLyrics = (onComplete: () => void) => {
  setIsPlayingSong(true);
  setShowLyrics(true);
  setDisplayedLyrics([]);

  setTimeout(() => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.volume = 0; // Start at 0 volume
    audioRef.current.play().catch(console.log);

    // Gradually increase volume from 0 to 1 over 1.5 seconds
    const fadeDuration = 1500; // 1.5 seconds in milliseconds
    const fadeSteps = 30; // Number of volume adjustments
    const fadeInterval = fadeDuration / fadeSteps; // Time between each step
    const volumeIncrement = 1 / fadeSteps; // Volume to add each step
    
    let currentStep = 0;
    const fadeInInterval = setInterval(() => {
      if (audioRef.current && currentStep < fadeSteps) {
        currentStep++;
        audioRef.current.volume = Math.min(currentStep * volumeIncrement, 1);
      } else {
        clearInterval(fadeInInterval);
      }
    }, fadeInterval);

    // Display lyrics one at a time, accumulating them
    lyrics.forEach((lyric, index) => {
      setTimeout(() => {
        setDisplayedLyrics(prev => [
          ...prev,
          { id: index, text: lyric.text }
        ]);
      }, lyric.time);
    });

    audioRef.current.onended = () => {
      clearInterval(fadeInInterval); // Clean up interval
      setIsPlayingSong(false);
      setShowLyrics(false);
      setDisplayedLyrics([]);
      onComplete();
    };
  }, 1000);
};


  const handleNoClick = () => {
    if (noClickCount < 4) {
      const newCount = noClickCount + 1;
      setNoClickCount(newCount);
      
      // Change to angry GIF temporarily, then back to valentine GIF
      setCurrentGif(angryGifs[newCount - 1]);
      setTimeout(() => {
        setCurrentGif("Will_you_be_my_valentine_GIFs.gif");
      }, 1500);

      if (newCount === 4) {
        // After 4th no - fade everything one by one (1.5sec total), show transition text, play song with lyrics
        setTimeout(() => {
          // Fade gif first
          setShowGif(false);
          
          setTimeout(() => {
            // Fade text
            setShowText(false);
            
            setTimeout(() => {
              // Fade buttons
              setShowButtons(false);
              
              setTimeout(() => {
                // Fade dialog box
                setShowDialog(false);
                
                setTimeout(() => {
                  // Show transition text
                  setShowTransitionText(true);
                  
                  setTimeout(() => {
                    // Hide transition text and play song with lyrics
                    setShowTransitionText(false);
                    
                    playSongWithLyrics(() => {
                      // After song ends, fade lyrics and show proposal
                      setTimeout(() => {
                        setShowText(true);
                        setShowButtons(true);
                        setShowDialog(true);
                        setIsFinalPhase(true);
                      }, 500);
                    });
                  }, 1000);
                }, 500);
              }, 375);
            }, 375);
          }, 375);
        }, 1000);
      }
    } else {
      // After 4th no in final phase, it's up to her
      onNo();
    }
  };

  const handleYesClick = () => {
    if (noClickCount < 4) {
      // Yes clicked before 4 no's - hide dialog, play song with lyrics, then show confetti
      setShowGif(false);
      setShowText(false);
      setShowButtons(false);
      setShowDialog(false);
      
      setTimeout(() => {
        playSongWithLyrics(() => {
          // After song ends, show confetti
          setTimeout(() => {
            onYes();
          }, 500);
        });
      }, 500);
    } else {
      // After 4 no's (final phase) - just go to confetti (song already played)
      onYes();
    }
  };

  return (
    <div className="min-h-screen bg-valentine-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* Floating background hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 2}s ease-in-out infinite`,
            }}
          >
            <svg width="60" height="60" viewBox="0 0 24 24" fill="#e63946">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Transition Text - "let me try in different way" */}
      {showTransitionText && (
        <div className="relative z-20 text-center animate-fade-up">
          <h1 className="font-display text-5xl md:text-7xl text-valentine-red animate-text-glow">
            let me try in different way
          </h1>
        </div>
      )}

      {/* Lyrics Display */}
      {showLyrics && (
  <div className="lyrics-stage">
    <div className="lyrics-container">
      {displayedLyrics.map((line) => (
        <p
          key={line.id}
          className="lyric-line font-display"
          style={{
            "--line-width": `${line.text.length * 1.8}ch`,
          } as React.CSSProperties}
        >
          {line.text}
        </p>
      ))}
    </div>
  </div>
)}

      {/* Main card */}
      {showDialog && (
        <div className={`relative z-10 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center animate-elastic-scale transition-opacity duration-500 ${showDialog ? 'opacity-100' : 'opacity-0'}`}>
          {/* Decorative hearts */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="animate-heartbeat">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="#e63946" className="drop-shadow-lg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>

          {/* GIF - show in first phase only */}
          {!isFinalPhase && showGif && (
            <div className={`mb-6 mt-4 transition-opacity duration-375 ${showGif ? 'opacity-100' : 'opacity-0'}`}>
              <img 
                src={`/${currentGif}`}
                alt="Valentine GIF"
                className="w-full max-w-xs mx-auto rounded-2xl shadow-lg"
              />
            </div>
          )}

          {showText && (
            <div className={`transition-opacity duration-375 ${showText ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-valentine-red mt-6 mb-4 animate-text-glow">
                {proposalText}
              </h2>

              <p className="font-body text-lg text-valentine-pink mb-8">
                — For SMITA 💕
              </p>
            </div>
          )}

          {/* Buttons */}
          {showButtons && (
            <div className={`flex gap-4 justify-center items-center transition-opacity duration-375 ${showButtons ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={handleYesClick}
                className="px-8 py-3 bg-valentine-red text-white font-body font-semibold rounded-full 
                         shadow-lg shadow-valentine-red/30 hover:shadow-valentine-red/50 
                         hover:scale-110 hover:bg-valentine-pink transition-all duration-300
                         animate-pulse"
              >
                Yes 💖
              </button>

              <button
                onClick={handleNoClick}
                className="px-8 py-3 bg-gray-200 text-gray-600 font-body font-semibold rounded-full 
                         shadow-lg hover:bg-gray-300 transition-all duration-300"
              >
                No
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Section 4: Success Page
const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-valentine-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti */}
      <Confetti />

      {/* Background gradient pulse */}
      <div className="absolute inset-0 bg-gradient-radial from-valentine-pale/60 via-valentine-bg to-valentine-bg animate-pulse" 
           style={{ animationDuration: '3s' }} />

      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
              opacity: 0.3 + Math.random() * 0.3,
            }}
          >
            <svg width={30 + Math.random() * 40} height={30 + Math.random() * 40} viewBox="0 0 24 24" fill={['#e63946', '#ff6b81', '#ff8fa3'][i % 3]}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex justify-center px-6">
  <div
    className="
      max-w-3xl w-full
      rounded-3xl
      px-10 py-14
      text-center

      bg-pink-50/80
      backdrop-blur-md

      border border-pink-200
      shadow-[0_0_40px_rgba(230,57,70,0.18)]
    "
  >
      <div className="relative z-10 text-center animate-fade-up">
        <div className="text-6xl md:text-8xl mb-6 animate-bounce">
          🎉💕🎊
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-valentine-red mb-4 animate-text-glow">
          yay!
        </h1>

        <h2 className="font-display text-3xl md:text-5xl text-valentine-pink mb-6">
          i love you so much
        </h2>

        <p className="font-body text-lg md:text-xl text-valentine-light">
          ( i knew you'd say yes ) 💘
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <div className="animate-heartbeat" style={{ animationDelay: '0s' }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="#e63946">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className="animate-heartbeat" style={{ animationDelay: '0.2s' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="#ff6b81">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className="animate-heartbeat" style={{ animationDelay: '0.4s' }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="#ff8fa3">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>

        <p className="font-display text-2xl text-valentine-red mt-1">
          SMITA ❤️
        </p>
      </div>
    </div>
  </div>
</div>
  );
};

// No Response Modal
const NoResponseModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-up">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center animate-elastic-scale">
        <div className="text-5xl mb-4">😏</div>
        <h3 className="font-display text-2xl text-valentine-red mb-3">
          Nice try!
        </h3>
        <p className="font-body text-gray-600 mb-6">
          "It's agent yes working undercover as No, lol."
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-valentine-red text-white font-body font-semibold rounded-full 
                   hover:bg-valentine-pink transition-colors duration-300"
        >
          Let me try again 😅
        </button>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentSection, setCurrentSection] = useState<'landing' | 'hearts' | 'prequestion' | 'proposal' | 'success'>('landing');
  const [showNoModal, setShowNoModal] = useState(false);

  const handleLandingTap = useCallback(() => {
    setCurrentSection('hearts');
  }, []);

  const handleHeartsComplete = useCallback(() => {
    setCurrentSection('prequestion');
  }, []);

  const handlePreQuestionYes = useCallback(() => {
    setCurrentSection('proposal');
  }, []);

  const handleYes = useCallback(() => {
    setCurrentSection('success');
  }, []);

  const handleNo = useCallback(() => {
    setShowNoModal(true);
  }, []);

  const closeNoModal = useCallback(() => {
    setShowNoModal(false);
  }, []);

  return (
    <div className="w-full min-h-screen">
      {currentSection === 'landing' && <LandingPage onTap={handleLandingTap} />}
      {currentSection === 'hearts' && <HeartGarden onComplete={handleHeartsComplete} />}
      {currentSection === 'prequestion' && <PreQuestionDialog onYes={handlePreQuestionYes} />}
      {currentSection === 'proposal' && <ProposalDialog onYes={handleYes} onNo={handleNo} />}
      {currentSection === 'success' && <SuccessPage />}
      
      {showNoModal && <NoResponseModal onClose={closeNoModal} />}
    </div>
  );
}

export default App;