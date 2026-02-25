import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Transformer, Line, Group, Arc } from 'react-konva';

const SCALE    = 60;   // px per meter at zoom=1
const GRID     = 10;   // snap grid px
const snap = (v) => Math.round(v / GRID) * GRID;

/* ── colour helpers ─────────────────────────────────────────────── */
const COLOR_HEX = {
  'Charcoal Gray':'#374151','Beige':'#d4b896','Navy Blue':'#1e3a5f',
  'Forest Green':'#14532d','Burgundy':'#7f1d1d','Ivory':'#fffff0',
  'Walnut Brown':'#5c3d1e','Light Oak':'#c4a265','Espresso':'#3d1c02',
  'White':'#f5f5f4','Black':'#0f0f0f','Warm Gray':'#78716c',
  'Slate Blue':'#475569','Terracotta':'#c2410c','Sage Green':'#84a98c',
  'Dusty Rose':'#c4726e','Midnight Blue':'#1e293b','Sand':'#c2b08c',
  'Matte Black':'#1c1c1c','Off-White':'#f0ece4','Caramel':'#a0522d',
};
const c2h = (n) => (!n ? null : n.startsWith('#') ? n : COLOR_HEX[n] || '#57534e');
const CAT_COLOR = {
  sofa:'#92400e',chair:'#78350f',table:'#57534e',bed:'#44403c',
  decor:'#78716c',storage:'#6b7280',lighting:'#a16207',
  door:'#d4a96a',window:'#7dd3fc',
};

/* ── Door shape ─────────────────────────────────────────────────── */
function DoorShape({ item, isSelected, onSelect, onChange }) {
  const w = item.width || 80;
  return (
    <Group x={item.x} y={item.y} rotation={item.rotation || 0}
      draggable={!item.locked}
      onClick={(e) => { e.cancelBubble = true; onSelect(); }}
      onTap={(e)   => { e.cancelBubble = true; onSelect(); }}
      onDragEnd={(e) => onChange({ ...item, x: snap(e.target.x()), y: snap(e.target.y()) })}
    >
      <Rect width={w} height={10} fill="#d4a96a"
        stroke={isSelected ? '#f59e0b' : '#a07840'} strokeWidth={isSelected ? 2 : 1} cornerRadius={1} />
      <Arc x={0} y={5} innerRadius={0} outerRadius={w} angle={90}
        fill="#d4a96a22" stroke="#a0784066" strokeWidth={1} />
      <Text text="Door" y={12} fontSize={8} fill="#d4a96a" listening={false} />
    </Group>
  );
}

/* ── Window shape ───────────────────────────────────────────────── */
function WindowShape({ item, isSelected, onSelect, onChange }) {
  const w = item.width || 120;
  return (
    <Group x={item.x} y={item.y} rotation={item.rotation || 0}
      draggable={!item.locked}
      onClick={(e) => { e.cancelBubble = true; onSelect(); }}
      onTap={(e)   => { e.cancelBubble = true; onSelect(); }}
      onDragEnd={(e) => onChange({ ...item, x: snap(e.target.x()), y: snap(e.target.y()) })}
    >
      <Rect width={w} height={10} fill="#7dd3fc18"
        stroke={isSelected ? '#f59e0b' : '#7dd3fc'} strokeWidth={isSelected ? 2 : 1.5} />
      <Line points={[w/3,0,w/3,10]}     stroke="#7dd3fc99" strokeWidth={0.8} listening={false} />
      <Line points={[w*2/3,0,w*2/3,10]} stroke="#7dd3fc99" strokeWidth={0.8} listening={false} />
      <Line points={[0,5,w,5]}           stroke="#7dd3fc66" strokeWidth={0.8} dash={[3,3]} listening={false} />
      <Text text="Window" y={12} fontSize={8} fill="#7dd3fc" listening={false} />
    </Group>
  );
}

/* ── Measurement lines ──────────────────────────────────────────── */
function Measurements({ item, OFFSET_X, OFFSET_Y }) {
  if (!item) return null;
  const x  = OFFSET_X + (item.x || 0);
  const y  = OFFSET_Y + (item.y || 0);
  const w  = item.width || 100;
  const d  = item.depth  || 80;
  const wm = (w / SCALE).toFixed(2);
  const dm = (d / SCALE).toFixed(2);
  return (
    <>
      <Line listening={false} points={[x,y-18,x+w,y-18]}     stroke="#f59e0b88" strokeWidth={1} />
      <Line listening={false} points={[x,y-23,x,y-13]}         stroke="#f59e0b88" strokeWidth={1} />
      <Line listening={false} points={[x+w,y-23,x+w,y-13]}     stroke="#f59e0b88" strokeWidth={1} />
      <Text listening={false} text={`${wm}m`} x={x+w/2-14} y={y-30} fontSize={10} fill="#f59e0b" />
      <Line listening={false} points={[x+w+18,y,x+w+18,y+d]}   stroke="#f59e0b88" strokeWidth={1} />
      <Line listening={false} points={[x+w+13,y,x+w+23,y]}     stroke="#f59e0b88" strokeWidth={1} />
      <Line listening={false} points={[x+w+13,y+d,x+w+23,y+d]} stroke="#f59e0b88" strokeWidth={1} />
      <Text listening={false} text={`${dm}m`} x={x+w+25} y={y+d/2-5} fontSize={10} fill="#f59e0b" />
    </>
  );
}

/* ── Regular furniture rect ─────────────────────────────────────── */
function FurnitureRect({ item, isSelected, onSelect, onChange }) {
  const grpRef = useRef();
  const trRef  = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && grpRef.current) {
      trRef.current.nodes([grpRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const w    = item.width || 100;
  const h    = item.depth || 80;
  const fill = c2h(item.color) || CAT_COLOR[item.category] || '#57534e';

  return (
    <>
      <Group ref={grpRef}
        x={item.x} y={item.y} rotation={item.rotation || 0}
        draggable={!item.locked} opacity={item.locked ? 0.65 : 1}
        onClick={(e) => { e.cancelBubble = true; onSelect(); }}
        onTap={(e)   => { e.cancelBubble = true; onSelect(); }}
        onDragEnd={(e) => onChange({ ...item, x: snap(e.target.x()), y: snap(e.target.y()) })}
        onTransformEnd={() => {
          const n = grpRef.current;
          onChange({
            ...item,
            x: snap(n.x()), y: snap(n.y()),
            rotation: Math.round(n.rotation()),
            width: Math.round(n.scaleX() * w),
            depth: Math.round(n.scaleY() * h),
          });
          n.scaleX(1); n.scaleY(1);
        }}
      >
        <Rect width={w} height={h} fill={fill} opacity={0.88}
          stroke={isSelected ? '#f59e0b' : item.locked ? '#52525b' : '#ffffff18'}
          strokeWidth={isSelected ? 2 : 1} cornerRadius={4} />
        {/* Category colour strip at top */}
        <Rect width={w} height={4} fill={CAT_COLOR[item.category] || fill}
          opacity={0.5} cornerRadius={[4,4,0,0]} listening={false} />
        {item.locked && <Text text="🔒" x={2} y={5} fontSize={9} listening={false} />}
        <Text
          text={item.name?.split(' ').slice(0,2).join('\n') || '?'}
          width={w} height={h} align="center" verticalAlign="middle"
          fontSize={Math.max(7, Math.min(11, w / 7))} fill="#e7e5e4"
          lineHeight={1.2} listening={false}
        />
      </Group>
      {isSelected && !item.locked && (
        <Transformer ref={trRef} rotateEnabled
          enabledAnchors={['top-left','top-right','bottom-left','bottom-right']}
          boundBoxFunc={(o, n) => (n.width < 20 || n.height < 20 ? o : n)} />
      )}
    </>
  );
}

/* ── Main planner ───────────────────────────────────────────────── */
export default function RoomPlanner2D({ room, placedFurniture, onUpdateFurniture }) {
  const [selectedId,       setSelectedId]       = useState(null);
  const [stageScale,       setStageScale]       = useState(1);
  const [stagePos,         setStagePos]         = useState({ x: 0, y: 0 });
  const [clipboard,        setClipboard]        = useState(null);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [canUndo,          setCanUndo]          = useState(false);
  const [canRedo,          setCanRedo]          = useState(false);
  const [size,             setSize]             = useState({ w: 800, h: 600 });
  const [localFurniture,   setLocalFurniture]   = useState(placedFurniture);

  const stageRef     = useRef();
  const containerRef = useRef();
  const historyRef   = useRef([placedFurniture]);
  const histIdxRef   = useRef(0);

  // Sync when parent adds / removes items externally (Furniture Catalog tab)
  useEffect(() => {
    const localIds = new Set(localFurniture.map(f => f._id));
    const propIds  = new Set(placedFurniture.map(f => f._id));
    const hasNew   = placedFurniture.some(f => !localIds.has(f._id));
    const hasDel   = localFurniture.some(f => !propIds.has(f._id) && !['door','window'].includes(f.category));
    if (hasNew || hasDel) {
      const h = historyRef.current.slice(0, histIdxRef.current + 1);
      h.push(placedFurniture);
      historyRef.current = h;
      histIdxRef.current = h.length - 1;
      setLocalFurniture(placedFurniture);
      setCanUndo(histIdxRef.current > 0);
      setCanRedo(false);
    }
}, [placedFurniture]); // eslint-disable-line

  // Container auto-size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }));
    ro.observe(el);
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  /* history ── */
  const pushHistory = useCallback((newList) => {
    const h = historyRef.current.slice(0, histIdxRef.current + 1);
    h.push(newList);
    historyRef.current = h;
    histIdxRef.current = h.length - 1;
    setLocalFurniture(newList);
    onUpdateFurniture(newList);
    setCanUndo(true);
    setCanRedo(false);
  }, [onUpdateFurniture]);

  const undo = useCallback(() => {
    if (histIdxRef.current <= 0) return;
    histIdxRef.current--;
    const prev = historyRef.current[histIdxRef.current];
    setLocalFurniture(prev);
    onUpdateFurniture(prev);
    setCanUndo(histIdxRef.current > 0);
    setCanRedo(true);
  }, [onUpdateFurniture]);

  const redo = useCallback(() => {
    if (histIdxRef.current >= historyRef.current.length - 1) return;
    histIdxRef.current++;
    const next = historyRef.current[histIdxRef.current];
    setLocalFurniture(next);
    onUpdateFurniture(next);
    setCanUndo(true);
    setCanRedo(histIdxRef.current < historyRef.current.length - 1);
  }, [onUpdateFurniture]);

  const handleItemChange = useCallback((updated) => {
    pushHistory(localFurniture.map(f => f._id === updated._id ? updated : f));
  }, [localFurniture, pushHistory]);

  const handleRemove = useCallback((id) => {
    pushHistory(localFurniture.filter(f => f._id !== id));
    setSelectedId(null);
  }, [localFurniture, pushHistory]);

  /* keyboard shortcuts ── */
  useEffect(() => {
    const down = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const item = localFurniture.find(f => f._id === selectedId);
        if (item) setClipboard(item);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (!clipboard) return;
        const ni = { ...clipboard, _id: Date.now().toString(), x: (clipboard.x||0)+GRID*2, y: (clipboard.y||0)+GRID*2 };
        pushHistory([...localFurniture, ni]);
        setSelectedId(ni._id);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) handleRemove(selectedId);
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [selectedId, clipboard, localFurniture, undo, redo, pushHistory, handleRemove]);

  /* zoom ── */
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const old   = stageScale;
    const next  = Math.min(Math.max(old * (e.evt.deltaY < 0 ? 1.1 : 0.9), 0.2), 5);
    const ptr   = stage.getPointerPosition();
    setStageScale(next);
    setStagePos({ x: ptr.x - ((ptr.x - stagePos.x) / old) * next, y: ptr.y - ((ptr.y - stagePos.y) / old) * next });
  };
  const resetView = () => { setStageScale(1); setStagePos({ x: 0, y: 0 }); };

  /* wall items ── */
  const addWallItem = (type) => {
    const item = {
      _id: Date.now().toString(), name: type === 'door' ? 'Door' : 'Window', category: type,
      x: Math.round(((room?.dimensions?.width||5)*SCALE)/2) - (type==='door'?40:60),
      y: 0, width: type==='door'?80:120, depth:10, rotation:0, price:0,
    };
    pushHistory([...localFurniture, item]);
    setSelectedId(item._id);
  };

  const toggleLock = () => {
    if (!selectedId) return;
    pushHistory(localFurniture.map(f => f._id === selectedId ? { ...f, locked: !f.locked } : f));
  };

  /* derived ── */
  const selectedItem = localFurniture.find(f => f._id === selectedId);
  const ROOM_W  = (room?.dimensions?.width  || 5) * SCALE;
  const ROOM_H  = (room?.dimensions?.length || 4) * SCALE;
  const OFFSET_X = 80;
  const OFFSET_Y = 80;

  const gridLines = [];
  for (let x = 0; x <= ROOM_W; x += GRID) {
    gridLines.push(<Line key={`gx${x}`} listening={false}
      points={[OFFSET_X+x, OFFSET_Y, OFFSET_X+x, OFFSET_Y+ROOM_H]}
      stroke="#1c1917" strokeWidth={x % SCALE === 0 ? 0.8 : 0.3} />);
  }
  for (let y = 0; y <= ROOM_H; y += GRID) {
    gridLines.push(<Line key={`gy${y}`} listening={false}
      points={[OFFSET_X, OFFSET_Y+y, OFFSET_X+ROOM_W, OFFSET_Y+y]}
      stroke="#1c1917" strokeWidth={y % SCALE === 0 ? 0.8 : 0.3} />);
  }

  return (
    <div className="flex flex-col h-full select-none">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-stone-900 border-b border-stone-800 text-xs">
        <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)"
          className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-300 rounded transition-colors">↩ Undo</button>
        <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)"
          className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-300 rounded transition-colors">↪ Redo</button>
        <span className="text-stone-700">│</span>
        <button disabled={!selectedId} title="Copy (Ctrl+C)"
          onClick={() => { const i = localFurniture.find(f=>f._id===selectedId); if(i) setClipboard(i); }}
          className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-300 rounded transition-colors">⎘ Copy</button>
        <button disabled={!clipboard} title="Paste (Ctrl+V)"
          onClick={() => { if(!clipboard) return; const ni={...clipboard,_id:Date.now().toString(),x:(clipboard.x||0)+GRID*2,y:(clipboard.y||0)+GRID*2}; pushHistory([...localFurniture,ni]); setSelectedId(ni._id); }}
          className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-300 rounded transition-colors">⎙ Paste</button>
        <span className="text-stone-700">│</span>
        <button onClick={() => addWallItem('door')}
          className="px-2.5 py-1 bg-amber-900/40 hover:bg-amber-800/60 text-amber-300 rounded transition-colors">🚪 Door</button>
        <button onClick={() => addWallItem('window')}
          className="px-2.5 py-1 bg-sky-900/40 hover:bg-sky-800/60 text-sky-300 rounded transition-colors">🪟 Window</button>
        <span className="text-stone-700">│</span>

        {selectedItem ? (
          <>
            <span className="text-amber-400 font-medium truncate max-w-[100px]">{selectedItem.name}</span>
            {selectedItem.category !== 'door' && selectedItem.category !== 'window' && (
              <button onClick={() => handleItemChange({...selectedItem, rotation:((selectedItem.rotation||0)+90)%360})}
                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors">↻ 90°</button>
            )}
            <button onClick={toggleLock}
              className={`px-2.5 py-1 rounded transition-colors ${selectedItem.locked ? 'bg-amber-700/40 text-amber-300' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'}`}>
              {selectedItem.locked ? '🔒 Locked' : '🔓 Lock'}</button>
            <button onClick={() => handleRemove(selectedId)}
              className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900/60 text-red-400 rounded transition-colors">✕ Remove</button>
            <span className="text-stone-700">│</span>
          </>
        ) : <span className="text-stone-600 italic">No item selected</span>}

        <button onClick={() => setShowMeasurements(v => !v)}
          className={`px-2.5 py-1 rounded transition-colors ${showMeasurements ? 'bg-amber-700/30 text-amber-400' : 'bg-stone-800 text-stone-500 hover:text-stone-300'}`}>
          📐 Measure</button>
        <span className="text-stone-700">│</span>
        <button onClick={() => setStageScale(s => Math.min(s*1.2,5))} className="w-6 h-6 flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-stone-300 rounded">+</button>
        <span className="text-stone-400 w-10 text-center">{Math.round(stageScale*100)}%</span>
        <button onClick={() => setStageScale(s => Math.max(s/1.2,0.2))} className="w-6 h-6 flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-stone-300 rounded">−</button>
        <button onClick={resetView} className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-500 rounded">⌂</button>
        <span className="ml-auto text-stone-600 hidden xl:block">Scroll=zoom · Drag canvas=pan · Del=remove · Ctrl+Z/Y=undo/redo</span>
      </div>

      {/* ── Canvas ── */}
      <div ref={containerRef} className="flex-1 overflow-hidden bg-stone-950">
        <Stage ref={stageRef}
          width={size.w} height={size.h}
          scaleX={stageScale} scaleY={stageScale}
          x={stagePos.x} y={stagePos.y}
          draggable
          onWheel={handleWheel}
          onDragEnd={(e) => { if (e.target === stageRef.current) setStagePos({ x: e.target.x(), y: e.target.y() }); }}
          onClick={(e)  => { if (e.target === stageRef.current) setSelectedId(null); }}
          onTap={(e)    => { if (e.target === stageRef.current) setSelectedId(null); }}
        >
          <Layer>
            <Rect x={-5000} y={-5000} width={15000} height={15000} fill="#0c0a09" listening={false} />
            {gridLines}
            <Rect x={OFFSET_X} y={OFFSET_Y} width={ROOM_W} height={ROOM_H}
              fill="#1a1614" stroke="#78716c" strokeWidth={2} listening={false} />

            {/* Ruler ticks X */}
            {Array.from({ length: Math.floor(room?.dimensions?.width||5)+1 }).map((_,i) => (
              <React.Fragment key={`rx${i}`}>
                <Line listening={false} points={[OFFSET_X+i*SCALE,OFFSET_Y-5,OFFSET_X+i*SCALE,OFFSET_Y+5]} stroke="#44403c" strokeWidth={1} />
                <Text listening={false} text={`${i}m`} x={OFFSET_X+i*SCALE-9} y={OFFSET_Y-20} fontSize={9} fill="#57534e" />
              </React.Fragment>
            ))}
            {/* Ruler ticks Y */}
            {Array.from({ length: Math.floor(room?.dimensions?.length||4)+1 }).map((_,i) => (
              <React.Fragment key={`ry${i}`}>
                <Line listening={false} points={[OFFSET_X-5,OFFSET_Y+i*SCALE,OFFSET_X+5,OFFSET_Y+i*SCALE]} stroke="#44403c" strokeWidth={1} />
                <Text listening={false} text={`${i}m`} x={OFFSET_X-34} y={OFFSET_Y+i*SCALE-5} fontSize={9} fill="#57534e" />
              </React.Fragment>
            ))}
            <Text listening={false} x={OFFSET_X} y={OFFSET_Y-38}
              text={`${room?.name}  ·  ${room?.dimensions?.width}m × ${room?.dimensions?.length}m`}
              fontSize={11} fill="#57534e" />

            {/* Furniture */}
            {localFurniture.map((item) => {
              const shared = {
                item: { ...item, x: OFFSET_X+(item.x||0), y: OFFSET_Y+(item.y||0) },
                isSelected: selectedId === item._id,
                onSelect: () => setSelectedId(item._id),
                onChange: (u) => handleItemChange({
                  ...u,
                  x: Math.max(0, Math.min(u.x - OFFSET_X, ROOM_W - (u.width||60))),
                  y: Math.max(0, Math.min(u.y - OFFSET_Y, ROOM_H - (u.depth||10))),
                }),
              };
              if (item.category === 'door')   return <DoorShape   key={item._id} {...shared} />;
              if (item.category === 'window') return <WindowShape  key={item._id} {...shared} />;
              return <FurnitureRect key={item._id} {...shared} />;
            })}

            {/* Measurements */}
            {showMeasurements && selectedItem &&
              !['door','window'].includes(selectedItem.category) && (
              <Measurements item={selectedItem} OFFSET_X={OFFSET_X} OFFSET_Y={OFFSET_Y} />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
