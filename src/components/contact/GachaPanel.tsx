"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { VoxelCat, VoxelDog, VoxelBunny, VoxelBird, VoxelFrog, PET_TYPES, PET_COLORS } from "../ui/GlobalCanvas";
import styles from "./GachaPanel.module.css";

function ShiftingModel({ isRolling, finalPet, unlocked }: { isRolling: boolean, finalPet: any, unlocked: string[] }) {
  const [currentDisplay, setCurrentDisplay] = useState(finalPet);
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      if (isRolling) {
        ref.current.rotation.y -= delta * 12; // Chaotic, blurry fast spin
        ref.current.position.y = Math.sin(state.clock.elapsedTime * 20) * 0.05; // Unstable vibration
      } else {
        // Smooth presentation spin
        ref.current.rotation.y += delta * 0.5;
        // Cinematic hover
        ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  useEffect(() => {
    if (!isRolling && finalPet) {
      setCurrentDisplay(finalPet);
      return;
    }
    if (!isRolling) return;
    
    // Cycle randomly while rolling
    const interval = setInterval(() => {
      const randomType = PET_TYPES[Math.floor(Math.random() * PET_TYPES.length)];
      setCurrentDisplay({ type: randomType, color: "#ffffff", seed: 0 }); 
    }, 60); // Incredibly fast flicker
    
    return () => clearInterval(interval);
  }, [isRolling, finalPet]);

  if (!currentDisplay) return null;

  const { type } = currentDisplay;
  
  // If it's a silhouette: we don't know it yet.
  const isSilhouette = !unlocked.includes(type);
  // Give random vibrant colors if rolling, otherwise its assigned true color
  const displayColor = isRolling ? PET_COLORS[Math.floor(Math.random() * PET_COLORS.length)] : (finalPet?.color || "#fff");
  
  return (
    <group ref={ref} scale={isRolling ? 2 : 2.5} position={[0, 0, 0]}>
      {type === "cat" && <VoxelCat color={displayColor} isSilhouette={isSilhouette} />}
      {type === "dog" && <VoxelDog color={displayColor} isSilhouette={isSilhouette} />}
      {type === "bunny" && <VoxelBunny color={displayColor} isSilhouette={isSilhouette} />}
      {type === "bird" && <VoxelBird color={displayColor} isSilhouette={isSilhouette} />}
      {type === "frog" && <VoxelFrog color={displayColor} isSilhouette={isSilhouette} />}
    </group>
  );
}

export default function GachaPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [finalPet, setFinalPet] = useState<{type: string, color: string, seed: number} | null>(null);

  // Load Pokedex
  useEffect(() => {
    const saved = localStorage.getItem("gacha-unlocked");
    if (saved) setUnlocked(JSON.parse(saved));
  }, []);

  const handleRoll = () => {
    if (isRolling) return;
    
    // Determine the pet they get
    const type = PET_TYPES[Math.floor(Math.random() * PET_TYPES.length)];
    const color = PET_COLORS[Math.floor(Math.random() * PET_COLORS.length)];
    const pet = { type, color, id: Date.now(), seed: Date.now() };
    
    setFinalPet(pet);
    setIsRolling(true);
    setIsOpen(true);
    setShowResult(false);

    // Spin for 3.5 seconds
    setTimeout(() => {
      setIsRolling(false);
      setShowResult(true);
      
      // Save to pokedex
      setUnlocked(prev => {
        const next = prev.includes(type) ? prev : [...prev, type];
        localStorage.setItem("gacha-unlocked", JSON.stringify(next));
        return next;
      });
      
      // Tell webGL canvas to spawn it into the background physically
      window.dispatchEvent(new CustomEvent("gacha-spawn", { detail: pet }));
      
      // Hide the overlay after letting them bask in the unlock for 2.5s
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => setShowResult(false), 500); // Wait for transition
      }, 3000);
      
    }, 3500);
  };

  return (
    <>
      <button 
        className={`${styles.fab} ${isOpen ? styles.fabHidden : ""}`} 
        onClick={handleRoll} 
        title="Roll Fortune Ball"
      >
        <span className={styles.fabIcon}>🎰</span>
      </button>

      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.fortuneContainer}>
            
            {/* The Glowing Fortune Ball Core below the animals */}
            <div className={`${styles.fortuneBall} ${isRolling ? styles.ballRolling : styles.ballResult}`}>
              <div className={styles.ballGlow}></div>
              <div className={styles.ballCore}>
                <div className={styles.ballInnerEnergy}></div>
              </div>
            </div>

            {/* 3D Silhouette Presentation Layer */}
            <div className={styles.canvasWrapper}>
              <Canvas fallback={null} camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={1.2} color="#ffffff" />
                <directionalLight position={[10, 20, 15]} intensity={3} color="#ffffff" />
                <directionalLight position={[-10, 5, -15]} intensity={1} color="#0055ff" />
                <ShiftingModel isRolling={isRolling} finalPet={finalPet} unlocked={unlocked} />
              </Canvas>
            </div>
            
            {/* Typography Overlay */}
            <div className={styles.uiOverlay}>
              {isRolling ? (
                <h2 className={styles.rollingText}>Tuning the Void...</h2>
              ) : (
                <div className={styles.resultUI}>
                   <h2 className={styles.resultTitle}>Entity Materialized!</h2>
                   <p className={styles.resultDesc}>
                     A new companion has entered the orbit.
                   </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
