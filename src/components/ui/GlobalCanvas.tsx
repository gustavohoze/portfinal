"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { usePathname } from "next/navigation";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Suppress the harmless internal THREE.Clock deprecation warning from @react-three/fiber
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
    originalWarn(...args);
  };
}

// ─── Apple-style elegant ambient gradient orb ──────────────────────────────────
function AmbientOrb({ isHome }: { isHome: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#0055ff") }, // Deep Apple blue
      uColor2: { value: new THREE.Color("#ff00aa") }, // Magenta
      uColor3: { value: new THREE.Color("#000000") }, // Black to fade into background
    }),
    []
  );

  useEffect(() => {
    if (!meshRef.current) return;
    
    // Initial position based on route
    meshRef.current.position.x = isHome ? 3.5 : 0;
    
    if (isHome) {
      const triggers: ScrollTrigger[] = [];
      const setupScroll = () => {
        const contactEl = document.getElementById("contact");

        if (contactEl && meshRef.current) {
          // Glide to the dead center and create a subtle halo for the CTA
          const animPos = gsap.to(meshRef.current.position, {
            x: 0,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: contactEl,
              start: "top bottom",
              end: "center center",
              scrub: 1,
            },
          });
          if (animPos.scrollTrigger) triggers.push(animPos.scrollTrigger);

          const animScale = gsap.to(meshRef.current.scale, {
            x: 3.5, y: 3.5, z: 3.5, // Refined scaling, not an explosion
            ease: "none",
            scrollTrigger: {
              trigger: contactEl,
              start: "top bottom",
              end: "center center",
              scrub: 1,
            },
          });
          if (animScale.scrollTrigger) triggers.push(animScale.scrollTrigger);
        }
      };
      
      setTimeout(setupScroll, 500);

      return () => {
        triggers.forEach(t => t.kill());
      };
    }
  }, [isHome]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime() * 0.15;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.03;
      
      // Only lerp automatically on inner pages, let GSAP control it on the Home page
      if (!isHome) {
        meshRef.current.position.x += (0 - meshRef.current.position.x) * 0.02;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -8]} scale={2.5}>
      <sphereGeometry args={[4, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          
          varying vec2 vUv;
          varying vec3 vPosition;

          // Simple 3D noise function
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

          float snoise(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx) ;

            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );

            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;

            i = mod289(i);
            vec4 p = permute( permute( permute(
                      i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );

            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );

            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);

            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;

            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
          }

          void main() {
            float noise = snoise(vec3(vPosition.x * 0.5, vPosition.y * 0.5, uTime));
            
            // Mix colors based on position and noise
            vec3 color = mix(uColor1, uColor2, noise + 0.5);
            
            // Fade out towards edges to blend into black background
            float distanceToCenter = length(vPosition) / 4.0; 
            float alpha = smoothstep(1.0, 0.1, distanceToCenter);
            
            color = mix(uColor3, color, alpha);
            
            // Make the entire orb slightly transparent and soft (DIMMER FOR TEXT CONTRAST)
            gl_FragColor = vec4(color, alpha * 0.4);
          }
        `}
      />
    </mesh>
  );
}

// ─── Supernova Dust Cloud ──────────────────────────────────────────────────────
function SupernovaDust() {
  const scrollGroupRef = useRef<THREE.Group>(null);
  const introGroupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  useEffect(() => {
    if (!introGroupRef.current || !scrollGroupRef.current) return;

    // Isolate Scroll Group initial state
    scrollGroupRef.current.position.set(3.5, 0, 0);

    // 1. Entrance Animation safely mutating ONLY introGroupRef
    gsap.fromTo(
      introGroupRef.current.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      { x: 1, y: 1, z: 1, duration: 4.5, ease: "power4.out" }
    );
    gsap.fromTo(
      introGroupRef.current.position,
      { x: -8.5, z: -20, y: -2 }, 
      { x: 0, z: 0, y: 0, duration: 4.5, ease: "power3.out" }
    );
    gsap.fromTo(
      introGroupRef.current.rotation,
      { y: -Math.PI / 4, z: Math.PI / 8 },
      { y: 0, z: 0, duration: 5, ease: "power3.out" }
    );

    // 2. Cinematic Scroll Triggers (Selective Fading Only)
    const triggers: ScrollTrigger[] = [];
    const setupScroll = () => {
      const workEl = document.getElementById("work");
      const contactEl = document.getElementById("contact");

      // Dim material opacity slightly for less clustering, but maintain original elegant positioning
      if (workEl && materialRef.current) {
        const animFade1 = gsap.to(materialRef.current, {
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: workEl,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
        });
        if (animFade1.scrollTrigger) triggers.push(animFade1.scrollTrigger);
      }

      if (contactEl && materialRef.current) {
        // Completely strip all dust particles on arrival at the contact section
        const animFade2 = gsap.to(materialRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: contactEl,
            start: "top bottom",
            end: "top center",
            scrub: 1,
          },
        });
        if (animFade2.scrollTrigger) triggers.push(animFade2.scrollTrigger);
      }
    };
    
    setTimeout(setupScroll, 500);

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);
  
  // Generate highly clustered particles for a supernova core + scattered dust
  const particlesCount = 1500; // Optimization: drastically lowered from 3500
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      // Use spherical distribution but deeply skewed towards the center
      const r = Math.pow(Math.random(), 3.5) * 8; // Radius scale
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = (r * Math.sin(phi) * Math.sin(theta)) * 0.5; // Flatten the galaxy just a bit
      const z = r * Math.cos(phi);
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const col = new Float32Array(particlesCount * 3);
    // Darker, cooler core to prioritize contrasting white text floating above it
    const colorInside = new THREE.Color("#1144cc");
    const colorOutside = new THREE.Color("#0055ff");
    const colorMix = new THREE.Color();
    
    for (let i = 0; i < particlesCount; i++) {
      // Calculate original distance to mix colors (core is white, edges are deep blue/purple)
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const distance = Math.sqrt(x*x + y*y + z*z);
      
      const mixRatio = Math.min(distance / 5, 1);
      colorMix.lerpColors(colorInside, colorOutside, mixRatio);
      
      // Add some random variation
      if (Math.random() > 0.8) {
        colorMix.lerp(new THREE.Color("#ff00aa"), 0.5); // Add magenta flares
      }

      col[i * 3] = colorMix.r;
      col[i * 3 + 1] = colorMix.g;
      col[i * 3 + 2] = colorMix.b;
    }
    return col;
  }, [positions]);

  useFrame(({ clock }) => {
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;

    if (pointsRef.current) {
      // Extremely subtle, ultra-premium global vertical parallax so the universe doesn't feel completely glued to the exact scroll pixel
      pointsRef.current.position.y = -scrollY * 0.001;

      // Animate rotation based on time + scroll for a deep interactive feel
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05 + scrollY * 0.0015;
      pointsRef.current.rotation.x = scrollY * 0.0008; // Tilt out nicely on scroll
      pointsRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;

      // Continuous slow breathing logic (independent of the GSAP entrance animation)
      const breathe = Math.sin(clock.getElapsedTime() * 0.5) * 0.03;
      pointsRef.current.scale.setScalar(1 + breathe);
    }
  });

  return (
    <group ref={scrollGroupRef}>
      <group ref={introGroupRef}>
        <points ref={pointsRef}>
        <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.05} // Increased slightly to maintain visual density with fewer particles
        vertexColors
        transparent
        opacity={0.4} // DIMMED FOR TEXT CONTRAST (GSAP scrubs this down to 0)
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      </points>
      </group>
    </group>
  );
}

// ─── Playful Space Voxel Animals ──────────────────────────────────────────────
export const PET_TYPES = ["cat", "dog", "bunny", "bird", "frog"];
export const PET_COLORS = ["#ff9900", "#00ddff", "#ff3366", "#ffffff", "#8844ff", "#4de37c", "#ffcc00", "#e6da20", "#ff00aa"];

export function AnimalMaterial({ isSilhouette, color, roughness = 0.8 }: { isSilhouette?: boolean; color: string; roughness?: number }) {
  if (isSilhouette) return <meshBasicMaterial color="#000000" toneMapped={false} />;
  return <meshStandardMaterial color={color} roughness={roughness} />;
}

export function SpaceHelmet({ neckPosition, headCenter, sphereRadius = 0.35, ringRadius = 0.25, type = "sphere", color = "#dddddd", capsuleHeight = 0.3, isSilhouette = false }: any) {
  if (isSilhouette) return null;

  const yOffset = headCenter[1] - neckPosition[1];
  const zOffset = headCenter[2] - neckPosition[2];

  return (
    <group position={neckPosition}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ringRadius, 0.03, 16, 32]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, yOffset, zOffset]}>
        {type === "capsule" ? <capsuleGeometry args={[sphereRadius, capsuleHeight, 16, 32]} /> : <sphereGeometry args={[sphereRadius, 32, 32]} />}
        <meshPhysicalMaterial transmission={0.9} opacity={1} transparent metalness={0.1} roughness={0.05} ior={1.2} color="#ffffff" />
      </mesh>
    </group>
  );
}

export function VoxelCat({ color = "#ffaa00", isSilhouette = false }: { color?: string, isSilhouette?: boolean }) {
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[0.4, 0.4, 0.5]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0, 0.3, 0.2]} castShadow><boxGeometry args={[0.35, 0.35, 0.35]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0.12, 0.52, 0.2]} castShadow><boxGeometry args={[0.1, 0.15, 0.1]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[-0.12, 0.52, 0.2]} castShadow><boxGeometry args={[0.1, 0.15, 0.1]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      
      {!isSilhouette && (
        <>
          <mesh position={[0.1, 0.38, 0.38]}><boxGeometry args={[0.07, 0.07, 0.02]} /><meshBasicMaterial color="#111" /></mesh>
          <mesh position={[-0.1, 0.33, 0.38]}><boxGeometry args={[0.04, 0.04, 0.02]} /><meshBasicMaterial color="#111" /></mesh>
          <mesh position={[0.05, 0.2, 0.38]}><boxGeometry args={[0.03, 0.15, 0.03]} /><meshPhysicalMaterial color="#aaddff" transmission={0.9} transparent roughness={0} /></mesh>
          <mesh position={[-0.05, 0.22, 0.38]} rotation={[0.4, 0, 0]}><boxGeometry args={[0.05, 0.08, 0.02]} /><meshBasicMaterial color="#ff5555" /></mesh>
        </>
      )}

      <mesh position={[0, 0.1, -0.3]} rotation={[0.3, 0, 0]} castShadow><boxGeometry args={[0.08, 0.4, 0.08]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0.15, -0.3, 0.15]} castShadow><boxGeometry args={[0.1, 0.2, 0.1]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[-0.15, -0.3, 0.15]} castShadow><boxGeometry args={[0.1, 0.2, 0.1]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0.15, -0.3, -0.15]} castShadow><boxGeometry args={[0.1, 0.2, 0.1]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[-0.15, -0.3, -0.15]} castShadow><boxGeometry args={[0.1, 0.2, 0.1]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      
      <SpaceHelmet isSilhouette={isSilhouette} neckPosition={[0, 0.15, 0.1]} headCenter={[0, 0.35, 0.22]} sphereRadius={0.35} ringRadius={0.22} color="#ff3366" />
    </group>
  );
}

export function VoxelDog({ color = "#8b5a2b", isSilhouette = false }: { color?: string, isSilhouette?: boolean }) {
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[0.45, 0.4, 0.6]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0, 0.35, 0.25]} castShadow><boxGeometry args={[0.35, 0.35, 0.35]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0, 0.25, 0.45]} castShadow><boxGeometry args={[0.2, 0.15, 0.15]} /><AnimalMaterial isSilhouette={isSilhouette} color="#e6c280" /></mesh>
      <mesh position={[0.22, 0.25, 0.25]} castShadow><boxGeometry args={[0.1, 0.3, 0.2]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[-0.22, 0.25, 0.25]} castShadow><boxGeometry args={[0.1, 0.3, 0.2]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      
      {!isSilhouette && (
        <>
          <mesh position={[0.03, 0.28, 0.53]} rotation={[0,0,0.2]}><boxGeometry args={[0.06, 0.04, 0.04]} /><meshBasicMaterial color="#111" /></mesh>
          <mesh position={[0.1, 0.44, 0.43]} rotation={[0,0,-0.4]}><boxGeometry args={[0.06, 0.06, 0.02]} /><meshBasicMaterial color="#111" /></mesh>
          <mesh position={[-0.1, 0.38, 0.43]} rotation={[0,0,0.2]}><boxGeometry args={[0.03, 0.08, 0.02]} /><meshBasicMaterial color="#111" /></mesh>
          <mesh position={[0.08, 0.15, 0.52]}><boxGeometry args={[0.02, 0.2, 0.02]} /><meshPhysicalMaterial color="#aaddff" transmission={0.9} transparent roughness={0} /></mesh>
          <mesh position={[-0.08, 0.18, 0.48]} rotation={[0.4, 0, 0.5]}><boxGeometry args={[0.06, 0.12, 0.02]} /><meshBasicMaterial color="#ff5555" /></mesh>
        </>
      )}

      <mesh position={[0, 0.2, -0.35]} rotation={[-0.2, 0, 0]} castShadow><boxGeometry args={[0.1, 0.1, 0.2]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0.15, -0.3, 0.2]} castShadow><boxGeometry args={[0.12, 0.2, 0.12]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[-0.15, -0.3, 0.2]} castShadow><boxGeometry args={[0.12, 0.2, 0.12]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0.15, -0.3, -0.2]} castShadow><boxGeometry args={[0.12, 0.2, 0.12]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[-0.15, -0.3, -0.2]} castShadow><boxGeometry args={[0.12, 0.2, 0.12]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>

      <SpaceHelmet isSilhouette={isSilhouette} neckPosition={[0, 0.2, 0.2]} headCenter={[0, 0.35, 0.32]} sphereRadius={0.4} ringRadius={0.25} color="#00ddff" />
    </group>
  );
}

export function VoxelBunny({ color = "#ffffff", isSilhouette = false }: { color?: string, isSilhouette?: boolean }) {
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[0.35, 0.4, 0.4]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0, 0.35, 0.1]} castShadow><boxGeometry args={[0.3, 0.3, 0.3]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0.1, 0.65, 0.1]} rotation={[0,0,-0.2]} castShadow><boxGeometry args={[0.08, 0.4, 0.08]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[-0.12, 0.55, 0.1]} rotation={[0,0,0.6]} castShadow><boxGeometry args={[0.08, 0.4, 0.08]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>

      {!isSilhouette && (
        <>
          <mesh position={[0.12, 0.4, 0.26]}><boxGeometry args={[0.08, 0.04, 0.02]} /><meshBasicMaterial color="#ff3366" /></mesh>
          <mesh position={[-0.08, 0.35, 0.26]}><boxGeometry args={[0.03, 0.07, 0.02]} /><meshBasicMaterial color="#ff3366" /></mesh>
          <mesh position={[0.02, 0.26, 0.26]} rotation={[0,0,-0.1]}><boxGeometry args={[0.04, 0.08, 0.02]} /><meshBasicMaterial color="#fff" /></mesh>
          <mesh position={[-0.05, 0.24, 0.26]} rotation={[0,0,0.2]}><boxGeometry args={[0.03, 0.05, 0.02]} /><meshBasicMaterial color="#fff" /></mesh>
          <mesh position={[-0.08, 0.12, 0.27]}><boxGeometry args={[0.02, 0.2, 0.02]} /><meshPhysicalMaterial color="#aaddff" transmission={0.9} transparent roughness={0} /></mesh>
        </>
      )}
      
      <mesh position={[0, 0.1, -0.25]} castShadow><boxGeometry args={[0.15, 0.15, 0.15]} /><AnimalMaterial isSilhouette={isSilhouette} color="#fff" /></mesh>
      <mesh position={[0.12, -0.25, 0.1]} castShadow><boxGeometry args={[0.08, 0.15, 0.08]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[-0.12, -0.25, 0.1]} castShadow><boxGeometry args={[0.08, 0.15, 0.08]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0.15, -0.2, -0.1]} castShadow><boxGeometry args={[0.1, 0.2, 0.2]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[-0.15, -0.2, -0.1]} castShadow><boxGeometry args={[0.1, 0.2, 0.2]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>

      <SpaceHelmet isSilhouette={isSilhouette} neckPosition={[0, 0.2, 0.1]} headCenter={[0, 0.45, 0.15]} sphereRadius={0.3} ringRadius={0.2} type="capsule" capsuleHeight={0.4} color="#ffaa00" />
    </group>
  );
}

export function VoxelBird({ color = "#00ddff", isSilhouette = false }: { color?: string, isSilhouette?: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.2, 0]} castShadow><boxGeometry args={[0.35, 0.4, 0.35]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0, 0.26, 0.25]} rotation={[0,0,-0.1]} castShadow><boxGeometry args={[0.15, 0.08, 0.2]} /><AnimalMaterial isSilhouette={isSilhouette} color="#ffaa00" /></mesh>
      <mesh position={[0.02, 0.2, 0.24]} rotation={[0.2,0,0.2]} castShadow><boxGeometry args={[0.12, 0.05, 0.18]} /><AnimalMaterial isSilhouette={isSilhouette} color="#ffaa00" /></mesh>
      
      {!isSilhouette && (
        <>
          <mesh position={[0.15, 0.35, 0.18]}><boxGeometry args={[0.06, 0.03, 0.02]} /><meshBasicMaterial color="#111" /></mesh>
          <mesh position={[-0.1, 0.28, 0.18]}><boxGeometry args={[0.03, 0.06, 0.02]} /><meshBasicMaterial color="#111" /></mesh>
          <mesh position={[0.05, 0.1, 0.3]}><boxGeometry args={[0.02, 0.15, 0.02]} /><meshPhysicalMaterial color="#aaddff" transmission={0.9} transparent roughness={0} /></mesh>
        </>
      )}

      <mesh position={[0.2, 0.15, 0]} castShadow><boxGeometry args={[0.05, 0.2, 0.25]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[-0.2, 0.15, 0]} castShadow><boxGeometry args={[0.05, 0.2, 0.25]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0.1, -0.1, 0]} castShadow><boxGeometry args={[0.05, 0.2, 0.05]} /><AnimalMaterial isSilhouette={isSilhouette} color="#ffaa00" /></mesh>
      <mesh position={[-0.1, -0.1, 0]} castShadow><boxGeometry args={[0.05, 0.2, 0.05]} /><AnimalMaterial isSilhouette={isSilhouette} color="#ffaa00" /></mesh>
      <mesh position={[0.1, -0.2, 0.05]} castShadow><boxGeometry args={[0.1, 0.05, 0.15]} /><AnimalMaterial isSilhouette={isSilhouette} color="#ffaa00" /></mesh>
      <mesh position={[-0.1, -0.2, 0.05]} castShadow><boxGeometry args={[0.1, 0.05, 0.15]} /><AnimalMaterial isSilhouette={isSilhouette} color="#ffaa00" /></mesh>

      <SpaceHelmet isSilhouette={isSilhouette} neckPosition={[0, 0.05, 0]} headCenter={[0, 0.25, 0.1]} sphereRadius={0.35} ringRadius={0.25} color="#8844ff" />
    </group>
  );
}

export function VoxelFrog({ color = "#4de37c", isSilhouette = false }: { color?: string, isSilhouette?: boolean }) {
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[0.5, 0.3, 0.4]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0.15, 0.2, 0.1]} castShadow><boxGeometry args={[0.15, 0.15, 0.15]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[-0.15, 0.2, 0.1]} castShadow><boxGeometry args={[0.15, 0.15, 0.15]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      
      {!isSilhouette && (
        <>
          <mesh position={[0.12, 0.24, 0.18]}><boxGeometry args={[0.08, 0.05, 0.02]} /><meshBasicMaterial color="#111" /></mesh>
          <mesh position={[-0.18, 0.20, 0.18]}><boxGeometry args={[0.03, 0.08, 0.02]} /><meshBasicMaterial color="#111" /></mesh>
          <mesh position={[0, 0.05, 0.21]} rotation={[0,0,0.1]}><boxGeometry args={[0.25, 0.05, 0.01]} /><meshBasicMaterial color="#111" /></mesh>
          <mesh position={[0.1, -0.05, 0.22]}><boxGeometry args={[0.03, 0.2, 0.03]} /><meshPhysicalMaterial color="#aaddff" transmission={0.9} transparent roughness={0} /></mesh>
          <mesh position={[-0.05, -0.02, 0.22]}><boxGeometry args={[0.02, 0.1, 0.02]} /><meshPhysicalMaterial color="#aaddff" transmission={0.9} transparent roughness={0} /></mesh>
        </>
      )}

      <mesh position={[0.3, -0.1, -0.1]} rotation={[0, 0, -0.3]} castShadow><boxGeometry args={[0.1, 0.3, 0.15]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[-0.3, -0.1, -0.1]} rotation={[0, 0, 0.3]} castShadow><boxGeometry args={[0.1, 0.3, 0.15]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[0.2, -0.2, 0.2]} castShadow><boxGeometry args={[0.08, 0.2, 0.08]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>
      <mesh position={[-0.2, -0.2, 0.2]} castShadow><boxGeometry args={[0.08, 0.2, 0.08]} /><AnimalMaterial isSilhouette={isSilhouette} color={color} /></mesh>

      <SpaceHelmet isSilhouette={isSilhouette} neckPosition={[0, 0.0, 0]} headCenter={[0, 0.15, 0.1]} sphereRadius={0.35} ringRadius={0.35} color="#ffffff" />
    </group>
  );
}
function FloatingPet({ type, color, seed }: { type: string, color: string, seed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Randomize movement characteristics based on seed
  const speedX = 0.2 + (seed % 3) * 0.1;
  const speedY = 0.15 + (seed % 5) * 0.05;
  const speedZ = 0.25 + (seed % 2) * 0.1;
  const rotX = (seed % 2 === 0 ? 1 : -1) * 0.2;
  const rotY = (seed % 3 === 0 ? 1 : -1) * 0.3;
  const rotZ = (seed % 5 === 0 ? 1 : -1) * 0.1;

  useEffect(() => {
    if (groupRef.current) {
      // Fun Gacha Pop-in Animation!
      gsap.fromTo(groupRef.current.scale, 
        { x: 0, y: 0, z: 0 }, 
        { x: 1, y: 1, z: 1, duration: 1.2, ease: "elastic.out(1, 0.4)" }
      );
    }
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime + seed * 10;
      
      // Drift organically in a 3D Lissajous curve
      groupRef.current.position.x = Math.sin(t * speedX) * 5;
      groupRef.current.position.y = Math.cos(t * speedY) * 3;
      groupRef.current.position.z = Math.sin(t * speedZ) * 4 - 2;

      // Tumble slowly in zero gravity
      groupRef.current.rotation.x += rotX * delta;
      groupRef.current.rotation.y += rotY * delta;
      groupRef.current.rotation.z += rotZ * delta;
    }
  });

  return (
    <group ref={groupRef}>
      {type === "cat" && <VoxelCat color={color} />}
      {type === "dog" && <VoxelDog color={color} />}
      {type === "bunny" && <VoxelBunny color={color} />}
      {type === "bird" && <VoxelBird color={color} />}
      {type === "frog" && <VoxelFrog color={color} />}
    </group>
  );
}

// ─── Floating Space Pets ────────────────────────────────────────────────────────

function FloatingSpacePets() {
  const groupRef = useRef<THREE.Group>(null);
  
  const [pets, setPets] = useState<any[]>([]);

  // Load saved pets from Pokedex on mount
  useEffect(() => {
    const saved = localStorage.getItem("gacha-active-pets");
    if (saved) {
      try {
        setPets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse gacha pets", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleGacha = (e: any) => {
      setPets((prev) => {
        // Hard cap to avoid WebGL crash on lower-end devices
        if (prev.length >= 30) return prev;
        
        const newPets = [...prev, e.detail];
        localStorage.setItem("gacha-active-pets", JSON.stringify(newPets));
        return newPets;
      });
    };
    
    window.addEventListener("gacha-spawn", handleGacha);
    return () => window.removeEventListener("gacha-spawn", handleGacha);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotate the entire constellation extremely slowly for cinematic feel
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x += Math.sin(state.clock.elapsedTime * 0.1) * 0.001;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {pets.map((pet) => (
        <FloatingPet key={pet.id} type={pet.type} color={pet.color} seed={pet.seed} />
      ))}
    </group>
  );
}

// ─── Scene Setup ───────────────────────────────────────────
export default function GlobalCanvas() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isContact = pathname === "/contact";

  return (
    <Canvas
      fallback={null}
      dpr={[1, 1.2]} // Capping DPR to prevent Retina Macs from melting the GPU
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <ambientLight intensity={0.5} />
      
      {/* Dynamic Lighting tailored heavily to react with metallic/roughness caps in the eyeball */}
      <directionalLight position={[10, 10, 5]} intensity={3} color="#ffffff" />
      <directionalLight position={[-10, 10, -5]} intensity={2} color="#0055ff" />
      <directionalLight position={[0, -10, 5]} intensity={1} color="#ff00aa" />
      
      {/* Playful Lighting specifically for the Floating Pets */}
      {isContact && <ambientLight intensity={0.9} color="#ffffff" />}
      {isContact && <directionalLight position={[10, 20, 15]} intensity={2.5} color="#ffffff" />}
      {isContact && <directionalLight position={[-10, 5, -15]} intensity={0.8} color="#0055ff" />}
      
      {/* Background ambient gradient glow (hidden completely on contact page) */}
      {!isContact && <AmbientOrb isHome={isHome} />}
      
      {/* Floating Voxel Pets */}
      {isContact && <FloatingSpacePets />}
      
      {/* Dynamic dust particle system ONLY on homepage */}
      {isHome && <SupernovaDust />}
    </Canvas>
  );
}
