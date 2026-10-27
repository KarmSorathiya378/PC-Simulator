import React, { useState } from 'react';
import { Group, Rect, Circle, Line, Text } from 'react-konva';
import { requiredConnections } from '../data/buildConfig';
import { SOCKET_COORDINATES, CABLE_ORIGINS } from '../data/connectionConfig';
export { SOCKET_COORDINATES, CABLE_ORIGINS };

interface ConnectionLayerProps {
  activeConnections: { cableId: string; socketId: string }[];
  isPsuInstalled: boolean;
  isMbInstalled: boolean;
  isGpuInstalled: boolean;
  isInteractive?: boolean;
  onConnect?: (cableId: string, socketId: string) => void;
  onDisconnect?: (cableId: string) => void;
}

export const ConnectionLayer: React.FC<ConnectionLayerProps> = ({
  activeConnections,
  isPsuInstalled,
  isMbInstalled,
  isGpuInstalled,
  isInteractive = true,
  onConnect,
  onDisconnect,
}) => {
  const [selectedCable, setSelectedCable] = useState<string | null>(null);
  const [hoveredSocket, setHoveredSocket] = useState<string | null>(null);

  // Check if a cable is connected to any socket
  const getConnectedSocketId = (cableId: string) =>
    activeConnections.find((c) => c.cableId === cableId)?.socketId;

  const handleSocketClick = (socketId: string) => {
    if (!isInteractive) return;

    if (selectedCable) {
      // Find matching requirement
      const req = requiredConnections.find((r) => r.cableId === selectedCable);
      if (req && req.socketId === socketId) {
        onConnect?.(selectedCable, socketId);
        setSelectedCable(null);
      }
    }
  };

  return (
    <Group>
      {/* 1. Sockets on installed Motherboard and GPU */}
      {isMbInstalled && (
        <>
          {/* 24-Pin ATX Socket */}
          <Group
            x={SOCKET_COORDINATES['socket-mb-24pin'].x}
            y={SOCKET_COORDINATES['socket-mb-24pin'].y}
            onClick={() => handleSocketClick('socket-mb-24pin')}
            onMouseEnter={() => setHoveredSocket('socket-mb-24pin')}
            onMouseLeave={() => setHoveredSocket(null)}
          >
            <Rect
              width={14}
              height={48}
              fill="#0F172A"
              stroke={hoveredSocket === 'socket-mb-24pin' ? '#31C5A1' : '#64748B'}
              strokeWidth={1.5}
              cornerRadius={2}
              shadowColor="#31C5A1"
              shadowBlur={hoveredSocket === 'socket-mb-24pin' ? 6 : 0}
            />
            {/* Pin dots */}
            {[...Array(12)].map((_, i) => (
              <Circle key={i} x={7} y={4 + i * 3.6} radius={1.2} fill="#F59E0B" />
            ))}
          </Group>

          {/* 8-Pin CPU EPS Socket */}
          <Group
            x={SOCKET_COORDINATES['socket-cpu-8pin'].x}
            y={SOCKET_COORDINATES['socket-cpu-8pin'].y}
            onClick={() => handleSocketClick('socket-cpu-8pin')}
            onMouseEnter={() => setHoveredSocket('socket-cpu-8pin')}
            onMouseLeave={() => setHoveredSocket(null)}
          >
            <Rect
              width={26}
              height={12}
              fill="#0F172A"
              stroke={hoveredSocket === 'socket-cpu-8pin' ? '#31C5A1' : '#64748B'}
              strokeWidth={1.5}
              cornerRadius={2}
              shadowColor="#31C5A1"
              shadowBlur={hoveredSocket === 'socket-cpu-8pin' ? 6 : 0}
            />
            {[...Array(4)].map((_, i) => (
              <Circle key={i} x={4 + i * 6} y={6} radius={1.2} fill="#F59E0B" />
            ))}
          </Group>
        </>
      )}

      {/* GPU PCIe 8-Pin Socket */}
      {isGpuInstalled && (
        <Group
          x={SOCKET_COORDINATES['socket-gpu-pcie'].x}
          y={SOCKET_COORDINATES['socket-gpu-pcie'].y}
          onClick={() => handleSocketClick('socket-gpu-pcie')}
          onMouseEnter={() => setHoveredSocket('socket-gpu-pcie')}
          onMouseLeave={() => setHoveredSocket(null)}
        >
          <Rect
            width={24}
            height={12}
            fill="#0F172A"
            stroke={hoveredSocket === 'socket-gpu-pcie' ? '#31C5A1' : '#76B900'}
            strokeWidth={1.5}
            cornerRadius={2}
            shadowColor="#31C5A1"
            shadowBlur={hoveredSocket === 'socket-gpu-pcie' ? 6 : 0}
          />
          {[...Array(4)].map((_, i) => (
            <Circle key={i} x={3.5 + i * 5.6} y={6} radius={1.2} fill="#F59E0B" />
          ))}
        </Group>
      )}

      {/* 2. PSU Cable Terminals & Braided Lines */}
      {isPsuInstalled && (
        <>
          {requiredConnections.map((req) => {
            const origin = CABLE_ORIGINS[req.cableId];
            const targetSocketId = getConnectedSocketId(req.cableId);
            const targetSocket = targetSocketId ? SOCKET_COORDINATES[targetSocketId] : null;
            const isCableConnected = !!targetSocket;
            const isCableSelected = selectedCable === req.cableId;

            // Compute curved path points if connected
            let curvePoints: number[] = [];
            if (isCableConnected && targetSocket) {
              const startX = origin.x;
              const startY = origin.y;
              const endX = targetSocket.x + targetSocket.width / 2;
              const endY = targetSocket.y + targetSocket.height / 2;
              const midX = (startX + endX) / 2 + (targetSocket.socketId === 'socket-mb-24pin' ? 40 : -20);
              const midY = (startY + endY) / 2;
              curvePoints = [startX, startY, midX, midY, endX, endY];
            }

            return (
              <Group key={req.cableId}>
                {/* Drawn connected cable line */}
                {isCableConnected && curvePoints.length > 0 && (
                  <>
                    {/* Shadow / Depth line */}
                    <Line
                      points={curvePoints}
                      stroke="#0B0F17"
                      strokeWidth={8}
                      tension={0.4}
                      lineCap="round"
                      opacity={0.7}
                    />
                    {/* Primary Sleeved Cable */}
                    <Line
                      points={curvePoints}
                      stroke="#334155"
                      strokeWidth={5}
                      tension={0.4}
                      lineCap="round"
                    />
                    {/* Cable Braided Texture Tracer */}
                    <Line
                      points={curvePoints}
                      stroke="#31C5A1"
                      strokeWidth={1.5}
                      dash={[4, 4]}
                      tension={0.4}
                      lineCap="round"
                    />
                    {/* Connector Head at Target */}
                    <Rect
                      x={targetSocket!.x - 2}
                      y={targetSocket!.y - 2}
                      width={targetSocket!.width + 4}
                      height={targetSocket!.height + 4}
                      fill="#1E293B"
                      stroke="#31C5A1"
                      strokeWidth={1.5}
                      cornerRadius={2}
                    />
                  </>
                )}

                {/* PSU Terminal Output Plug */}
                <Group
                  x={origin.x}
                  y={origin.y}
                  onClick={() => {
                    if (!isInteractive) return;
                    if (isCableConnected) {
                      onDisconnect?.(req.cableId);
                    } else {
                      setSelectedCable(isCableSelected ? null : req.cableId);
                    }
                  }}
                >
                  <Circle
                    radius={7}
                    fill={isCableConnected ? '#31C5A1' : isCableSelected ? '#F59E0B' : '#475569'}
                    stroke="#1E293B"
                    strokeWidth={1.5}
                  />
                  <Text
                    x={12}
                    y={-4}
                    text={req.sourceLabel}
                    fontSize={8}
                    fill={isCableConnected ? '#31C5A1' : isCableSelected ? '#FBBF24' : '#94A3B8'}
                    fontStyle={isCableSelected ? 'bold' : 'normal'}
                  />
                </Group>
              </Group>
            );
          })}
        </>
      )}

      {/* Guide text when cable is selected */}
      {selectedCable && (
        <Group x={180} y={500}>
          <Rect width={240} height={22} fill="#1E293B" stroke="#F59E0B" strokeWidth={1} cornerRadius={4} />
          <Text
            x={10}
            y={6}
            text="Click matching socket to route cable"
            fontSize={10}
            fill="#FBBF24"
            fontStyle="bold"
          />
        </Group>
      )}
    </Group>
  );
};

export default ConnectionLayer;
