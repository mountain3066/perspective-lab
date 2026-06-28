// ==========================================
// 3D Vector Mathematics Utility
// Author: Rolland Luo (rolland.online@gmail.com)
// ==========================================
class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  sub(v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  scale(s) {
    return new Vector3(this.x * s, this.y * s, this.z * s);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v) {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const len = this.length();
    if (len < 1e-6) return new Vector3(0, 0, 0);
    return new Vector3(this.x / len, this.y / len, this.z / len);
  }
}

// ==========================================
// App State Definitions
// ==========================================
const camera = {
  yaw: 35,       // Rotation around Y-axis (degrees)
  pitch: 0,      // Tilt up/down (degrees)
  height: 0.6,   // Camera elevation Y (world units)
  distance: 10.0, // Horizontal radius from origin (world units)
  fov: 3.2,      // Drawing plane distance (focal length)
};

// Setup Camera (3D Setup View) State
let setupYaw = 0.6;   // Orbit yaw (radians)
let setupPitch = 0.3; // Orbit pitch (radians)
const setupDistance = 15.0;

// Configurable constants
const PP_HEIGHT = 0.65; // Drawing plane visual half-height (controls overall scale)

// ==========================================
// Localization & Translation Dictionary
// ==========================================
let currentLang = localStorage.getItem('perspective_lab_lang') || 'en';

const TRANSLATIONS = {
  en: {
    title: "Interactive Perspective Drawing Explainer",
    subtitle: "Interact with 3D space to understand how 1-point, 2-point, and 3-point perspective projection works.",
    setupBadge: "3D Setup",
    setupTitle: "Spatial Relationship View",
    setupDesc: "Rotate/drag to see the observer's eye, drawing plane, object, and projection rays.",
    setupHint: "Drag to orbit scene",
    perspBadge: "2D Canvas",
    perspTitle: "Perspective Drawing View",
    perspDesc: "The picture plane as drawn. Receding lines converge toward vanishing points.",
    controlsTitle: "Interactive Controls",
    labelChooseObject: "Choose Object",
    objectCube: "1. Cube",
    objectChair: "2. Armchair",
    objectHouse: "3. Simplified House",
    objectColumn: "4. Cylinder",
    objectPrism: "5. Prism",
    objectRailroad: "6. Railroad Track",
    objectStairs: "7. Staircase",
    labelPresets: "Perspective Presets",
    btn1pt: "1-Point",
    btn2pt: "2-Point",
    btn3pt: "3-Point",
    labelYaw: "Camera Rotation (Yaw)",
    labelPitch: "Camera Pitch",
    labelHeight: "Camera Height",
    labelDistance: "Camera Distance",
    labelFov: "Field of View / Zoom",
    togglesTitle: "Display Layer Toggles",
    lblHorizon: "Horizon Line",
    lblVanishing: "Vanishing Points",
    lblOrthogonals: "Receding Guides",
    lblRays: "3D Projection Rays",
    lblGround: "Ground Plane/Grid",
    lblLabels: "Text Annotations",
    lblCoords: "Show Coordinates",
    legHorizon: "Horizon Line (Eye Level)",
    legVanishing: "Vanishing Points (V1, V2, V3)",
    legOrthogonals: "Receding Orthogonals",
    legWireframe: "Visible Surfaces & Edges (Front)",
    legHidden: "Hidden Surfaces & Edges (Back)",
    legRays: "Sight Rays (3D view)",
    legCoords: "Vertex Coordinates (x, y)",
    footerText: "© 2026 DrawingPerspectiveLab. Interactive Geometry & Perspective Theory Explainer. Author: Rolland Luo (<a href=\"mailto:rolland.online@gmail.com\">rolland.online@gmail.com</a>)",

    explainer1ptBadge: "1-Point Perspective",
    explainer1ptTitle: "One-Point Perspective",
    explainer1ptText: "The camera is level (pitch = 0°) and aligned perpendicular to one set of faces of the cube (yaw = 0° or 90°). Only one vanishing point exists, located at the center of vision. Horizontal and vertical lines remain perfectly parallel to the drawing plane and never converge.",
    explainer2ptBadge: "2-Point Perspective",
    explainer2ptTitle: "Two-Point Perspective",
    explainer2ptText: "The camera is level (pitch = 0°) but rotated at an angle around the object (yaw is non-zero). Two vanishing points appear on the horizon line (representing depth and width lines converging). Vertical lines remain parallel and straight.",
    explainer3ptBadge: "3-Point Perspective",
    explainer3ptTitle: "Three-Point Perspective",
    explainer3ptText: "The camera is looking up or down (pitch is non-zero) and rotated around the object. All three sets of parallel lines (width, height, depth) are oblique to the picture plane, and each converges to a separate vanishing point (V1, V2, and a vertical V3).",

    canvasDrawingPlane: "Drawing Plane",
    canvasObserver: "Observer (Eye)",
    canvasHorizonLabel: "HORIZON (EYE LEVEL)",
    vpLabelX: "Vx (X-Axis)",
    vpLabelY: "Vy (Y-Axis)",
    vpLabelZ: "Vz (Z-Axis)",
    directionArrowX: "X direction ➔",
    directionArrowY: "Y direction ➔",
    directionArrowZ: "Z direction ➔"
  },
  zh: {
    title: "绘画透视互动解析工具 (DrawingPerspectiveLab)",
    subtitle: "通过在 3D 空间中进行交互，理解单点透视、两点透视及三点透视投影的原理。",
    setupBadge: "3D 空间设置",
    setupTitle: "空间关系视图",
    setupDesc: "旋转/拖拽以观察观察者眼睛、投影面（画面）、物体和视线投影射线。",
    setupHint: "拖拽以旋转场景",
    perspBadge: "2D 画面效果",
    perspTitle: "透视绘制视图",
    perspDesc: "实际绘制出的投影面画面。平行线向灭点收缩汇聚。",
    controlsTitle: "交互式控制面板",
    labelChooseObject: "选择物体",
    objectCube: "1. 立方体",
    objectChair: "2. 扶手椅",
    objectHouse: "3. 简易房屋",
    objectColumn: "4. 圆柱体",
    objectPrism: "5. 三棱柱",
    objectRailroad: "6. 铁轨",
    objectStairs: "7. 楼梯",
    labelPresets: "透视模式预设",
    btn1pt: "单点透视",
    btn2pt: "两点透视",
    btn3pt: "三点透视",
    labelYaw: "相机水平旋转 (Yaw)",
    labelPitch: "相机垂直俯仰 (Pitch)",
    labelHeight: "相机高度",
    labelDistance: "相机距离",
    labelFov: "镜头视场/缩放",
    togglesTitle: "显示图层开关",
    lblHorizon: "地平线",
    lblVanishing: "灭点",
    lblOrthogonals: "透视引导线",
    lblRays: "3D 视线投影",
    lblGround: "地面网格",
    lblLabels: "文字标注",
    lblCoords: "显示坐标",
    legHorizon: "地平线 (视平线)",
    legVanishing: "灭点 (Vx, Vy, Vz)",
    legOrthogonals: "透视收缩线",
    legWireframe: "可见表面与边缘 (正面)",
    legHidden: "隐藏表面与边缘 (背面)",
    legRays: "视线/射线 (3D 视图)",
    legCoords: "顶点坐标 (x, y)",
    footerText: "© 2026 DrawingPerspectiveLab. 交互式几何与绘画透视原理学习工具。作者: 山风在线 (<a href=\"mailto:rolland.online@gmail.com\">rolland.online@gmail.com</a>)",

    explainer1ptBadge: "单点透视",
    explainer1ptTitle: "单点透视（平行透视）",
    explainer1ptText: "相机处于水平状态（俯仰角为 0°），且视线垂直于立方体的一个面（偏航角为 0° 或 90°）。此时仅存在一个灭点，位于视中心。画面中的水平线和垂直线仍与投影面保持平行，永不相交。",
    explainer2ptBadge: "两点透视",
    explainer2ptTitle: "两点透视（成角透视）",
    explainer2ptText: "相机处于水平状态（俯仰角为 0°），但绕着物体旋转了角度（偏航角非 0°）。地平线上会出现两个灭点（分别代表物体的宽度方向和深度方向的线条汇聚）。画面中的垂直线依然保持平行竖直。",
    explainer3ptBadge: "三点透视",
    explainer3ptTitle: "三点透视（斜角透视）",
    explainer3ptText: "相机向上或向下倾斜（俯仰角非 0°），且绕着物体旋转。此时物体的三组平行线（宽度、高度、深度）均与投影面倾斜，各自收缩汇聚于独立的灭点（Vx、Vz 以及垂直方向的 Vy）。",

    canvasDrawingPlane: "投影面 (画面)",
    canvasObserver: "观察者 (视点)",
    canvasHorizonLabel: "地平线 (视平线)",
    vpLabelX: "Vx (X轴灭点)",
    vpLabelY: "Vy (Y轴灭点)",
    vpLabelZ: "Vz (Z轴灭点)",
    directionArrowX: "X 轴方向 ➔",
    directionArrowY: "Y 轴方向 ➔",
    directionArrowZ: "Z 轴方向 ➔"
  }
};

// DOM Elements
const setupCanvas = document.getElementById('setup-canvas');
const perspectiveCanvas = document.getElementById('perspective-canvas');
const setupCtx = setupCanvas.getContext('2d');
const perspectiveCtx = perspectiveCanvas.getContext('2d');

// Object wireframes and surfaces
const OBJECTS = {
  cube: {
    vertices: [
      new Vector3(-0.5, 0.0, -0.5), // 0: Bottom FL
      new Vector3(0.5, 0.0, -0.5),  // 1: Bottom FR
      new Vector3(0.5, 0.0, 0.5),   // 2: Bottom BR
      new Vector3(-0.5, 0.0, 0.5),  // 3: Bottom BL
      new Vector3(-0.5, 1.0, -0.5), // 4: Top FL
      new Vector3(0.5, 1.0, -0.5),  // 5: Top FR
      new Vector3(0.5, 1.0, 0.5),   // 6: Top BR
      new Vector3(-0.5, 1.0, 0.5),  // 7: Top BL
    ],
    edges: [
      { a: 0, b: 1, axis: 'x' }, { a: 3, b: 2, axis: 'x' }, // X-axis edges
      { a: 4, b: 5, axis: 'x' }, { a: 7, b: 6, axis: 'x' },
      { a: 0, b: 4, axis: 'y' }, { a: 1, b: 5, axis: 'y' }, // Y-axis edges
      { a: 2, b: 6, axis: 'y' }, { a: 3, b: 7, axis: 'y' },
      { a: 0, b: 3, axis: 'z' }, { a: 1, b: 2, axis: 'z' }, // Z-axis edges
      { a: 4, b: 7, axis: 'z' }, { a: 5, b: 6, axis: 'z' }
    ],
    faces: [
      [0, 4, 5, 1], // Front (Z = -0.75)
      [1, 5, 6, 2], // Right (X = 0.75)
      [2, 6, 7, 3], // Back (Z = 0.75)
      [3, 7, 4, 0], // Left (X = -0.75)
      [4, 7, 6, 5], // Top (Y = 1.5)
      [3, 0, 1, 2]  // Bottom (Y = 0.0)
    ]
  },
  chair: {
    vertices: [
      new Vector3(-0.75, 0.0, -0.75), // 0: FL foot
      new Vector3(0.75, 0.0, -0.75),  // 1: FR foot
      new Vector3(0.75, 0.0, 0.75),   // 2: BR foot
      new Vector3(-0.75, 0.0, 0.75),  // 3: BL foot

      new Vector3(-0.75, 0.7, -0.75), // 4: Seat FL
      new Vector3(0.75, 0.7, -0.75),  // 5: Seat FR
      new Vector3(0.75, 0.7, 0.75),   // 6: Seat BR
      new Vector3(-0.75, 0.7, 0.75),  // 7: Seat BL

      new Vector3(-0.75, 1.5, 0.75),  // 8: Backrest TL
      new Vector3(0.75, 1.5, 0.75),   // 9: Backrest TR

      new Vector3(-0.75, 1.0, -0.75), // 10: Armrest FL
      new Vector3(0.75, 1.0, -0.75),  // 11: Armrest FR
      new Vector3(-0.75, 1.0, 0.75),  // 12: Armrest BL (junction)
      new Vector3(0.75, 1.0, 0.75),   // 13: Armrest BR (junction)
    ],
    edges: [
      // Legs (Y)
      { a: 0, b: 4, axis: 'y' }, { a: 1, b: 5, axis: 'y' },
      { a: 2, b: 6, axis: 'y' }, { a: 3, b: 7, axis: 'y' },
      // Seat Cushion (X, Z)
      { a: 4, b: 5, axis: 'x' }, { a: 5, b: 6, axis: 'z' },
      { a: 6, b: 7, axis: 'x' }, { a: 7, b: 4, axis: 'z' },
      // Armrest Pillars (Y)
      { a: 4, b: 10, axis: 'y' }, { a: 5, b: 11, axis: 'y' },
      // Armrest rails (Z)
      { a: 10, b: 12, axis: 'z' }, { a: 11, b: 13, axis: 'z' },
      // Backrest frame (Y, X)
      { a: 7, b: 12, axis: 'y' }, { a: 6, b: 13, axis: 'y' },
      { a: 12, b: 8, axis: 'y' }, { a: 13, b: 9, axis: 'y' },
      { a: 8, b: 9, axis: 'x' },
      // Backrest middle bars (X)
      { a: 12, b: 13, axis: 'x' }
    ],
    faces: [
      [4, 7, 6, 5], // Seat Top
      [4, 5, 6, 7], // Seat Bottom (opposite normal)
      [7, 8, 9, 6], // Backrest Front
      [7, 6, 9, 8], // Backrest Back
      [4, 10, 12, 7], // Left Armrest Inner
      [4, 7, 12, 10], // Left Armrest Outer
      [5, 6, 13, 11], // Right Armrest Inner
      [5, 11, 13, 6], // Right Armrest Outer
      [12, 13, 9, 8], // Backrest upper plate Front
      [12, 8, 9, 13]  // Backrest upper plate Back
    ]
  },
  house: {
    vertices: [
      new Vector3(-0.75, 0.0, -0.75), // 0: Bottom FL
      new Vector3(0.75, 0.0, -0.75),  // 1: Bottom FR
      new Vector3(0.75, 0.0, 0.75),   // 2: Bottom BR
      new Vector3(-0.75, 0.0, 0.75),  // 3: Bottom BL
      new Vector3(-0.75, 1.0, -0.75), // 4: Top Wall FL
      new Vector3(0.75, 1.0, -0.75),  // 5: Top Wall FR
      new Vector3(0.75, 1.0, 0.75),   // 6: Top Wall BR
      new Vector3(-0.75, 1.0, 0.75),  // 7: Top Wall BL
      new Vector3(0.0, 1.6, -0.75),   // 8: Roof ridge Front
      new Vector3(0.0, 1.6, 0.75),    // 9: Roof ridge Back

      // Door (on Front Wall, Z = -0.75)
      new Vector3(-0.2, 0.0, -0.75),  // 10: Door Bottom-Left
      new Vector3(-0.2, 0.6, -0.75),  // 11: Door Top-Left
      new Vector3(0.2, 0.6, -0.75),   // 12: Door Top-Right
      new Vector3(0.2, 0.0, -0.75),   // 13: Door Bottom-Right

      // Window (on Right Wall, X = 0.75)
      new Vector3(0.75, 0.4, -0.3),   // 14: Window Bottom-Front
      new Vector3(0.75, 0.8, -0.3),   // 15: Window Top-Front
      new Vector3(0.75, 0.8, 0.3),    // 16: Window Top-Back
      new Vector3(0.75, 0.4, 0.3),    // 17: Window Bottom-Back
    ],
    edges: [
      // Base Box X
      { a: 0, b: 1, axis: 'x' }, { a: 3, b: 2, axis: 'x' },
      { a: 4, b: 5, axis: 'x' }, { a: 7, b: 6, axis: 'x' },
      // Base Box Y
      { a: 0, b: 4, axis: 'y' }, { a: 1, b: 5, axis: 'y' },
      { a: 2, b: 6, axis: 'y' }, { a: 3, b: 7, axis: 'y' },
      // Base Box Z
      { a: 0, b: 3, axis: 'z' }, { a: 1, b: 2, axis: 'z' },
      { a: 4, b: 7, axis: 'z' }, { a: 5, b: 6, axis: 'z' },
      // Roof Ridge (Z)
      { a: 8, b: 9, axis: 'z' },
      // Roof slope angles (other)
      { a: 4, b: 8, axis: 'other' }, { a: 5, b: 8, axis: 'other' },
      { a: 7, b: 9, axis: 'other' }, { a: 6, b: 9, axis: 'other' },

      // Door Edges
      { a: 10, b: 11, axis: 'y' }, // Door Left (Vertical Y)
      { a: 11, b: 12, axis: 'x' }, // Door Top (Horizontal X)
      { a: 12, b: 13, axis: 'y' }, // Door Right (Vertical Y)
      { a: 10, b: 13, axis: 'x' }, // Door Bottom (Horizontal X - on ground)

      // Window Edges
      { a: 14, b: 15, axis: 'y' }, // Window Front (Vertical Y)
      { a: 15, b: 16, axis: 'z' }, // Window Top (Horizontal Z)
      { a: 16, b: 17, axis: 'y' }, // Window Back (Vertical Y)
      { a: 17, b: 14, axis: 'z' }, // Window Bottom (Horizontal Z)
    ],
    faces: [
      [0, 4, 5, 1], // Front Wall
      [1, 5, 6, 2], // Right Wall
      [2, 6, 7, 3], // Back Wall
      [3, 7, 4, 0], // Left Wall
      [3, 0, 1, 2], // Floor
      [4, 8, 5],    // Front Gable
      [6, 9, 7],    // Back Gable
      [4, 7, 9, 8], // Left Roof slope
      [5, 8, 9, 6], // Right Roof slope

      // Door Face (drawn on top of Front Wall)
      [10, 11, 12, 13],

      // Window Face (drawn on top of Right Wall)
      [14, 15, 16, 17]
    ]
  },
  column: {
    vertices: (() => {
      const verts = [];
      const R = 0.75;
      const segments = 16;
      // Bottom circle
      for (let i = 0; i < segments; i++) {
        const theta = (i * 2 * Math.PI) / segments;
        verts.push(new Vector3(R * Math.sin(theta), 0.0, R * Math.cos(theta)));
      }
      // Top circle
      for (let i = 0; i < segments; i++) {
        const theta = (i * 2 * Math.PI) / segments;
        verts.push(new Vector3(R * Math.sin(theta), 1.0, R * Math.cos(theta)));
      }
      return verts;
    })(),
    edges: (() => {
      const eds = [];
      const segments = 16;
      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;
        // Bottom ring
        eds.push({ a: i, b: next, axis: 'other' });
        // Top ring
        eds.push({ a: i + segments, b: next + segments, axis: 'other' });
        // Vertical lines
        eds.push({ a: i, b: i + segments, axis: 'y' });
      }
      return eds;
    })(),
    faces: (() => {
      const fcs = [];
      const segments = 16;
      // Side faces (outward CCW winding)
      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;
        fcs.push([i, next, next + segments, i + segments]);
      }
      // Top face (CCW winding looking down at top)
      const topFace = [];
      for (let i = 0; i < segments; i++) {
        topFace.push(i + segments);
      }
      fcs.push(topFace);
      // Bottom face (CCW winding looking up from bottom)
      const bottomFace = [];
      for (let i = segments - 1; i >= 0; i--) {
        bottomFace.push(i);
      }
      fcs.push(bottomFace);
      return fcs;
    })()
  },
  triPrism: {
    vertices: (() => {
      const verts = [];
      // Manually define the base triangle coordinates so that the apex angle (at vertex 0/3) is obtuse
      const baseCoords = [
        new Vector3(0.0, 0.0, -0.25),  // Vertex 0: Apex brought closer to base center
        new Vector3(0.75, 0.0, -0.75), // Vertex 1: Bottom Right
        new Vector3(-0.75, 0.0, -0.75) // Vertex 2: Bottom Left
      ];
      // Bottom face
      for (let i = 0; i < 3; i++) {
        verts.push(baseCoords[i]);
      }
      // Top face
      for (let i = 0; i < 3; i++) {
        verts.push(new Vector3(baseCoords[i].x, 1.0, baseCoords[i].z));
      }
      return verts;
    })(),
    edges: (() => {
      const eds = [];
      const segments = 3;
      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;
        // Bottom ring
        eds.push({ a: i, b: next, axis: 'other' });
        // Top ring
        eds.push({ a: i + segments, b: next + segments, axis: 'other' });
        // Vertical lines
        eds.push({ a: i, b: i + segments, axis: 'y' });
      }
      return eds;
    })(),
    faces: (() => {
      const fcs = [];
      const segments = 3;
      // Side faces (outward CCW winding)
      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;
        fcs.push([i, next, next + segments, i + segments]);
      }
      // Top face (CCW winding looking down at top)
      const topFace = [];
      for (let i = 0; i < segments; i++) {
        topFace.push(i + segments);
      }
      fcs.push(topFace);
      // Bottom face (CCW winding looking up from bottom)
      const bottomFace = [];
      for (let i = segments - 1; i >= 0; i--) {
        bottomFace.push(i);
      }
      fcs.push(bottomFace);
      return fcs;
    })()
  },
  railroad: (() => {
    const verts = [];
    const eds = [];
    const fcs = [];

    // Helper function to add a box (cuboid)
    function addBox(xMin, xMax, yMin, yMax, zMin, zMax, zAxisTag = 'z') {
      const baseIndex = verts.length;
      verts.push(new Vector3(xMin, yMin, zMin)); // 0: Bottom FL
      verts.push(new Vector3(xMax, yMin, zMin)); // 1: Bottom FR
      verts.push(new Vector3(xMax, yMin, zMax)); // 2: Bottom BR
      verts.push(new Vector3(xMin, yMin, zMax)); // 3: Bottom BL
      verts.push(new Vector3(xMin, yMax, zMin)); // 4: Top FL
      verts.push(new Vector3(xMax, yMax, zMin)); // 5: Top FR
      verts.push(new Vector3(xMax, yMax, zMax)); // 6: Top BR
      verts.push(new Vector3(xMin, yMax, zMax)); // 7: Top BL

      // Edges
      const boxEdges = [
        { a: 0, b: 1, axis: 'x' }, { a: 3, b: 2, axis: 'x' },
        { a: 4, b: 5, axis: 'x' }, { a: 7, b: 6, axis: 'x' },
        { a: 0, b: 4, axis: 'y' }, { a: 1, b: 5, axis: 'y' },
        { a: 2, b: 6, axis: 'y' }, { a: 3, b: 7, axis: 'y' },
        { a: 0, b: 3, axis: zAxisTag }, { a: 1, b: 2, axis: zAxisTag },
        { a: 4, b: 7, axis: zAxisTag }, { a: 5, b: 6, axis: zAxisTag }
      ];
      boxEdges.forEach(e => {
        eds.push({ a: baseIndex + e.a, b: baseIndex + e.b, axis: e.axis });
      });

      // Faces (CCW winding looking from outside)
      const boxFaces = [
        [0, 4, 5, 1], // Front (Z min)
        [1, 5, 6, 2], // Right (X max)
        [2, 6, 7, 3], // Back (Z max)
        [3, 7, 4, 0], // Left (X min)
        [4, 7, 6, 5], // Top (Y max)
        [3, 0, 1, 2]  // Bottom (Y min)
      ];
      boxFaces.forEach(f => {
        fcs.push(f.map(idx => baseIndex + idx));
      });
    }

    // 1. Left Rail (X from -0.35 to -0.25, Y from 0.0 to 0.08, Z from -2.0 to 2.0)
    addBox(-0.35, -0.25, 0.0, 0.08, -2.0, 2.0, 'z');

    // 2. Right Rail (X from 0.25 to 0.35, Y from 0.0 to 0.08, Z from -2.0 to 2.0)
    addBox(0.25, 0.35, 0.0, 0.08, -2.0, 2.0, 'z');

    // 3. Wooden Ties (planks along Z from -1.8 to 1.8)
    const zPositions = [-1.8, -1.2, -0.6, 0.0, 0.6, 1.2, 1.8];
    zPositions.forEach(z => {
      addBox(-0.5, 0.5, 0.0, 0.04, z - 0.08, z + 0.08, 'z');
    });

    return { vertices: verts, edges: eds, faces: fcs };
  })(),
  stairs: (() => {
    const verts = [
      // Left side vertices (X = -0.75)
      new Vector3(-0.75, 0.0, -0.75), // 0
      new Vector3(-0.75, 0.2, -0.75), // 1
      new Vector3(-0.75, 0.2, -0.45), // 2
      new Vector3(-0.75, 0.4, -0.45), // 3
      new Vector3(-0.75, 0.4, -0.15), // 4
      new Vector3(-0.75, 0.6, -0.15), // 5
      new Vector3(-0.75, 0.6, 0.15),  // 6
      new Vector3(-0.75, 0.8, 0.15),  // 7
      new Vector3(-0.75, 0.8, 0.45),  // 8
      new Vector3(-0.75, 1.0, 0.45),  // 9
      new Vector3(-0.75, 1.0, 0.75),  // 10
      new Vector3(-0.75, 0.0, 0.75),  // 11

      // Right side vertices (X = 0.75)
      new Vector3(0.75, 0.0, -0.75), // 12
      new Vector3(0.75, 0.2, -0.75), // 13
      new Vector3(0.75, 0.2, -0.45), // 14
      new Vector3(0.75, 0.4, -0.45), // 15
      new Vector3(0.75, 0.4, -0.15), // 16
      new Vector3(0.75, 0.6, -0.15), // 17
      new Vector3(0.75, 0.6, 0.15),  // 18
      new Vector3(0.75, 0.8, 0.15),  // 19
      new Vector3(0.75, 0.8, 0.45),  // 20
      new Vector3(0.75, 1.0, 0.45),  // 21
      new Vector3(0.75, 1.0, 0.75),  // 22
      new Vector3(0.75, 0.0, 0.75),  // 23
    ];

    const eds = [];
    // 1. Horizontal cross edges (X-axis)
    for (let i = 0; i < 12; i++) {
      eds.push({ a: i, b: i + 12, axis: 'x' });
    }
    // 2. Left and Right profile edges
    const profileOffsets = [0, 12];
    profileOffsets.forEach(offset => {
      // Risers (vertical Y-axis)
      for (let i = 0; i < 5; i++) {
        eds.push({ a: offset + 2 * i, b: offset + 2 * i + 1, axis: 'y' });
      }
      // Treads (horizontal Z-axis)
      for (let i = 0; i < 5; i++) {
        eds.push({ a: offset + 2 * i + 1, b: offset + 2 * i + 2, axis: 'z' });
      }
      // Back wall vertical edge
      eds.push({ a: offset + 10, b: offset + 11, axis: 'y' });
      // Bottom horizontal edge
      eds.push({ a: offset + 11, b: offset, axis: 'z' });
    });

    const fcs = [];
    // 1. Risers (Z-min normals, facing front)
    for (let i = 0; i < 5; i++) {
      fcs.push([2 * i, 2 * i + 1, 12 + 2 * i + 1, 12 + 2 * i]);
    }
    // 2. Treads (Y-max normals, facing up)
    for (let i = 0; i < 5; i++) {
      fcs.push([2 * i + 1, 2 * i + 2, 12 + 2 * i + 2, 12 + 2 * i + 1]);
    }
    // 3. Back wall (Z-max normal, facing back)
    fcs.push([23, 22, 10, 11]);
    // 4. Bottom wall (Y-min normal, facing down)
    fcs.push([11, 0, 12, 23]);
    // 5. Left profile wall (X-min normal, facing left)
    fcs.push([11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    // 6. Right profile wall (X-max normal, facing right)
    fcs.push([12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);

    return { vertices: verts, edges: eds, faces: fcs };
  })()
}

let currentObjectKey = 'cube';

// Checkboxes and layers
const layers = {
  horizon: true,
  vanishing: true,
  orthogonals: true,
  rays: true,
  ground: true,
  labels: true,
  coords: false
};

// ==========================================
// Coordinate Space Calculations
// ==========================================

// Global main camera coordinate systems variables
let eye = new Vector3();
let R = new Vector3(); // Camera Right
let U = new Vector3(); // Camera Up
let N = new Vector3(); // Camera Look-at (Forward)

function updateCameraBasis() {
  const yawRad = camera.yaw * Math.PI / 180;
  const pitchRad = camera.pitch * Math.PI / 180;

  const cosYaw = Math.cos(yawRad);
  const sinYaw = Math.sin(yawRad);
  const cosPitch = Math.cos(pitchRad);
  const sinPitch = Math.sin(pitchRad);

  // Target Y is offset by the pitch orbit contribution, looking at ground level (relative to eye.y)
  const target = new Vector3(0, camera.height + camera.distance * sinPitch, 0);

  // Camera height eye.y is exactly camera.height
  eye = new Vector3(
    camera.distance * cosPitch * sinYaw,
    camera.height,
    camera.distance * cosPitch * cosYaw
  );

  // Gaze vector
  N = target.sub(eye).normalize();

  // Right vector (perpendicular to up vector [0, 1, 0] and look direction N)
  const upRef = new Vector3(0, 1, 0);
  R = N.cross(upRef).normalize();

  // Real camera up vector
  U = R.cross(N).normalize();
}

// Convert 3D world coordinate to Main Camera space
function toMainCameraSpace(pt) {
  const v = pt.sub(eye);
  return new Vector3(
    v.dot(R),
    v.dot(U),
    v.dot(N)
  );
}

// Project a point in main camera space to 2D Perspective View pixels
function projectMainCameraSpace(camPt, W, H) {
  const S = H / (2 * PP_HEIGHT); // Screen scaling factor based on picture plane height
  const xs = camera.fov * camPt.x / camPt.z;
  const ys = camera.fov * camPt.y / camPt.z;

  return {
    x: W / 2 + xs * S,
    y: H / 2 - ys * S,
    visible: camPt.z > 0.1
  };
}

// Project a full world coordinate directly to 2D Perspective View pixels
function projectPerspective(pt, W, H) {
  const camPt = toMainCameraSpace(pt);
  return projectMainCameraSpace(camPt, W, H);
}

// Project a infinite direction vector onto the drawing plane
function projectDirection(dir, W, H) {
  let dot = dir.dot(N);
  let d = dir;
  if (dot < 0) {
    d = dir.scale(-1);
    dot = -dot;
  }

  if (dot < 1e-4) {
    return { infinite: true };
  }

  const xc = d.dot(R);
  const yc = d.dot(U);
  const zc = d.dot(N);

  const xs = camera.fov * xc / zc;
  const ys = camera.fov * yc / zc;
  const S = H / (2 * PP_HEIGHT);

  return {
    infinite: false,
    x: W / 2 + xs * S,
    y: H / 2 - ys * S,
    dir: d
  };
}

// ==========================================
// Face Visibility & Projection Helpers
// ==========================================
function isFaceFrontFacing(vertices, face, eyePos) {
  if (face.length < 3) return false;
  const v0 = vertices[face[0]];
  const v1 = vertices[face[1]];
  const v2 = vertices[face[2]];

  const edge1 = v1.sub(v0);
  const edge2 = v2.sub(v0);
  const normal = edge1.cross(edge2).normalize();

  // Vector from eye to face
  const toFace = v0.sub(eyePos);

  return toFace.dot(normal) < 0;
}

function drawSetupFace(ctx, vertices, face, fillColor) {
  const W = setupCanvas.width;
  const H = setupCanvas.height;

  ctx.beginPath();
  let first = true;
  for (let i = 0; i < face.length; i++) {
    const s = projectSetup(vertices[face[i]], W, H);
    if (!s || !s.visible) return;
    if (first) {
      ctx.moveTo(s.x, s.y);
      first = false;
    } else {
      ctx.lineTo(s.x, s.y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
}

function drawSetupProjectedFace(ctx, vertices, face, fillColor) {
  const W = setupCanvas.width;
  const H = setupCanvas.height;

  ctx.beginPath();
  let first = true;
  for (let i = 0; i < face.length; i++) {
    const v = vertices[face[i]];
    const camV = toMainCameraSpace(v);
    if (camV.z <= 0.1) return;

    // Intersection with picture plane
    const I = eye.add(v.sub(eye).scale(camera.fov / camV.z));
    const s = projectSetup(I, W, H);
    if (!s || !s.visible) return;

    if (first) {
      ctx.moveTo(s.x, s.y);
      first = false;
    } else {
      ctx.lineTo(s.x, s.y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
}

function drawPerspectiveFace(ctx, vertices, face, fillColor) {
  const W = perspectiveCanvas.width;
  const H = perspectiveCanvas.height;

  ctx.beginPath();
  let first = true;
  for (let i = 0; i < face.length; i++) {
    const camPt = toMainCameraSpace(vertices[face[i]]);
    if (camPt.z <= 0.1) return;
    const s = projectMainCameraSpace(camPt, W, H);
    if (first) {
      ctx.moveTo(s.x, s.y);
      first = false;
    } else {
      ctx.lineTo(s.x, s.y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
}

// ==========================================
// 3D Setup View Camera & Math
// ==========================================

function projectSetup(pt, W, H) {
  // Orbit Setup camera
  const setupEye = new Vector3(
    setupDistance * Math.cos(setupPitch) * Math.sin(setupYaw),
    setupDistance * Math.sin(setupPitch) + 0.5,
    setupDistance * Math.cos(setupPitch) * Math.cos(setupYaw)
  );

  const setupTarget = new Vector3(0, 0.5, 0);
  const setupN = setupTarget.sub(setupEye).normalize();
  const setupR = setupN.cross(new Vector3(0, 1, 0)).normalize();
  const setupU = setupR.cross(setupN).normalize();

  const v = pt.sub(setupEye);
  const xc = v.dot(setupR);
  const yc = v.dot(setupU);
  const zc = v.dot(setupN);

  if (zc < 0.1) return null;

  const f_setup = 7.0;
  const S_setup = Math.min(W, H) / 2.0;

  const xs = f_setup * xc / zc;
  const ys = f_setup * yc / zc;

  return {
    x: W / 2 + xs * S_setup,
    y: H / 2 - ys * S_setup,
    visible: zc > 0.1
  };
}

// ==========================================
// Line Clipping & Drawing Helpers
// ==========================================

// Draw a world space line clipped to the camera front plane onto the perspective canvas
function drawClippedLine(ctx, p1, p2, color, width, dashed = false) {
  const pc1 = toMainCameraSpace(p1);
  const pc2 = toMainCameraSpace(p2);

  // Both behind focal plane, discard
  if (pc1.z <= 0.1 && pc2.z <= 0.1) return;

  let c1 = new Vector3(pc1.x, pc1.y, pc1.z);
  let c2 = new Vector3(pc2.x, pc2.y, pc2.z);

  // Clip to z = 0.1 plane
  if (c1.z < 0.1) {
    const t = (0.1 - c1.z) / (c2.z - c1.z);
    c1 = new Vector3(
      c1.x + t * (c2.x - c1.x),
      c1.y + t * (c2.y - c1.y),
      0.1
    );
  } else if (c2.z < 0.1) {
    const t = (0.1 - c2.z) / (c1.z - c2.z);
    c2 = new Vector3(
      c2.x + t * (c1.x - c2.x),
      c2.y + t * (c1.y - c2.y),
      0.1
    );
  }

  const W = perspectiveCanvas.width;
  const H = perspectiveCanvas.height;
  const s1 = projectMainCameraSpace(c1, W, H);
  const s2 = projectMainCameraSpace(c2, W, H);

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  if (dashed) ctx.setLineDash([4, 4]);
  else ctx.setLineDash([]);
  ctx.moveTo(s1.x, s1.y);
  ctx.lineTo(s2.x, s2.y);
  ctx.stroke();
  ctx.setLineDash([]); // Reset
}

// Draw a line on the Setup View canvas
function drawSetupLine(ctx, p1, p2, color, width, dashed = false) {
  const W = setupCanvas.width;
  const H = setupCanvas.height;
  const s1 = projectSetup(p1, W, H);
  const s2 = projectSetup(p2, W, H);

  if (!s1 || !s2 || !s1.visible || !s2.visible) return;

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  if (dashed) ctx.setLineDash([4, 4]);
  else ctx.setLineDash([]);
  ctx.moveTo(s1.x, s1.y);
  ctx.lineTo(s2.x, s2.y);
  ctx.stroke();
  ctx.setLineDash([]); // Reset
}

// ==========================================
// Setup View Drawing Loop
// ==========================================
function drawSetupScene() {
  const W = setupCanvas.width;
  const H = setupCanvas.height;

  setupCtx.clearRect(0, 0, W, H);

  // Background gradient
  const grad = setupCtx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, Math.max(W, H) / 1.5);
  grad.addColorStop(0, '#0f111a');
  grad.addColorStop(1, '#06070a');
  setupCtx.fillStyle = grad;
  setupCtx.fillRect(0, 0, W, H);

  // 1. Draw Grid on Ground Plane (Y = 0)
  if (layers.ground) {
    const gridColor = 'rgba(255, 217, 125, 0.12)';
    const centerColor = 'rgba(255, 217, 125, 0.4)';

    for (let x = -3; x <= 3; x += 0.5) {
      const isCenter = Math.abs(x) < 0.01;
      drawSetupLine(setupCtx, new Vector3(x, 0, -3), new Vector3(x, 0, 3), isCenter ? centerColor : gridColor, isCenter ? 1.5 : 1);
    }
    for (let z = -3; z <= 3; z += 0.5) {
      const isCenter = Math.abs(z) < 0.01;
      drawSetupLine(setupCtx, new Vector3(-3, 0, z), new Vector3(3, 0, z), isCenter ? centerColor : gridColor, isCenter ? 1.5 : 1);
    }
  }

  const obj = OBJECTS[currentObjectKey];

  // 2. Draw Object Sight Rays (from Observer Eye to Vertices)
  if (layers.rays) {
    obj.vertices.forEach(v => {
      drawSetupLine(setupCtx, eye, v, 'rgba(224, 170, 255, 0.35)', 1, true);
    });
  }

  // 3. Draw Camera Position Stand (Eye height reference)
  drawSetupLine(setupCtx, eye, new Vector3(eye.x, 0, eye.z), 'rgba(255, 255, 255, 0.2)', 1.5, true);
  drawSetupLine(setupCtx, new Vector3(eye.x, 0, eye.z), new Vector3(0, 0, 0), 'rgba(255, 255, 255, 0.15)', 1, true);

  // 4. Classify Edges based on main camera eye (used for picture plane projection and sight rays)
  const classifiedEdges = obj.edges.map(edge => {
    const edgeFaces = obj.faces ? obj.faces.filter(face => face.includes(edge.a) && face.includes(edge.b)) : [];
    let isVisible = true;
    if (edgeFaces.length > 0) {
      isVisible = edgeFaces.some(face => isFaceFrontFacing(obj.vertices, face, eye));
    }
    return { ...edge, isVisible };
  });

  // 4.1 Setup camera eye (used for orbiting Setup View occlusion)
  const setupEye = new Vector3(
    setupDistance * Math.cos(setupPitch) * Math.sin(setupYaw),
    setupDistance * Math.sin(setupPitch) + 0.5,
    setupDistance * Math.cos(setupPitch) * Math.cos(setupYaw)
  );

  const setupClassifiedEdges = obj.edges.map(edge => {
    const edgeFaces = obj.faces ? obj.faces.filter(face => face.includes(edge.a) && face.includes(edge.b)) : [];
    let isVisible = true;
    if (edgeFaces.length > 0) {
      isVisible = edgeFaces.some(face => isFaceFrontFacing(obj.vertices, face, setupEye));
    }
    return { ...edge, isVisible };
  });

  // 4a. Sort faces of 3D Object by depth relative to setupEye (furthest first)
  if (obj.faces) {
    const setupN = new Vector3(0, 0.5, 0).sub(setupEye).normalize();
    const sortedSetupFaces = obj.faces
      .map(face => {
        let sumDepth = 0;
        face.forEach(vIdx => {
          const v = obj.vertices[vIdx];
          const vRel = v.sub(setupEye);
          sumDepth += vRel.dot(setupN);
        });
        const avgDepth = sumDepth / face.length;
        const isFront = isFaceFrontFacing(obj.vertices, face, setupEye);
        return { face, avgDepth, isFront };
      })
      .sort((a, b) => b.avgDepth - a.avgDepth);

    sortedSetupFaces.forEach(({ face, isFront }) => {
      const color = isFront ? 'rgba(255, 255, 255, 0.09)' : 'rgba(165, 180, 252, 0.06)';
      drawSetupFace(setupCtx, obj.vertices, face, color);
    });
  }

  // 4c. Draw Hidden Edges of 3D Object (Dashed Light Indigo relative to Setup View camera)
  setupClassifiedEdges.forEach(edge => {
    if (!edge.isVisible) {
      const v1 = obj.vertices[edge.a];
      const v2 = obj.vertices[edge.b];
      drawSetupLine(setupCtx, v1, v2, 'rgba(165, 180, 252, 0.45)', 1.2, true);
    }
  });

  // 4d. Draw Visible Edges of 3D Object (Solid White relative to Setup View camera)
  setupClassifiedEdges.forEach(edge => {
    if (edge.isVisible) {
      const v1 = obj.vertices[edge.a];
      const v2 = obj.vertices[edge.b];
      drawSetupLine(setupCtx, v1, v2, 'rgba(255, 255, 255, 0.65)', 2);
    }
  });

  // 5. Draw Picture Plane (Drawing Board)
  const W_p = PP_HEIGHT * (perspectiveCanvas.width / perspectiveCanvas.height);
  const H_p = PP_HEIGHT;

  const Cp = eye.add(N.scale(camera.fov)); // Plane Center
  const C0 = Cp.sub(R.scale(W_p)).add(U.scale(H_p)); // Top-Left
  const C1 = Cp.add(R.scale(W_p)).add(U.scale(H_p)); // Top-Right
  const C2 = Cp.add(R.scale(W_p)).sub(U.scale(H_p)); // Bottom-Right
  const C3 = Cp.sub(R.scale(W_p)).sub(U.scale(H_p)); // Bottom-Left

  // Project corners
  const s0 = projectSetup(C0, W, H);
  const s1 = projectSetup(C1, W, H);
  const s2 = projectSetup(C2, W, H);
  const s3 = projectSetup(C3, W, H);

  if (s0 && s1 && s2 && s3 && s0.visible && s1.visible && s2.visible && s3.visible) {
    // Fill transparent quad
    setupCtx.beginPath();
    setupCtx.fillStyle = 'rgba(0, 210, 255, 0.06)';
    setupCtx.moveTo(s0.x, s0.y);
    setupCtx.lineTo(s1.x, s1.y);
    setupCtx.lineTo(s2.x, s2.y);
    setupCtx.lineTo(s3.x, s3.y);
    setupCtx.closePath();
    setupCtx.fill();

    // Draw boundary line
    setupCtx.beginPath();
    setupCtx.strokeStyle = 'rgba(0, 210, 255, 0.5)';
    setupCtx.lineWidth = 1.5;
    setupCtx.moveTo(s0.x, s0.y);
    setupCtx.lineTo(s1.x, s1.y);
    setupCtx.lineTo(s2.x, s2.y);
    setupCtx.lineTo(s3.x, s3.y);
    setupCtx.closePath();
    setupCtx.stroke();

    if (layers.labels) {
      setupCtx.fillStyle = 'rgba(0, 210, 255, 0.8)';
      setupCtx.font = '10px Space Grotesk';
      setupCtx.fillText(TRANSLATIONS[currentLang].canvasDrawingPlane, s0.x + 5, s0.y + 15);
    }
  }

  // 6. Draw Projected Drawing directly *on* the Picture Plane in 3D
  // 6a. Projected Back Faces on the Picture Plane
  if (obj.faces) {
    obj.faces.forEach(face => {
      if (!isFaceFrontFacing(obj.vertices, face, eye)) {
        drawSetupProjectedFace(setupCtx, obj.vertices, face, 'rgba(99, 102, 241, 0.07)');
      }
    });
  }

  // 6b. Projected Front Faces on the Picture Plane
  if (obj.faces) {
    obj.faces.forEach(face => {
      if (isFaceFrontFacing(obj.vertices, face, eye)) {
        drawSetupProjectedFace(setupCtx, obj.vertices, face, 'rgba(0, 255, 135, 0.20)');
      }
    });
  }

  // 6c. Projected Edges (Hidden then Visible) on the Picture Plane
  classifiedEdges.forEach(edge => {
    const v1 = obj.vertices[edge.a];
    const v2 = obj.vertices[edge.b];
    const camV1 = toMainCameraSpace(v1);
    const camV2 = toMainCameraSpace(v2);

    if (camV1.z > 0.1 && camV2.z > 0.1) {
      const I1 = eye.add(v1.sub(eye).scale(camera.fov / camV1.z));
      const I2 = eye.add(v2.sub(eye).scale(camera.fov / camV2.z));

      if (!edge.isVisible) {
        // Hidden edge projected (Dashed Indigo)
        drawSetupLine(setupCtx, I1, I2, 'rgba(99, 102, 241, 0.8)', 1.2, true);
      } else {
        // Visible edge projected (Solid Green)
        drawSetupLine(setupCtx, I1, I2, '#00ff87', 2);
      }
    }
  });

  // 7. Draw Observer Eye Node
  const sEye = projectSetup(eye, W, H);
  if (sEye && sEye.visible) {
    setupCtx.beginPath();
    setupCtx.arc(sEye.x, sEye.y, 6, 0, Math.PI * 2);
    setupCtx.fillStyle = '#ff5e62';
    setupCtx.shadowColor = '#ff5e62';
    setupCtx.shadowBlur = 8;
    setupCtx.fill();
    setupCtx.shadowBlur = 0; // Reset

    setupCtx.strokeStyle = '#fff';
    setupCtx.lineWidth = 1;
    setupCtx.stroke();

    if (layers.labels) {
      setupCtx.fillStyle = '#f8fafc';
      setupCtx.font = '11px Space Grotesk';
      setupCtx.fillText(TRANSLATIONS[currentLang].canvasObserver, sEye.x + 10, sEye.y - 5);
    }
  }
}

// ==========================================
// Perspective View Drawing Loop
// ==========================================
function drawPerspectiveScene() {
  const W = perspectiveCanvas.width;
  const H = perspectiveCanvas.height;

  perspectiveCtx.clearRect(0, 0, W, H);

  // Background
  perspectiveCtx.fillStyle = '#06070a';
  perspectiveCtx.fillRect(0, 0, W, H);

  const yawRad = camera.yaw * Math.PI / 180;
  const pitchRad = camera.pitch * Math.PI / 180;

  // 1. Calculate Horizon Line (using actual camera look-at vectors to ensure exact alignment)
  const y_horizon = -camera.fov * N.y / U.y;
  const S = H / (2 * PP_HEIGHT);
  const Y_horizon_pixel = H / 2 - y_horizon * S;

  if (layers.horizon) {
    perspectiveCtx.beginPath();
    perspectiveCtx.strokeStyle = '#00d2ff';
    perspectiveCtx.lineWidth = 1.5;
    perspectiveCtx.setLineDash([6, 4]);
    perspectiveCtx.moveTo(0, Y_horizon_pixel);
    perspectiveCtx.lineTo(W, Y_horizon_pixel);
    perspectiveCtx.stroke();
    perspectiveCtx.setLineDash([]); // Reset

    if (layers.labels) {
      perspectiveCtx.fillStyle = 'rgba(0, 210, 255, 0.9)';
      perspectiveCtx.font = '10px Space Grotesk';
      perspectiveCtx.fillText(TRANSLATIONS[currentLang].canvasHorizonLabel, 10, Y_horizon_pixel - 6);
    }
  }

  // Calculate dynamic Vanishing Points
  const vps = {
    x: projectDirection(new Vector3(1, 0, 0), W, H),
    y: projectDirection(new Vector3(0, 1, 0), W, H),
    z: projectDirection(new Vector3(0, 0, 1), W, H)
  };

  // 2. Draw Ground Plane Grid in Perspective
  if (layers.ground) {
    const gridColor = 'rgba(255, 217, 125, 0.08)';
    for (let x = -4; x <= 4; x += 1) {
      drawClippedLine(perspectiveCtx, new Vector3(x, 0, -4), new Vector3(x, 0, 4), gridColor, 1);
    }
    for (let z = -4; z <= 4; z += 1) {
      drawClippedLine(perspectiveCtx, new Vector3(-4, 0, z), new Vector3(4, 0, z), gridColor, 1);
    }
  }

  const obj = OBJECTS[currentObjectKey];

  // 3. Draw Receding Guidelines (Orthogonals)
  if (layers.orthogonals) {
    obj.edges.forEach(edge => {
      const v1 = obj.vertices[edge.a];
      const v2 = obj.vertices[edge.b];

      const s1 = projectPerspective(v1, W, H);
      const s2 = projectPerspective(v2, W, H);

      if (!s1.visible || !s2.visible) return;

      let vp = null;
      if (edge.axis === 'x') vp = vps.x;
      else if (edge.axis === 'y') vp = vps.y;
      else if (edge.axis === 'z') vp = vps.z;

      if (vp) {
        // Check if edge is visible relative to eye
        const edgeFaces = obj.faces ? obj.faces.filter(face => face.includes(edge.a) && face.includes(edge.b)) : [];
        let isVisible = true;
        if (edgeFaces.length > 0) {
          isVisible = edgeFaces.some(face => isFaceFrontFacing(obj.vertices, face, eye));
        }
        const alpha = isVisible ? '0.28' : '0.08';
        const infAlpha = isVisible ? '0.18' : '0.05';

        if (!vp.infinite) {
          // Draw thin dotted line to vanishing point
          perspectiveCtx.beginPath();
          perspectiveCtx.strokeStyle = `rgba(255, 159, 28, ${alpha})`;
          perspectiveCtx.lineWidth = 1;
          perspectiveCtx.setLineDash([3, 3]);
          perspectiveCtx.moveTo(s1.x, s1.y);
          perspectiveCtx.lineTo(vp.x, vp.y);
          perspectiveCtx.moveTo(s2.x, s2.y);
          perspectiveCtx.lineTo(vp.x, vp.y);
          perspectiveCtx.stroke();
        } else {
          // Drawing infinity lines (parallel guides)
          perspectiveCtx.beginPath();
          perspectiveCtx.strokeStyle = `rgba(255, 159, 28, ${infAlpha})`;
          perspectiveCtx.lineWidth = 1;
          perspectiveCtx.setLineDash([3, 3]);

          if (edge.axis === 'y') {
            // Draw straight vertical lines across the canvas
            perspectiveCtx.moveTo(s1.x, 0);
            perspectiveCtx.lineTo(s1.x, H);
            perspectiveCtx.moveTo(s2.x, 0);
            perspectiveCtx.lineTo(s2.x, H);
          } else if (edge.axis === 'x') {
            // Draw straight horizontal lines
            perspectiveCtx.moveTo(0, s1.y);
            perspectiveCtx.lineTo(W, s1.y);
            perspectiveCtx.moveTo(0, s2.y);
            perspectiveCtx.lineTo(W, s2.y);
          }
          perspectiveCtx.stroke();
        }
      }
    });
  }

  // 4. Draw Projected Object Surfaces and Edges
  const classifiedEdges = obj.edges.map(edge => {
    const edgeFaces = obj.faces ? obj.faces.filter(face => face.includes(edge.a) && face.includes(edge.b)) : [];
    let isVisible = true;
    if (edgeFaces.length > 0) {
      isVisible = edgeFaces.some(face => isFaceFrontFacing(obj.vertices, face, eye));
    }
    return { ...edge, isVisible };
  });

  // 4a. Sort faces by depth in camera space (furthest first)
  if (obj.faces) {
    const sortedFaces = obj.faces
      .map(face => {
        let sumZ = 0;
        face.forEach(vIdx => {
          const camPt = toMainCameraSpace(obj.vertices[vIdx]);
          sumZ += camPt.z;
        });
        const avgZ = sumZ / face.length;
        const isFront = isFaceFrontFacing(obj.vertices, face, eye);
        return { face, avgZ, isFront };
      })
      .sort((a, b) => b.avgZ - a.avgZ); // Sort descending (largest depth first)

    // Draw sorted faces
    sortedFaces.forEach(({ face, isFront }) => {
      const color = isFront ? 'rgba(0, 255, 135, 0.63)' : 'rgba(99, 102, 241, 1.0)';
      drawPerspectiveFace(perspectiveCtx, obj.vertices, face, color);
    });
  }

  // 4c. Draw Hidden Edges (Dashed Indigo)
  classifiedEdges.forEach(edge => {
    if (!edge.isVisible) {
      const v1 = obj.vertices[edge.a];
      const v2 = obj.vertices[edge.b];
      drawClippedLine(perspectiveCtx, v1, v2, 'rgba(99, 102, 241, 0.67)', 1.5, true);
    }
  });

  // 4d. Draw Visible Edges (Solid)
  classifiedEdges.forEach(edge => {
    if (edge.isVisible) {
      const v1 = obj.vertices[edge.a];
      const v2 = obj.vertices[edge.b];
      drawClippedLine(perspectiveCtx, v1, v2, '#00ff87', 2.5);
    }
  });

  // 5. Draw Vanishing Points (Circles and Labels)
  if (layers.vanishing) {
    const vpKeys = ['x', 'y', 'z'];
    const vpLabels = {
      x: TRANSLATIONS[currentLang].vpLabelX,
      y: TRANSLATIONS[currentLang].vpLabelY,
      z: TRANSLATIONS[currentLang].vpLabelZ
    };

    vpKeys.forEach(k => {
      const vp = vps[k];
      if (!vp.infinite) {
        const onScreen = vp.x >= 0 && vp.x <= W && vp.y >= 0 && vp.y <= H;

        if (onScreen) {
          // Draw standard visible VP node
          perspectiveCtx.beginPath();
          perspectiveCtx.arc(vp.x, vp.y, 5, 0, Math.PI * 2);
          perspectiveCtx.fillStyle = '#ff5e62';
          perspectiveCtx.shadowColor = '#ff5e62';
          perspectiveCtx.shadowBlur = 6;
          perspectiveCtx.fill();
          perspectiveCtx.shadowBlur = 0; // Reset

          perspectiveCtx.strokeStyle = '#fff';
          perspectiveCtx.lineWidth = 1;
          perspectiveCtx.stroke();

          if (layers.labels) {
            perspectiveCtx.fillStyle = '#fff';
            perspectiveCtx.font = '10px Space Grotesk';
            let labelText = vpLabels[k];
            if (layers.coords) {
              const rx = Math.round(vp.x - W / 2);
              const ry = Math.round(H / 2 - vp.y);
              labelText += ` (${rx}, ${ry})`;
            }
            perspectiveCtx.fillText(labelText, vp.x + 8, vp.y - 6);
          }
        } else {
          // VP is offscreen: find where the line from screen center to VP intersects screen boundaries
          const cx = W / 2;
          const cy = H / 2;
          const dx = vp.x - cx;
          const dy = vp.y - cy;

          let t = 1.0;

          if (dx > 0) { // Right edge
            t = Math.min(t, (W - 12 - cx) / dx);
          } else if (dx < 0) { // Left edge
            t = Math.min(t, (12 - cx) / dx);
          }

          if (dy > 0) { // Bottom edge
            t = Math.min(t, (H - 12 - cy) / dy);
          } else if (dy < 0) { // Top edge
            t = Math.min(t, (12 - cy) / dy);
          }

          // Compute border intersection coordinate
          const bx = cx + t * dx;
          const by = cy + t * dy;

          // Draw tiny arrow pointing offscreen towards VP
          perspectiveCtx.beginPath();
          perspectiveCtx.fillStyle = 'rgba(255, 94, 98, 0.85)';
          perspectiveCtx.arc(bx, by, 3.5, 0, Math.PI * 2);
          perspectiveCtx.fill();

          if (layers.labels) {
            perspectiveCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            perspectiveCtx.font = '9px Space Grotesk';

            // Align label text depending on which side it's pinned to
            let align = 'left';
            let offsetX = 8;
            if (bx > W - 60) { align = 'right'; offsetX = -8; }
            else if (bx < 60) { align = 'left'; offsetX = 8; }

            perspectiveCtx.textAlign = align;
            let labelStr = k === 'x' ? TRANSLATIONS[currentLang].directionArrowX :
              k === 'y' ? TRANSLATIONS[currentLang].directionArrowY :
                TRANSLATIONS[currentLang].directionArrowZ;
            if (layers.coords) {
              const rx = Math.round(vp.x - W / 2);
              const ry = Math.round(H / 2 - vp.y);
              labelStr = labelStr.replace('➔', `(${rx}, ${ry}) ➔`);
            }
            perspectiveCtx.fillText(labelStr, bx + offsetX, by + 3);
            perspectiveCtx.textAlign = 'left'; // Reset
          }
        }
      }
    });
  }

  // 6. Draw Coordinates overlay (center origin crosshair & vertex coordinates)
  if (layers.coords) {
    perspectiveCtx.fillStyle = '#f43f5e'; // Coordinates label color (Rose)
    perspectiveCtx.font = '9px Space Grotesk';
    
    // 6a. Render vertices coordinates
    obj.vertices.forEach((v, idx) => {
      const s = projectPerspective(v, W, H);
      if (s.visible) {
        const rx = Math.round(s.x - W / 2);
        const ry = Math.round(H / 2 - s.y);
        
        // Draw tiny dot at vertex
        perspectiveCtx.beginPath();
        perspectiveCtx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        perspectiveCtx.fill();
        
        // Draw text label: e.g. "v0 (-50, 120)"
        perspectiveCtx.fillText(`v${idx} (${rx}, ${ry})`, s.x + 6, s.y - 4);
      }
    });
    
    // 6b. Render Center of Canvas Origin O(0, 0)
    const cx = W / 2;
    const cy = H / 2;
    perspectiveCtx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
    perspectiveCtx.lineWidth = 1;
    
    // Draw crosshair
    perspectiveCtx.beginPath();
    perspectiveCtx.moveTo(cx - 6, cy);
    perspectiveCtx.lineTo(cx + 6, cy);
    perspectiveCtx.moveTo(cx, cy - 6);
    perspectiveCtx.lineTo(cx, cy + 6);
    perspectiveCtx.stroke();
    
    // Draw O (0,0) label
    perspectiveCtx.fillText('O (0, 0)', cx + 8, cy + 12);
  }
}

// Combined render call
function draw() {
  drawSetupScene();
  drawPerspectiveScene();
}

// ==========================================
// Explainer & Preset Management
// ==========================================

function updateExplainer() {
  const badge = document.getElementById('explainer-type-badge');
  const title = document.getElementById('explainer-title');
  const text = document.getElementById('explainer-text');

  // Criteria checks for alignment
  const isYawZero = Math.abs(camera.yaw % 90) < 1.5 || Math.abs(camera.yaw % 90 - 90) < 1.5 || Math.abs(camera.yaw % 90 + 90) < 1.5;
  const isPitchZero = Math.abs(camera.pitch) < 1.5;

  const dict = TRANSLATIONS[currentLang];

  if (isYawZero && isPitchZero) {
    badge.innerText = dict.explainer1ptBadge;
    badge.className = 'explainer-mode-badge';
    badge.style.background = '#6366f1'; // Indigo
    title.innerText = dict.explainer1ptTitle;
    text.innerText = dict.explainer1ptText;
  } else if (!isYawZero && isPitchZero) {
    badge.innerText = dict.explainer2ptBadge;
    badge.className = 'explainer-mode-badge';
    badge.style.background = '#00d2ff'; // Cyan
    title.innerText = dict.explainer2ptTitle;
    text.innerText = dict.explainer2ptText;
  } else {
    badge.innerText = dict.explainer3ptBadge;
    badge.className = 'explainer-mode-badge';
    badge.style.background = '#ff5e62'; // Pink
    title.innerText = dict.explainer3ptTitle;
    text.innerText = dict.explainer3ptText;
  }
}

function highlightPresetButtons() {
  const btn1 = document.getElementById('btn-1pt');
  const btn2 = document.getElementById('btn-2pt');
  const btn3 = document.getElementById('btn-3pt');

  btn1.classList.remove('active');
  btn2.classList.remove('active');
  btn3.classList.remove('active');

  const isYawZero = Math.abs(camera.yaw % 90) < 1.5 || Math.abs(camera.yaw % 90 - 90) < 1.5 || Math.abs(camera.yaw % 90 + 90) < 1.5;
  const isPitchZero = Math.abs(camera.pitch) < 1.5;

  if (isYawZero && isPitchZero) {
    btn1.classList.add('active');
  } else if (!isYawZero && isPitchZero) {
    btn2.classList.add('active');
  } else {
    btn3.classList.add('active');
  }
}

function applyPreset(mode) {
  if (mode === '1pt') {
    camera.yaw = 0;
    camera.pitch = 0;
    camera.height = 0.6;
    camera.distance = 10.0;
    camera.fov = 3.2;
  } else if (mode === '2pt') {
    camera.yaw = 35;
    camera.pitch = 0;
    camera.height = 0.6;
    camera.distance = 10.0;
    camera.fov = 3.2;
  } else if (mode === '3pt') {
    camera.yaw = 35;
    camera.pitch = -22;
    camera.height = 2.8;
    camera.distance = 10.0;
    camera.fov = 3.2;
  }

  updateUI();
  updateCameraBasis();
  updateExplainer();
  highlightPresetButtons();
  draw();
}

function updateUI() {
  document.getElementById('slider-yaw').value = Math.round(camera.yaw);
  document.getElementById('val-yaw').innerText = `${Math.round(camera.yaw)}°`;

  document.getElementById('slider-pitch').value = Math.round(camera.pitch);
  document.getElementById('val-pitch').innerText = `${Math.round(camera.pitch)}°`;

  document.getElementById('slider-height').value = camera.height.toFixed(1);
  document.getElementById('val-height').innerText = camera.height.toFixed(1);

  document.getElementById('slider-distance').value = camera.distance.toFixed(1);
  document.getElementById('val-distance').innerText = camera.distance.toFixed(1);

  document.getElementById('slider-fov').value = camera.fov.toFixed(1);
  document.getElementById('val-fov').innerText = camera.fov.toFixed(1);
}

// ==========================================
// Interaction Event Listeners
// ==========================================

function initEvents() {
  // Sliders binding
  document.getElementById('slider-yaw').addEventListener('input', (e) => {
    camera.yaw = parseFloat(e.target.value);
    document.getElementById('val-yaw').innerText = `${Math.round(camera.yaw)}°`;
    updateCameraBasis();
    updateExplainer();
    highlightPresetButtons();
    draw();
  });

  document.getElementById('slider-pitch').addEventListener('input', (e) => {
    camera.pitch = parseFloat(e.target.value);
    document.getElementById('val-pitch').innerText = `${Math.round(camera.pitch)}°`;
    updateCameraBasis();
    updateExplainer();
    highlightPresetButtons();
    draw();
  });

  document.getElementById('slider-height').addEventListener('input', (e) => {
    camera.height = parseFloat(e.target.value);
    document.getElementById('val-height').innerText = camera.height.toFixed(1);
    updateCameraBasis();
    draw();
  });

  document.getElementById('slider-distance').addEventListener('input', (e) => {
    camera.distance = parseFloat(e.target.value);
    document.getElementById('val-distance').innerText = camera.distance.toFixed(1);
    updateCameraBasis();
    draw();
  });

  document.getElementById('slider-fov').addEventListener('input', (e) => {
    camera.fov = parseFloat(e.target.value);
    document.getElementById('val-fov').innerText = camera.fov.toFixed(1);
    draw();
  });

  // Toggles binding
  const toggleMap = {
    'chk-horizon': 'horizon',
    'chk-vanishing': 'vanishing',
    'chk-orthogonals': 'orthogonals',
    'chk-rays': 'rays',
    'chk-ground': 'ground',
    'chk-labels': 'labels',
    'chk-coords': 'coords'
  };

  Object.keys(toggleMap).forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      layers[toggleMap[id]] = e.target.checked;
      draw();
    });
  });

  // Object selector
  document.getElementById('object-select').addEventListener('change', (e) => {
    currentObjectKey = e.target.value;
    draw();
  });

  // Preset buttons
  document.getElementById('btn-1pt').addEventListener('click', () => applyPreset('1pt'));
  document.getElementById('btn-2pt').addEventListener('click', () => applyPreset('2pt'));
  document.getElementById('btn-3pt').addEventListener('click', () => applyPreset('3pt'));

  // Language switcher buttons
  document.getElementById('btn-lang-en').addEventListener('click', () => switchLanguage('en'));
  document.getElementById('btn-lang-zh').addEventListener('click', () => switchLanguage('zh'));

  // Window Resize
  window.addEventListener('resize', handleResize);

  // Mouse Drag Setup Canvas (Orbit setup camera view)
  let isDraggingSetup = false;
  let prevMousePos = { x: 0, y: 0 };

  setupCanvas.addEventListener('mousedown', (e) => {
    isDraggingSetup = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mousemove', (e) => {
    if (isDraggingSetup) {
      const dx = e.clientX - prevMousePos.x;
      const dy = e.clientY - prevMousePos.y;

      setupYaw -= dx * 0.007;
      setupPitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, setupPitch + dy * 0.007));

      prevMousePos = { x: e.clientX, y: e.clientY };
      draw();
    }
  });

  window.addEventListener('mouseup', () => {
    isDraggingSetup = false;
  });

  // Touch Support Setup Canvas
  setupCanvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDraggingSetup = true;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  setupCanvas.addEventListener('touchmove', (e) => {
    if (isDraggingSetup && e.touches.length === 1) {
      const dx = e.touches[0].clientX - prevMousePos.x;
      const dy = e.touches[0].clientY - prevMousePos.y;

      setupYaw -= dx * 0.008;
      setupPitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, setupPitch + dy * 0.008));

      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      draw();
    }
  });

  setupCanvas.addEventListener('touchend', () => {
    isDraggingSetup = false;
  });

  // Mouse Drag Perspective Canvas (Rotates Observer Eye)
  let isDraggingPersp = false;
  let prevPerspMouse = { x: 0, y: 0 };

  perspectiveCanvas.addEventListener('mousedown', (e) => {
    isDraggingPersp = true;
    prevPerspMouse = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mousemove', (e) => {
    if (isDraggingPersp) {
      const dx = e.clientX - prevPerspMouse.x;
      const dy = e.clientY - prevPerspMouse.y;

      camera.yaw += dx * 0.35;
      if (camera.yaw > 180) camera.yaw -= 360;
      if (camera.yaw < -180) camera.yaw += 360;

      camera.pitch = Math.max(-85, Math.min(85, camera.pitch - dy * 0.35));

      prevPerspMouse = { x: e.clientX, y: e.clientY };

      updateUI();
      updateCameraBasis();
      updateExplainer();
      highlightPresetButtons();
      draw();
    }
  });

  window.addEventListener('mouseup', () => {
    isDraggingPersp = false;
  });

  // Touch Support Perspective Canvas
  perspectiveCanvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDraggingPersp = true;
      prevPerspMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  perspectiveCanvas.addEventListener('touchmove', (e) => {
    if (isDraggingPersp && e.touches.length === 1) {
      const dx = e.touches[0].clientX - prevPerspMouse.x;
      const dy = e.touches[0].clientY - prevPerspMouse.y;

      camera.yaw += dx * 0.35;
      if (camera.yaw > 180) camera.yaw -= 360;
      if (camera.yaw < -180) camera.yaw += 360;

      camera.pitch = Math.max(-85, Math.min(85, camera.pitch - dy * 0.35));

      prevPerspMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      updateUI();
      updateCameraBasis();
      updateExplainer();
      highlightPresetButtons();
      draw();
    }
  });

  perspectiveCanvas.addEventListener('touchend', () => {
    isDraggingPersp = false;
  });
}

function handleResize() {
  const dpr = window.devicePixelRatio || 1;

  // Set setup canvas dimensions
  const setupRect = setupCanvas.parentElement.getBoundingClientRect();
  setupCanvas.width = setupRect.width * dpr;
  setupCanvas.height = setupRect.height * dpr;
  setupCanvas.style.width = `${setupRect.width}px`;
  setupCanvas.style.height = `${setupRect.height}px`;

  // Set perspective canvas dimensions
  const perspectiveRect = perspectiveCanvas.parentElement.getBoundingClientRect();
  perspectiveCanvas.width = perspectiveRect.width * dpr;
  perspectiveCanvas.height = perspectiveRect.height * dpr;
  perspectiveCanvas.style.width = `${perspectiveRect.width}px`;
  perspectiveCanvas.style.height = `${perspectiveRect.height}px`;

  draw();
}

// ==========================================
// Language Switcher Logic
// ==========================================
function switchLanguage(lang) {
  if (lang !== 'en' && lang !== 'zh') lang = 'en';
  currentLang = lang;
  localStorage.setItem('perspective_lab_lang', lang);

  // Update document language attribute
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  // Update button active state
  const btnEn = document.getElementById('btn-lang-en');
  const btnZh = document.getElementById('btn-lang-zh');
  if (btnEn && btnZh) {
    if (lang === 'en') {
      btnEn.classList.add('active');
      btnZh.classList.remove('active');
    } else {
      btnEn.classList.remove('active');
      btnZh.classList.add('active');
    }
  }

  const dict = TRANSLATIONS[lang];

  // Update document title
  document.title = dict.title;

  // Update HTML elements text content
  document.getElementById('header-subtitle').innerText = dict.subtitle;
  document.getElementById('setup-badge').innerText = dict.setupBadge;
  document.getElementById('setup-title').innerText = dict.setupTitle;
  document.getElementById('setup-desc').innerText = dict.setupDesc;
  document.getElementById('setup-hint').innerText = dict.setupHint;

  document.getElementById('persp-badge').innerText = dict.perspBadge;
  document.getElementById('persp-title').innerText = dict.perspTitle;
  document.getElementById('persp-desc').innerText = dict.perspDesc;

  document.getElementById('controls-title').innerText = dict.controlsTitle;
  document.getElementById('label-object-select').innerText = dict.labelChooseObject;

  // Update object selection options text content
  const select = document.getElementById('object-select');
  if (select) {
    const optionKeys = ['cube', 'chair', 'house', 'column', 'triPrism', 'railroad', 'stairs'];
    const dictOptionKeys = ['objectCube', 'objectChair', 'objectHouse', 'objectColumn', 'objectPrism', 'objectRailroad', 'objectStairs'];
    for (let i = 0; i < optionKeys.length; i++) {
      const opt = select.querySelector(`option[value="${optionKeys[i]}"]`);
      if (opt) {
        opt.innerText = dict[dictOptionKeys[i]];
      }
    }
  }

  document.getElementById('label-presets').innerText = dict.labelPresets;
  document.getElementById('btn-1pt').innerText = dict.btn1pt;
  document.getElementById('btn-2pt').innerText = dict.btn2pt;
  document.getElementById('btn-3pt').innerText = dict.btn3pt;

  document.getElementById('label-yaw').innerText = dict.labelYaw;
  document.getElementById('label-pitch').innerText = dict.labelPitch;
  document.getElementById('label-height').innerText = dict.labelHeight;
  document.getElementById('label-distance').innerText = dict.labelDistance;
  document.getElementById('label-fov').innerText = dict.labelFov;

  document.getElementById('toggles-title').innerText = dict.togglesTitle;
  document.getElementById('lbl-horizon').innerText = dict.lblHorizon;
  document.getElementById('lbl-vanishing').innerText = dict.lblVanishing;
  document.getElementById('lbl-orthogonals').innerText = dict.lblOrthogonals;
  document.getElementById('lbl-rays').innerText = dict.lblRays;
  document.getElementById('lbl-ground').innerText = dict.lblGround;
  document.getElementById('lbl-labels').innerText = dict.lblLabels;
  document.getElementById('lbl-coords').innerText = dict.lblCoords;

  document.getElementById('leg-horizon').innerText = dict.legHorizon;
  document.getElementById('leg-vanishing').innerText = dict.legVanishing;
  document.getElementById('leg-orthogonals').innerText = dict.legOrthogonals;
  document.getElementById('leg-wireframe').innerText = dict.legWireframe;
  document.getElementById('leg-hidden').innerText = dict.legHidden;
  document.getElementById('leg-rays').innerText = dict.legRays;
  document.getElementById('leg-coords').innerText = dict.legCoords;

  document.getElementById('footer-text').innerHTML = dict.footerText;

  // Re-draw setup/perspective and update explainer card texts
  updateExplainer();
  draw();
}

// ==========================================
// Initialization
// ==========================================
function init() {
  initEvents();
  handleResize();
  updateCameraBasis();
  updateUI();
  switchLanguage(currentLang);
  highlightPresetButtons();
}

// Trigger initial setup on load
window.addEventListener('DOMContentLoaded', init);
