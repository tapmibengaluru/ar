"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ArExperiencePage() {
  const [engineLoaded, setEngineLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initARComponent = () => {
      // @ts-ignore
      if (window.AFRAME && !window.AFRAME.components["tap-to-place"]) {
        // @ts-ignore
        window.AFRAME.registerComponent("tap-to-place", {
          init: function () {
            const scene = this.el.sceneEl;
            const videoAsset = document.querySelector("#ar-video-source") as HTMLVideoElement;
            const videoContainer = document.querySelector("#video-screen-container");
            const reticle = document.querySelector("#floor-reticle");
            let isPlaced = false;

            scene.addEventListener("click", (event: any) => {
              // Ensure the click event hit our invisible ground collision array
              if (!isPlaced && event.detail.intersection) {
                const clickPosition = event.detail.intersection.point;

                // Lock video container precisely where the user tapped
                videoContainer?.setAttribute("position", clickPosition);
                videoContainer?.setAttribute("visible", "true");

                // Trigger video playback and lift browser audio lock rules
                if (videoAsset) {
                  videoAsset.play().catch((err) => console.error("Video playback failed:", err));
                  videoAsset.muted = false;
                }

                // Clean up placement guide UI
                if (reticle) reticle.setAttribute("visible", "false");
                isPlaced = true;
              }
            });
          },
        });
      }
    };

    if (engineLoaded) {
      initARComponent();
    }
  }, [engineLoaded]);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* 1. Core 3D Base Pipeline - MUST LOAD FIRST */}
      <Script 
        src="https://aframe.io/releases/1.5.0/aframe.min.js" 
        strategy="beforeInteractive" 
      />

      {/* 2. 8th Wall Tracking Engine Binary - LOADS SECOND */}
      <Script
        src="/external-xr/xr.js"
        strategy="lazyOnload"
        data-preload-chunks="slam"
        onLoad={() => {
          // Fixed the event tracking hook to listen for the proper engine init event
          window.addEventListener("xr-loaded", () => setEngineLoaded(true), { once: true });
          
          // Fallback assertion check in case binary registration finished early
          // @ts-ignore
          if (window.XR8) setEngineLoaded(true);
        }}
      />

      {engineLoaded ? (
        // @ts-ignore
        <a-scene
          xrweb="disableWorldTracking: false; disableLoadingScreen: true; disableReadyScreen: true;"
          tap-to-place
          style={{ width: "100%", height: "100%" }}
        >
          {/* @ts-ignore */}
          <a-assets>
            <video
              id="ar-video-source"
              src="/campus-video.mp4"
              preload="auto"
              loop
              playsInline
              webkit-playsinline="true"
              muted
            />
          </a-assets>

          {/* @ts-ignore */}
          <a-camera
            id="camera"
            position="0 4 4"
            raycaster="objects: .surface-floor"
            cursor="fuse: false; rayOrigin: mouse;"
          />

          {/* @ts-ignore */}
          <a-entity
            class="surface-floor"
            geometry="primitive: plane; width: 1000; height: 1000"
            rotation="-90 0 0"
            visible="false"
          />

          {/* @ts-ignore */}
          <a-entity id="floor-reticle">
            {/* @ts-ignore */}
            <a-ring color="#4F46E5" radius-inner="0.3" radius-outer="0.4" rotation="-90 0 0" />
          </a-entity>

          {/* @ts-ignore */}
          <a-entity id="video-screen-container" position="0 0 0" visible="false" look-at="#camera">
            {/* @ts-ignore */}
            <a-video src="#ar-video-source" width="4" height="2.25" position="0 1.125 0" />
          </a-entity>
        </a-scene>
      ) : (
        /* Custom UI Loading Wrapper built with Tailwind */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-neutral-900 to-black text-white z-50 p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          {/* <h2 className="text-xl font-bold tracking-tight mb-1">MEGAMIND X TAPMI</h2> */}
          <p className="text-xs font-light text-neutral-400 tracking-wide animate-pulse">
            Configuring AR Engine...
          </p>
        </div>
      )}
    </div>
  );
}