export interface Building {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  // Pixel positions on campus-map.png (1024x683)
  mapX: number;
  mapY: number;
  rooms: string[];
  description: string;
}

export interface WalkingEdge {
  time: number;
  safe: boolean;
}

export interface TimetableEntry {
  module: string;
  code: string;
  room: string;
  building: string;
  time: string;
  duration: number;
  enrolled: number;
  qrCode: string;
}

export const BUILDINGS: Record<string, Building> = {
  ritterman: {
    id: "ritterman",
    name: "Ritterman Building",
    code: "R",
    lat: 51.58845,
    lng: -0.22862,
    mapX: 500,
    mapY: 165,
    rooms: ["R110", "R209", "RG08"],
    description: "Computer Science labs, lecture rooms",
  },
  hatchcroft: {
    id: "hatchcroft",
    name: "Hatchcroft Building",
    code: "H",
    lat: 51.58798,
    lng: -0.22901,
    mapX: 248,
    mapY: 383,
    rooms: ["H101", "H201"],
    description: "Main lecture building, seminar rooms",
  },
  college: {
    id: "college",
    name: "College Building",
    code: "C",
    lat: 51.58761,
    lng: -0.22985,
    mapX: 362,
    mapY: 398,
    rooms: ["CG01", "C101"],
    description: "Administration, faculty offices",
  },
  grove: {
    id: "grove",
    name: "Grove Building",
    code: "G",
    lat: 51.58712,
    lng: -0.23021,
    mapX: 110,
    mapY: 258,
    rooms: ["G101"],
    description: "Art, Design and Media",
  },
  library: {
    id: "library",
    name: "Sheppard Library",
    code: "L",
    lat: 51.58780,
    lng: -0.22845,
    mapX: 475,
    mapY: 310,
    rooms: ["L01"],
    description: "24/7 study spaces, 3 floors",
  },
  mdxhouse: {
    id: "mdxhouse",
    name: "MDX House",
    code: "MDX",
    lat: 51.58901,
    lng: -0.22790,
    mapX: 380,
    mapY: 160,
    rooms: ["MDX01"],
    description: "Student Union, café, social spaces",
  },
  quad: {
    id: "quad",
    name: "Quad",
    code: "Q",
    lat: 51.58830,
    lng: -0.22920,
    mapX: 358,
    mapY: 448,
    rooms: [],
    description: "Central campus outdoor space",
  },
  fenella: {
    id: "fenella",
    name: "Fenella Building",
    code: "F",
    lat: 51.58870,
    lng: -0.23050,
    mapX: 248,
    mapY: 568,
    rooms: [],
    description: "Business School",
  },
  williams: {
    id: "williams",
    name: "Williams Building",
    code: "W",
    lat: 51.58750,
    lng: -0.22830,
    mapX: 540,
    mapY: 410,
    rooms: [],
    description: "Engineering and Science",
  },
  ravensfield: {
    id: "ravensfield",
    name: "Ravensfield",
    code: "RF",
    lat: 51.58820,
    lng: -0.23120,
    mapX: 168,
    mapY: 558,
    rooms: [],
    description: "Student accommodation",
  },
};

export const WALKING_GRAPH: Record<string, Record<string, WalkingEdge>> = {
  ritterman: {
    hatchcroft: { time: 2, safe: true },
    library: { time: 2, safe: true },
    mdxhouse: { time: 3, safe: true },
    quad: { time: 2, safe: true },
  },
  hatchcroft: {
    ritterman: { time: 2, safe: true },
    college: { time: 2, safe: true },
    library: { time: 3, safe: true },
    quad: { time: 1, safe: true },
    grove: { time: 4, safe: false },
  },
  college: {
    hatchcroft: { time: 2, safe: true },
    grove: { time: 2, safe: true },
    fenella: { time: 3, safe: true },
    quad: { time: 2, safe: true },
  },
  grove: {
    college: { time: 2, safe: true },
    hatchcroft: { time: 4, safe: false },
    fenella: { time: 2, safe: true },
    library: { time: 2, safe: true },
  },
  library: {
    ritterman: { time: 2, safe: true },
    hatchcroft: { time: 3, safe: true },
    grove: { time: 2, safe: true },
    mdxhouse: { time: 2, safe: true },
  },
  mdxhouse: {
    ritterman: { time: 3, safe: true },
    library: { time: 2, safe: true },
    quad: { time: 2, safe: true },
  },
  quad: {
    ritterman: { time: 2, safe: true },
    hatchcroft: { time: 1, safe: true },
    college: { time: 2, safe: true },
    mdxhouse: { time: 2, safe: true },
  },
  fenella: {
    college: { time: 3, safe: true },
    grove: { time: 2, safe: true },
  },
  williams: {
    library: { time: 2, safe: true },
    college: { time: 3, safe: true },
  },
};

export const DEMO_TIMETABLE: TimetableEntry[] = [
  {
    module: "Advanced Algorithms",
    code: "CST3170",
    room: "R110",
    building: "ritterman",
    time: "10:00",
    duration: 60,
    enrolled: 28,
    qrCode: "CHECKIN_R110_CST3170_20260303",
  },
  {
    module: "Web Technologies",
    code: "CST3340",
    room: "H101",
    building: "hatchcroft",
    time: "13:00",
    duration: 90,
    enrolled: 35,
    qrCode: "CHECKIN_H101_CST3340_20260303",
  },
  {
    module: "Software Engineering",
    code: "CST3180",
    room: "R209",
    building: "ritterman",
    time: "15:00",
    duration: 60,
    enrolled: 22,
    qrCode: "CHECKIN_R209_CST3180_20260303",
  },
];

export const ROOM_CAPACITIES: Record<string, { capacity: number; buildingName: string }> = {
  RG08: { capacity: 80, buildingName: "Ritterman Ground Floor" },
  R110: { capacity: 35, buildingName: "Ritterman Floor 1" },
  R209: { capacity: 35, buildingName: "Ritterman Floor 2" },
  H101: { capacity: 40, buildingName: "Hatchcroft Floor 1" },
  H201: { capacity: 40, buildingName: "Hatchcroft Floor 2" },
  CG01: { capacity: 60, buildingName: "College Building Ground" },
  C101: { capacity: 50, buildingName: "College Building Floor 1" },
  G101: { capacity: 45, buildingName: "Grove Building Floor 1" },
  L01: { capacity: 120, buildingName: "Sheppard Library Ground" },
  MDX01: { capacity: 30, buildingName: "MDX House Ground" },
};
