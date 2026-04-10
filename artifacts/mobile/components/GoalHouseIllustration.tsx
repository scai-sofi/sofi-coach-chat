import React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Polygon,
  Ellipse,
  Line,
  Circle,
} from 'react-native-svg';

/**
 * Isometric clay-style house illustration for Save Up / Emergency Fund goals.
 *
 * Style intent:
 * - Matches the SoFi coach persona avatars: matte clay surface, soft subsurface
 *   glow, warm-tinted shadows, completely smooth/rounded-edge quality.
 * - Color palette informed by Pacific's "New 3D Illustrations":
 *     Roof → Pacific brand teal (muted clay version of the signature cyan)
 *     Walls → warm near-white cream (matches the small house in illustration-realEstate)
 *     Windows → cool navy-teal (echoes Pacific's dark window treatment)
 *   The clay render technique (matte gradients, broad subsurface glow) is kept
 *   from the avatar style rather than Pacific's glossy-plastic treatment.
 * - No background, no ground platform — transparent with a light radial
 *   drop shadow beneath the house.
 *
 * Isometric geometry (viewBox 200×200):
 *   f(x, y, z) = (100 + x*20 − y*20,  108 + x*10 + y*10 − z*22)
 *   X unit → right-forward, Y unit → left-forward, Z unit → up
 *   House: 4 wide × 3 deep × 3 tall walls; ridge centered at x=2, z=5
 *
 * Gradient IDs are suffixed with a per-instance unique ID to prevent conflicts
 * when multiple GoalCard instances render simultaneously on the same screen.
 */
export function GoalHouseIllustration({ size = 94 }: { size?: number }) {
  // React.useId() returns a string like ":r0:" — strip colons so it's valid in url(#...) references
  const uid = React.useId().replace(/:/g, '');

  const id = (name: string) => `${name}-${uid}`;
  const url = (name: string) => `url(#${name}-${uid})`;

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        {/* ── Wall surfaces ─────────────────────────────────────────────── */}
        {/*
         * Walls: warm near-white cream — matching the small residential house
         * in Pacific's illustration-realEstate. Warm undertone keeps clay feel.
         */}
        {/* Front wall (y=0, viewer-right face) */}
        <LinearGradient
          id={id('wf')}
          x1="170" y1="42" x2="108" y2="108"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#EDE8DE" />
          <Stop offset="1" stopColor="#D0C8B2" />
        </LinearGradient>

        {/* Side wall (x=0, viewer-left face) — slightly darker */}
        <LinearGradient
          id={id('ws')}
          x1="100" y1="42" x2="44" y2="135"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#DDD8CC" />
          <Stop offset="1" stopColor="#BCB49E" />
        </LinearGradient>

        {/* ── Roof ───────────────────────────────────────────────────────── */}
        {/*
         * Pacific brand teal rendered in clay (matte/subsurface) rather than
         * Pacific's glossy-plastic treatment. Teal signals SoFi brand; the
         * gradient desaturation toward the eave gives the clay depth quality.
         */}
        {/* Right slope (lighter — main visible face) */}
        <LinearGradient
          id={id('rr')}
          x1="158" y1="28" x2="132" y2="112"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#2AB8CC" />
          <Stop offset="1" stopColor="#1C96AA" />
        </LinearGradient>

        {/* Left slope (darker — shadow side) */}
        <LinearGradient
          id={id('rl')}
          x1="112" y1="20" x2="58" y2="70"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#1A8FA0" />
          <Stop offset="1" stopColor="#127080" />
        </LinearGradient>

        {/* ── Window & door ─────────────────────────────────────────────── */}
        {/*
         * Windows: cool teal-navy — matches Pacific's small-house windows.
         * Uses userSpaceOnUse so the vertical gradient works correctly on
         * parallelogram polygon shapes (objectBoundingBox is unreliable for
         * non-rectangular shapes in react-native-svg).
         * y1/y2 span the combined vertical extent of both front windows (69–117).
         */}
        <LinearGradient
          id={id('win')}
          x1="130" y1="69" x2="130" y2="117"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0"    stopColor="#4A8EA8" />
          <Stop offset="0.55" stopColor="#2E7090" />
          <Stop offset="1"    stopColor="#1E5C7A" />
        </LinearGradient>

        {/*
         * Side window gradient — same teal-navy but spanning the side face
         * vertical extent (69–106).
         */}
        <LinearGradient
          id={id('wins')}
          x1="72" y1="67" x2="72" y2="106"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0"    stopColor="#4A8EA8" />
          <Stop offset="0.55" stopColor="#2E7090" />
          <Stop offset="1"    stopColor="#1E5C7A" />
        </LinearGradient>

        {/*
         * Door: warm wood brown — earthy accent against teal roof.
         * userSpaceOnUse spanning door polygon vertical extent (87–133).
         */}
        <LinearGradient
          id={id('door')}
          x1="140" y1="87" x2="140" y2="133"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#8C6244" />
          <Stop offset="1" stopColor="#6A482C" />
        </LinearGradient>

        {/* ── Clay subsurface glow overlays ─────────────────────────────── */}
        {/*
         * These simulate the defining quality of the clay avatar material:
         * a broad, soft, low-opacity white radial that scatters light through
         * the surface like real sculpting clay or matte plastic.
         * Opacity is intentionally low (0.18–0.22) — visible but not shiny.
         */}
        <RadialGradient
          id={id('gf')} cx="163" cy="58" r="74"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FFFDF5" stopOpacity={0.24} />
          <Stop offset="1" stopColor="#FFFDF5" stopOpacity={0}    />
        </RadialGradient>

        <RadialGradient
          id={id('gs')} cx="84" cy="50" r="54"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FFFDF5" stopOpacity={0.20} />
          <Stop offset="1" stopColor="#FFFDF5" stopOpacity={0}    />
        </RadialGradient>

        {/* Roof glow: cool-white highlight for teal clay surface */}
        <RadialGradient
          id={id('grr')} cx="154" cy="36" r="58"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#E0FEFF" stopOpacity={0.24} />
          <Stop offset="1" stopColor="#E0FEFF" stopOpacity={0}    />
        </RadialGradient>

        <RadialGradient
          id={id('grl')} cx="110" cy="26" r="50"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#E0FEFF" stopOpacity={0.14} />
          <Stop offset="1" stopColor="#E0FEFF" stopOpacity={0}    />
        </RadialGradient>

        {/* ── Drop shadow ───────────────────────────────────────────────── */}
        {/*
         * Teal-tinted shadow — matches how Pacific's 3D illustrations cast
         * cool-neutral ambient shadows. Three-stop gradient for smooth falloff.
         */}
        <RadialGradient
          id={id('sh')} cx="110" cy="186" r="76"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0"   stopColor="#1A4858" stopOpacity={0.26} />
          <Stop offset="0.5" stopColor="#1A4858" stopOpacity={0.10} />
          <Stop offset="1"   stopColor="#1A4858" stopOpacity={0}    />
        </RadialGradient>
      </Defs>

      {/* ── DROP SHADOW ──────────────────────────────────────────────────── */}
      <Ellipse cx={110} cy={186} rx={74} ry={20} fill={url('sh')} />

      {/* ── PAINTER'S ORDER: back → front ────────────────────────────────── */}

      {/* Side wall (x=0 plane: FLB→BLB→BLT→FLT) */}
      <Polygon points="100,108 40,138 40,72 100,42" fill={url('ws')} />
      <Polygon points="100,108 40,138 40,72 100,42" fill={url('gs')} />

      {/* Front wall, pentagon including gable (FLB→FRB→FRT→RidgeF→FLT) */}
      <Polygon points="100,108 180,148 180,82 140,18 100,42" fill={url('wf')} />
      <Polygon points="100,108 180,148 180,82 140,18 100,42" fill={url('gf')} />

      {/* Ambient occlusion: vertical corner where front meets side */}
      <Line
        x1="100" y1="108" x2="100" y2="42"
        stroke="#1A3848" strokeWidth={1.8} strokeOpacity={0.20}
      />

      {/* Left roof slope (FLT→BLT→RidgeB→RidgeF) — darker side */}
      <Polygon points="100,42 40,72 80,48 140,18" fill={url('rl')} />
      <Polygon points="100,42 40,72 80,48 140,18" fill={url('grl')} />

      {/* Right roof slope (FRT→RidgeF→RidgeB→BRT) — lighter side */}
      <Polygon points="180,82 140,18 80,48 120,112" fill={url('rr')} />
      <Polygon points="180,82 140,18 80,48 120,112" fill={url('grr')} />

      {/* Ridge highlight — cool catch-light on teal ridge edge */}
      <Line
        x1="140" y1="18" x2="80" y2="48"
        stroke="#7ADEEE" strokeWidth={1.2} strokeOpacity={0.55}
      />

      {/* Eave AO lines — subtle warm shadow at eave edge */}
      <Line x1="100" y1="42" x2="180" y2="82" stroke="#1A3848" strokeWidth={1.8} strokeOpacity={0.18} />
      <Line x1="40"  y1="72" x2="100" y2="42" stroke="#1A3848" strokeWidth={1.6} strokeOpacity={0.16} />

      {/* ── FRONT FACE WINDOWS ─────────────────────────────────────────── */}
      {/* Window 1  iso(1.0–2.0, 0, 1.2–2.1) */}
      {/* Frame: 1px wider on all sides */}
      <Polygon points="118,94 142,105 142,80 118,69" fill="#A8C8CC" fillOpacity={0.60} />
      {/* Pane */}
      <Polygon points="120,91.6 140,101.6 140,81.8 120,71.8" fill={url('win')} />
      {/* Top-left corner highlight (clay inner glow on window) */}
      <Polygon points="120,71.8 129.5,76.5 129.5,85.2 120,80.5" fill="#FFFFFF" fillOpacity={0.28} />

      {/* Window 2  iso(2.5–3.5, 0, 1.2–2.1) */}
      <Polygon points="148,109 172,121 172,95 148,83" fill="#A8C8CC" fillOpacity={0.60} />
      <Polygon points="150,106.6 170,116.6 170,96.8 150,86.8" fill={url('win')} />
      <Polygon points="150,86.8 159.5,91.5 159.5,100.2 150,95.5" fill="#FFFFFF" fillOpacity={0.28} />

      {/* ── DOOR ───────────────────────────────────────────────────────── */}
      {/* iso(1.5–2.5, 0, 0–1.5) */}
      {/* Door frame */}
      <Polygon points="128,125 152,137 152,98 128,87" fill="#88A8A8" fillOpacity={0.45} />
      {/* Door panel */}
      <Polygon points="130,123 150,133 150,100 130,90" fill={url('door')} />
      {/* Door highlight */}
      <Polygon points="130,90 138,94.2 138,107 130,102.8" fill="#FFFFFF" fillOpacity={0.14} />
      {/* Door knob */}
      <Circle cx={147} cy={118} r={2.2} fill="#C09050" fillOpacity={0.85} />

      {/* ── GABLE OCULUS WINDOW ────────────────────────────────────────── */}
      {/* Circular attic window centered in the gable triangle at (140, 44) */}
      {/* Frame ring */}
      <Circle cx={140} cy={44} r={9} fill="#A8C8CC" fillOpacity={0.62} />
      {/* Pane */}
      <Circle cx={140} cy={44} r={7} fill={url('win')} />
      {/* Highlight: small soft oval top-left of pane */}
      <Circle cx={137} cy={41} r={3.2} fill="#FFFFFF" fillOpacity={0.26} />

      {/* ── SIDE FACE WINDOW ───────────────────────────────────────────── */}
      {/* iso(0, 0.8–2.0, 1.2–2.1) */}
      <Polygon points="86,92 58,105 58,80 86,67" fill="#98B8BC" fillOpacity={0.55} />
      <Polygon points="84,89.6 60,101.6 60,81.8 84,69.8" fill={url('wins')} />
      <Polygon points="84,69.8 75.5,74 75.5,82.5 84,78.3" fill="#FFFFFF" fillOpacity={0.26} />

      {/* Base AO shadow at wall bottom edges */}
      <Line x1="100" y1="108" x2="180" y2="148" stroke="#1A3848" strokeWidth={1.4} strokeOpacity={0.14} />
      <Line x1="100" y1="108" x2="40"  y2="138" stroke="#1A3848" strokeWidth={1.4} strokeOpacity={0.12} />
    </Svg>
  );
}
