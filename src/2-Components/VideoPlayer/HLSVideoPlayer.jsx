import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const HLSVideoPlayer = ({ 
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
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

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

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Reset retry counter for new video
    retryCountRef.current = 0;

    // Determine which URL to use (HLS preferred, MP4 fallback)
    const streamUrl = hlsUrl || videoUrl;
    
    console.log('🎬 HLSVideoPlayer Debug Info:', {
      hlsUrl,
      videoUrl,
      streamUrl,
      isHLS: streamUrl?.includes('.m3u8') || streamUrl?.includes('hls'),
      hlsSupported: Hls.isSupported()
    });
    
    if (!streamUrl) {
      console.error('❌ No video source available');
      setError('No video source available');
      setIsLoading(false);
      return;
    }

    // Check if it's an HLS stream
    const isHLS = streamUrl.includes('.m3u8') || streamUrl.includes('hls');
    
    if (isHLS && Hls.isSupported()) {
      // Use HLS.js for streaming - always use HLS.js for .m3u8 files
      console.log('🎬 Using HLS streaming:', streamUrl);
      
      const hls = new Hls({
        // HLS Configuration for optimal streaming
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.2,
        nudgeMaxRetry: 5,
        maxFragLookUpTolerance: 0.25,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        enableEmsgMetadataCea: true,
        enableWebVTT: true,
        enableIMSC1: true,
        enableCEA708Captions: true,
        stretchShortVideoTrack: true,
        maxAudioFramesDrift: 1,
        maxStarvationDelay: 4,
        maxLoadingDelay: 4,
        testBandwidth: true,
        progressive: true,
        // Enhanced CORS settings
        xhrSetup: (xhr, url) => {
          xhr.withCredentials = false;
          // Add additional headers to help with CORS
          xhr.setRequestHeader('Accept', 'application/vnd.apple.mpegurl, */*');
          xhr.setRequestHeader('Accept-Encoding', 'gzip, deflate, br');
          xhr.setRequestHeader('Cache-Control', 'no-cache');
        },
        // Custom loader to handle relative URLs
        loader: {
          load: function(context, config, callbacks) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', context.url, true);
            xhr.withCredentials = false;
            xhr.setRequestHeader('Accept', 'application/vnd.apple.mpegurl, */*');
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            
            xhr.onload = function() {
              if (xhr.status === 200) {
                let data = xhr.responseText;
                
                // If this is a manifest file, convert relative URLs to absolute URLs
                if (context.url.includes('.m3u8')) {
                  const baseUrl = context.url.substring(0, context.url.lastIndexOf('/') + 1);
                  data = data.replace(/^([^#].*\.ts)$/gm, baseUrl + '$1');
                }
                
                callbacks.onSuccess({
                  url: context.url,
                  data: data
                }, {}, context);
              } else {
                callbacks.onError({
                  code: xhr.status,
                  text: xhr.statusText
                }, context);
              }
            };
            
            xhr.onerror = function() {
              callbacks.onError({
                code: 0,
                text: 'Network error'
              }, context);
            };
            
            xhr.send();
          }
        }
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_LOADED, () => {
        console.log('✅ HLS manifest parsed successfully');
        setIsLoading(false);
        setError(null);
        retryCountRef.current = 0; // Reset retry counter on success
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS Error:', data);
        
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Network error, trying to recover...');
              // Check if it's a CORS error
              if (data.details === 'manifestLoadError' || data.details === 'levelLoadError') {
                console.error('CORS error detected, trying to recover...');
                if (retryCountRef.current < maxRetries) {
                  retryCountRef.current++;
                  console.log(`Retry attempt ${retryCountRef.current}/${maxRetries}`);
                  setTimeout(() => {
                    hls.startLoad();
                  }, 1000 * retryCountRef.current); // Exponential backoff
                } else {
                  console.error('Max retries reached, giving up');
                  hls.destroy();
                  setError('HLS streaming failed after multiple attempts');
                }
                return;
              }
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              console.error('Fatal error, destroying HLS instance');
              hls.destroy();
              setError('HLS streaming failed');
              break;
          }
        } else {
          console.warn('Non-fatal HLS error:', data);
        }
      });

      hlsRef.current = hls;

      return () => {
        hls.destroy();
      };
    } else if (videoUrl && !videoUrl.includes('.m3u8')) {
      // Fallback to MP4 only if it's not an HLS file
      console.log('📹 Using MP4:', videoUrl);
      video.src = videoUrl;
      video.load();
    } else {
      setError('No compatible video source available');
      setIsLoading(false);
    }
  }, [hlsUrl, videoUrl]);

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

export default HLSVideoPlayer; 