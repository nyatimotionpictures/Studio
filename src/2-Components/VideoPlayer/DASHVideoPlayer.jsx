import React, { useEffect, useRef, useState } from 'react';

const DASHVideoPlayer = ({ 
  videoUrl, 
  dashUrl, 
  thumbnailUrl, 
  title, 
  controls = true, 
  width = '100%', 
  height = 'auto',
  aspectRatio = '16/9'
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [dashjsLoaded, setDashjsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Video event handlers
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = (e) => {
      console.error('Video error:', e);
      setError('Video playback error');
      setIsLoading(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Clean up previous player
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {
        console.warn('Error destroying previous player:', e);
      }
      playerRef.current = null;
    }

    // Determine which URL to use (DASH preferred, MP4 fallback)
    const streamUrl = dashUrl || videoUrl;
    
    console.log('🎬 DASHVideoPlayer Debug Info:', {
      dashUrl,
      videoUrl,
      streamUrl,
      isDASH: streamUrl?.includes('.mpd') || streamUrl?.includes('dash'),
      dashjsLoaded
    });
    
    if (!streamUrl) {
      console.error('❌ No video source available');
      setError('No video source available');
      setIsLoading(false);
      return;
    }

    // Check if it's a DASH stream and if dashjs is available
    const isDASH = streamUrl.includes('.mpd') || streamUrl.includes('dash');
    
    if (isDASH && dashjsLoaded && window.dashjs && window.dashjs.supportsMediaSource()) {
      // Use DASH.js for streaming
      console.log('🎬 Using DASH streaming:', streamUrl);
      
      try {
        const player = window.dashjs.MediaPlayer().create();
        
        // Configure DASH player
        player.updateSettings({
          'streaming': {
            'buffer': {
              'bufferTimeAtTopQuality': 30,
              'bufferTimeAtTopQualityLongForm': 60,
              'fastSwitchEnabled': true,
              'bufferToKeep': 20,
              'bufferAheadToKeep': 20
            },
            'abr': {
              'autoSwitchBitrate': {
                'video': true,
                'audio': true
              },
              'bandwidthSafetyFactor': 0.9,
              'useBufferOccupancyABR': true
            }
          },
          'debug': {
            'logLevel': window.dashjs.Debug.LOG_LEVEL_WARNING
          }
        });

        // Set up event handlers
        player.on(window.dashjs.MediaPlayer.events.MANIFEST_LOADED, () => {
          console.log('✅ DASH manifest loaded successfully');
          setIsLoading(false);
          setError(null);
        });

        player.on(window.dashjs.MediaPlayer.events.ERROR, (error) => {
          console.error('❌ DASH Error:', error);
          setError('DASH streaming failed');
          setIsLoading(false);
        });

        player.on(window.dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, (event) => {
          console.log('🔄 Quality change:', event.mediaType, event.oldQuality, event.newQuality);
        });

        // Initialize player
        player.initialize(video, streamUrl, false);
        playerRef.current = player;

      } catch (error) {
        console.error('❌ Failed to initialize DASH player:', error);
        setError('DASH player initialization failed');
        setIsLoading(false);
      }

      return () => {
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch (e) {
            console.warn('Error destroying DASH player:', e);
          }
        }
      };
    } else if (videoUrl && !videoUrl.includes('.mpd')) {
      // Fallback to MP4
      console.log('📹 Using MP4 fallback:', videoUrl);
      video.src = videoUrl;
      video.load();
    } else {
      setError('No compatible video source available');
      setIsLoading(false);
    }
  }, [dashUrl, videoUrl, dashjsLoaded]);

  // Load dashjs dynamically
  useEffect(() => {
    const loadDashJS = async () => {
      try {
        // Check if dashjs is already loaded
        if (window.dashjs) {
          setDashjsLoaded(true);
          return;
        }

        // Try to load dashjs from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.dashjs.org/latest/dash.all.min.js';
        script.onload = () => {
          console.log('✅ DASH.js loaded successfully');
          setDashjsLoaded(true);
        };
        script.onerror = () => {
          console.warn('⚠️ Failed to load DASH.js, falling back to MP4');
          setDashjsLoaded(false);
        };
        document.head.appendChild(script);
      } catch (error) {
        console.warn('⚠️ Error loading DASH.js:', error);
        setDashjsLoaded(false);
      }
    };

    loadDashJS();
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (video && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      video.currentTime = percentage * duration;
    }
  };

  const handlePlaybackRateChange = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  if (error) {
    return (
      <div style={{ 
        width, 
        height, 
        backgroundColor: '#36323E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '14px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px' }}>❌</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width, height, position: 'relative' }}>
      {/* Video Element */}
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          backgroundColor: '#36323E'
        }}
        controls={controls}
        preload="metadata"
        playsInline
        muted={false}
        poster={thumbnailUrl}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '24px',
              marginBottom: '10px'
            }}>⏳</div>
            <div>Loading DASH stream...</div>
          </div>
        </div>
      )}

      {/* Custom Controls (if controls=false) */}
      {!controls && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '10px',
          color: 'white'
        }}>
          {/* Progress Bar */}
          <div 
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '2px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
            onClick={handleSeek}
          >
            <div style={{
              width: `${(currentTime / duration) * 100}%`,
              height: '100%',
              backgroundColor: '#3498db',
              borderRadius: '2px'
            }}></div>
          </div>

          {/* Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button 
              onClick={handlePlayPause}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>

            <span style={{ fontSize: '12px' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div>
              {[0.5, 1, 1.5, 2].map(rate => (
                <button
                  key={rate}
                  onClick={() => handlePlaybackRateChange(rate)}
                  style={{
                    background: playbackRate === rate ? '#3498db' : 'none',
                    border: '1px solid white',
                    color: 'white',
                    padding: '2px 6px',
                    marginLeft: '5px',
                    borderRadius: '3px',
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DASHVideoPlayer; 