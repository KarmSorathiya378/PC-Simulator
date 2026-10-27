# 3D Hardware Model Assets

This directory houses 3D PC hardware assets for the PC Builder Lab simulator.

## Procedural Hardware Generation (Current Standard)

All primary hardware models (CPU, GPU, RAM, Motherboard, Power Supply Unit, 120mm Case Fans, and Sleeved Power Cables) are procedurally constructed in code under `src/three/parts/` using:
- **Three.js Geometries & PBR Materials** (`MeshStandardMaterial` with metalness/roughness tuning).
- **Procedural Canvas Textures** (`src/three/materials/proceduralTextures.ts`):
  - Circuit traces & silkscreen for Motherboard PCBs
  - Laser-etched brushed nickel Integrated Heat Spreader (IHS) markings for CPUs
  - Gold connector contact finger arrays for RAM and PCIe expansion
  - Hexagonal honeycomb ventilation mesh for PSU and case exhausts
  - High-frequency memory heatsink decals and markings

## External GLTF/GLB Asset Policy

When importing third-party `.glb` / `.gltf` assets:
1. Ensure files carry clear **CC0 (Public Domain)** or royalty-free commercial licenses with attribution.
2. Optimize polygon count (recommend < 50,000 tris per component).
3. Apply Draco or KTX2 compression where appropriate for low bandwidth consumption.
4. Keep original source license documentation in this directory.
