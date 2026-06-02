"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ArExperiencePage() {
  const [engineLoaded, setEngineLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const registerComponents = () => {
      // @ts-ignore
      if (window.AFRAME && !window.AFRAME.components["tap-to-place"]) {
        // @ts-ignore
        window.AFRAME.registerComponent("tap-to-place", {
          init: function () {
            const scene = this.el.sceneEl || this.el;
            let isPlaced = false;

            scene.addEventListener("click", (event: any) => {
              // Ensure the click event hit our collision plane
              if (!isPlaced && event.detail && event.detail.intersection) {
                const clickPosition = event.detail.intersection.point;
                const videoAsset = document.querySelector("#ar-video-source") as HTMLVideoElement | null;
                const videoContainer = document.querySelector("#video-screen-container");
                const reticle = document.querySelector("#floor-reticle");

                // Lock video container precisely where the user tapped
                if (videoContainer) {
                  videoContainer.setAttribute("position", clickPosition);
                  videoContainer.setAttribute("visible", "true");
                }

                // Trigger video playback and lift browser audio lock rules
                if (videoAsset) {
                  videoAsset.play().catch((err) => console.error("Video playback failed:", err));
                  videoAsset.muted = false;
                }

                // Clean up placement guide UI
                if (reticle) {
                  reticle.setAttribute("visible", "false");
                }

                isPlaced = true;
              }
            });
          },
        });
      }
    };

    const interval = setInterval(() => {
      // @ts-ignore
      if (window.AFRAME) {
        registerComponents();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* 1. Core 3D Base Pipeline - MUST LOAD FIRST */}
      <Script 
        src="https://aframe.io/releases/1.5.0/aframe.min.js" 
        strategy="beforeInteractive" 
      />
      {/* Community look-at component for orienting video screen to camera */}
      <Script 
        src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js" 
        strategy="beforeInteractive" 
      />

      {/* 2. 8th Wall Tracking Engine Binary - LOADS SECOND */}
      <Script
        src="/external-xr/xr.js"
        strategy="afterInteractive"
        data-preload-chunks="slam"
        onLoad={() => {
          setEngineLoaded(true);
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

          {/* Invisible ground raycast receiver representing physical space.
              NOTE: visible="false" causes Three.js raycasting to ignore the mesh! 
              Using opacity: 0 makes it invisible but raycastable. */}
          {/* @ts-ignore */}
          <a-entity
            class="surface-floor"
            geometry="primitive: plane; width: 1000; height: 1000"
            rotation="-90 0 0"
            material="opacity: 0; transparent: true; depthWrite: false;"
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
          <p className="text-xs font-light text-neutral-400 tracking-wide animate-pulse">
            Configuring AR Engine...
          </p>
        </div>
      )}
    </div>
  );
}