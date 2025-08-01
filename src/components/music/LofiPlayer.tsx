import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Music,
  Radio,
  Coffee,
  Sparkles,
  Loader2
} from 'lucide-react';

interface Station {
  stationuuid: string;
  name: string;
  url_resolved: string;
  tags: string;
  country: string;
  clickcount: number;
  genre: string;
}

export const LofiPlayer = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentStationIndex, setCurrentStationIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadLofiStations();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const loadLofiStations = async () => {
    try {
      setIsLoading(true);
      
      // Get a random server from Radio Browser API
      const serverResponse = await fetch('https://de1.api.radio-browser.info/json/servers');
      const servers = await serverResponse.json();
      const randomServer = servers[Math.floor(Math.random() * servers.length)];
      const baseUrl = `https://${randomServer.name}`;
      
      // Search for lofi stations
      const searchQueries = ['lofi', 'lo-fi', 'chill', 'chillhop', 'study music'];
      let allStations: Station[] = [];
      
      for (const query of searchQueries) {
        try {
          const response = await fetch(
            `${baseUrl}/json/stations/search?name=${encodeURIComponent(query)}&limit=15&hidebroken=true&order=clickcount&reverse=true`,
            {
              headers: {
                'User-Agent': 'HabitCrown-LofiPlayer/1.0'
              }
            }
          );
          const stations = await response.json();
          allStations = allStations.concat(stations);
        } catch (error) {
          console.warn(`Failed to fetch stations for query: ${query}`, error);
        }
      }
      
      // Remove duplicates and filter for working stations
      const uniqueStations = allStations.filter((station, index, self) => 
        index === self.findIndex(s => s.stationuuid === station.stationuuid) &&
        station.url_resolved && 
        station.url_resolved.trim() !== ''
      );
      
      // Sort by popularity and take top 15
      const sortedStations = uniqueStations
        .sort((a, b) => (b.clickcount || 0) - (a.clickcount || 0))
        .slice(0, 15);
      
      setStations(sortedStations);
      
      if (sortedStations.length > 0) {
        setCurrentStationIndex(0);
      }
      
    } catch (error) {
      console.error('Error loading stations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectStation = async (index: number) => {
    if (index < 0 || index >= stations.length) return;
    
    setCurrentStationIndex(index);
    const station = stations[index];
    
    if (audioRef.current) {
      setIsBuffering(true);
      
      // Stop current playback
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Set new source
      audioRef.current.src = station.url_resolved;
      audioRef.current.crossOrigin = 'anonymous';
      audioRef.current.load();
      
      // Click tracking for Radio Browser API
      try {
        await fetch(`https://de1.api.radio-browser.info/json/url/${station.stationuuid}`, {
          method: 'GET',
          headers: {
            'User-Agent': 'HabitCrown-LofiPlayer/1.0'
          }
        });
      } catch (error) {
        // Silent fail for click tracking
      }
    }
  };

  const togglePlayPause = async () => {
    if (currentStationIndex === -1 || !audioRef.current) return;
    
    // Check if user has interacted before attempting to play
    if (!hasUserInteracted && !isPlaying) {
      alert('Please click on a station or control button first to enable audio playback.');
      return;
    }
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Ensure the audio is loaded
        if (audioRef.current.readyState < 2) {
          audioRef.current.load();
          await new Promise((resolve) => {
            const onCanPlay = () => {
              audioRef.current?.removeEventListener('canplay', onCanPlay);
              resolve(void 0);
            };
            audioRef.current?.addEventListener('canplay', onCanPlay);
          });
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      setIsPlaying(false);
      setIsBuffering(false);
      
      // Show user-friendly error message
      alert('Unable to play this station. This might be due to browser restrictions or the station being temporarily unavailable. Please try another station.');
    }
  };

  const previousStation = () => {
    if (stations.length === 0) return;
    const newIndex = currentStationIndex <= 0 ? stations.length - 1 : currentStationIndex - 1;
    selectStation(newIndex);
  };

  const nextStation = () => {
    if (stations.length === 0) return;
    const newIndex = currentStationIndex >= stations.length - 1 ? 0 : currentStationIndex + 1;
    selectStation(newIndex);
  };

  const handleAudioCanPlay = () => {
    setIsBuffering(false);
  };

  const handleAudioError = (event: any) => {
    console.error('Audio error:', event);
    setIsBuffering(false);
    setIsPlaying(false);
    
    // Get error details
    const audio = audioRef.current;
    if (audio && audio.error) {
      console.error('Audio error code:', audio.error.code);
      console.error('Audio error message:', audio.error.message);
    }
    
    // Auto-skip to next station on error after a short delay
    setTimeout(() => {
      if (stations.length > 1) {
        console.log('Auto-skipping to next station due to error');
        nextStation();
      }
    }, 2000);
  };

  const currentStation = currentStationIndex >= 0 ? stations[currentStationIndex] : null;

  if (isLoading) {
    return (
      <motion.div 
        className="flex items-center justify-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <Music className="h-8 w-8 text-amber-600" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="h-3 w-3 text-yellow-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Current Station Display */}
      <motion.div 
        className="bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 rounded-3xl p-8 border border-amber-200/50 shadow-lg backdrop-blur-sm"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring", damping: 25 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <motion.div 
              className="flex items-center space-x-3 mb-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Radio className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Now Playing</span>
            </motion.div>
            <motion.h3 
              className="text-xl font-bold text-amber-800 mb-1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentStation?.name || 'Select a station to start'}
            </motion.h3>
            <motion.p 
              className="text-amber-600"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentStation?.tags || currentStation?.genre || 'Lofi Music'}
              {currentStation?.country && ` • ${currentStation.country}`}
            </motion.p>
          </div>
          
          {/* Visualizer */}
          <motion.div 
            className="flex items-end space-x-1 h-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-amber-400 to-yellow-400 rounded-full"
                animate={isPlaying ? {
                  height: [8, 24, 8],
                  opacity: [0.6, 1, 0.6]
                } : { height: 8, opacity: 0.6 }}
                transition={{
                  duration: 1 + i * 0.2,
                  repeat: isPlaying ? Infinity : 0,
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="flex items-center justify-center space-x-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={() => {
            setHasUserInteracted(true);
            previousStation();
          }}
          disabled={stations.length === 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white/70 backdrop-blur-sm border border-amber-200/50 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SkipBack className="h-5 w-5 text-amber-600" />
        </motion.button>

        <motion.button
          onClick={() => {
            setHasUserInteracted(true);
            togglePlayPause();
          }}
          disabled={currentStationIndex === -1 || isBuffering}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gradient-to-br from-amber-200 to-orange-200 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-amber-300/50"
        >
          {isBuffering ? (
            <Loader2 className="h-6 w-6 text-amber-700 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-6 w-6 text-amber-700" />
          ) : (
            <Play className="h-6 w-6 text-amber-700 ml-0.5" />
          )}
        </motion.button>

        <motion.button
          onClick={() => {
            setHasUserInteracted(true);
            nextStation();
          }}
          disabled={stations.length === 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white/70 backdrop-blur-sm border border-amber-200/50 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SkipForward className="h-5 w-5 text-amber-600" />
        </motion.button>
      </motion.div>

      {/* Volume Control */}
      <motion.div 
        className="flex items-center justify-center space-x-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={() => setIsMuted(!isMuted)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-amber-600 hover:text-amber-700 transition-colors"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </motion.button>
        
        <div className="relative w-32">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${volume}%, #fde68a ${volume}%, #fde68a 100%)`
            }}
          />
        </div>
      </motion.div>

      {/* Station List */}
      <motion.div 
        className="space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Coffee className="h-5 w-5 text-amber-600" />
          <h4 className="text-lg font-semibold text-amber-800">Available Lofi Stations</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {stations.map((station, index) => (
              <motion.button
                key={station.stationuuid}
                onClick={() => {
                  setHasUserInteracted(true);
                  selectStation(index);
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay: index * 0.05 }}
                className={`text-left p-4 rounded-xl border transition-all duration-300 ${
                  currentStationIndex === index
                    ? 'bg-gradient-to-br from-amber-200 to-orange-200 border-amber-300 shadow-lg'
                    : 'bg-white/70 backdrop-blur-sm border-amber-200/50 hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <h5 className="font-medium text-amber-800 text-sm mb-1 truncate">
                  {station.name}
                </h5>
                <p className="text-xs text-amber-600 mb-1 truncate">
                  {station.tags || station.genre || 'Lofi Music'}
                </p>
                <p className="text-xs text-amber-500 truncate">
                  {station.country}
                </p>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onCanPlay={handleAudioCanPlay}
        onError={handleAudioError}
        onLoadStart={() => setIsBuffering(true)}
        onLoadedData={() => setIsBuffering(false)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => nextStation()}
        preload="none"
        crossOrigin="anonymous"
      />

      {/* Custom slider styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </motion.div>
  );
};
