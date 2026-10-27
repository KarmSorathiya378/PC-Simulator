export interface SocketCoord {
  socketId: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CableOrigin {
  cableId: string;
  name: string;
  x: number;
  y: number;
}

// Well-defined layout positions for power sockets on installed hardware
export const SOCKET_COORDINATES: Record<string, SocketCoord> = {
  'socket-mb-24pin': {
    socketId: 'socket-mb-24pin',
    name: '24-Pin ATX Main Power Header',
    x: 375,
    y: 160,
    width: 14,
    height: 48,
  },
  'socket-cpu-8pin': {
    socketId: 'socket-cpu-8pin',
    name: '8-Pin EPS CPU 12V Power Header',
    x: 175,
    y: 84,
    width: 26,
    height: 12,
  },
  'socket-gpu-pcie': {
    socketId: 'socket-gpu-pcie',
    name: '8-Pin PCIe Graphics Power Port',
    x: 337,
    y: 272,
    width: 24,
    height: 12,
  },
};

// Cable origins from the PSU modular bay
export const CABLE_ORIGINS: Record<string, CableOrigin> = {
  'cable-24pin-atx': {
    cableId: 'cable-24pin-atx',
    name: '24-Pin ATX Cable',
    x: 180,
    y: 430,
  },
  'cable-8pin-eps': {
    cableId: 'cable-8pin-eps',
    name: '8-Pin CPU EPS Cable',
    x: 180,
    y: 450,
  },
  'cable-8pin-pcie': {
    cableId: 'cable-8pin-pcie',
    name: '8-Pin PCIe Cable',
    x: 180,
    y: 470,
  },
};
