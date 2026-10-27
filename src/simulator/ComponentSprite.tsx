import React from 'react';
import { Group, Rect, Circle, Line, Text } from 'react-konva';
import type { ComponentDefinition } from '../types';

interface ComponentSpriteProps {
  component: ComponentDefinition;
  x: number;
  y: number;
  isDraggable?: boolean;
  isSelected?: boolean;
  isHovered?: boolean;
  onDragStart?: (e: any) => void;
  onDragMove?: (e: any) => void;
  onDragEnd?: (e: any) => void;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ComponentSprite: React.FC<ComponentSpriteProps> = ({
  component,
  x,
  y,
  isDraggable = false,
  isSelected = false,
  onDragStart,
  onDragMove,
  onDragEnd,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { width, height } = component.visual;

  // Render specific detailed graphics per hardware category
  const renderHardwareVisual = () => {
    switch (component.category) {
      case 'case':
        return (
          <Group>
            {/* Outer Chassis */}
            <Rect
              width={width}
              height={height}
              fill="#181E29"
              stroke="#2E3B4E"
              strokeWidth={3}
              cornerRadius={8}
              shadowColor="#000000"
              shadowBlur={16}
              shadowOpacity={0.6}
            />
            {/* Front Panel Mesh Accent */}
            <Rect x={width - 24} y={10} width={14} height={height - 20} fill="#111620" cornerRadius={3} />
            {/* PSU Shroud Lower Chamber */}
            <Rect x={10} y={height - 110} width={width - 40} height={100} fill="#141923" stroke="#263143" strokeWidth={1} cornerRadius={4} />
            <Text x={20} y={height - 95} text="PSU / DRIVE CHAMBER" fontSize={9} fill="#4B5A72" fontFamily="sans-serif" fontStyle="bold" />
            {/* Motherboard Backplate Tray Area */}
            <Rect x={50} y={20} width={width - 90} height={height - 145} fill="#1C2432" stroke="#2A384C" strokeWidth={1} dash={[4, 4]} cornerRadius={4} />
            {/* Standoff Brass Pins */}
            {[
              { sx: 65, sy: 35 },
              { sx: 190, sy: 35 },
              { sx: 310, sy: 35 },
              { sx: 65, sy: 175 },
              { sx: 190, sy: 175 },
              { sx: 310, sy: 175 },
              { sx: 65, sy: 315 },
              { sx: 190, sy: 315 },
              { sx: 310, sy: 315 },
            ].map((p, idx) => (
              <Circle key={idx} x={p.sx} y={p.sy} radius={4} fill="#D97706" stroke="#92400E" strokeWidth={1} />
            ))}
            {/* Cable Pass-Through Rubber Grommets */}
            <Rect x={width - 70} y={60} width={16} height={70} fill="#0F131A" cornerRadius={8} />
            <Rect x={width - 70} y={180} width={16} height={90} fill="#0F131A" cornerRadius={8} />
          </Group>
        );

      case 'motherboard':
        return (
          <Group>
            {/* Main PCB Board */}
            <Rect
              width={width}
              height={height}
              fill="#222B38"
              stroke="#37475E"
              strokeWidth={2}
              cornerRadius={6}
            />
            {/* PCB Traces */}
            <Line points={[20, 20, 80, 20, 100, 40]} stroke="#2D3B4F" strokeWidth={1.5} />
            <Line points={[120, 280, 240, 280]} stroke="#2D3B4F" strokeWidth={1.5} />
            <Line points={[260, 40, 260, 110]} stroke="#2D3B4F" strokeWidth={1.5} />
            {/* Rear I/O Shield Heatsink */}
            <Rect x={4} y={15} width={42} height={110} fill="#161B24" stroke="#4B5E7D" strokeWidth={1} cornerRadius={2} />
            <Text x={8} y={65} text="MAG" fontSize={11} fill="#8DA2C0" fontStyle="bold" rotation={-90} />
            {/* VRM Top Heatsink */}
            <Rect x={52} y={12} width={120} height={32} fill="#19202C" stroke="#3A4B64" strokeWidth={1} cornerRadius={2} />
            {/* CPU Socket Housing Area */}
            <Rect x={75} y={55} width={90} height={90} fill="#141922" stroke="#475569" strokeWidth={1.5} cornerRadius={4} />
            <Rect x={85} y={65} width={70} height={70} fill="#2A3444" stroke="#64748B" strokeWidth={1} />
            <Text x={94} y={96} text="AM5 LGA" fontSize={10} fill="#94A3B8" fontStyle="bold" />
            {/* Socket Pin Array Grid Simulation */}
            <Circle x={145} y={75} radius={3} fill="#D97706" />
            {/* 4x DDR5 Memory Slots */}
            {[0, 1, 2, 3].map((slotIdx) => (
              <Group key={slotIdx} x={185 + slotIdx * 16} y={45}>
                <Rect width={10} height={125} fill="#131821" stroke="#334155" strokeWidth={1} cornerRadius={1} />
                <Rect x={1} y={2} width={8} height={8} fill="#475569" />
                <Rect x={1} y={115} width={8} height={8} fill="#475569" />
              </Group>
            ))}
            {/* M.2 NVMe Armored Slot with Heatsink */}
            <Rect x={68} y={155} width={105} height={26} fill="#181F2C" stroke="#3B82F6" strokeWidth={1} cornerRadius={2} />
            <Text x={78} y={163} text="LIGHTNING GEN 4 M.2" fontSize={7} fill="#60A5FA" fontStyle="bold" />
            {/* PCIe 4.0 x16 Primary Steel-Armor Slot */}
            <Rect x={25} y={192} width={180} height={16} fill="#161E29" stroke="#94A3B8" strokeWidth={1.5} cornerRadius={2} />
            <Rect x={30} y={197} width={170} height={6} fill="#090D14" />
            {/* Chipset Heatsink Block */}
            <Rect x={185} y={190} width={75} height={65} fill="#1A212E" stroke="#334155" strokeWidth={1} cornerRadius={4} />
            <Text x={198} y={222} text="B650" fontSize={13} fill="#64748B" fontStyle="bold" />
            {/* 24-Pin ATX Power Header */}
            <Rect x={255} y={80} width={12} height={50} fill="#E2E8F0" stroke="#475569" strokeWidth={1} cornerRadius={1} />
            {/* CPU 8-Pin Power Header (Top Left) */}
            <Rect x={55} y={4} width={28} height={10} fill="#E2E8F0" stroke="#475569" strokeWidth={1} cornerRadius={1} />
          </Group>
        );

      case 'cpu':
        return (
          <Group>
            {/* Greenish-Gold Substrate PCB */}
            <Rect width={width} height={height} fill="#0D5C3A" stroke="#059669" strokeWidth={1.5} cornerRadius={4} />
            {/* Nickel-Plated Copper Integrated Heat Spreader (IHS) */}
            <Rect x={8} y={8} width={width - 16} height={height - 16} fill="#94A3B8" stroke="#CBD5E1" strokeWidth={1.5} cornerRadius={6} />
            {/* AM5 Cutouts on IHS edges */}
            <Rect x={width / 2 - 8} y={5} width={16} height={6} fill="#0D5C3A" cornerRadius={1} />
            <Rect x={width / 2 - 8} y={height - 11} width={16} height={6} fill="#0D5C3A" cornerRadius={1} />
            {/* Triangle Alignment Indicator on Corner 1 */}
            <Line points={[2, 2, 10, 2, 2, 10]} closed fill="#F59E0B" />
            {/* Laser Engraved CPU Model Text */}
            <Text x={12} y={24} text="AMD Ryzen™" fontSize={8} fill="#1E293B" fontStyle="bold" />
            <Text x={12} y={35} text="7 7800X3D" fontSize={10} fill="#0F172A" fontStyle="bold" />
            <Text x={12} y={50} text="DIFFUSED IN TAIWAN" fontSize={5} fill="#475569" />
          </Group>
        );

      case 'cooler':
        return (
          <Group>
            {/* Dual Twin Tower Aluminum Fin Stack */}
            <Rect width={width} height={height} fill="#334155" stroke="#475569" strokeWidth={1.5} cornerRadius={4} />
            {/* Fin lines */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Line
                key={i}
                points={[6, 15 + i * 14, width - 6, 15 + i * 14]}
                stroke="#475569"
                strokeWidth={1}
              />
            ))}
            {/* Central 120mm PWM Fan Shroud */}
            <Circle x={width / 2} y={height / 2} radius={42} fill="#1E293B" stroke="#0F172A" strokeWidth={2} />
            <Circle x={width / 2} y={height / 2} radius={16} fill="#0F172A" stroke="#31C5A1" strokeWidth={1.5} />
            {/* Fan Blades */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
              <Line
                key={idx}
                points={[
                  width / 2,
                  height / 2,
                  width / 2 + Math.cos((angle * Math.PI) / 180) * 36,
                  height / 2 + Math.sin((angle * Math.PI) / 180) * 36,
                ]}
                stroke="#334155"
                strokeWidth={3}
                lineCap="round"
              />
            ))}
            {/* Center Hub Logo */}
            <Text x={width / 2 - 12} y={height / 2 - 4} text="PEERLESS" fontSize={5} fill="#94A3B8" fontStyle="bold" />
            {/* Copper Heatpipes Caps */}
            {[-25, -12, 12, 25].map((offset, idx) => (
              <Circle key={idx} x={width / 2 + offset} y={8} radius={3.5} fill="#EA580C" stroke="#C2410C" strokeWidth={1} />
            ))}
          </Group>
        );

      case 'ram':
        return (
          <Group>
            {/* Black Anodized Aluminum Heatspreader */}
            <Rect width={width} height={height} fill="#1E293B" stroke="#334155" strokeWidth={1} cornerRadius={3} />
            {/* Top RGB Light Bar Diffuser */}
            <Rect x={4} y={2} width={width - 8} height={5} fill="#38BDF8" cornerRadius={2} />
            {/* DDR5 High-Speed Geometric Grooves */}
            <Line points={[15, 14, 45, 14]} stroke="#475569" strokeWidth={1.5} />
            <Line points={[width - 45, 14, width - 15, 14]} stroke="#475569" strokeWidth={1.5} />
            {/* Center Spec Badge */}
            <Rect x={width / 2 - 28} y={10} width={56} height={14} fill="#0F172A" stroke="#334155" strokeWidth={0.5} cornerRadius={2} />
            <Text x={width / 2 - 24} y={14} text="VENGEANCE 6000" fontSize={6} fill="#F8FAFC" fontStyle="bold" />
            {/* Gold Bottom Contact Pins with Keying Notch */}
            <Rect x={2} y={height - 5} width={width / 2 - 8} height={5} fill="#F59E0B" />
            <Rect x={width / 2 + 8} y={height - 5} width={width / 2 - 10} height={5} fill="#F59E0B" />
            {/* DIMM Key Notch in center */}
            <Rect x={width / 2 - 8} y={height - 5} width={16} height={5} fill="#1E293B" />
          </Group>
        );

      case 'ssd':
        return (
          <Group>
            {/* M.2 Form Factor 2280 PCB */}
            <Rect width={width} height={height} fill="#0F172A" stroke="#1E293B" strokeWidth={1} cornerRadius={2} />
            {/* PCIe 4.0 NVMe Controller Chip */}
            <Rect x={10} y={4} width={14} height={14} fill="#1E293B" stroke="#475569" strokeWidth={0.5} />
            {/* NAND Flash Storage ICs */}
            <Rect x={30} y={4} width={16} height={14} fill="#1E293B" stroke="#334155" strokeWidth={0.5} />
            <Rect x={50} y={4} width={16} height={14} fill="#1E293B" stroke="#334155" strokeWidth={0.5} />
            {/* Product Label Sticker */}
            <Rect x={28} y={6} width={40} height={10} fill="#DC2626" cornerRadius={1} />
            <Text x={31} y={9} text="990 PRO 1TB" fontSize={5} fill="#FFFFFF" fontStyle="bold" />
            {/* Gold M.2 Connector Edge Pins (M-Key) */}
            <Rect x={2} y={2} width={5} height={height - 4} fill="#F59E0B" />
            {/* Rear Mounting Screw Half-Moon Notch */}
            <Circle x={width} y={height / 2} radius={3.5} fill="#171D2B" />
          </Group>
        );

      case 'gpu':
        return (
          <Group>
            {/* Massive 2.5 Slot Triple-Fan GPU Shroud */}
            <Rect width={width} height={height} fill="#1E2430" stroke="#38455B" strokeWidth={1.5} cornerRadius={6} />
            {/* Top Accent Bar with GEFORCE RTX Illuminated Branding */}
            <Rect x={10} y={8} width={width - 20} height={16} fill="#0D1117" stroke="#1F2937" strokeWidth={1} cornerRadius={2} />
            <Text x={18} y={13} text="GEFORCE RTX™ 4070 SUPER" fontSize={8} fill="#76B900" fontStyle="bold" />
            {/* 12VHPWR / PCIe 8-Pin Power Socket on top edge */}
            <Rect x={width - 55} y={2} width={24} height={7} fill="#F8FAFC" stroke="#000000" strokeWidth={1} />
            {/* Dual Torx Cooling Fans */}
            <Group x={55} y={62}>
              <Circle radius={34} fill="#111620" stroke="#2B3648" strokeWidth={1.5} />
              <Circle radius={10} fill="#1E293B" stroke="#76B900" strokeWidth={1} />
              <Line points={[-25, 0, 25, 0]} stroke="#334155" strokeWidth={2.5} />
              <Line points={[0, -25, 0, 25]} stroke="#334155" strokeWidth={2.5} />
            </Group>
            <Group x={155} y={62}>
              <Circle radius={34} fill="#111620" stroke="#2B3648" strokeWidth={1.5} />
              <Circle radius={10} fill="#1E293B" stroke="#76B900" strokeWidth={1} />
              <Line points={[-25, 0, 25, 0]} stroke="#334155" strokeWidth={2.5} />
              <Line points={[0, -25, 0, 25]} stroke="#334155" strokeWidth={2.5} />
            </Group>
            {/* PCIe x16 Gold Fingers at bottom edge */}
            <Rect x={20} y={height - 6} width={130} height={6} fill="#F59E0B" />
            {/* PCIe Retention Hook */}
            <Rect x={152} y={height - 7} width={8} height={7} fill="#334155" cornerRadius={1} />
            {/* Metal I/O Bracket on Left Side */}
            <Rect x={0} y={0} width={8} height={height} fill="#94A3B8" stroke="#64748B" strokeWidth={1} />
          </Group>
        );

      case 'psu':
        return (
          <Group>
            {/* ATX Form Factor Power Supply Unit Enclosure */}
            <Rect width={width} height={height} fill="#181D26" stroke="#2B3444" strokeWidth={2} cornerRadius={4} />
            {/* 120mm Intake Fan Grill with Honeycomb Cutouts */}
            <Circle x={width / 2 - 20} y={height / 2} radius={44} fill="#11151D" stroke="#2E394A" strokeWidth={1.5} />
            <Circle x={width / 2 - 20} y={height / 2} radius={32} stroke="#374356" strokeWidth={1} dash={[3, 3]} />
            <Circle x={width / 2 - 20} y={height / 2} radius={14} fill="#273242" />
            <Text x={width / 2 - 30} y={height / 2 - 4} text="RM750e" fontSize={6} fill="#F59E0B" fontStyle="bold" />
            {/* Modular Cable Output Terminal Bank (Right side) */}
            <Rect x={width - 38} y={15} width={30} height={height - 30} fill="#0C0F15" stroke="#1F2633" strokeWidth={1} cornerRadius={2} />
            {/* Individual Modular Sockets */}
            <Rect x={width - 32} y={22} width={20} height={10} fill="#334155" cornerRadius={1} />
            <Rect x={width - 32} y={38} width={20} height={10} fill="#334155" cornerRadius={1} />
            <Rect x={width - 32} y={54} width={20} height={14} fill="#475569" cornerRadius={1} />
            <Rect x={width - 32} y={74} width={20} height={18} fill="#475569" cornerRadius={1} />
            {/* 80 Plus Gold Efficiency Badge */}
            <Rect x={10} y={height - 25} width={38} height={15} fill="#D97706" cornerRadius={2} />
            <Text x={14} y={height - 21} text="80 PLUS" fontSize={5} fill="#FFFFFF" fontStyle="bold" />
            <Text x={17} y={height - 14} text="GOLD" fontSize={6} fill="#000000" fontStyle="bold" />
          </Group>
        );

      default:
        return (
          <Rect
            width={width}
            height={height}
            fill={component.visual.color}
            stroke="#475569"
            strokeWidth={1}
            cornerRadius={4}
          />
        );
    }
  };

  return (
    <Group
      x={x}
      y={y}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Selection Glow Outline */}
      {isSelected && (
        <Rect
          x={-4}
          y={-4}
          width={width + 8}
          height={height + 8}
          stroke="#31C5A1"
          strokeWidth={2}
          cornerRadius={6}
          shadowColor="#31C5A1"
          shadowBlur={10}
          shadowOpacity={0.8}
        />
      )}

      {renderHardwareVisual()}
    </Group>
  );
};

export default ComponentSprite;
