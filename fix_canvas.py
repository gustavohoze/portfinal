import sys

file_path = "/Users/mac/Documents/Portfolio/port/src/components/ui/GlobalCanvas.tsx"

with open(file_path, "r") as f:
    content = f.read()

start_marker = "// ─── Playful Space Voxel Animals ──────────────────────────────────────────────"
end_marker = "function FloatingPet"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_content = """// ─── Playful Space Voxel Animals ──────────────────────────────────────────────
export const PET_TYPES = ["cat", "dog", "bunny", "bird", "frog"];
export const PET_COLORS = ["#ff9900", "#00ddff", "#ff3366", "#ffffff", "#8844ff", "#4de37c", "#ffcc00", "#e6da20", "#ff00aa"];

function AnimalMaterial({ isSilhouette, color, roughness = 0.8 }: { isSilhouette?: boolean; color: string; roughness?: number }) {
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
"""

new_file = content[:start_idx] + new_content + content[end_idx:]

with open(file_path, "w") as f:
    f.write(new_file)
