// Backend integration point: replace all exports with real-time WebSocket or REST API calls

export type ThreatLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type DroneStatus = 'ACTIVE' | 'TRACKING' | 'CLEARED' | 'LOST';
export type SensorStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE';

export interface DroneBlip {
  id: string;
  x: number; // percentage from center -50 to 50
  y: number; // percentage from center -50 to 50
  threatLevel: ThreatLevel;
  droneType: string;
  confidence: number;
  detectedAt: string;
  zone: string;
  bearing: number;
  distance: number; // meters
  status: DroneStatus;
}

export interface DetectionEvent {
  id: string;
  timestamp: string;
  droneType: string;
  manufacturer: string;
  threatLevel: ThreatLevel;
  zone: string;
  confidence: number;
  sensorsTriggered: number[];
  duration: number; // seconds
  status: DroneStatus;
  bearing: number;
  distance: number;
  signalStrength: number;
  actionTaken: string;
}

export interface SensorUnit {
  id: string;
  label: string;
  bearing: number; // degrees on platform
  status: SensorStatus;
  signalQuality: number; // 0-100
  lastPing: string;
  battery: number; // percentage
  sensitivity: number; // dB
  temperature: number; // celsius
  uptime: string;
  detectionCount: number;
}

export interface Alert {
  id: string;
  type: ThreatLevel;
  message: string;
  timestamp: string;
  droneId: string;
  zone: string;
  dismissed: boolean;
}

export const MOCK_DRONE_BLIPS: DroneBlip[] = [
  {
    id: 'drone-001',
    x: -28,
    y: -18,
    threatLevel: 'CRITICAL',
    droneType: 'DJI Matrice 300',
    confidence: 94,
    detectedAt: '2026-08-28T05:58:12Z',
    zone: 'Inner Exclusion',
    bearing: 312,
    distance: 87,
    status: 'ACTIVE',
  },
  {
    id: 'drone-002',
    x: 32,
    y: 14,
    threatLevel: 'HIGH',
    droneType: 'FPV Racing Quad',
    confidence: 81,
    detectedAt: '2026-08-28T06:01:44Z',
    zone: 'Middle Zone',
    bearing: 58,
    distance: 142,
    status: 'TRACKING',
  },
  {
    id: 'drone-003',
    x: -12,
    y: 38,
    threatLevel: 'MEDIUM',
    droneType: 'DJI Phantom 4',
    confidence: 76,
    detectedAt: '2026-08-28T05:52:30Z',
    zone: 'Outer Perimeter',
    bearing: 196,
    distance: 218,
    status: 'TRACKING',
  },
  {
    id: 'drone-004',
    x: 18,
    y: -40,
    threatLevel: 'LOW',
    droneType: 'Parrot Anafi',
    confidence: 68,
    detectedAt: '2026-08-28T05:44:18Z',
    zone: 'Outer Perimeter',
    bearing: 24,
    distance: 310,
    status: 'TRACKING',
  },
];

export const MOCK_DETECTION_EVENTS: DetectionEvent[] = [
  {
    id: 'evt-20260828-001',
    timestamp: '2026-08-28T05:58:12Z',
    droneType: 'DJI Matrice 300',
    manufacturer: 'DJI',
    threatLevel: 'CRITICAL',
    zone: 'Inner Exclusion',
    confidence: 94,
    sensorsTriggered: [1, 2, 3, 5],
    duration: 312,
    status: 'ACTIVE',
    bearing: 312,
    distance: 87,
    signalStrength: 91,
    actionTaken: 'Alert issued, camera tracking',
  },
  {
    id: 'evt-20260828-002',
    timestamp: '2026-08-28T06:01:44Z',
    droneType: 'FPV Racing Quad',
    manufacturer: 'Custom Build',
    threatLevel: 'HIGH',
    zone: 'Middle Zone',
    confidence: 81,
    sensorsTriggered: [4, 5, 6],
    duration: 88,
    status: 'TRACKING',
    bearing: 58,
    distance: 142,
    signalStrength: 74,
    actionTaken: 'Camera locked, monitoring',
  },
  {
    id: 'evt-20260828-003',
    timestamp: '2026-08-28T05:52:30Z',
    droneType: 'DJI Phantom 4',
    manufacturer: 'DJI',
    threatLevel: 'MEDIUM',
    zone: 'Outer Perimeter',
    confidence: 76,
    sensorsTriggered: [7, 8],
    duration: 640,
    status: 'TRACKING',
    bearing: 196,
    distance: 218,
    signalStrength: 58,
    actionTaken: 'Monitoring, no action',
  },
  {
    id: 'evt-20260828-004',
    timestamp: '2026-08-28T05:44:18Z',
    droneType: 'Parrot Anafi',
    manufacturer: 'Parrot',
    threatLevel: 'LOW',
    zone: 'Outer Perimeter',
    confidence: 68,
    sensorsTriggered: [3, 4],
    duration: 1140,
    status: 'TRACKING',
    bearing: 24,
    distance: 310,
    signalStrength: 43,
    actionTaken: 'Logged, no action',
  },
  {
    id: 'evt-20260828-005',
    timestamp: '2026-08-28T04:31:09Z',
    droneType: 'Autel EVO II',
    manufacturer: 'Autel Robotics',
    threatLevel: 'HIGH',
    zone: 'Middle Zone',
    confidence: 88,
    sensorsTriggered: [1, 2, 4, 5],
    duration: 420,
    status: 'CLEARED',
    bearing: 145,
    distance: 165,
    signalStrength: 82,
    actionTaken: 'Intercepted, cleared',
  },
  {
    id: 'evt-20260828-006',
    timestamp: '2026-08-28T03:14:55Z',
    droneType: 'DJI Mini 3 Pro',
    manufacturer: 'DJI',
    threatLevel: 'MEDIUM',
    zone: 'Middle Zone',
    confidence: 72,
    sensorsTriggered: [6, 7],
    duration: 290,
    status: 'CLEARED',
    bearing: 270,
    distance: 178,
    signalStrength: 61,
    actionTaken: 'Operator cleared, civilian',
  },
  {
    id: 'evt-20260828-007',
    timestamp: '2026-08-28T02:47:22Z',
    droneType: 'Skydio 2+',
    manufacturer: 'Skydio',
    threatLevel: 'LOW',
    zone: 'Outer Perimeter',
    confidence: 65,
    sensorsTriggered: [8, 1],
    duration: 185,
    status: 'CLEARED',
    bearing: 88,
    distance: 295,
    signalStrength: 38,
    actionTaken: 'Logged, cleared',
  },
  {
    id: 'evt-20260828-008',
    timestamp: '2026-08-28T01:22:41Z',
    droneType: 'Unknown Fixed-Wing',
    manufacturer: 'Unknown',
    threatLevel: 'CRITICAL',
    zone: 'Inner Exclusion',
    confidence: 71,
    sensorsTriggered: [2, 3, 4, 6, 7],
    duration: 55,
    status: 'LOST',
    bearing: 350,
    distance: 62,
    signalStrength: 95,
    actionTaken: 'Lost signal, incident filed',
  },
  {
    id: 'evt-20260828-009',
    timestamp: '2026-08-27T23:58:14Z',
    droneType: 'DJI Inspire 2',
    manufacturer: 'DJI',
    threatLevel: 'HIGH',
    zone: 'Inner Exclusion',
    confidence: 91,
    sensorsTriggered: [1, 3, 5, 7],
    duration: 730,
    status: 'CLEARED',
    bearing: 225,
    distance: 95,
    signalStrength: 88,
    actionTaken: 'Escorted off premises',
  },
  {
    id: 'evt-20260828-010',
    timestamp: '2026-08-27T22:11:03Z',
    droneType: 'Yuneec Typhoon H',
    manufacturer: 'Yuneec',
    threatLevel: 'MEDIUM',
    zone: 'Outer Perimeter',
    confidence: 79,
    sensorsTriggered: [5, 6],
    duration: 380,
    status: 'CLEARED',
    bearing: 130,
    distance: 240,
    signalStrength: 54,
    actionTaken: 'Monitored, departed',
  },
  {
    id: 'evt-20260828-011',
    timestamp: '2026-08-27T21:05:38Z',
    droneType: 'FPV Racing Quad',
    manufacturer: 'Custom Build',
    threatLevel: 'HIGH',
    zone: 'Middle Zone',
    confidence: 84,
    sensorsTriggered: [2, 4, 6],
    duration: 215,
    status: 'CLEARED',
    bearing: 47,
    distance: 155,
    signalStrength: 77,
    actionTaken: 'Camera tracked, cleared',
  },
  {
    id: 'evt-20260828-012',
    timestamp: '2026-08-27T19:44:20Z',
    droneType: 'DJI Phantom 4',
    manufacturer: 'DJI',
    threatLevel: 'LOW',
    zone: 'Outer Perimeter',
    confidence: 63,
    sensorsTriggered: [7],
    duration: 920,
    status: 'CLEARED',
    bearing: 315,
    distance: 330,
    signalStrength: 31,
    actionTaken: 'Logged, recreational flight',
  },
];

export const MOCK_SENSORS: SensorUnit[] = [
  {
    id: 'mic-001',
    label: 'MIC-01',
    bearing: 0,
    status: 'ONLINE',
    signalQuality: 94,
    lastPing: '2026-08-28T06:03:38Z',
    battery: 87,
    sensitivity: -42,
    temperature: 28,
    uptime: '14d 06h 22m',
    detectionCount: 34,
  },
  {
    id: 'mic-002',
    label: 'MIC-02',
    bearing: 45,
    status: 'ONLINE',
    signalQuality: 88,
    lastPing: '2026-08-28T06:03:39Z',
    battery: 91,
    sensitivity: -44,
    temperature: 27,
    uptime: '14d 06h 22m',
    detectionCount: 29,
  },
  {
    id: 'mic-003',
    label: 'MIC-03',
    bearing: 90,
    status: 'ONLINE',
    signalQuality: 91,
    lastPing: '2026-08-28T06:03:37Z',
    battery: 83,
    sensitivity: -41,
    temperature: 29,
    uptime: '14d 06h 22m',
    detectionCount: 41,
  },
  {
    id: 'mic-004',
    label: 'MIC-04',
    bearing: 135,
    status: 'DEGRADED',
    signalQuality: 52,
    lastPing: '2026-08-28T06:02:11Z',
    battery: 34,
    sensitivity: -51,
    temperature: 36,
    uptime: '14d 06h 22m',
    detectionCount: 18,
  },
  {
    id: 'mic-005',
    label: 'MIC-05',
    bearing: 180,
    status: 'ONLINE',
    signalQuality: 96,
    lastPing: '2026-08-28T06:03:40Z',
    battery: 78,
    sensitivity: -40,
    temperature: 27,
    uptime: '14d 06h 22m',
    detectionCount: 37,
  },
  {
    id: 'mic-006',
    label: 'MIC-06',
    bearing: 225,
    status: 'ONLINE',
    signalQuality: 85,
    lastPing: '2026-08-28T06:03:38Z',
    battery: 92,
    sensitivity: -43,
    temperature: 28,
    uptime: '14d 06h 22m',
    detectionCount: 26,
  },
  {
    id: 'mic-007',
    label: 'MIC-07',
    bearing: 270,
    status: 'OFFLINE',
    signalQuality: 0,
    lastPing: '2026-08-28T05:41:03Z',
    battery: 12,
    sensitivity: -60,
    temperature: 42,
    uptime: '0d 00h 00m',
    detectionCount: 0,
  },
  {
    id: 'mic-008',
    label: 'MIC-08',
    bearing: 315,
    status: 'ONLINE',
    signalQuality: 89,
    lastPing: '2026-08-28T06:03:39Z',
    battery: 76,
    sensitivity: -43,
    temperature: 28,
    uptime: '14d 06h 22m',
    detectionCount: 31,
  },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alert-001',
    type: 'CRITICAL',
    message: 'DJI Matrice 300 entered Inner Exclusion Zone — bearing 312° at 87m',
    timestamp: '2026-08-28T05:58:12Z',
    droneId: 'drone-001',
    zone: 'Inner Exclusion',
    dismissed: false,
  },
  {
    id: 'alert-002',
    type: 'HIGH',
    message: 'FPV Racing Quad detected — unregistered signal pattern, Middle Zone',
    timestamp: '2026-08-28T06:01:44Z',
    droneId: 'drone-002',
    zone: 'Middle Zone',
    dismissed: false,
  },
  {
    id: 'alert-003',
    type: 'MEDIUM',
    message: 'MIC-04 signal degraded — coverage gap at 135° bearing',
    timestamp: '2026-08-28T06:02:11Z',
    droneId: '',
    zone: 'System',
    dismissed: false,
  },
  {
    id: 'alert-004',
    type: 'CRITICAL',
    message: 'MIC-07 offline — sector 270° unmonitored',
    timestamp: '2026-08-28T05:41:03Z',
    droneId: '',
    zone: 'System',
    dismissed: false,
  },
];

export const MOCK_HOURLY_DETECTIONS = [
  { hour: '20:00', count: 1 },
  { hour: '21:00', count: 3 },
  { hour: '22:00', count: 0 },
  { hour: '23:00', count: 2 },
  { hour: '00:00', count: 1 },
  { hour: '01:00', count: 2 },
  { hour: '02:00', count: 1 },
  { hour: '03:00', count: 2 },
  { hour: '04:00', count: 1 },
  { hour: '05:00', count: 4 },
  { hour: '06:00', count: 3 },
];

export const MOCK_SIGNAL_HISTORY = [
  { t: '05:30', mic1: 88, mic2: 82, mic3: 90, mic5: 94 },
  { t: '05:40', mic1: 91, mic2: 85, mic3: 87, mic5: 96 },
  { t: '05:45', mic1: 86, mic2: 80, mic3: 91, mic5: 93 },
  { t: '05:50', mic1: 93, mic2: 88, mic3: 89, mic5: 97 },
  { t: '05:55', mic1: 94, mic2: 91, mic3: 92, mic5: 95 },
  { t: '06:00', mic1: 92, mic2: 87, mic3: 93, mic5: 96 },
  { t: '06:03', mic1: 94, mic2: 88, mic3: 91, mic5: 96 },
];