import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

/* ── colour helpers ─────────────────────────────────────────────── */
const COLOR_HEX = {
  'Charcoal Gray':'#374151','Beige':'#d4b896','Navy Blue':'#1e3a5f',
  'Forest Green':'#14532d','Burgundy':'#7f1d1d','Ivory':'#fffff0',
  'Walnut Brown':'#5c3d1e','Light Oak':'#c4a265','Espresso':'#3d1c02',
  'White':'#f5f5f4','Black':'#0f0f0f','Warm Gray':'#78716c',
  'Slate Blue':'#475569','Terracotta':'#c2410c','Sage Green':'#84a98c',
  'Dusty Rose':'#c4726e','Midnight Blue':'#1e293b','Sand':'#c2b08c',
  'Matte Black':'#1c1c1c','Off-White':'#f0ece4','Caramel':'#a0522d',
  'Stone Gray':'#9ca3af','Brass':'#b5943c','Chrome':'#d4d4d8',
};
const c2h = (n) => (!n ? '#57534e' : n.startsWith('#') ? n : COLOR_HEX[n] || '#57534e');
const CAT_COLOR = {
  sofa:'#92400e',chair:'#78350f',table:'#57534e',bed:'#44403c',
  decor:'#78716c',storage:'#6b7280',lighting:'#a16207',
};

const FLOOR_MATS = {
  Wood:     { color:'#8B6914', roughness:0.70, metalness:0.00 },
  Marble:   { color:'#e8e0d8', roughness:0.15, metalness:0.05 },
  Tile:     { color:'#d1d5db', roughness:0.30, metalness:0.05 },
  Carpet:   { color:'#8B7355', roughness:1.00, metalness:0.00 },
  Concrete: { color:'#6b7280', roughness:0.90, metalness:0.00 },
};
const WALL_PRESETS = ['#2d2520','#e8e0d8','#1e3a5f','#14532d','#3d1c02','#292524','#7f1d1d'];

/* shared mat helper */
function M({ color, r=0.7, m=0.05 }) {
  return <meshStandardMaterial color={color} roughness={r} metalness={m} />;
}

/* ── Room geometry ──────────────────────────────────────────────── */
function Floor({ width, length, mat }) {
  const m = FLOOR_MATS[mat] || FLOOR_MATS.Wood;
  return (
    <mesh rotation={[-Math.PI/2,0,0]} position={[width/2,0,length/2]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <M color={m.color} r={m.roughness} m={m.metalness} />
    </mesh>
  );
}

function Walls({ width, length, height, wallColor }) {
  const col = wallColor || '#2d2520';
  const t = 0.08;
  return (
    <group>
      <mesh position={[width/2,height/2,0]}        receiveShadow castShadow><boxGeometry args={[width+t,height,t]}/><M color={col} r={0.95} m={0}/></mesh>
      <mesh position={[0,height/2,length/2]}        receiveShadow castShadow><boxGeometry args={[t,height,length+t]}/><M color={col} r={0.95} m={0}/></mesh>
      <mesh position={[width,height/2,length/2]}    receiveShadow castShadow><boxGeometry args={[t,height,length+t]}/><M color={col} r={0.95} m={0}/></mesh>
    </group>
  );
}

/* ── Furniture shapes ───────────────────────────────────────────── */
function Sofa({ w, h, d, color }) {
  const c = color; const arm = 0.14;
  return (
    <group>
      <mesh position={[0,h*0.22,0]}               castShadow><boxGeometry args={[w,h*0.38,d*0.72]}/><M color={c} r={0.85}/></mesh>
      <mesh position={[0,h*0.64,-d*0.47+0.07]}    castShadow><boxGeometry args={[w,h*0.68,0.16]}/><M color={c} r={0.85}/></mesh>
      <mesh position={[-w/2+arm/2,h*0.44,-d*0.08]} castShadow><boxGeometry args={[arm,h*0.52,d*0.78]}/><M color={c} r={0.85}/></mesh>
      <mesh position={[w/2-arm/2,h*0.44,-d*0.08]}  castShadow><boxGeometry args={[arm,h*0.52,d*0.78]}/><M color={c} r={0.85}/></mesh>
      {/* cushions */}
      {(w>1.4?[-w/3,0,w/3]:w>0.8?[-w/4,w/4]:[0]).map((cx,i)=>(
        <mesh key={i} position={[cx,h*0.42,d*0.06]} castShadow>
          <boxGeometry args={[w/(w>1.4?3.3:w>0.8?2.1:1.1)-0.04,h*0.13,d*0.58]}/>
          <M color={c} r={0.92}/></mesh>
      ))}
      {[[-w/2+0.1,-d/2+0.08],[w/2-0.1,-d/2+0.08],[-w/2+0.1,d/2-0.08],[w/2-0.1,d/2-0.08]].map(([lx,lz],i)=>(
        <mesh key={i} position={[lx,h*0.05,lz]} castShadow><boxGeometry args={[0.06,h*0.12,0.06]}/><M color="#3d2406" r={0.6} m={0}/></mesh>
      ))}
    </group>
  );
}

function Chair({ w, h, d, color }) {
  const c = color;
  return (
    <group>
      <mesh position={[0,h*0.50,0]}          castShadow><boxGeometry args={[w,h*0.1,d]}/><M color={c} r={0.8}/></mesh>
      <mesh position={[0,h*0.75,-d*0.45]}    castShadow><boxGeometry args={[w,h*0.5,0.08]}/><M color={c} r={0.8}/></mesh>
      {[[-w/2+0.04,-d/2+0.04],[w/2-0.04,-d/2+0.04],[-w/2+0.04,d/2-0.04],[w/2-0.04,d/2-0.04]].map(([lx,lz],i)=>(
        <mesh key={i} position={[lx,h*0.26,lz]} castShadow><boxGeometry args={[0.05,h*0.5,0.05]}/><M color="#3d2406" r={0.6} m={0}/></mesh>
      ))}
    </group>
  );
}

function Table({ w, h, d, color }) {
  const c = color; const lh = h*0.88;
  return (
    <group>
      <mesh position={[0,h-h*0.05,0]} castShadow receiveShadow><boxGeometry args={[w,h*0.08,d]}/><M color={c} r={0.4} m={0.1}/></mesh>
      {[[-w/2+0.06,-d/2+0.06],[w/2-0.06,-d/2+0.06],[-w/2+0.06,d/2-0.06],[w/2-0.06,d/2-0.06]].map(([lx,lz],i)=>(
        <mesh key={i} position={[lx,lh/2,lz]} castShadow><boxGeometry args={[0.07,lh,0.07]}/><M color={c} r={0.4} m={0.1}/></mesh>
      ))}
    </group>
  );
}

function Bed({ w, h, d, color }) {
  const c = color; const fh = h*0.18;
  return (
    <group>
      <mesh position={[0,fh/2,0]}            castShadow receiveShadow><boxGeometry args={[w,fh,d]}/><M color="#3d2406" r={0.7}/></mesh>
      <mesh position={[0,fh+h*0.11,0]}       castShadow><boxGeometry args={[w*0.92,h*0.19,d*0.88]}/><M color="#f5f5f0" r={1.0} m={0}/></mesh>
      <mesh position={[0,fh+h*0.44,-d*0.48]} castShadow><boxGeometry args={[w,h*0.64,0.12]}/><M color={c} r={0.8}/></mesh>
      {[-w*0.2,w*0.2].map((px,i)=>(
        <mesh key={i} position={[px,fh+h*0.25,-d*0.3]} castShadow><boxGeometry args={[w*0.35,h*0.1,d*0.18]}/><M color="#e8e4dc" r={1.0} m={0}/></mesh>
      ))}
      <mesh position={[0,fh+h*0.23,d*0.12]} castShadow><boxGeometry args={[w*0.88,h*0.06,d*0.58]}/><M color={c} r={0.95} m={0}/></mesh>
    </group>
  );
}

function Lamp({ w, h, d, color }) {
  const c = color;
  return (
    <group>
      <mesh position={[0,h*0.04,0]}  castShadow><cylinderGeometry args={[w*0.22,w*0.28,h*0.06,10]}/><M color="#2d2d2d" r={0.4} m={0.5}/></mesh>
      <mesh position={[0,h*0.5,0]}   castShadow><cylinderGeometry args={[0.025,0.025,h*0.85,8]}/><M color="#3d3d3d" r={0.3} m={0.6}/></mesh>
      <mesh position={[0,h*0.88,0]}  castShadow><coneGeometry args={[w*0.42,h*0.22,12,1,true]}/><meshStandardMaterial color={c} roughness={0.7} side={2}/></mesh>
      <pointLight position={[0,h*0.84,0]} intensity={0.9} color="#fde68a" distance={4} />
    </group>
  );
}

function Storage({ w, h, d, color }) {
  const c = color; const shelves = Math.max(1,Math.floor(h/0.4));
  return (
    <group>
      <mesh position={[0,h/2,0]} castShadow receiveShadow><boxGeometry args={[w,h,d]}/><M color={c} r={0.6}/></mesh>
      {Array.from({length:shelves-1}).map((_,i)=>(
        <mesh key={i} position={[0,(h/shelves)*(i+1),0]} castShadow><boxGeometry args={[w*0.96,0.025,d*0.95]}/><M color="#4b5563" r={0.5}/></mesh>
      ))}
      {[-w/2+0.08,w/2-0.08].map((hx,i)=>(
        <mesh key={i} position={[hx,h*0.5,d*0.5-0.02]} castShadow><boxGeometry args={[0.04,h*0.07,0.04]}/><M color="#9ca3af" r={0.2} m={0.8}/></mesh>
      ))}
    </group>
  );
}

function Decor({ w, h, d, color }) {
  const c = color;
  return (
    <group>
      <mesh position={[0,h*0.16,0]} castShadow><cylinderGeometry args={[w*0.3,w*0.24,h*0.32,10]}/><M color="#a16207" r={0.7}/></mesh>
      <mesh position={[0,h*0.32,0]} castShadow><cylinderGeometry args={[w*0.28,w*0.28,h*0.03,10]}/><M color="#3d2406" r={1.0} m={0}/></mesh>
      <mesh position={[0,h*0.65,0]} castShadow><sphereGeometry args={[w*0.38,10,10]}/><M color={c} r={0.9} m={0}/></mesh>
    </group>
  );
}

/* ── Per-item dispatcher ────────────────────────────────────────── */
function FurnitureItem({ item, roomWidth, roomLength }) {
  const PX = 60; // must match 2D SCALE constant
  const ix = (item.x||0)/PX + (item.width||100)/PX/2;
  const iz = (item.y||0)/PX + (item.depth||80)/PX/2;
  const w  = Math.max(0.15, Math.min((item.width||100)/PX,  roomWidth  - 0.05));
  const h  = Math.max(0.25, (item.height||80)/PX);
  const d  = Math.max(0.15, Math.min((item.depth||80)/PX,   roomLength - 0.05));
  const px = Math.min(Math.max(ix, w/2), roomWidth  - w/2);
  const pz = Math.min(Math.max(iz, d/2), roomLength - d/2);
  const color = c2h(item.color) || CAT_COLOR[item.category] || '#57534e';
  const rot   = ((item.rotation||0) * Math.PI) / 180;
  const props = { w, h, d, color };

  if (item.category === 'door' || item.category === 'window') return null;

  return (
    <group position={[px, 0, pz]} rotation={[0, -rot, 0]}>
      {item.category === 'sofa'    && <Sofa    {...props} />}
      {item.category === 'chair'   && <Chair   {...props} />}
      {item.category === 'table'   && <Table   {...props} />}
      {item.category === 'bed'     && <Bed     {...props} />}
      {item.category === 'lighting'&& <Lamp    {...props} />}
      {item.category === 'storage' && <Storage {...props} />}
      {item.category === 'decor'   && <Decor   {...props} />}
      {!['sofa','chair','table','bed','lighting','storage','decor'].includes(item.category) && (
        <mesh position={[0,h/2,0]} castShadow>
          <boxGeometry args={[w,h,d]}/><M color={color} r={0.6}/>
        </mesh>
      )}
    </group>
  );
}

/* ── Scene ──────────────────────────────────────────────────────── */
function Scene({ room, placedFurniture, floorMat, wallColor }) {
  const w = room?.dimensions?.width  || 5;
  const l = room?.dimensions?.length || 4;
  const h = room?.dimensions?.height || 2.7;

  return (
    <>
      <ambientLight intensity={0.45} color="#fef3c7" />
      <directionalLight position={[w/2, h*1.6, l/2]} intensity={1.2} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-far={50} shadow-camera-left={-12} shadow-camera-right={12}
        shadow-camera-top={12} shadow-camera-bottom={-12} color="#fef3c7" />
      <pointLight position={[w*0.25, h-0.3, l*0.25]} intensity={0.4} color="#fde68a" />
      <pointLight position={[w*0.75, h-0.3, l*0.75]} intensity={0.4} color="#fde68a" />

      <Floor width={w} length={l} mat={floorMat} />
      <Walls width={w} length={l} height={h} wallColor={wallColor} />

      {placedFurniture.map((item) => (
        <FurnitureItem key={item._id} item={item} roomWidth={w} roomLength={l} />
      ))}

      <gridHelper args={[Math.max(w,l)+2, Math.max(w,l)+2, '#2a2522', '#1c1917']}
        position={[w/2, 0.005, l/2]} />
    </>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function RoomViewer3D({ room, placedFurniture }) {
  const [floorMat,  setFloorMat]  = useState('Wood');
  const [wallColor, setWallColor] = useState('#2d2520');
  const [showPanel, setShowPanel] = useState(false);

  const w = room?.dimensions?.width  || 5;
  const l = room?.dimensions?.length || 4;
  const h = room?.dimensions?.height || 2.7;

  const CAMERA_PRESETS = {
    Perspective: [w*0.85, h*1.4, l*1.6],
    'Top-Down':  [w/2,    h*4,   l/2  ],
    Front:       [w/2,    h*0.6, l*2.2],
    Corner:      [w*1.6,  h*1.2, l*1.6],
  };
  const [camKey, setCamKey] = useState(0);
  const [camPos, setCamPos] = useState(CAMERA_PRESETS.Perspective);

  return (
    <div className="w-full h-full relative bg-stone-950" style={{ minHeight:'450px' }}>

      {/* Top-left info */}
      <div className="absolute top-3 left-3 z-10 text-xs text-stone-500 bg-stone-900/80 px-3 py-1.5 rounded pointer-events-none">
        {room?.name} · {w}m×{l}m×{h}m · {placedFurniture.length} items
      </div>

      {/* Settings toggle */}
      <button onClick={() => setShowPanel(v => !v)}
        className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-stone-900/90 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs rounded transition-colors border border-stone-700">
        ⚙ Settings
      </button>

      {/* Settings panel */}
      {showPanel && (
        <div className="absolute top-12 right-3 z-20 bg-stone-900 border border-stone-700 rounded-lg p-4 w-56 space-y-4 shadow-xl">
          {/* Floor material */}
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider mb-2">Floor Material</p>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.keys(FLOOR_MATS).map(mat => (
                <button key={mat} onClick={() => setFloorMat(mat)}
                  className={`px-2 py-1.5 rounded text-xs transition-colors ${floorMat===mat ? 'bg-amber-500 text-stone-950 font-medium' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'}`}>
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Wall colour */}
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider mb-2">Wall Colour</p>
            <div className="flex flex-wrap gap-2">
              {WALL_PRESETS.map(col => (
                <button key={col} onClick={() => setWallColor(col)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${wallColor===col ? 'border-amber-400 scale-110' : 'border-stone-600 hover:border-stone-400'}`}
                  style={{ backgroundColor: col }} />
              ))}
              <input type="color" value={wallColor} onChange={e => setWallColor(e.target.value)}
                className="w-7 h-7 rounded-full border-2 border-stone-600 cursor-pointer bg-transparent" title="Custom colour" />
            </div>
          </div>

          {/* Camera presets */}
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider mb-2">Camera View</p>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(CAMERA_PRESETS).map(([name, pos]) => (
                <button key={name}
                  onClick={() => { setCamPos(pos); setCamKey(k => k+1); }}
                  className="px-2 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 text-xs rounded transition-colors">
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hint */}
      <div className="absolute bottom-3 left-3 z-10 text-xs text-stone-600 pointer-events-none">
        Drag to orbit · Scroll to zoom · Right-click to pan
      </div>

      <Canvas key={camKey} shadows
        camera={{ position: camPos, fov:60, near:0.1, far:150 }}
        gl={{ antialias: true }}
        style={{ background:'#0c0a09' }}>
        <Suspense fallback={null}>
          <Scene room={room} placedFurniture={placedFurniture} floorMat={floorMat} wallColor={wallColor} />
          <OrbitControls
            target={[w/2, h/3, l/2]}
            maxPolarAngle={Math.PI/2+0.1}
            minDistance={1} maxDistance={40}
            enableDamping dampingFactor={0.05} />
        </Suspense>
      </Canvas>
    </div>
  );
}
