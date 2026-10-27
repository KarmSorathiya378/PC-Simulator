import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import type { Slot } from '../types';

interface DropZoneProps {
  slot: Slot;
  isValidTarget: boolean;
  isOccupied: boolean;
  isHovered?: boolean;
  width?: number;
  height?: number;
}

export const DropZone: React.FC<DropZoneProps> = ({
  slot,
  isValidTarget,
  isOccupied,
  isHovered = false,
  width = 90,
  height = 50,
}) => {
  // If already occupied, don't show an intrusive dropzone placeholder
  if (isOccupied) {
    return null;
  }

  // Dynamic styling based on drop-target validity
  let strokeColor = '#3A475C';
  let fillColor = 'rgba(38, 47, 66, 0.4)';
  let dashArray = [6, 4];
  let textColor = '#64748B';

  if (isValidTarget) {
    if (isHovered) {
      strokeColor = '#31C5A1';
      fillColor = 'rgba(49, 197, 161, 0.25)';
      dashArray = [8, 4];
      textColor = '#31C5A1';
    } else {
      strokeColor = '#31C5A1';
      fillColor = 'rgba(49, 197, 161, 0.12)';
      dashArray = [6, 3];
      textColor = '#A7F3D0';
    }
  }

  return (
    <Group x={slot.position.x} y={slot.position.y}>
      {/* Outer border & slot zone */}
      <Rect
        width={width}
        height={height}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={isValidTarget ? 2 : 1}
        dash={dashArray}
        cornerRadius={4}
        shadowColor={isValidTarget ? '#31C5A1' : undefined}
        shadowBlur={isValidTarget ? 8 : 0}
        shadowOpacity={0.6}
      />

      {/* Target indicator corner accents when valid */}
      {isValidTarget && (
        <>
          <Rect x={-2} y={-2} width={6} height={6} fill="#31C5A1" cornerRadius={1} />
          <Rect x={width - 4} y={-2} width={6} height={6} fill="#31C5A1" cornerRadius={1} />
          <Rect x={-2} y={height - 4} width={6} height={6} fill="#31C5A1" cornerRadius={1} />
          <Rect x={width - 4} y={height - 4} width={6} height={6} fill="#31C5A1" cornerRadius={1} />
        </>
      )}

      {/* Slot label */}
      <Text
        text={slot.label}
        width={width}
        y={height / 2 - 6}
        align="center"
        fontSize={10}
        fontFamily="sans-serif"
        fontStyle={isValidTarget ? 'bold' : 'normal'}
        fill={textColor}
        listening={false}
      />
    </Group>
  );
};

export default DropZone;
