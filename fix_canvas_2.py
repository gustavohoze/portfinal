import sys

file_path = "/Users/mac/Documents/Portfolio/port/src/components/ui/GlobalCanvas.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace('const PET_TYPES = ["cat", "dog", "bunny", "bird", "frog"];\n', '')
content = content.replace('const PET_COLORS = ["#ff9900", "#00ddff", "#ff3366", "#ffffff", "#8844ff", "#4de37c", "#ffcc00", "#e6da20", "#ff00aa"];\n', '')

old_gacha_event = """    const handleGacha = () => {
      setPets((prev) => {
        if (prev.length >= 25) return prev; // Limit max pets to preserve frame rate
        const type = PET_TYPES[Math.floor(Math.random() * PET_TYPES.length)];
        const color = PET_COLORS[Math.floor(Math.random() * PET_COLORS.length)];
        return [...prev, { id: Date.now(), type, color, seed: prev.length + 10 }];
      });
    };
    
    window.addEventListener("new-gacha-pet", handleGacha);
    return () => window.removeEventListener("new-gacha-pet", handleGacha);"""

new_gacha_event = """    const handleGacha = (e: any) => {
      setPets((prev) => {
        if (prev.length >= 25) return prev;
        return [...prev, e.detail];
      });
    };
    
    window.addEventListener("gacha-spawn", handleGacha);
    return () => window.removeEventListener("gacha-spawn", handleGacha);"""

content = content.replace(old_gacha_event, new_gacha_event)

with open(file_path, "w") as f:
    f.write(content)
