"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

export type GestureType = 'NONE' | 'PINCH_ROTATE' | 'DUAL_ZOOM' | 'OPEN_PAN';

interface HandTrackingState {
  isEnabled: boolean;
  isLoaded: boolean;
  activeGesture: GestureType;
  confidence: number;
  fps: number;
}

export function useHandTracking(videoRef: React.RefObject<HTMLVideoElement>, canvasRef: React.RefObject<HTMLCanvasElement>, targetDomElement: React.RefObject<HTMLElement>) {
  const [state, setState] = useState<HandTrackingState>({
    isEnabled: false,
    isLoaded: false,
    activeGesture: 'NONE',
    confidence: 0,
    fps: 0,
  });

  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  
  // Smoothing & State buffers
  const isInteractingRef = useRef(false);
  const pinchStartDistRef = useRef(0);
  const activeGestureRef = useRef<GestureType>('NONE');

  const enableTracking = useCallback(async () => {
    setState(s => ({ ...s, isEnabled: true }));
    
    // Dynamic import to avoid SSR issues
    const { Hands } = await import('@mediapipe/hands');
    const { Camera } = await import('@mediapipe/camera_utils');
    const { drawConnectors, drawLandmarks } = await import('@mediapipe/drawing_utils');

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults((results) => {
      // Calculate FPS
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 1000) {
        setState(s => ({ ...s, fps: frameCountRef.current }));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      if (!canvasRef.current || !videoRef.current) return;
      const canvasCtx = canvasRef.current.getContext('2d');
      if (!canvasCtx) return;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Draw video frame
      canvasCtx.globalAlpha = 0.3;
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.globalAlpha = 1.0;

      let currentGesture: GestureType = 'NONE';
      let confidence = 0;

      if (results.multiHandLandmarks && results.multiHandedness) {
        const handsCount = results.multiHandLandmarks.length;
        
        // Draw hands
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, (window as any).HAND_CONNECTIONS || [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]], {color: '#00D2FF', lineWidth: 2});
          drawLandmarks(canvasCtx, landmarks, {color: '#FF1744', lineWidth: 1, radius: 3});
        }

        // Logic for ONE hand
        if (handsCount === 1) {
          const hand = results.multiHandLandmarks[0];
          confidence = results.multiHandedness[0].score;
          
          const thumbTip = hand[4];
          const indexTip = hand[8];
          const middleTip = hand[12];
          const ringTip = hand[16];
          const pinkyTip = hand[20];
          const wrist = hand[0];

          // Calculate pinch distance
          const dx = thumbTip.x - indexTip.x;
          const dy = thumbTip.y - indexTip.y;
          const pinchDist = Math.sqrt(dx*dx + dy*dy);

          // Check if hand is open (all fingers extended far from wrist)
          const isOpen = 
            Math.abs(indexTip.y - wrist.y) > 0.3 &&
            Math.abs(middleTip.y - wrist.y) > 0.3 &&
            Math.abs(ringTip.y - wrist.y) > 0.3 &&
            Math.abs(pinkyTip.y - wrist.y) > 0.3;

          const wrapper = targetDomElement.current;
          const target = wrapper ? wrapper.querySelector('canvas') : null;
          if (wrapper && target) {
            const rect = wrapper.getBoundingClientRect();
            // Mirror x coordinate because webcam is mirrored
            const mappedX = (1 - indexTip.x) * rect.width + rect.left;
            const mappedY = indexTip.y * rect.height + rect.top;

            if (pinchDist < 0.05) {
              currentGesture = 'PINCH_ROTATE';
              if (!isInteractingRef.current || activeGestureRef.current !== 'PINCH_ROTATE') {
                target.dispatchEvent(new PointerEvent('pointerdown', { clientX: mappedX, clientY: mappedY, buttons: 1, pointerId: 1 }));
                isInteractingRef.current = true;
              } else {
                target.dispatchEvent(new PointerEvent('pointermove', { clientX: mappedX, clientY: mappedY, buttons: 1, pointerId: 1 }));
              }
            } else if (isOpen && pinchDist > 0.1) {
              currentGesture = 'OPEN_PAN';
              // Map palm center for panning
              const palmX = (1 - hand[9].x) * rect.width + rect.left;
              const palmY = hand[9].y * rect.height + rect.top;

              if (!isInteractingRef.current || activeGestureRef.current !== 'OPEN_PAN') {
                target.dispatchEvent(new PointerEvent('pointerdown', { clientX: palmX, clientY: palmY, buttons: 2, pointerId: 2 }));
                isInteractingRef.current = true;
              } else {
                target.dispatchEvent(new PointerEvent('pointermove', { clientX: palmX, clientY: palmY, buttons: 2, pointerId: 2 }));
              }
            } else {
              // Release interaction
              if (isInteractingRef.current) {
                target.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));
                target.dispatchEvent(new PointerEvent('pointerup', { pointerId: 2 }));
                isInteractingRef.current = false;
              }
            }
          }
        } 
        // Logic for TWO hands (DUAL ZOOM)
        else if (handsCount === 2) {
          currentGesture = 'DUAL_ZOOM';
          const hand1 = results.multiHandLandmarks[0];
          const hand2 = results.multiHandLandmarks[1];
          confidence = (results.multiHandedness[0].score + results.multiHandedness[1].score) / 2;

          // Distance between index fingers of both hands
          const dx = hand1[8].x - hand2[8].x;
          const dy = hand1[8].y - hand2[8].y;
          const currentDist = Math.sqrt(dx*dx + dy*dy);

          const wrapper = targetDomElement.current;
          const target = wrapper ? wrapper.querySelector('canvas') : null;
          if (wrapper && target) {
            if (!isInteractingRef.current || activeGestureRef.current !== 'DUAL_ZOOM') {
              pinchStartDistRef.current = currentDist;
              isInteractingRef.current = true;
            } else {
              const delta = currentDist - pinchStartDistRef.current;
              // Trigger wheel event for zoom
              if (Math.abs(delta) > 0.01) {
                target.dispatchEvent(new WheelEvent('wheel', { deltaY: delta > 0 ? -50 : 50 }));
                pinchStartDistRef.current = currentDist; // Reset origin to prevent exponential zoom
              }
            }
          }
        }
      } else {
        // Release all interactions if no hands detected
        if (isInteractingRef.current && targetDomElement.current) {
          targetDomElement.current.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));
          targetDomElement.current.dispatchEvent(new PointerEvent('pointerup', { pointerId: 2 }));
          isInteractingRef.current = false;
        }
      }

      activeGestureRef.current = currentGesture;
      setState(s => {
        // Only update state if gesture changed or loaded state changed to avoid unnecessary renders
        if (s.activeGesture !== currentGesture || !s.isLoaded || Math.abs(s.confidence - confidence) > 0.1) {
          return { ...s, isLoaded: true, activeGesture: currentGesture, confidence };
        }
        return s;
      });

      canvasCtx.restore();
    });

    handsRef.current = hands;

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({image: videoRef.current});
          }
        },
        width: 640,
        height: 480
      });
      camera.start();
      cameraRef.current = camera;
    }
  }, [canvasRef, videoRef, targetDomElement]);

  const disableTracking = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    if (handsRef.current) {
      handsRef.current.close();
    }
    setState(s => ({ ...s, isEnabled: false, isLoaded: false, activeGesture: 'NONE' }));
  }, []);

  useEffect(() => {
    return () => {
      disableTracking();
    };
  }, [disableTracking]);

  return { state, enableTracking, disableTracking };
}
