"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ArExperiencePage() {
  const [engineLoaded, setEngineLoaded] = useState(false);

  useEffect(() => {
    // 1. Ensure this only initializes in the browser context
    if (typeof window === "undefined") return;

    // 2. Custom A-Frame component logic to place video and handle mobile audio autoplay block
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
              if (!isPlaced && event.detail.intersection) {
                // Fetch the exact 3D vector where the user clicked on the physical floor
                const clickPosition = event.detail.intersection.point;

                // Move the video mesh right to that physical spot and display it
                videoContainer?.setAttribute("position", clickPosition);
                videoContainer?.setAttribute("visible", "true");

                // Bypass mobile browser canvas audio privacy blocking rules
                if (videoAsset) {
                  videoAsset.play().catch((err) => console.log("Playback error:", err));
                  videoAsset.muted = false;
                }

                // Hide the floor target locator
                reticle?.setAttribute("visible", "false");
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
      {/* 3. Load the 8th Wall Engine Binary Script directly into the client DOM */}
      <Script
        src="/external-xr/xr.js"
        strategy="afterInteractive"
        data-preload-chunks="slam"
        onLoad={() => {
          // Listen for A-Frame to load entirely after the core binary mounts
          window.addEventListener("飛-loaded", () => setEngineLoaded(true), { once: true });
          // Fallback if script loads fast
          // @ts-ignore
          if (window.AFRAME) setEngineLoaded(true);
        }}
      />
      {/* Secondary script helper for canvas UI styling/overlays */}
      <Script src="https://aframe.io/releases/1.5.0/aframe.min.js" strategy="beforeInteractive" />

      {engineLoaded ? (
        // @ts-ignore - A-Frame elements aren't native TSX intrinsics
        <a-scene
          xrweb="disableWorldTracking: false"
          tap-to-place
          style={{ width: "100%", height: "100%" }}
        >
          {/* Asset pipeline pointing directly to your file in the public directory */}
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

          {/* Device Camera Rig with Raycaster configured to look for surface clicks */}
          {/* @ts-ignore */}
          <a-camera
            id="camera"
            position="0 4 4"
            raycaster="objects: .surface-floor"
            cursor="fuse: false; rayOrigin: mouse;"
          />

          {/* Invisible ground raycast receiver representing physical space */}
          {/* @ts-ignore */}
          <a-entity
            class="surface-floor"
            geometry="primitive: plane; width: 1000; height: 1000"
            rotation="-90 0 0"
            visible="false"
          />

          {/* Surface visual guide reticle */}
          {/* @ts-ignore */}
          <a-entity id="floor-reticle">
            {/* @ts-ignore */}
            <a-ring color="#accent" radius-inner="0.3" radius-outer="0.4" rotation="-90 0 0" />
          </a-entity>

          {/* The Container for your floating 16:9 MP4 Campus Video Screen */}
          {/* @ts-ignore */}
          <a-entity id="video-screen-container" position="0 0 0" visible="false" look-at="#camera">
            {/* @ts-ignore */}
            <a-video src="#ar-video-source" width="4" height="2.25" position="0 1.125 0" />
          </a-entity>
        </a-scene>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-50 p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
          <p className="text-xl font-light tracking-wide">Initializing AR Environment...</p>
        </div>
      )}
    </div>
  );
}