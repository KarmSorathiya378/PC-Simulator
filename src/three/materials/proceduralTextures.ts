import * as THREE from 'three';

/**
 * Procedural texture generators using offscreen HTML5 Canvas.
 * These create crisp, lightweight, self-contained PBR textures without external asset loading.
 */

/**
 * Creates a detailed dark motherboard PCB texture with circuit traces and silkscreen.
 */
export function createPcbTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return texture;
  }

  // Dark matte PCB substrate
  ctx.fillStyle = '#181E29';
  ctx.fillRect(0, 0, size, size);

  // Subtle PCB weave / ground plane grid
  ctx.strokeStyle = '#1D2533';
  ctx.lineWidth = 1;
  const gridSize = 16;
  for (let x = 0; x < size; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y < size; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Copper and silver circuit bus traces
  ctx.strokeStyle = '#324563';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 48; i++) {
    const startX = (i * 21) % size;
    const startY = (i * 37) % size;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + 40, startY + 40);
    ctx.lineTo(startX + 180, startY + 40);
    ctx.lineTo(startX + 220, startY + 80);
    ctx.stroke();
  }

  // High-density memory & PCIe differential signal trace pairs
  ctx.strokeStyle = '#435B80';
  ctx.lineWidth = 1;
  for (let i = 0; i < 16; i++) {
    const y = 300 + i * 8;
    ctx.beginPath();
    ctx.moveTo(100, y);
    ctx.lineTo(240, y);
    ctx.lineTo(300, y + 60);
    ctx.lineTo(500, y + 60);
    ctx.stroke();
  }

  // Silkscreen text and markings (white/light silver)
  ctx.fillStyle = '#A0AEC0';
  ctx.font = 'bold 16px "SF Mono", monospace';
  ctx.fillText('MSI MAG B650 TOMAHAWK WIFI', 320, 180);
  ctx.font = '12px "SF Mono", monospace';
  ctx.fillText('AM5 LGA1718 SOCKET', 320, 205);
  ctx.fillText('PCIe 4.0 x16 REINFORCED SLOT', 220, 680);
  ctx.fillText('LIGHTNING GEN 4 M.2 (64Gb/s)', 340, 520);
  ctx.fillText('AUDIO BOOST 5 - HIGH DEFINITION', 80, 880);

  // Surface Mount Device (SMD) pads
  ctx.fillStyle = '#CBD5E1';
  for (let i = 0; i < 90; i++) {
    const px = (i * 47) % (size - 80) + 40;
    const py = (i * 61) % (size - 80) + 40;
    ctx.fillRect(px, py, 6, 3);
    ctx.fillRect(px + 9, py, 6, 3);
  }

  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates laser-etched nickel Integrated Heat Spreader (IHS) markings for the CPU.
 */
export function createCpuIhsTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Brushed nickel IHS metallic base
  ctx.fillStyle = '#C8D0DA';
  ctx.fillRect(0, 0, size, size);

  // Subtle directional brushed metal grain
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  for (let y = 0; y < size; y += 3) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Laser-etched text
  ctx.fillStyle = '#334155';
  ctx.textAlign = 'center';

  ctx.font = '900 32px system-ui, -apple-system, sans-serif';
  ctx.fillText('AMD RYZEN™', size / 2, 170);

  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.fillText('7 7800X3D', size / 2, 210);

  ctx.font = '14px "SF Mono", monospace';
  ctx.fillText('100-000000910 BF 2348SUT', size / 2, 270);
  ctx.fillText('9MC6348X30129 — DIFFUSED IN TAIWAN', size / 2, 295);
  ctx.fillText('MADE IN MALAYSIA', size / 2, 320);

  // Alignment golden triangle in corner
  ctx.fillStyle = '#EAB308';
  ctx.beginPath();
  ctx.moveTo(35, 450);
  ctx.lineTo(65, 450);
  ctx.lineTo(35, 480);
  ctx.closePath();
  ctx.fill();

  // Pseudo DataMatrix / QR mark
  ctx.fillStyle = '#1E293B';
  const qrX = 380;
  const qrY = 360;
  for (let rx = 0; rx < 8; rx++) {
    for (let ry = 0; ry < 8; ry++) {
      if ((rx + ry * 3) % 2 === 0 || (rx === 0 && ry === 0)) {
        ctx.fillRect(qrX + rx * 8, qrY + ry * 8, 7, 7);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates gold connector contact finger strip texture for RAM and PCIe slots.
 */
export function createGoldFingerTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 128;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Dark substrate
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, width, height);

  // Gold fingers with bevel and spacing
  const pinCount = 64;
  const pinWidth = width / pinCount;
  for (let i = 0; i < pinCount; i++) {
    // Gap for the DDR/PCIe key notch in the middle
    if (i >= 28 && i <= 31) continue;

    const x = i * pinWidth + 1;
    // Gold gradient
    const grad = ctx.createLinearGradient(x, 10, x, height - 10);
    grad.addColorStop(0, '#F59E0B');
    grad.addColorStop(0.5, '#FDE047');
    grad.addColorStop(1, '#D97706');

    ctx.fillStyle = grad;
    ctx.fillRect(x, 10, pinWidth - 2.5, height - 20);

    // Rounded tip
    ctx.beginPath();
    ctx.arc(x + (pinWidth - 2.5) / 2, height - 10, (pinWidth - 2.5) / 2, 0, Math.PI);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates hexagonal honeycomb ventilation mesh texture for PSU and PC Case backplanes.
 */
export function createHoneycombTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return texture;
  }

  // Metal sheet color
  ctx.fillStyle = '#1E2530';
  ctx.fillRect(0, 0, size, size);

  // Hexagonal holes (black cutout)
  ctx.fillStyle = '#070A0F';
  ctx.strokeStyle = '#2D3748';
  ctx.lineWidth = 2;

  const hexRadius = 10;
  const dx = hexRadius * Math.sqrt(3);
  const dy = hexRadius * 1.5;

  for (let row = -1; row < size / dy + 2; row++) {
    const xOffset = (row % 2 === 0) ? 0 : dx / 2;
    for (let col = -1; col < size / dx + 2; col++) {
      const centerX = col * dx + xOffset;
      const centerY = row * dy;

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = centerX + (hexRadius - 2) * Math.cos(angle);
        const hy = centerY + (hexRadius - 2) * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates high-speed DDR5 memory module badge and heatsink decal texture.
 */
export function createRamHeatsinkTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 128;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Gunmetal brushed aluminum heatsink
  ctx.fillStyle = '#262D38';
  ctx.fillRect(0, 0, width, height);

  // Diamond/chevron textured ridges
  ctx.strokeStyle = '#1A202C';
  ctx.lineWidth = 2;
  for (let x = 20; x < width - 20; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.lineTo(x + 8, height / 2);
    ctx.lineTo(x, height - 20);
    ctx.stroke();
  }

  // Center logo badge
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(width / 2 - 110, 30, 220, 68);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(width / 2 - 110, 30, 220, 68);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CORSAIR', width / 2, 58);

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 12px "SF Mono", monospace';
  ctx.fillText('VENGEANCE DDR5 6000MT/s', width / 2, 82);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
