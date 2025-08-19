import React, { useEffect, useRef, useState } from 'react';

const UniversalVideoPlayer = ({ 
  videoUrl, 
  hlsUrl,
  thumbnailUrl, 
  title, 
  controls = true, 
  width = '100%', 
  height = 'auto',
  aspectRatio = '16/9'
}) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffered, setBuffered] = useState(0);

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
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration || 1;
        setBuffered((bufferedEnd / duration) * 100);
      }
    };
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
    video.addEventListener('progress', handleProgress);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 UniversalVideoPlayer Debug Info:', {
      videoUrl,
      hlsUrl,
      isMP4: videoUrl?.includes('.mp4'),
      isHLS: hlsUrl?.includes('.m3u8'),
      finalChoice: videoUrl ? 'MP4 (preferred)' : hlsUrl ? 'HLS (fallback)' : 'None'
    });

    // Reset state
    setIsLoading(true);
    setError(null);
    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);

    // Prioritize MP4 over HLS to avoid CORS issues
    const finalUrl = videoUrl || hlsUrl;
    
    if (!finalUrl) {
      setError('No video source available');
      setIsLoading(false);
      return;
    }

    console.log(`🎬 Loading video: ${finalUrl}`);
    
    // Set video source
    video.src = finalUrl;
    video.load();

  }, [videoUrl, hlsUrl]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
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

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
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
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            Try refreshing the page
          </div>
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
        crossOrigin="anonymous"
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
            <div>Loading video...</div>
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
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '15px',
          color: 'white'
        }}>
          {/* Progress Bar */}
          <div 
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '3px',
              cursor: 'pointer',
              marginBottom: '15px',
              position: 'relative'
            }}
            onClick={handleSeek}
          >
            {/* Buffered progress */}
            <div style={{
              width: `${buffered}%`,
              height: '100%',
              backgroundColor: 'rgba(255,255,255,0.5)',
              borderRadius: '3px',
              position: 'absolute',
              top: 0,
              left: 0
            }}></div>
            
            {/* Played progress */}
            <div style={{
              width: `${(currentTime / duration) * 100}%`,
              height: '100%',
              backgroundColor: '#3498db',
              borderRadius: '3px',
              position: 'absolute',
              top: 0,
              left: 0
            }}></div>
          </div>

          {/* Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button 
                onClick={handlePlayPause}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              <span style={{ fontSize: '14px', minWidth: '80px' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Playback Speed */}
              <div style={{ display: 'flex', gap: '5px' }}>
                {[0.5, 1, 1.5, 2].map(rate => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    style={{
                      background: playbackRate === rate ? '#3498db' : 'none',
                      border: '1px solid white',
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      minWidth: '30px'
                    }}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreen}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                ⛶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Info Overlay */}
      {title && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '5px',
          fontSize: '12px',
          pointerEvents: 'none'
        }}>
          {title}
        </div>
      )}
    </div>
  );
};

export default UniversalVideoPlayer; 