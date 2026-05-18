'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface MindARViewerProps {
  onReady?: () => void;
}

const MindARViewer: React.FC<MindARViewerProps> = ({ onReady }) => {
  const sceneRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [aframeLoaded, setAframeLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (sceneRef.current) {
        // MindAR cleanup logic if needed
      }
    };
  }, []);

  const handleMindARLoaded = () => {
    console.log('AR Scripts Loaded');
    setIsLoaded(true);
    if (onReady) onReady();
  };

  if (!isMounted) {
    return (
      <div className="w-full h-screen relative overflow-hidden bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white font-medium tracking-widest uppercase text-sm">Initializing AR Engine...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      {/* MindAR and A-Frame Scripts Loaded Sequentially */}
      <Script 
        src="https://aframe.io/releases/1.5.0/aframe.min.js" 
        strategy="afterInteractive"
        onLoad={() => {
          console.log('A-Frame Loaded');
          setAframeLoaded(true);
        }}
      />
      {aframeLoaded && (
        <Script 
          src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js" 
          strategy="afterInteractive"
          onLoad={handleMindARLoaded}
        />
      )}

      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white font-medium tracking-widest uppercase text-sm">Initializing AR Engine...</p>
        </div>
      )}

      {/* A-Frame Scene - Only rendered when both A-Frame and MindAR are fully loaded and registered */}
      {isLoaded && (
        <div className="w-full h-full">
          {/* @ts-ignore */}
          <a-scene 
            mindar-image="imageTargetSrc: /targets.mind; autoStart: true; uiLoading: no; uiError: no; uiScanning: no;" 
            color-space="sRGB" 
            embedded={true}
            renderer="colorManagement: true; physicallyCorrectLights: true;" 
            vr-mode-ui="enabled: false" 
            device-orientation-permission-ui="enabled: false"
            ref={sceneRef}
          >
            <a-assets>
              <video 
                id="campus-video" 
                src="/campus-video.mp4" 
                preload="auto" 
                loop 
                muted
                crossOrigin="anonymous"
                playsInline
                webkit-playsinline="true"
              ></video>
            </a-assets>

            <a-camera position="0 0 0" look-controls="enabled: false" cursor="fuse: false; rayOrigin: mouse;" raycaster="objects: .clickable"></a-camera>

            {/* Target 0 - Example */}
            <a-entity mindar-image-target="targetIndex: 0">
              <a-video 
                src="#campus-video" 
                position="0 0 0" 
                height="0.552" 
                width="1" 
                rotation="0 0 0"
                className="clickable"
                onClick={() => {
                  const video = document.querySelector('#campus-video') as HTMLVideoElement;
                  if (video && video.paused) video.play();
                  else if (video) video.pause();
                }}
              ></a-video>
            </a-entity>
          </a-scene>
        </div>
      )}

      {/* Premium UI Overlay */}
      <div className="absolute bottom-10 left-0 right-0 z-40 flex justify-center px-6 pointer-events-none">
        <div className="glass-panel px-6 py-4 max-w-md w-full flex items-center justify-between pointer-events-auto shadow-2xl border-white/10">
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">TAPMI AR Experience</h3>
            <p className="text-white/60 text-xs tracking-wide uppercase">Point at the target to play video</p>
          </div>
          <button 
            className="bg-accent hover:bg-accent-muted text-white px-4 py-2 rounded-full transition-all text-xs font-bold uppercase tracking-widest"
            onClick={() => window.location.reload()}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default MindARViewer;
